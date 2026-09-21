import Image from "next/image";
import Link from "next/link";
import { NeedCard } from "@/components/NeedCard";
import { listNeeds } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

/** Personal Chicago album — city character (street, plaza, civic, Mart, canyon, patio, one river night, neighborhood). */
const GALLERY = [
  {
    src: "/chicago/shot-magnificile.jpg",
    alt: "Looking up past The Drake toward the Hancock on Goethe Street",
    caption: "Magnificent Mile · Goethe",
  },
  {
    src: "/chicago/shot-federal-plaza.jpg",
    alt: "Federal Plaza architecture and Calder sculpture at street level",
    caption: "Federal Plaza",
  },
  {
    src: "/chicago/shot-harold-library.jpg",
    alt: "Harold Washington Library at sunset",
    caption: "Harold Washington Library",
  },
  {
    src: "/chicago/shot-merchandise-mart.jpg",
    alt: "Merchandise Mart and riverfront towers at dusk",
    caption: "Merchandise Mart · dusk",
  },
  {
    src: "/chicago/shot-pano-day-loop.jpg",
    alt: "Daytime Chicago Loop skyline across Grant Park",
    caption: "The Loop · day",
  },
  {
    src: "/chicago/shot-patio-night.jpg",
    alt: "Night outdoor dining patio with orange umbrellas and city buildings",
    caption: "River patio night",
  },
  {
    src: "/chicago/shot-neon-river.jpg",
    alt: "Neon purple and pink river reflections of Chicago buildings",
    caption: "River lights",
  },
  {
    src: "/chicago/shot-rooftop-clouds.jpg",
    alt: "Neighborhood brick rooftop under a dramatic cloudscape",
    caption: "Neighborhood rooftop",
  },
] as const;

export default async function HomePage() {
  const needs = await listNeeds();
  const open = needs.filter((n) => n.status === "open").slice(0, 4);

  return (
    <div className="flex w-full flex-1 flex-col">
      <section className="relative isolate min-h-[28rem] overflow-hidden sm:min-h-[32rem]">
        <Image
          src="/chicago/shot-bluehour-river.jpg"
          alt="Chicago River at blue hour with Wrigley Building and Michigan Avenue Bridge"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a22]/85 via-[#1a2a22]/45 to-[#1a2a22]/20" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-end px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-medium uppercase tracking-wide text-[#e7dcc8]">
            Bread &amp; Table · Chicago pilot
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Feed this city, one claimed table at a time.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#f0e6d6] sm:text-lg sm:leading-8">
            Charities post a meal need. Restaurants claim it, deliver, then mark fulfilled.
            Charity confirms — only then it counts for the scoreboard and plaques.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12">
        <section className="-mt-16 grid gap-3 sm:-mt-20 sm:grid-cols-2">
          <Link
            href="/calendar"
            className="group rounded-2xl border border-[#2f4a3a] bg-[#2f4a3a] p-5 text-[#fffaf2] shadow-lg transition hover:bg-[#3d5c4a]"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[#e7dcc8]">
              Restaurant
            </p>
            <p className="mt-1 text-lg font-semibold">I&apos;m a restaurant</p>
            <p className="mt-2 text-sm leading-6 text-[#e7dcc8]">
              Browse open needs, then claim, then fulfill delivery
            </p>
            <p className="mt-4 text-sm font-medium group-hover:underline">Open needs calendar</p>
          </Link>

          <Link
            href="/post"
            className="group rounded-2xl border border-[#c4a574] bg-white p-5 text-[#2f4a3a] shadow-lg transition hover:border-[#2f4a3a] hover:bg-[#fffaf2]"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">Charity</p>
            <p className="mt-1 text-lg font-semibold">I&apos;m a charity</p>
            <p className="mt-2 text-sm leading-6 text-[#5c6b61]">
              Post a need, wait for a claim, then confirm delivery
            </p>
            <p className="mt-4 text-sm font-medium group-hover:underline">Post a need</p>
          </Link>
        </section>

        <p className="text-sm text-[#5c6b61]">
          Path:{" "}
          <span className="font-medium text-[#2f4a3a]">open, claimed, fulfilled, confirmed</span>.
          Scoreboard and plaques count <span className="font-medium text-[#2f4a3a]">confirmed</span>{" "}
          only.{" "}
          <Link
            href="/scoreboard"
            className="font-medium text-[#8a6b3d] underline underline-offset-2 hover:text-[#2f4a3a]"
          >
            City scoreboard
          </Link>
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-[#2f4a3a]">This city</h2>
          <p className="mt-1 text-sm text-[#5c6b61]">Your Chicago album — Mag Mile street, Federal Plaza, the library, Merchandise Mart, a street canyon, patio night, one river-lights shot, and a neighborhood rooftop. One of each. No beach or harbor clones.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((shot) => (
              <figure
                key={shot.src}
                className="overflow-hidden rounded-2xl border border-[#e7dcc8] bg-[#f0e6d6]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <figcaption className="px-3 py-2 text-xs font-medium text-[#5c6b61]">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold text-[#2f4a3a]">Open needs</h2>
            <Link href="/calendar" className="text-sm font-medium text-[#8a6b3d] hover:underline">
              Full calendar
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
      </div>
    </div>
  );
}
