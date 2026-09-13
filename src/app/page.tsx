"use client";

import Link from "next/link";
import { BookOpen, FlaskConical, Target, Brain, Zap, Library, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useProgressStore, topicMastery, BADGES } from "@/lib/store/progress";
import { TOPICS } from "@/lib/content/areas";
import { masteryColor } from "@/lib/types";

const CTA_BUTTONS = [
  { href: "/learn", icon: BookOpen, label: "Start Learning" },
  { href: "/simulations", icon: FlaskConical, label: "Try a Simulation" },
  { href: "/practice", icon: Target, label: "Practice Questions" },
  { href: "/diagnostic", icon: Brain, label: "Test My Knowledge" },
  { href: "/daily", icon: Zap, label: "Challenge Me" },
  { href: "/formulas", icon: Library, label: "Formula Bank" },
  { href: "/progress", icon: BarChart3, label: "My Progress" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const topicStats = useProgressStore((s) => s.topicStats);
  const xp = useProgressStore((s) => s.xp);
  const badges = useProgressStore((s) => s.badges);
  const streak = useProgressStore((s) => s.streakCurrent);

  useEffect(() => setMounted(true), []);

  const totalAttempted = Object.values(topicStats).reduce((sum, t) => sum + t.attempted, 0);
  const totalCorrect = Object.values(topicStats).reduce((sum, t) => sum + t.correct, 0);
  const overallPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <main className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1b3a] via-[#122a5c] to-[#1d4ed8] px-6 py-14 text-white shadow-xl sm:px-12">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Uganda A-Level Physics · Senior 6</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">🚀 SENIOR 6 MECHANICS MASTER LAB</h1>
          <p className="mt-4 text-base text-slate-200 sm:text-lg">
            Understand the Physics. Master the Mathematics. Conquer the Exam.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
            A complete interactive learning system: lessons that explain <em>why</em> formulas work, live
            simulations you can control, hundreds of practice &amp; exam questions with full step-by-step
            solutions, a mistake analyser, and a personal AI-style physics tutor.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CTA_BUTTONS.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-3 py-4 text-xs font-semibold uppercase tracking-wide backdrop-blur transition hover:bg-amber-400 hover:text-slate-900 sm:text-sm"
              >
                <b.icon className="h-5 w-5" />
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {mounted && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="XP Earned" value={xp} accent="text-amber-500" />
          <StatCard label="Day Streak" value={streak} accent="text-orange-500" />
          <StatCard label="Overall Accuracy" value={`${overallPct}%`} accent="text-emerald-600" />
          <StatCard label="Badges Earned" value={`${badges.length}/${BADGES.length}`} accent="text-blue-600" />
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Curriculum at a Glance</h2>
          <Link href="/learn" className="text-sm font-semibold text-blue-700 hover:underline">
            View full curriculum →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.slice(0, 9).map((t) => {
            const stat = mounted ? topicStats[t.id] : undefined;
            const { pct, level } = topicMastery(stat);
            return (
              <Link
                key={t.id}
                href={`/learn/${t.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">{t.title}</h3>
                  {t.status === "extension" && (
                    <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
                      Extension
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600">{t.blurb}</p>
                {mounted && (
                  <div className={`mt-3 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${masteryColor(level)}`}>
                    {pct}% · {level}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">How this platform helps you learn</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["LEARN", "Clear explanations of every concept — simple language first, formal definitions second."],
            ["VISUALISE", "Interactive simulations for vectors, projectiles, collisions, circular motion, orbits and more."],
            ["TRY & PRACTISE", "Hundreds of generated and curated questions across every difficulty level."],
            ["GET FEEDBACK", "Instant grading, hints, full step-by-step solutions, and a mistake analyser."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-blue-700">{title}</h3>
              <p className="mt-1 text-xs text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className={`text-2xl font-extrabold ${accent}`}>{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
