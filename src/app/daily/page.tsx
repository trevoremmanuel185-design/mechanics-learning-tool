"use client";

import { useEffect, useMemo, useState } from "react";
import { QUESTION_BANK } from "@/lib/questions/bank";
import { generateQuestion } from "@/lib/questions/generators";
import { gradeAnswer, diagnoseMistake } from "@/lib/utils/grading";
import { useProgressStore } from "@/lib/store/progress";
import SolutionSteps from "@/components/questions/SolutionSteps";
import type { Difficulty, Question } from "@/lib/types";
import { CheckCircle2, XCircle, CalendarDays } from "lucide-react";

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % 100000;
  }
  return hash;
}

function pickDeterministic<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function buildDailySet(dateStr: string): Question[] {
  const seed = hashDate(dateStr);
  const easy = QUESTION_BANK.filter((q) => q.difficulty === "easy" || q.difficulty === "beginner");
  const medium = QUESTION_BANK.filter((q) => q.difficulty === "medium");
  const hard = QUESTION_BANK.filter((q) => q.difficulty === "hard");
  const scenario = QUESTION_BANK.filter((q) => q.scenario);
  const challengeSources: Difficulty[] = ["exam", "challenge"];
  const challenge = QUESTION_BANK.filter((q) => challengeSources.includes(q.difficulty));

  return [
    pickDeterministic(easy, seed),
    pickDeterministic(medium, seed + 7),
    pickDeterministic(hard, seed + 13),
    pickDeterministic(scenario, seed + 19),
    challenge.length > 0 ? pickDeterministic(challenge, seed + 29) : generateQuestion("moments", "hard"),
  ].filter(Boolean);
}

export default function DailyChallengePage() {
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const daily = useProgressStore((s) => s.daily);
  const ensureDaily = useProgressStore((s) => s.ensureDaily);
  const completeDailyQuestion = useProgressStore((s) => s.completeDailyQuestion);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const addMistake = useProgressStore((s) => s.addMistake);

  const todayStr = new Date().toISOString().slice(0, 10);
  const questions = useMemo(() => buildDailySet(todayStr), [todayStr]);

  useEffect(() => {
    setMounted(true);
    ensureDaily(questions.map((q) => q.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  const labels = ["Easy", "Medium", "Difficult", "Scenario", "Challenge"];

  function check(q: Question) {
    const ans = answers[q.id] ?? "";
    const result = gradeAnswer(q, ans);
    setCheckedIds((prev) => new Set(prev).add(q.id));
    completeDailyQuestion(q.id, result.correct);
    recordAttempt(q.topicId, result.correct, result.correct ? 20 : 5);
    if (!result.correct) {
      const diag = diagnoseMistake(q, ans);
      addMistake({
        questionId: q.id,
        topicId: q.topicId,
        prompt: q.prompt,
        studentAnswer: ans,
        correctAnswer: q.correctAnswer,
        mistakeType: diag.type,
        explanation: diag.explanation,
      });
    }
  }

  const completed = daily?.completedIds.length ?? 0;
  const correct = daily?.correctIds.length ?? 0;

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <CalendarDays className="h-6 w-6 text-blue-600" /> Daily Challenge
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          A fresh set of 5 questions every day — one easy, one medium, one difficult, one scenario, one challenge.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
        Today&apos;s score: {correct} / {completed} completed ({questions.length} total questions)
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => {
          const checked = checkedIds.has(q.id);
          const result = checked ? gradeAnswer(q, answers[q.id] ?? "") : null;
          return (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-600">
                {labels[i]} Question
              </span>
              {q.scenario && <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-700">📌 {q.scenario}</div>}
              <p className="mt-2 text-base font-medium text-slate-900">{q.prompt}</p>
              {q.choices ? (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.choices.map((c) => (
                    <button
                      key={c}
                      disabled={checked}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: c }))}
                      className={`rounded-lg border px-3 py-2 text-left text-sm ${
                        answers[q.id] === c ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  disabled={checked}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Type your answer…"
                  className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              )}
              {!checked ? (
                <button onClick={() => check(q)} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                  Check Answer
                </button>
              ) : (
                <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${result?.correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                  {result?.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />}
                  <div>
                    <p className="font-bold">{result?.correct ? "Correct!" : `Correct answer: ${q.correctAnswer}`}</p>
                  </div>
                </div>
              )}
              {checked && (
                <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
                  <SolutionSteps solution={q.solution} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
