"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TOPICS } from "@/lib/content/areas";
import { getQuestionsByTopic } from "@/lib/questions/bank";
import { TOPIC_GENERATORS } from "@/lib/questions/generators";
import { useProgressStore, topicMastery } from "@/lib/store/progress";
import { masteryColor } from "@/lib/types";
import { Repeat, Ruler } from "lucide-react";

export default function PracticePage() {
  const [mounted, setMounted] = useState(false);
  const topicStats = useProgressStore((s) => s.topicStats);
  useEffect(() => setMounted(true), []);

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🎯 Practice Questions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Choose a topic to practise. Questions range from beginner to Senior 6 exam level, each with hints and full
          step-by-step solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/practice/formula-rearrangement" className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 hover:bg-amber-100">
          <Repeat className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-bold text-amber-800">Formula Rearrangement Trainer</h3>
            <p className="text-xs text-amber-700">Unlimited practice making any variable the subject of a formula.</p>
          </div>
        </Link>
        <Link href="/practice/unit-trainer" className="flex items-center gap-3 rounded-xl border border-teal-300 bg-teal-50 p-4 hover:bg-teal-100">
          <Ruler className="h-6 w-6 text-teal-600" />
          <div>
            <h3 className="font-bold text-teal-800">Unit Conversion Trainer</h3>
            <p className="text-xs text-teal-700">Unlimited practice converting between km/h, m/s, g, kg, cm, m and more.</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => {
          const curatedCount = getQuestionsByTopic(t.id).length;
          const hasGenerator = Boolean(TOPIC_GENERATORS[t.id]);
          const stat = mounted ? topicStats[t.id] : undefined;
          const { pct, level } = topicMastery(stat);
          return (
            <Link key={t.id} href={`/practice/${t.id}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="font-semibold text-slate-900">{t.title}</h3>
              <p className="mt-1 text-xs text-slate-600">
                {curatedCount} curated question(s){hasGenerator ? " + unlimited generated practice" : ""}
              </p>
              {mounted && (
                <div className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${masteryColor(level)}`}>
                  {pct}% · {level}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
