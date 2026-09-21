export const BRIDGE_ACTIONS = ["list", "setup", "configure", "perform"] as const;
export type BridgeAction = (typeof BRIDGE_ACTIONS)[number];

export const ACTIVITIES = [
  "ping",
  "log",
  "add_feed_item",
  "list_feed",
  "notify_grok",
  "cursor_agent",
] as const;
export type ActivityName = (typeof ACTIVITIES)[number];

export type AppConfig = {
  title: string;
  tagline: string;
  timezone: string;
  features: {
    feed: boolean;
    cursorAgent: boolean;
    notifyGrok: boolean;
  };
  updatedAt: string;
};

export type FeedItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  source: "grok_bot" | "app";
};

export type ActivityRecord = {
  id: string;
  at: string;
  action: BridgeAction | "system";
  activity?: ActivityName;
  summary: string;
  ok: boolean;
};

export type SetupResult = {
  dataDir: string;
  config: AppConfig;
  env: {
    grokBridgeSecret: boolean;
    grokBotWebhook: boolean;
    cursorApiKey: boolean;
    cursorRepoUrl: boolean;
    bridgePublicUrl: string | null;
  };
  next: string[];
};

export type PerformParams = {
  activity: ActivityName;
  message?: string;
  title?: string;
  body?: string;
  prompt?: string;
  name?: string;
};

export type ConfigureParams = {
  title?: string;
  tagline?: string;
  timezone?: string;
  features?: Partial<AppConfig["features"]>;
};

export type BridgeRequestBody = {
  action?: unknown;
  params?: unknown;
};
