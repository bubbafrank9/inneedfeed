import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Calendar" },
  { href: "/post", label: "Post a need" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/recognition", label: "Plaques" },
  { href: "/bridge", label: "Bridge" },
];

export function SiteNav() {
  return (
    <header className="border-b border-[#e7dcc8] bg-[#fffaf2]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-[#2f4a3a]">
          InNeedFeed
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[#3d5346] hover:bg-[#f0e6d6]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
