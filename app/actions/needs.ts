"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { claimNeed, createNeed, demoPin } from "@/lib/marketplace/store";
import type { MealType } from "@/lib/marketplace/types";

export type ActionState = { error?: string; ok?: boolean };

export async function claimNeedAction(
  needId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await claimNeed(needId, {
    restaurantName: String(formData.get("restaurantName") || ""),
    contactName: String(formData.get("contactName") || ""),
    contactPhone: String(formData.get("contactPhone") || ""),
    contactEmail: String(formData.get("contactEmail") || ""),
    confirmDiet: formData.get("confirmDiet") === "on",
    confirmAllergens: formData.get("confirmAllergens") === "on",
    confirmWindow: formData.get("confirmWindow") === "on",
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/calendar");
  revalidatePath(`/needs/${needId}`);
  revalidatePath("/");
  redirect(`/needs/${needId}?claimed=1`);
}

export async function createNeedAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const pin = String(formData.get("demoPin") || "");
  if (pin !== demoPin()) {
    return { error: "Wrong demo PIN. See README for the pilot code." };
  }

  const title = String(formData.get("title") || "").trim();
  const charityName = String(formData.get("charityName") || "").trim();
  const neighborhood = String(formData.get("neighborhood") || "").trim();
  const date = String(formData.get("date") || "");
  const dietRules = String(formData.get("dietRules") || "").trim();
  const allergens = String(formData.get("allergens") || "").trim();
  const deliveryWindow = String(formData.get("deliveryWindow") || "").trim();
  const notes = String(formData.get("notes") || "").trim() || undefined;
  const headcount = Number(formData.get("headcount") || 0);
  const mealType = String(formData.get("mealType") || "dinner") as MealType;
  const allowed: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  if (!title || !charityName || !date || !allergens || !dietRules || !deliveryWindow || !neighborhood) {
    return { error: "Fill every required field (allergens included)." };
  }
  if (!headcount || headcount < 1) {
    return { error: "Headcount must be at least 1." };
  }
  if (!allowed.includes(mealType)) {
    return { error: "Pick a valid meal type." };
  }

  const need = await createNeed({
    title,
    charityName,
    neighborhood,
    date,
    mealType,
    headcount,
    dietRules,
    allergens,
    deliveryWindow,
    notes,
  });

  revalidatePath("/calendar");
  revalidatePath("/");
  redirect(`/needs/${need.id}`);
}
