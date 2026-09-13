"use client";

import { useState } from "react";
import { buildQuestionSet } from "@/lib/questions";
import { TOPICS } from "@/lib/content/areas";
import QuestionCard from "@/components/questions/QuestionCard";
import { RefreshCcw } from "lucide-react";
import type { Question } from "@/lib/types";

export default function QuizPage() {
  const [count, setCount] = useState(10);
  const [topicId, setTopicId] = useState("all");
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestionSet(10));
  const [started, setStarted] = useState(false);

  function start() {
    setQuestions(buildQuestionSet(count, { topicIds: topicId === "all" ? undefined : [topicId] }));
    setStarted(true);
  }

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🧠 Quick Quiz</h1>
        <p className="mt-1 text-sm text-slate-600">
          A fast, mixed-topic quiz with instant feedback, hints, and full solutions — perfect for daily revision.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600">Number of questions</label>
          <select value={count} onChange={(e) => setCount(+e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600">Topic focus</label>
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="all">Mixed (all topics)</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <button onClick={start} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <RefreshCcw className="h-4 w-4" /> {started ? "Restart Quiz" : "Start Quiz"}
        </button>
      </div>

      {started && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
