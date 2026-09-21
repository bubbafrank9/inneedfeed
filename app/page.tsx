import Link from "next/link";
import { NeedCard } from "@/components/NeedCard";
import { listNeeds } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const needs = await listNeeds();
  const open = needs.filter((n) => n.status === "open").slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
      <section className="rounded-3xl border border-[#e7dcc8] bg-gradient-to-br from-[#fffaf2] to-[#f0e6d6] p-8 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-wide text-[#8a6b3d]">
          Bread &amp; Table · Chicago pilot
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-[#2f4a3a] sm:text-5xl">
          Claim a real meal need. Feed neighbors. Earn a mark worth hanging.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5c6b61]">
          InNeedFeed lets charities post specific upcoming meals — dinner for 20 elders, 250
          shelter breakfasts — and restaurants commit on a calendar. Recognition plaques count only
          after charity confirms fulfillment — never on claim alone. Track honest city totals on the{" "}
          <Link href="/scoreboard" className="font-medium text-[#2f4a3a] underline underline-offset-2">
            Chicago scoreboard
          </Link>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calendar"
            className="rounded-full bg-[#2f4a3a] px-5 py-2.5 text-sm font-medium text-[#fffaf2]"
          >
            Browse calendar
          </Link>
          <Link
            href="/scoreboard"
            className="rounded-full border border-[#2f4a3a] px-5 py-2.5 text-sm font-medium text-[#2f4a3a]"
          >
            City scoreboard
          </Link>
          <Link
            href="/post"
            className="rounded-full border border-[#c4a574] px-5 py-2.5 text-sm font-medium text-[#7a5c2e]"
          >
            Post a need (demo)
          </Link>
        </div>
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

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e7dcc8] bg-white p-5">
      <h3 className="font-semibold text-[#2f4a3a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5c6b61]">{children}</p>
    </div>
  );
}
