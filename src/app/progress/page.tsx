"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore, topicMastery, BADGES } from "@/lib/store/progress";
import { TOPICS } from "@/lib/content/areas";
import { masteryColor } from "@/lib/types";
import { Flame, Sparkles, Trophy } from "lucide-react";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  const topicStats = useProgressStore((s) => s.topicStats);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streakCurrent);
  const longestStreak = useProgressStore((s) => s.streakLongest);
  const badges = useProgressStore((s) => s.badges);
  const examResults = useProgressStore((s) => s.examResults);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const totalAttempted = Object.values(topicStats).reduce((s, t) => s + t.attempted, 0);
  const totalCorrect = Object.values(topicStats).reduce((s, t) => s + t.correct, 0);
  const overallPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📊 My Progress</h1>
        <p className="mt-1 text-sm text-slate-600">Track your mastery, streaks, badges and exam history.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Sparkles className="h-5 w-5 text-amber-500" />} label="XP" value={xp} />
        <StatCard icon={<Flame className="h-5 w-5 text-orange-500" />} label="Current Streak" value={`${streak}d`} />
        <StatCard icon={<Flame className="h-5 w-5 text-orange-300" />} label="Longest Streak" value={`${longestStreak}d`} />
        <StatCard icon={<Trophy className="h-5 w-5 text-blue-500" />} label="Overall Accuracy" value={`${overallPct}%`} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Topic Mastery</h2>
        <div className="mt-3 space-y-2">
          {TOPICS.map((t) => {
            const { pct, level } = topicMastery(topicStats[t.id]);
            const attempted = topicStats[t.id]?.attempted ?? 0;
            return (
              <Link key={t.id} href={`/learn/${t.id}`} className="block rounded-lg p-2 hover:bg-slate-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{t.title}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${masteryColor(level)}`}>
                    {pct}% · {level}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">{attempted} question(s) attempted</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Badges</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const earned = badges.includes(b.id);
            return (
              <div key={b.id} className={`rounded-xl border p-3 text-center ${earned ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50 opacity-50"}`}>
                <div className="text-2xl">{b.icon}</div>
                <p className="mt-1 text-xs font-bold text-slate-800">{b.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{b.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Exam History</h2>
        {examResults.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No exams taken yet. Try Exam Mode!</p>
        ) : (
          <div className="mt-3 space-y-2">
            {examResults.slice(0, 10).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-sm">
                <span>{new Date(r.date).toLocaleDateString()} — {r.total} questions, {r.durationMin} min</span>
                <span className="font-bold text-blue-700">{r.score}/{r.total} ({r.percentage}%)</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => {
          if (confirm("Reset all progress? This cannot be undone.")) resetProgress();
        }}
        className="w-fit rounded-lg border border-rose-300 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
      >
        Reset All Progress
      </button>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className="flex justify-center">{icon}</div>
      <div className="mt-1 text-xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
