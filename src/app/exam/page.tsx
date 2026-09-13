"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildQuestionSet } from "@/lib/questions";
import { gradeAnswer, diagnoseMistake } from "@/lib/utils/grading";
import { useProgressStore } from "@/lib/store/progress";
import { TOPICS } from "@/lib/content/areas";
import SolutionSteps from "@/components/questions/SolutionSteps";
import { masteryFromPercent, masteryColor } from "@/lib/types";
import type { Question } from "@/lib/types";
import { Clock, Flag } from "lucide-react";

type Stage = "setup" | "running" | "results";

const COUNT_OPTIONS = [10, 20, 30, 50];
const TIME_OPTIONS = [15, 30, 60, 90];

export default function ExamModePage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveExamResult = useProgressStore((s) => s.saveExamResult);
  const addMistake = useProgressStore((s) => s.addMistake);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);

  function start() {
    const set = buildQuestionSet(count);
    setQuestions(set);
    setAnswers({});
    setCurrent(0);
    setSecondsLeft(minutes * 60);
    setStage("running");
  }

  useEffect(() => {
    if (stage !== "running") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          finishExam();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const grading = useMemo(() => {
    if (stage !== "results") return null;
    let score = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    const detail = questions.map((q) => {
      const studentAnswer = answers[q.id] ?? "";
      const result = gradeAnswer(q, studentAnswer);
      if (result.correct) score++;
      const t = topicBreakdown[q.topicId] ?? { correct: 0, total: 0 };
      t.total++;
      if (result.correct) t.correct++;
      topicBreakdown[q.topicId] = t;
      return { question: q, studentAnswer, correct: result.correct };
    });
    return { score, topicBreakdown, detail };
  }, [stage, questions, answers]);

  function finishExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage("results");
  }

  // Persist results once grading is computed
  const savedRef = useRef(false);
  useEffect(() => {
    if (stage === "results" && grading && !savedRef.current) {
      savedRef.current = true;
      saveExamResult({
        score: grading.score,
        total: questions.length,
        percentage: Math.round((grading.score / questions.length) * 100),
        durationMin: minutes,
        topicBreakdown: grading.topicBreakdown,
      });
      grading.detail.forEach((d) => {
        recordAttempt(d.question.topicId, d.correct, d.correct ? 15 : 3);
        if (!d.correct) {
          const diag = diagnoseMistake(d.question, d.studentAnswer);
          addMistake({
            questionId: d.question.id,
            topicId: d.question.topicId,
            prompt: d.question.prompt,
            studentAnswer: d.studentAnswer || "(no answer given)",
            correctAnswer: d.question.correctAnswer,
            mistakeType: diag.type,
            explanation: diag.explanation,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, grading]);

  useEffect(() => {
    if (stage === "setup") savedRef.current = false;
  }, [stage]);

  if (stage === "setup") {
    return (
      <main className="mx-auto flex max-w-xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📝 SENIOR 6 MECHANICS EXAM MODE</h1>
          <p className="mt-1 text-sm text-slate-600">Simulate real exam conditions: mixed topics, a strict timer, and a full performance report.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-bold text-slate-700">Number of questions</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`rounded-lg border px-4 py-2 text-sm font-bold ${count === n ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-700"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="mt-5 block text-sm font-bold text-slate-700">Time limit</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIME_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`rounded-lg border px-4 py-2 text-sm font-bold ${minutes === m ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-700"}`}
              >
                {m} min
              </button>
            ))}
          </div>
          <button onClick={start} className="mt-6 w-full rounded-lg bg-amber-500 py-3 text-sm font-extrabold text-white hover:bg-amber-600">
            🚀 Start Exam
          </button>
        </div>
      </main>
    );
  }

  if (stage === "running") {
    const q = questions[current];
    const mm = Math.floor(secondsLeft / 60);
    const ss = secondsLeft % 60;
    return (
      <main className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Clock className="h-4 w-4 text-blue-600" /> {mm}:{ss.toString().padStart(2, "0")}
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Question {current + 1} of {questions.length}
          </p>
          <button onClick={finishExam} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700">
            <Flag className="h-3.5 w-3.5" /> Submit Exam
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setCurrent(i)}
              className={`h-8 w-8 rounded-md text-xs font-bold ${
                i === current ? "bg-blue-600 text-white" : answers[qq.id] ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

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

        <div className="flex justify-between">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-40"
          >
            ← Previous
          </button>
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              Next →
            </button>
          ) : (
            <button onClick={finishExam} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
              Finish &amp; Submit
            </button>
          )}
        </div>
      </main>
    );
  }

  // Results
  if (!grading) return null;
  const pct = Math.round((grading.score / questions.length) * 100);
  const level = masteryFromPercent(pct);

  return (
    <main className="flex flex-col gap-6">
      <div className={`rounded-2xl border-2 p-6 text-center ${masteryColor(level)}`}>
        <p className="text-xs font-bold uppercase tracking-wide">Exam Complete</p>
        <p className="mt-1 text-4xl font-extrabold">{pct}%</p>
        <p className="mt-1 text-sm font-semibold">
          {grading.score} / {questions.length} correct — {level}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Topic Performance</h2>
        <div className="mt-3 space-y-2">
          {Object.entries(grading.topicBreakdown).map(([topicId, stats]) => {
            const p = Math.round((stats.correct / stats.total) * 100);
            const topic = TOPICS.find((t) => t.id === topicId);
            return (
              <div key={topicId}>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>{topic?.title ?? topicId}</span>
                  <span>{stats.correct}/{stats.total} ({p}%)</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <span className="font-bold">Revision recommendation: </span>
          Focus first on{" "}
          {Object.entries(grading.topicBreakdown)
            .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
            .slice(0, 2)
            .map(([id]) => TOPICS.find((t) => t.id === id)?.title ?? id)
            .join(" and ")}
          , where your accuracy was lowest.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Detailed Review</h2>
        {grading.detail.map((d, i) => (
          <div key={d.question.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-400">Q{i + 1}</span>
              <span className={`rounded-full px-2 py-0.5 font-bold ${d.correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {d.correct ? "Correct" : "Incorrect"}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-900">{d.question.prompt}</p>
            <p className="mt-1 text-xs text-slate-600">
              Your answer: <span className="font-semibold">{d.studentAnswer || "(no answer)"}</span>
            </p>
            <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
              <SolutionSteps solution={d.question.solution} />
            </div>
          </div>
        ))}
      </section>

      <button onClick={() => setStage("setup")} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
        Start Another Exam
      </button>
    </main>
  );
}
