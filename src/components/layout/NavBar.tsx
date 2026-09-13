"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Rocket, Flame, Sparkles } from "lucide-react";
import { useProgressStore } from "@/lib/store/progress";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/simulations", label: "Simulations" },
  { href: "/practice", label: "Practice" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/formulas", label: "Formula Bank" },
  { href: "/graph-trainer", label: "Graph Trainer" },
  { href: "/quiz", label: "Quiz" },
  { href: "/exam", label: "Exam Mode" },
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/daily", label: "Daily Challenge" },
  { href: "/progress", label: "Progress" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/glossary", label: "Glossary" },
  { href: "/misconceptions", label: "Misconceptions" },
  { href: "/tutor", label: "AI Tutor" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streakCurrent);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0b1b3a] text-white shadow-lg">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <Rocket className="h-6 w-6 text-amber-400" />
          <span className="text-sm font-bold leading-tight sm:text-base">
            SENIOR 6 <span className="text-amber-400">MECHANICS</span> MASTER LAB
          </span>
        </Link>

        <nav className="ml-4 hidden flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  active ? "bg-amber-400 text-slate-900" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {mounted && (
            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> {xp} XP
              <span className="mx-1 text-slate-500">•</span>
              <Flame className="h-3.5 w-3.5 text-orange-400" /> {streak}d streak
            </div>
          )}
          <button
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid grid-cols-2 gap-1 border-t border-slate-800 bg-[#0b1b3a] px-4 py-3 sm:grid-cols-3 lg:hidden">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide ${
                  active ? "bg-amber-400 text-slate-900" : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
