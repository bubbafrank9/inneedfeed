import { launchCursorAgent } from "./cursor";
import { notifyGrokBot } from "./notify";
import {
  appendActivity,
  defaultConfig,
  getDataDir,
  readActivities,
  readConfig,
  readFeed,
  writeConfig,
  writeFeed,
} from "./store";
import {
  ACTIVITIES,
  BRIDGE_ACTIONS,
  type ActivityName,
  type AppConfig,
  type BridgeAction,
  type ConfigureParams,
  type PerformParams,
  type SetupResult,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function parseAction(value: unknown): BridgeAction | null {
  return BRIDGE_ACTIONS.includes(value as BridgeAction)
    ? (value as BridgeAction)
    : null;
}

export function catalog() {
  return {
    actions: BRIDGE_ACTIONS,
    activities: ACTIVITIES,
    endpoints: {
      invoke: "/api/bridge",
      openapi: "/api/bridge/openapi",
      tools: "/api/bridge/tools",
    },
  };
}

export async function runSetup(): Promise<SetupResult> {
  const config = await readConfig();
  const env = {
    grokBridgeSecret: Boolean(process.env.GROK_BRIDGE_SECRET),
    grokBotWebhook: Boolean(process.env.GROK_BOT_WEBHOOK_URL),
    cursorApiKey: Boolean(process.env.CURSOR_API_KEY),
    cursorRepoUrl: Boolean(process.env.CURSOR_REPO_URL),
    bridgePublicUrl: process.env.BRIDGE_PUBLIC_URL || null,
  };

  const next: string[] = [];
  if (!env.grokBotWebhook) {
    next.push(
      "Set GROK_BOT_WEBHOOK_URL and GROK_BOT_WEBHOOK_KEY so the app can wake your Grok Bot routine.",
    );
  }
  if (!env.cursorApiKey) {
    next.push(
      "Set CURSOR_API_KEY (and optionally CURSOR_REPO_URL) to let the bot launch Cursor cloud agents.",
    );
  }
  if (!env.bridgePublicUrl || env.bridgePublicUrl.includes("localhost")) {
    next.push(
      "Expose this app with a public HTTPS URL (ngrok, Cloudflare Tunnel, or Vercel) and set BRIDGE_PUBLIC_URL. Grok Bot cannot reach localhost.",
    );
  }
  if (next.length === 0) {
    next.push("Bridge is ready. Install skills/inneedfeed-bridge/SKILL.md on the Grok Bot.");
  }

  await appendActivity({
    action: "setup",
    ok: true,
    summary: "Initialized data store and reported environment readiness.",
  });

  return { dataDir: getDataDir(), config, env, next };
}

export function parseConfigure(params: unknown): ConfigureParams | { error: string } {
  if (params == null) return {};
  if (!isRecord(params)) return { error: "configure params must be an object" };

  const features = isRecord(params.features) ? params.features : undefined;
  return {
    title: asString(params.title, 80),
    tagline: asString(params.tagline, 240),
    timezone: asString(params.timezone, 64),
    features: features
      ? {
          feed: typeof features.feed === "boolean" ? features.feed : undefined,
          cursorAgent:
            typeof features.cursorAgent === "boolean"
              ? features.cursorAgent
              : undefined,
          notifyGrok:
            typeof features.notifyGrok === "boolean"
              ? features.notifyGrok
              : undefined,
        }
      : undefined,
  };
}

export async function runConfigure(params: ConfigureParams): Promise<AppConfig> {
  const current = await readConfig();
  const featurePatch = params.features
    ? Object.fromEntries(
        Object.entries(params.features).filter(([, value]) => value !== undefined),
      )
    : {};
  const next = await writeConfig({
    ...current,
    title: params.title ?? current.title,
    tagline: params.tagline ?? current.tagline,
    timezone: params.timezone ?? current.timezone,
    features: {
      ...current.features,
      ...featurePatch,
    },
  });

  await appendActivity({
    action: "configure",
    ok: true,
    summary: `Updated app config (${next.title}).`,
  });

  return next;
}

export function parsePerform(params: unknown): PerformParams | { error: string } {
  if (!isRecord(params)) return { error: "perform params must be an object" };
  const activity = params.activity;
  if (!ACTIVITIES.includes(activity as ActivityName)) {
    return {
      error: `Unknown activity. Use one of: ${ACTIVITIES.join(", ")}`,
    };
  }
  return {
    activity: activity as ActivityName,
    message: asString(params.message, 2000),
    title: asString(params.title, 120),
    body: asString(params.body, 4000),
    prompt: asString(params.prompt, 8000),
    name: asString(params.name, 100),
  };
}

export async function runPerform(params: PerformParams) {
  const config = await readConfig();

  switch (params.activity) {
    case "ping": {
      const result = {
        ok: true as const,
        pong: true,
        title: config.title,
        now: new Date().toISOString(),
      };
      await appendActivity({
        action: "perform",
        activity: "ping",
        ok: true,
        summary: "Ping",
      });
      return result;
    }
    case "log": {
      const summary = params.message || "Logged an event from Grok Bot.";
      const record = await appendActivity({
        action: "perform",
        activity: "log",
        ok: true,
        summary,
      });
      return { ok: true as const, record };
    }
    case "list_feed": {
      if (!config.features.feed) {
        return { ok: false as const, error: "Feed feature is disabled in config." };
      }
      const items = await readFeed();
      await appendActivity({
        action: "perform",
        activity: "list_feed",
        ok: true,
        summary: `Listed ${items.length} feed items.`,
      });
      return { ok: true as const, items };
    }
    case "add_feed_item": {
      if (!config.features.feed) {
        return { ok: false as const, error: "Feed feature is disabled in config." };
      }
      if (!params.title) {
        return { ok: false as const, error: "add_feed_item requires params.title" };
      }
      const items = await readFeed();
      const item = {
        id: crypto.randomUUID(),
        title: params.title,
        body: params.body || "",
        createdAt: new Date().toISOString(),
        source: "grok_bot" as const,
      };
      await writeFeed([item, ...items].slice(0, 100));
      await appendActivity({
        action: "perform",
        activity: "add_feed_item",
        ok: true,
        summary: `Added feed item: ${item.title}`,
      });
      return { ok: true as const, item };
    }
    case "notify_grok": {
      if (!config.features.notifyGrok) {
        return { ok: false as const, error: "notifyGrok feature is disabled in config." };
      }
      const payload = {
        source: "inneedfeed-bridge",
        message: params.message || "Inneedfeed needs your attention.",
        at: new Date().toISOString(),
      };
      const result = await notifyGrokBot(payload);
      await appendActivity({
        action: "perform",
        activity: "notify_grok",
        ok: result.ok,
        summary: result.ok
          ? "Posted to Grok Bot webhook."
          : result.error || "Grok Bot webhook failed.",
      });
      return result.ok
        ? { ok: true as const, payload }
        : { ok: false as const, error: result.error };
    }
    case "cursor_agent": {
      if (!config.features.cursorAgent) {
        return { ok: false as const, error: "cursorAgent feature is disabled in config." };
      }
      if (!params.prompt) {
        return { ok: false as const, error: "cursor_agent requires params.prompt" };
      }
      const result = await launchCursorAgent({
        prompt: params.prompt,
        name: params.name,
      });
      await appendActivity({
        action: "perform",
        activity: "cursor_agent",
        ok: result.ok,
        summary: result.ok
          ? `Launched Cursor agent ${result.agentId ?? ""}`.trim()
          : result.error || "Cursor agent failed.",
      });
      return result;
    }
    default: {
      return { ok: false as const, error: "Unhandled activity" };
    }
  }
}

export async function snapshot() {
  const [config, feed, activities] = await Promise.all([
    readConfig(),
    readFeed(),
    readActivities(12),
  ]);
  return { catalog: catalog(), config, feed, activities };
}

export { defaultConfig };
