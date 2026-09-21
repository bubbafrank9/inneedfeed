import Image from "next/image";
import Link from "next/link";

export function ChicagoHero({
  openCount,
  confirmedHint,
}: {
  openCount: number;
  confirmedHint: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[#e7dcc8]/80 shadow-[0_20px_50px_rgba(47,74,58,0.15)]">
      <div className="absolute inset-0">
        <Image
          src="/chicago/20180804_191714.jpg"
          alt="Chicago skyline across Lake Michigan"
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="(max-width: 1024px) 100vw, 1100px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#122018]/88 via-[#1a2e24]/72 to-[#2f4a3a]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#122018]/75 via-transparent to-transparent" />
      </div>

      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#f0e6d6] ring-1 ring-white/20 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7dce95]" />
            Bread &amp; Table · Chicago pilot
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-[#fffaf2] sm:text-5xl">
            Claim a real meal need. Feed neighbors. Earn a mark worth hanging.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#e7dcc8] sm:text-lg sm:leading-8">
            Charities post specific upcoming meals — dinner for 20 elders, 250 shelter breakfasts —
            and restaurants commit on a calendar. Plaques count only after charity confirms
            fulfillment. {confirmedHint}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calendar"
              className="rounded-full bg-[#fffaf2] px-5 py-2.5 text-sm font-semibold text-[#2f4a3a] shadow-md transition hover:bg-white"
            >
              Browse calendar
              {openCount > 0 ? (
                <span className="ml-2 rounded-full bg-[#2f4a3a] px-2 py-0.5 text-[11px] text-[#fffaf2]">
                  {openCount} open
                </span>
              ) : null}
            </Link>
            <Link
              href="/scoreboard"
              className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-[#fffaf2] backdrop-blur transition hover:bg-white/20"
            >
              City scoreboard
            </Link>
            <Link
              href="/post"
              className="rounded-full border border-[#c4a574]/80 px-5 py-2.5 text-sm font-medium text-[#f5e6c8] transition hover:bg-[#c4a574]/20"
            >
              Post a need (demo)
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PhotoTile src="/chicago/20180714_221905.jpg" label="River & Loop" />
          <PhotoTile src="/chicago/20180714_222243.jpg" label="Millennium Park" />
          <PhotoTile src="/chicago/20180729_122129.jpg" label="Lakefront" className="col-span-2" />
        </div>
      </div>
      <p className="relative border-t border-white/10 bg-black/25 px-6 py-2 text-[10px] text-[#e7dcc8]/80 backdrop-blur">
        Photos: personal Chicago album (Kenny/Bubba) — cropped for web
      </p>
    </section>
  );
}

function PhotoTile({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative h-24 overflow-hidden rounded-2xl ring-1 ring-white/30 sm:h-28 ${className}`}>
      <Image src={src} alt={label} fill className="object-cover" sizes="280px" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <span className="absolute bottom-2 left-3 text-xs font-medium text-white">{label}</span>
    </div>
  );
}
