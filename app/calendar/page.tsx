import Link from "next/link";
import { NeedCard } from "@/components/NeedCard";
import { listNeeds } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function labelMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const needs = await listNeeds();
  const months = [...new Set(needs.map((n) => monthKey(n.date)))].sort();
  const active = params.month && months.includes(params.month) ? params.month : months[0];
  const visible = needs.filter((n) => monthKey(n.date) === active);

  const byDay = new Map<string, typeof needs>();
  for (const need of visible) {
    const list = byDay.get(need.date) ?? [];
    list.push(need);
    byDay.set(need.date, list);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold text-[#2f4a3a]">Claim calendar</h1>
        <p className="mt-2 max-w-2xl text-[#5c6b61]">
          Open jobs restaurants can commit to. Demo charity names are placeholders until Bubba’s
          vetted roster lands. After claim: mark fulfilled → charity confirm → scoreboard & plaques.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {months.map((m) => (
          <Link
            key={m}
            href={`/calendar?month=${m}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              m === active
                ? "bg-[#2f4a3a] text-[#fffaf2]"
                : "border border-[#e7dcc8] bg-white text-[#3d5346]"
            }`}
          >
            {labelMonth(m)}
          </Link>
        ))}
      </div>

      <div className="space-y-8">
        {[...byDay.entries()].map(([day, dayNeeds]) => (
          <section key={day}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8a6b3d]">
              {new Date(day + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                timeZone: "America/Chicago",
              })}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {dayNeeds.map((need) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          </section>
        ))}
        {visible.length === 0 ? (
          <p className="text-[#5c6b61]">No needs in this month. Try another month or post one.</p>
        ) : null}
      </div>
    </div>
  );
}
