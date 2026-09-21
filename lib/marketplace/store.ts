import { promises as fs } from "fs";
import path from "path";
import { buildSeedNeeds } from "./seed";
import type { ClaimNeedInput, CreateNeedInput, MealNeed } from "./types";

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
  if (needs[idx].status === "claimed") {
    return { ok: false, error: "This need was already claimed." };
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

export function demoPin(): string {
  return process.env.DEMO_PIN?.trim() || "2244";
}
