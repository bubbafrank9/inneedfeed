import { promises as fs } from "fs";
import path from "path";
import { tierForConfirmedCount } from "./recognition";
import { buildSeedNeeds } from "./seed";
import type {
  ChicagoScoreboard,
  ClaimNeedInput,
  CreateNeedInput,
  MealNeed,
  RestaurantLeaderRow,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "needs.json");

async function ensureNeedsFile(): Promise<MealNeed[]> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as MealNeed[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // missing or empty — seed
  }
  const seeded = buildSeedNeeds();
  await fs.writeFile(DATA_PATH, JSON.stringify(seeded, null, 2), "utf8");
  return seeded;
}

async function writeNeeds(needs: MealNeed[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(needs, null, 2), "utf8");
}

export async function listNeeds(): Promise<MealNeed[]> {
  const needs = await ensureNeedsFile();
  return [...needs].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getNeed(id: string): Promise<MealNeed | null> {
  const needs = await ensureNeedsFile();
  return needs.find((n) => n.id === id) ?? null;
}

export async function createNeed(input: CreateNeedInput): Promise<MealNeed> {
  const needs = await ensureNeedsFile();
  const need: MealNeed = {
    id: `need-${Date.now().toString(36)}`,
    ...input,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  needs.push(need);
  await writeNeeds(needs);
  return need;
}

export async function claimNeed(
  id: string,
  input: ClaimNeedInput,
): Promise<{ ok: true; need: MealNeed } | { ok: false; error: string }> {
  if (!input.confirmDiet || !input.confirmAllergens || !input.confirmWindow) {
    return { ok: false, error: "Confirm diet, allergens, and delivery window before claiming." };
  }
  if (!input.restaurantName.trim() || !input.contactName.trim()) {
    return { ok: false, error: "Restaurant name and contact name are required." };
  }

  const needs = await ensureNeedsFile();
  const idx = needs.findIndex((n) => n.id === id);
  if (idx < 0) return { ok: false, error: "Need not found." };
  if (needs[idx].status !== "open") {
    return { ok: false, error: "This need is no longer open for claims." };
  }

  needs[idx] = {
    ...needs[idx],
    status: "claimed",
    claimedBy: {
      restaurantName: input.restaurantName.trim(),
      contactName: input.contactName.trim(),
      contactPhone: input.contactPhone.trim(),
      contactEmail: input.contactEmail.trim(),
      claimedAt: new Date().toISOString(),
    },
  };
  await writeNeeds(needs);
  return { ok: true, need: needs[idx] };
}

/** Restaurant marks delivery done → fulfilled (awaiting charity confirm). */
export async function markFulfilled(
  id: string,
): Promise<{ ok: true; need: MealNeed } | { ok: false; error: string }> {
  const needs = await ensureNeedsFile();
  const idx = needs.findIndex((n) => n.id === id);
  if (idx < 0) return { ok: false, error: "Need not found." };
  if (needs[idx].status !== "claimed") {
    return { ok: false, error: "Only claimed needs can be marked fulfilled." };
  }

  needs[idx] = {
    ...needs[idx],
    status: "fulfilled",
    fulfilledAt: new Date().toISOString(),
  };
  await writeNeeds(needs);
  return { ok: true, need: needs[idx] };
}

/** Charity confirms receipt with demo PIN → confirmed (counts for recognition). */
export async function confirmFulfilled(
  id: string,
  pin: string,
): Promise<{ ok: true; need: MealNeed } | { ok: false; error: string }> {
  if (pin.trim() !== demoPin()) {
    return { ok: false, error: "Wrong demo PIN. See README for the pilot code." };
  }

  const needs = await ensureNeedsFile();
  const idx = needs.findIndex((n) => n.id === id);
  if (idx < 0) return { ok: false, error: "Need not found." };
  if (needs[idx].status !== "fulfilled") {
    return { ok: false, error: "Only fulfilled needs can be confirmed by the charity." };
  }

  needs[idx] = {
    ...needs[idx],
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
  };
  await writeNeeds(needs);
  return { ok: true, need: needs[idx] };
}

export function demoPin(): string {
  return process.env.DEMO_PIN?.trim() || "2244";
}

export async function getChicagoScoreboard(): Promise<ChicagoScoreboard> {
  const needs = await listNeeds();
  const confirmed = needs.filter((n) => n.status === "confirmed");
  const restaurants = new Set(
    confirmed
      .map((n) => n.claimedBy?.restaurantName?.trim())
      .filter((name): name is string => Boolean(name)),
  );
  const charities = new Set(
    confirmed.map((n) => n.charityName.trim()).filter(Boolean),
  );

  return {
    confirmedMeals: confirmed.length,
    confirmedHeadcount: confirmed.reduce((sum, n) => sum + n.headcount, 0),
    restaurantsWithConfirmed: restaurants.size,
    charitiesWithConfirmed: charities.size,
    openCount: needs.filter((n) => n.status === "open").length,
    claimedCount: needs.filter((n) => n.status === "claimed").length,
    fulfilledPendingConfirm: needs.filter((n) => n.status === "fulfilled").length,
  };
}

/** Live restaurant leaderboard — confirmed meals only. */
export async function listRestaurantLeaderboard(): Promise<RestaurantLeaderRow[]> {
  const needs = await listNeeds();
  const map = new Map<string, { confirmedCount: number; confirmedHeadcount: number }>();

  for (const need of needs) {
    if (need.status !== "confirmed" || !need.claimedBy?.restaurantName) continue;
    const name = need.claimedBy.restaurantName.trim();
    const row = map.get(name) ?? { confirmedCount: 0, confirmedHeadcount: 0 };
    row.confirmedCount += 1;
    row.confirmedHeadcount += need.headcount;
    map.set(name, row);
  }

  return [...map.entries()]
    .map(([restaurantName, stats]) => ({
      restaurantName,
      confirmedCount: stats.confirmedCount,
      confirmedHeadcount: stats.confirmedHeadcount,
      tier: tierForConfirmedCount(stats.confirmedCount),
    }))
    .sort((a, b) => {
      if (b.confirmedCount !== a.confirmedCount) return b.confirmedCount - a.confirmedCount;
      return b.confirmedHeadcount - a.confirmedHeadcount;
    });
}
