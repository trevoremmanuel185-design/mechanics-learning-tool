"use client";

import { useMemo, useState } from "react";
import { QUESTION_BANK } from "@/lib/questions/bank";
import { generateForTopic } from "@/lib/questions/generators";
import { TOPICS } from "@/lib/content/areas";
import { gradeAnswer } from "@/lib/utils/grading";
import { useProgressStore } from "@/lib/store/progress";
import { masteryFromPercent, masteryColor } from "@/lib/types";
import type { Question } from "@/lib/types";
import Link from "next/link";

const DIAGNOSTIC_TOPICS = [
  "kinematics-basics", "suvat", "newton-laws", "friction", "momentum-impulse",
  "work-energy-power", "circular-motion", "gravitation-fields", "moments-equilibrium", "vectors",
];

function buildDiagnosticSet(): Question[] {
  const result: Question[] = [];
  for (const topicId of DIAGNOSTIC_TOPICS) {
    const curated = QUESTION_BANK.filter((q) => q.topicId === topicId);
    if (curated.length > 0) {
      result.push(curated[Math.floor(Math.random() * curated.length)]);
    } else {
      const gen = generateForTopic(topicId, "medium");
      if (gen) result.push(gen);
    }
  }
  return result;
}

type Stage = "intro" | "running" | "results";

export default function DiagnosticPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const setDiagnostic = useProgressStore((s) => s.setDiagnostic);
  const diagnostic = useProgressStore((s) => s.diagnostic);

  function start() {
    setQuestions(buildDiagnosticSet());
    setAnswers({});
    setCurrent(0);
    setStage("running");
  }

  const results = useMemo(() => {
    if (stage !== "results") return null;
    const byTopic: Record<string, number> = {};
    questions.forEach((q) => {
      const studentAnswer = answers[q.id] ?? "";
      const r = gradeAnswer(q, studentAnswer);
      byTopic[q.topicId] = r.correct ? 100 : 0;
    });
    return byTopic;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function finish() {
    if (results) setDiagnostic(results);
    setStage("results");
  }

  if (stage === "intro") {
    return (
      <main className="mx-auto flex max-w-xl flex-col gap-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">🧭 TEST MY MECHANICS LEVEL</h1>
        <p className="text-sm text-slate-600">
          A short diagnostic test covering {DIAGNOSTIC_TOPICS.length} major Mechanics topics. We&apos;ll use your
          results to build a personalised learning plan.
        </p>
        {diagnostic && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-left text-sm text-blue-900">
            You have a previous diagnostic result saved. Taking it again will replace it.
          </div>
        )}
        <button onClick={start} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">
          Start Diagnostic Test
        </button>
      </main>
    );
  }

  if (stage === "running") {
    const q = questions[current];
    if (!q) return null;
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-5">
        <p className="text-sm font-semibold text-slate-500">
          Question {current + 1} of {questions.length} — Topic: {TOPICS.find((t) => t.id === q.topicId)?.title}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {q.scenario && <div className="mb-3 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-700">📌 {q.scenario}</div>}
          <p className="text-base font-medium text-slate-900">{q.prompt}</p>
          {q.choices ? (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: c }))}
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${answers[q.id] === c ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              placeholder="Type your answer…"
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>
        <div className="flex justify-end">
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              Next →
            </button>
          ) : (
            <button onClick={finish} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
              See My Results
            </button>
          )}
        </div>
      </main>
    );
  }

  if (!results) return null;
  const sorted = Object.entries(results).sort((a, b) => a[1] - b[1]);
  const weakest = sorted.slice(0, 3);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Your Personalised Mechanics Report</h1>
      <div className="space-y-3">
        {sorted.map(([topicId, pct]) => {
          const topic = TOPICS.find((t) => t.id === topicId);
          const level = masteryFromPercent(pct);
          return (
            <div key={topicId} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{topic?.title ?? topicId}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${masteryColor(level)}`}>{pct}% · {level}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="font-bold text-amber-800">📌 Your Personalised Learning Plan</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-amber-900">
          {weakest.map(([topicId]) => (
            <li key={topicId}>
              Revise <Link href={`/learn/${topicId}`} className="font-semibold underline">{TOPICS.find((t) => t.id === topicId)?.title}</Link> from
              the beginning, then complete its practice questions.
            </li>
          ))}
          <li>Retake this diagnostic test after a week of focused revision to track your improvement.</li>
        </ol>
      </div>

      <button onClick={() => setStage("intro")} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
        Retake Diagnostic
      </button>
    </main>
  );
}
