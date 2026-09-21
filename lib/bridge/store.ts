import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ActivityRecord, AppConfig, FeedItem } from "./types";

const dataDir = path.join(process.cwd(), "data");
const configPath = path.join(dataDir, "config.json");
const feedPath = path.join(dataDir, "feed.json");
const activityPath = path.join(dataDir, "activities.json");

export function getDataDir(): string {
  return dataDir;
}

export function defaultConfig(): AppConfig {
  return {
    title: "Inneedfeed",
    tagline: "Grok Bot can set up, configure, and run activities here.",
    timezone: "America/Chicago",
    features: {
      feed: true,
      cursorAgent: true,
      notifyGrok: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

async function ensureDataDir(): Promise<void> {
  await mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function ensureStore(): Promise<AppConfig> {
  await ensureDataDir();
  const config = await readJson<AppConfig | null>(configPath, null);
  if (!config) {
    const created = defaultConfig();
    await writeFile(configPath, JSON.stringify(created, null, 2));
    await writeFile(feedPath, "[]");
    await writeFile(activityPath, "[]");
    return created;
  }
  return config;
}

export async function readConfig(): Promise<AppConfig> {
  return ensureStore();
}

export async function writeConfig(config: AppConfig): Promise<AppConfig> {
  await ensureDataDir();
  const next = { ...config, updatedAt: new Date().toISOString() };
  await writeFile(configPath, JSON.stringify(next, null, 2));
  return next;
}

export async function readFeed(): Promise<FeedItem[]> {
  await ensureStore();
  return readJson<FeedItem[]>(feedPath, []);
}

export async function writeFeed(items: FeedItem[]): Promise<FeedItem[]> {
  await ensureDataDir();
  await writeFile(feedPath, JSON.stringify(items, null, 2));
  return items;
}

export async function readActivities(limit = 20): Promise<ActivityRecord[]> {
  await ensureStore();
  const all = await readJson<ActivityRecord[]>(activityPath, []);
  return all.slice(0, limit);
}

export async function appendActivity(
  record: Omit<ActivityRecord, "id" | "at">,
): Promise<ActivityRecord> {
  await ensureStore();
  const all = await readJson<ActivityRecord[]>(activityPath, []);
  const entry: ActivityRecord = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    ...record,
  };
  all.unshift(entry);
  await writeFile(activityPath, JSON.stringify(all.slice(0, 200), null, 2));
  return entry;
}
