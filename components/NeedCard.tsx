import Link from "next/link";
import type { MealNeed, NeedStatus } from "@/lib/marketplace/types";

const STATUS_STYLES: Record<NeedStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-[#e7f2ea] text-[#2f4a3a]" },
  claimed: { label: "Claimed", className: "bg-[#f3e8d8] text-[#7a5c2e]" },
  fulfilled: { label: "Fulfilled", className: "bg-[#e8eef8] text-[#3a4a6a]" },
  confirmed: { label: "Confirmed", className: "bg-[#2f4a3a] text-[#fffaf2]" },
  cancelled: { label: "Cancelled", className: "bg-[#f0e6d6] text-[#5c6b61]" },
};

export function NeedCard({ need }: { need: MealNeed }) {
  const badge = STATUS_STYLES[need.status] ?? STATUS_STYLES.open;
  return (
    <Link
      href={`/needs/${need.id}`}
      className="block rounded-2xl border border-[#e7dcc8] bg-white p-5 shadow-sm transition hover:border-[#c4a574]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">
            {need.date} · {need.neighborhood}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#2f4a3a]">{need.title}</h3>
          <p className="mt-1 text-sm text-[#5c6b61]">{need.charityName}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#3d5346]">
        {need.headcount} people · {need.mealType} · {need.deliveryWindow}
      </p>
    </Link>
  );
}
