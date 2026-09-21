import Link from "next/link";
import type { MealNeed } from "@/lib/marketplace/types";

export function NeedCard({ need }: { need: MealNeed }) {
  const open = need.status === "open";
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
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            open ? "bg-[#e7f2ea] text-[#2f4a3a]" : "bg-[#f3e8d8] text-[#7a5c2e]"
          }`}
        >
          {open ? "Open" : "Claimed"}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#3d5346]">
        {need.headcount} people · {need.mealType} · {need.deliveryWindow}
      </p>
    </Link>
  );
}
