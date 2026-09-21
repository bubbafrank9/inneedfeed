export type NeedStatus = "open" | "claimed";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealNeed {
  id: string;
  title: string;
  charityName: string;
  neighborhood: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  headcount: number;
  dietRules: string;
  allergens: string;
  deliveryWindow: string;
  notes?: string;
  status: NeedStatus;
  claimedBy?: {
    restaurantName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    claimedAt: string;
  };
  createdAt: string;
}

export interface CreateNeedInput {
  title: string;
  charityName: string;
  neighborhood: string;
  date: string;
  mealType: MealType;
  headcount: number;
  dietRules: string;
  allergens: string;
  deliveryWindow: string;
  notes?: string;
}

export interface ClaimNeedInput {
  restaurantName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  confirmDiet: boolean;
  confirmAllergens: boolean;
  confirmWindow: boolean;
}
