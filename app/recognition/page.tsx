import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { RECOGNITION_THRESHOLDS, TIER_COPY, type RecognitionTier } from "@/lib/marketplace/recognition";
import { listRestaurantLeaderboard } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

const TIER_ORDER: RecognitionTier[] = ["Neighbor", "Table Steward", "City Champion"];

export default async function RecognitionPage() {
  const leaderboard = await listRestaurantLeaderboard();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <PageBanner
        src="/chicago/section-bean.jpg"
        eyebrow="Story Vaccine · physical marks"
        title="Plaques & recognition"
      >
        <p>
          Recognition issues only after charity confirms fulfillment. Thresholds are pilot constants
          labeled TBD. Live counts:{" "}
          <Link href="/scoreboard" className="font-medium text-[#fffaf2] underline underline-offset-2">
            Chicago scoreboard
          </Link>
          .
        </p>
      </PageBanner>

      <div className="grid gap-4 md:grid-cols-3">
        {TIER_ORDER.map((name) => {
          const tier = TIER_COPY[name];
          return (
            <article
              key={name}
              className="flex flex-col rounded-2xl border border-[#e7dcc8] bg-white/90 p-6 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">Tier</p>
              <h2 className="mt-1 text-xl font-semibold text-[#2f4a3a]">{name}</h2>
              <p className="mt-1 text-xs font-medium text-[#8a6b3d]">{tier.thresholdLabel}</p>
              <p className="mt-4 text-lg italic text-[#3d5346]">“{tier.line}”</p>
              <p className="mt-4 text-sm text-[#5c6b61]">
                <span className="font-medium text-[#2f4a3a]">Physical: </span>
                {tier.physical}
              </p>
              <p className="mt-2 text-sm text-[#5c6b61]">{tier.note}</p>
            </article>
          );
        })}
      </div>

      <section className="rounded-3xl border border-[#e7dcc8] bg-white/90 p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-[#2f4a3a]">Restaurant leaderboard</h2>
        <p className="mt-1 text-sm text-[#5c6b61]">
          Confirmed meals only. Neighbor ≥{RECOGNITION_THRESHOLDS.neighbor}, Table Steward ≥
          {RECOGNITION_THRESHOLDS.tableSteward}, City Champion ≥{RECOGNITION_THRESHOLDS.cityChampion}{" "}
          (all TBD).
        </p>

        {leaderboard.length === 0 ? (
          <p className="mt-6 text-sm text-[#5c6b61]">
            No confirmed meals yet. Claim → mark fulfilled → charity confirm, then names appear here.
          </p>
        ) : (
          <ol className="mt-6 divide-y divide-[#e7dcc8]">
            {leaderboard.map((row, index) => (
              <li
                key={row.restaurantName}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium tabular-nums text-[#8a6b3d]">
                    {index + 1}.
                  </span>
                  <div>
                    <p className="font-semibold text-[#2f4a3a]">{row.restaurantName}</p>
                    <p className="text-sm text-[#5c6b61]">
                      {row.confirmedCount} confirmed ·{" "}
                      {row.confirmedHeadcount.toLocaleString("en-US")} people fed
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    row.tier ? "bg-[#e7f2ea] text-[#2f4a3a]" : "bg-[#f0e6d6] text-[#5c6b61]"
                  }`}
                >
                  {row.tier ?? "Below Neighbor"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
