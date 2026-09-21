"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CommandPalette } from "./CommandPalette";

const primary = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/calendar", label: "Calendar", icon: "calendar" },
  { href: "/post", label: "Post", icon: "plus" },
  { href: "/scoreboard", label: "Scoreboard", icon: "chart" },
] as const;

const more = [
  { href: "/recognition", label: "Plaques", hint: "Tiers after confirmed meals" },
  { href: "/bridge", label: "Bridge", hint: "Grok Bot API tools" },
] as const;

function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const common = { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8 };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path strokeLinecap="round" d="M8 3v4M16 3v4M3 11h18" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function SiteNavClient({
  openCount,
  claimedCount,
}: {
  openCount: number;
  claimedCount: number;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setDrawerOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const mod = useMemo(() => {
    if (typeof navigator === "undefined") return "⌘";
    return /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/20 shadow-[0_8px_30px_rgba(47,74,58,0.12)]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/chicago/nav-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[center_35%] scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e24]/85 via-[#243d31]/78 to-[#2f4a3a]/88 backdrop-blur-[2px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fffaf2]/15 ring-1 ring-white/30 backdrop-blur transition group-hover:bg-[#fffaf2]/25">
              <span className="text-lg leading-none">🍲</span>
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-[#fffaf2] sm:text-base">
                InNeedFeed
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[#e7dcc8]/80 sm:block">
                Chicago · Bread &amp; Table
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primary.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#fffaf2] text-[#2f4a3a] shadow-sm"
                      : "text-[#fffaf2]/90 hover:bg-white/10"
                  }`}
                >
                  <Icon name={link.icon} />
                  {link.label}
                  {link.href === "/calendar" && openCount > 0 ? (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                        active ? "bg-[#2f4a3a] text-[#fffaf2]" : "bg-[#c4a574] text-[#1a2e24]"
                      }`}
                    >
                      {openCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  more.some((m) => isActive(m.href))
                    ? "bg-[#fffaf2] text-[#2f4a3a]"
                    : "text-[#fffaf2]/90 hover:bg-white/10"
                }`}
                aria-expanded={moreOpen}
              >
                More
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.25 7.5 10 12.25 14.75 7.5" />
                </svg>
              </button>
              {moreOpen ? (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#e7dcc8] bg-[#fffaf2] py-1 shadow-xl">
                  {more.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 hover:bg-[#f0e6d6]"
                    >
                      <span className="block text-sm font-medium text-[#2f4a3a]">{item.label}</span>
                      <span className="block text-xs text-[#5c6b61]">{item.hint}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-xs text-[#fffaf2] ring-1 ring-white/15 backdrop-blur sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9fdfb2] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7dce95]" />
              </span>
              <span className="tabular-nums">
                <strong>{openCount}</strong> open · <strong>{claimedCount}</strong> in flight
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-full bg-[#fffaf2]/12 px-3 py-2 text-xs font-medium text-[#fffaf2] ring-1 ring-white/20 backdrop-blur transition hover:bg-[#fffaf2]/2 md:flex"
              aria-label="Open command palette"
            >
              <Icon name="search" className="h-3.5 w-3.5" />
              Jump
              <kbd className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px]">{mod}+K</kbd>
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffaf2]/15 text-[#fffaf2] ring-1 ring-white/25 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-[#fffaf2] shadow-2xl">
            <div className="relative h-36 overflow-hidden">
              <Image src="/chicago/section-river.jpg" alt="" fill className="object-cover" sizes="320px" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fffaf2] via-[#2f4a3a]/40 to-[#2f4a3a]/50" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#fffaf2]/90">Chicago pilot</p>
                  <p className="text-lg font-semibold text-[#2f4a3a]">Navigate</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full bg-white/80 p-2 text-[#2f4a3a]"
                  aria-label="Close"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {[...primary, ...more.map((m) => ({ ...m, icon: "home" as const }))].map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-3 py-3 text-sm font-medium ${
                      active ? "bg-[#2f4a3a] text-[#fffaf2]" : "text-[#2f4a3a] hover:bg-[#f0e6d6]"
                    }`}
                  >
                    {link.label}
                    {"hint" in link && link.hint ? (
                      <span className={`mt-0.5 block text-xs font-normal ${active ? "text-[#e7dcc8]" : "text-[#5c6b61]"}`}>
                        {link.hint}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setPaletteOpen(true);
                }}
                className="mt-2 rounded-xl border border-dashed border-[#c4a574] px-3 py-3 text-left text-sm font-medium text-[#7a5c2e]"
              >
                Jump anywhere ({mod}+K)
              </button>
            </nav>
          </aside>
        </div>
      ) : null}

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7dcc8]/80 bg-[#fffaf2]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {primary.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium ${
                  active ? "text-[#2f4a3a]" : "text-[#5c6b61]"
                }`}
              >
                {active ? (
                  <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-[#c4a574]" />
                ) : null}
                <Icon name={link.icon} className="h-5 w-5" />
                {link.label}
                {link.href === "/calendar" && openCount > 0 ? (
                  <span className="absolute right-1 top-1 rounded-full bg-[#2f4a3a] px-1 text-[9px] text-[#fffaf2]">
                    {openCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium text-[#5c6b61]"
          >
            <Icon name="menu" className="h-5 w-5" />
            More
          </button>
        </div>
      </nav>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} openCount={openCount} />
    </>
  );
}
