"use client";

import { useMemo, useState } from "react";
import { QUESTION_BANK } from "@/lib/questions/bank";
import { TOPICS } from "@/lib/content/areas";
import QuestionCard from "@/components/questions/QuestionCard";

export default function ScenariosPage() {
  const [topicFilter, setTopicFilter] = useState("all");

  const scenarioQuestions = useMemo(() => {
    let list = QUESTION_BANK.filter((q) => q.scenario || q.type === "scenario" || q.type === "multistep");
    if (topicFilter !== "all") list = list.filter((q) => q.topicId === topicFilter);
    return list;
  }, [topicFilter]);

  const REAL_WORLD_CONTEXTS = [
    "🏍️ Boda bodas", "🚌 Buses & matatus", "🚂 Trains", "✈️ Aircraft", "⚽ Football", "🏃 Athletics",
    "🏀 Basketball", "🏗️ Construction cranes", "🌉 Bridges", "🛗 Lifts", "🚜 Tractors & agriculture",
    "💧 Water pumps", "🛰️ Satellites", "🚀 Rockets", "🪨 Falling objects", "🌀 Springs & pendulums", "🚤 Boats",
  ];

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🌍 Real-Life Scenario Questions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Mechanics questions set in realistic Ugandan and international contexts — because physics is everywhere.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {REAL_WORLD_CONTEXTS.map((c) => (
          <span key={c} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            {c}
          </span>
        ))}
      </div>

      <select
        value={topicFilter}
        onChange={(e) => setTopicFilter(e.target.value)}
        className="w-fit rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="all">All topics</option>
        {TOPICS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {scenarioQuestions.length > 0 ? (
          scenarioQuestions.map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)
        ) : (
          <p className="text-sm text-slate-500">No scenario questions found for this topic yet.</p>
        )}
      </div>
    </main>
  );
}
