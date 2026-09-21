/**
 * Chicago pilot recognition thresholds — labeled TBD until Bubba locks.
 * Counts are charity-confirmed meals only (never claim-only).
 */
export const RECOGNITION_THRESHOLDS = {
  neighbor: 1, // Neighbor ≥1 confirmed — TBD
  tableSteward: 5, // Table Steward ≥5 confirmed — TBD
  cityChampion: 10, // City Champion ≥10 confirmed — TBD
} as const;

export type RecognitionTier = "Neighbor" | "Table Steward" | "City Champion";

export function tierForConfirmedCount(
  confirmedCount: number,
): RecognitionTier | null {
  if (confirmedCount >= RECOGNITION_THRESHOLDS.cityChampion) return "City Champion";
  if (confirmedCount >= RECOGNITION_THRESHOLDS.tableSteward) return "Table Steward";
  if (confirmedCount >= RECOGNITION_THRESHOLDS.neighbor) return "Neighbor";
  return null;
}

export const TIER_COPY: Record<
  RecognitionTier,
  { line: string; physical: string; note: string; thresholdLabel: string }
> = {
  Neighbor: {
    line: "We fed neighbors this month.",
    physical: "Window cling or counter standee",
    note: "First charity-confirmed meal — quiet thank-you, no stage.",
    thresholdLabel: `≥${RECOGNITION_THRESHOLDS.neighbor} confirmed (TBD)`,
  },
  "Table Steward": {
    line: "Table Steward — Bread & Table",
    physical: "Wall plaque with partner mark",
    note: "Habit tier — earned pride, not purchased glow.",
    thresholdLabel: `≥${RECOGNITION_THRESHOLDS.tableSteward} confirmed (TBD)`,
  },
  "City Champion": {
    line: "City Champion — Chicago tables",
    physical: "Trophy + ceremony moment",
    note: "Annual / top-tier recognition (thresholds TBD with Bubba).",
    thresholdLabel: `≥${RECOGNITION_THRESHOLDS.cityChampion} confirmed (TBD)`,
  },
};
