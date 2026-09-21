"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Item = { href: string; label: string; keywords: string; group: string };

const ITEMS: Item[] = [
  { href: "/", label: "Home", keywords: "landing hero open needs", group: "Pages" },
  { href: "/calendar", label: "Claim calendar", keywords: "jobs meals browse", group: "Pages" },
  { href: "/post", label: "Post a need", keywords: "charity demo pin create", group: "Pages" },
  { href: "/scoreboard", label: "Chicago scoreboard", keywords: "stats confirmed city", group: "Pages" },
  { href: "/recognition", label: "Plaques & tiers", keywords: "neighbor steward champion", group: "Pages" },
  { href: "/bridge", label: "Grok Bridge", keywords: "api tools grok", group: "Pages" },
];

export function CommandPalette({
  open,
  onClose,
  openCount,
}: {
  open: boolean;
  onClose: () => void;
  openCount: number;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ITEMS;
    return ITEMS.filter(
      (i) =>
        i.label.toLowerCase().includes(needle) ||
        i.keywords.includes(needle) ||
        i.group.toLowerCase().includes(needle),
    );
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/45 px-4 pt-[12vh] backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Dismiss" onClick={onClose} />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#e7dcc8] bg-[#fffaf2] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to page"
      >
        <div className="border-b border-[#e7dcc8] px-4 py-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, Math.max(filtered.length - 1, 0)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && filtered[active]) {
                e.preventDefault();
                go(filtered[active].href);
              }
            }}
            placeholder="Jump to calendar, plaques, scoreboard…"
            className="w-full bg-transparent text-base text-[#2f4a3a] outline-none placeholder:text-[#8a6b3d]/70"
          />
          <p className="mt-1 text-xs text-[#5c6b61]">
            {openCount} open meal jobs · Esc to close
          </p>
        </div>
        <ul className="max-h-72 overflow-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[#5c6b61]">No matches</li>
          ) : (
            filtered.map((item, idx) => (
              <li key={item.href}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => go(item.href)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                    idx === active ? "bg-[#2f4a3a] text-[#fffaf2]" : "text-[#2f4a3a] hover:bg-[#f0e6d6]"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className={`text-xs ${idx === active ? "text-[#e7dcc8]" : "text-[#8a6b3d]"}`}>
                    {item.group}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
