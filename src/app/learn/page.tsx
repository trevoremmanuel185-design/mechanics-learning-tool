"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AREAS, getTopicsByArea } from "@/lib/content/areas";
import { useProgressStore, topicMastery } from "@/lib/store/progress";
import { masteryColor } from "@/lib/types";

export default function LearnPage() {
  const [mounted, setMounted] = useState(false);
  const topicStats = useProgressStore((s) => s.topicStats);
  useEffect(() => setMounted(true), []);

  return (
    <main className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📖 Learn Mechanics</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every topic follows the same path: simple explanation → definition → real-life meaning → formulae →
          derivation → worked examples → practice → mini-test.
        </p>
      </div>

      {AREAS.map((area) => {
        const topics = getTopicsByArea(area.id);
        if (topics.length === 0) return null;
        return (
          <section key={area.id}>
            <h2 className="text-lg font-bold text-slate-800">{area.title}</h2>
            <p className="text-xs text-slate-500">{area.description}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => {
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
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.subtopics.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
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
        );
      })}
    </main>
  );
}
