"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Open needs" },
  { href: "/post", label: "Post a need" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/recognition", label: "Plaques" },
] as const;

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7dcc8] bg-[#fffaf2]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0 shrink-0">
          <Link href="/" className="block font-semibold tracking-tight text-[#2f4a3a]">
            InNeedFeed
          </Link>
          <p className="hidden text-[11px] leading-tight text-[#8a6b3d] sm:block">
            Chicago · claim → fulfill → confirm
          </p>
        </div>

        <nav
          aria-label="Primary"
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {primaryLinks.map((link) => {
            const active = linkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "whitespace-nowrap rounded-full bg-[#2f4a3a] px-3 py-1.5 font-medium text-[#fffaf2]"
                    : "whitespace-nowrap rounded-full px-3 py-1.5 text-[#3d5346] hover:bg-[#f0e6d6]"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e7dcc8] bg-[#fffaf2]">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-[#5c6b61] sm:px-6">
        <p>InNeedFeed · Bread &amp; Table Chicago pilot</p>
        <Link
          href="/bridge"
          className="text-[#8a6b3d]/80 underline-offset-2 hover:text-[#2f4a3a] hover:underline"
        >
          Bridge (internal)
        </Link>
      </div>
    </footer>
  );
}
