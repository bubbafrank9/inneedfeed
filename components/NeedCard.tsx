import Image from "next/image";
import Link from "next/link";
import type { MealNeed, NeedStatus } from "@/lib/marketplace/types";

const STATUS_STYLES: Record<NeedStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-[#e7f2ea] text-[#2f4a3a]" },
  claimed: { label: "Claimed", className: "bg-[#f3e8d8] text-[#7a5c2e]" },
  fulfilled: { label: "Fulfilled", className: "bg-[#e8eef8] text-[#3a4a6a]" },
  confirmed: { label: "Confirmed", className: "bg-[#2f4a3a] text-[#fffaf2]" },
  cancelled: { label: "Cancelled", className: "bg-[#f0e6d6] text-[#5c6b61]" },
};

/** Card headers only — never reuse home hero/gallery shots (avoids same-screen duplicates). */
const NEIGHBORHOOD_PHOTOS = [
  "/chicago/shot-river-reflection.jpg",
  "/chicago/shot-pink-towers.jpg",
  "/chicago/shot-sunset-hero.jpg",
  "/chicago/shot-night-trees.jpg",
  "/chicago/shot-night-band.jpg",
  "/chicago/shot-night-waterfront.jpg",
  "/chicago/shot-rooftops-dusk.jpg",
  "/chicago/shot-pano-day-west.jpg",
  "/chicago/shot-pano-day-east.jpg",
  "/chicago/shot-pano-dusk-left.jpg",
  "/chicago/shot-fireworks-wide.jpg",
  "/chicago/shot-harbor-masts.jpg",
  "/chicago/section-towers.jpg",
  "/chicago/section-skyline.jpg",
  "/chicago/section-river.jpg",
  "/chicago/section-bean.jpg",
];

function photoForNeed(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return NEIGHBORHOOD_PHOTOS[hash % NEIGHBORHOOD_PHOTOS.length];
}

export function NeedCard({ need }: { need: MealNeed }) {
  const badge = STATUS_STYLES[need.status] ?? STATUS_STYLES.open;
  const photo = photoForNeed(need.id);

  return (
    <Link
      href={`/needs/${need.id}`}
      className="group block overflow-hidden rounded-2xl border border-[#e7dcc8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c4a574] hover:shadow-lg"
    >
      <div className="relative h-28 overflow-hidden">
        <Image
          src={photo}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow ${badge.className}`}
        >
          {badge.label}
        </span>
        <p className="absolute bottom-2 left-3 text-xs font-medium text-white/95">
          {need.neighborhood}
        </p>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">{need.date}</p>
        <h3 className="mt-1 text-lg font-semibold text-[#2f4a3a]">{need.title}</h3>
        <p className="mt-1 text-sm text-[#5c6b61]">{need.charityName}</p>
        <p className="mt-3 text-sm text-[#3d5346]">
          {need.headcount} people · {need.mealType} · {need.deliveryWindow}
        </p>
      </div>
    </Link>
  );
}
