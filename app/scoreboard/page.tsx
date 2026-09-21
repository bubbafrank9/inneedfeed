import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { getChicagoScoreboard } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

export default async function ScoreboardPage() {
  const board = await getChicagoScoreboard();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <PageBanner
        src="/chicago/section-skyline.jpg"
        eyebrow="Chicago · public aggregates"
        title="City scoreboard"
      >
        <p>
          Honest city-level counts. Confirmed meals only — claim and fulfill-without-confirm do not
          inflate the board. Seed charity names are demo placeholders.
        </p>
      </PageBanner>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Confirmed meals" value={String(board.confirmedMeals)} hint="Charity-confirmed fulfillments" />
        <Stat
          label="Confirmed headcount"
          value={board.confirmedHeadcount.toLocaleString("en-US")}
          hint="Sum of people on confirmed needs"
        />
        <Stat
          label="Restaurants (≥1 confirmed)"
          value={String(board.restaurantsWithConfirmed)}
          hint="Distinct restaurants with a confirmed meal"
        />
        <Stat
          label="Charities (≥1 confirmed)"
          value={String(board.charitiesWithConfirmed)}
          hint="Distinct charities with a confirmed meal"
        />
        <Stat label="Open needs" value={String(board.openCount)} hint="Still claimable" />
        <Stat
          label="Claimed (in flight)"
          value={String(board.claimedCount)}
          hint={`+ ${board.fulfilledPendingConfirm} fulfilled awaiting confirm`}
        />
      </section>

      <p className="text-sm text-[#5c6b61]">
        Restaurant tiers live on{" "}
        <Link href="/recognition" className="font-medium text-[#2f4a3a] underline underline-offset-2">
          Plaques
        </Link>
        . Browse open jobs on the{" "}
        <Link href="/calendar" className="font-medium text-[#2f4a3a] underline underline-offset-2">
          claim calendar
        </Link>
        .
      </p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-[#e7dcc8] bg-white/90 p-6 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-[#2f4a3a]">{value}</p>
      <p className="mt-2 text-sm text-[#5c6b61]">{hint}</p>
    </div>
  );
}
