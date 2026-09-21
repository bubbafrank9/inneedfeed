export type NeedStatus =
  | "open"
  | "claimed"
  | "fulfilled"
  | "confirmed"
  | "cancelled";

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
  fulfilledAt?: string;
  confirmedAt?: string;
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

export interface ChicagoScoreboard {
  confirmedMeals: number;
  confirmedHeadcount: number;
  restaurantsWithConfirmed: number;
  charitiesWithConfirmed: number;
  openCount: number;
  claimedCount: number;
  fulfilledPendingConfirm: number;
}

export interface RestaurantLeaderRow {
  restaurantName: string;
  confirmedCount: number;
  confirmedHeadcount: number;
  tier: "Neighbor" | "Table Steward" | "City Champion" | null;
}
