import Link from "next/link";
import { ChicagoHero } from "@/components/ChicagoHero";
import { NeedCard } from "@/components/NeedCard";
import { getChicagoScoreboard, listNeeds } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [needs, board] = await Promise.all([listNeeds(), getChicagoScoreboard()]);
  const open = needs.filter((n) => n.status === "open").slice(0, 4);
  const openCount = needs.filter((n) => n.status === "open").length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12">
      <ChicagoHero
        openCount={openCount}
        confirmedHint={
          board.confirmedMeals > 0
            ? `${board.confirmedMeals} confirmed meals on the city board so far.`
            : "The city scoreboard stays honest — claims alone never inflate it."
        }
      />

      <section className="animate-fade-up grid gap-3 sm:grid-cols-3">
        <StatChip label="Open now" value={String(openCount)} />
        <StatChip label="Confirmed meals" value={String(board.confirmedMeals)} />
        <StatChip
          label="Confirmed headcount"
          value={board.confirmedHeadcount.toLocaleString("en-US")}
        />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold text-[#2f4a3a]">Open needs</h2>
          <Link href="/calendar" className="text-sm font-medium text-[#8a6b3d] hover:underline">
            Full calendar →
          </Link>
        </div>
        {open.length === 0 ? (
          <p className="text-[#5c6b61]">No open needs right now — post one in demo mode.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {open.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Info title="Specific, not leftovers">
          Every card is a scheduled headcount, window, and diet rules — the opposite of roulette.
        </Info>
        <Info title="One claim per need">
          Confirm diet, allergens, and timing before you lock the slot. Then mark fulfilled; charity
          confirms before it counts.
        </Info>
        <Info title="Confirm before plaque">
          Neighbor → Table Steward → City Champion only after confirmed meals. See Plaques and the
          scoreboard.
        </Info>
      </section>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e7dcc8] bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[#2f4a3a]">{value}</p>
    </div>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e7dcc8] bg-white/90 p-5 shadow-sm">
      <h3 className="font-semibold text-[#2f4a3a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5c6b61]">{children}</p>
    </div>
  );
}
