"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import HintPanel from "./HintPanel";
import SolutionSteps from "./SolutionSteps";
import { gradeAnswer, diagnoseMistake } from "@/lib/utils/grading";
import { useProgressStore } from "@/lib/store/progress";
import { CheckCircle2, XCircle, Eye, RefreshCcw } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-slate-100 text-slate-700",
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-orange-100 text-orange-700",
  exam: "bg-rose-100 text-rose-700",
  challenge: "bg-purple-100 text-purple-700",
};

export default function QuestionCard({
  question,
  index,
  onNext,
  trackProgress = true,
}: {
  question: Question;
  index?: number;
  onNext?: () => void;
  trackProgress?: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const addMistake = useProgressStore((s) => s.addMistake);

  function handleCheck() {
    const studentAnswer = question.choices && selectedChoice !== null ? question.choices[selectedChoice] : answer;
    if (!studentAnswer.trim() && selectedChoice === null) return;
    const result = gradeAnswer(question, studentAnswer);
    setIsCorrect(result.correct);
    setChecked(true);
    if (trackProgress) recordAttempt(question.topicId, result.correct);
    if (!result.correct) {
      const diag = diagnoseMistake(question, studentAnswer);
      if (trackProgress) {
        addMistake({
          questionId: question.id,
          topicId: question.topicId,
          prompt: question.prompt,
          studentAnswer,
          correctAnswer: question.correctAnswer,
          mistakeType: diag.type,
          explanation: diag.explanation,
        });
      }
    }
  }

  function reset() {
    setAnswer("");
    setSelectedChoice(null);
    setChecked(false);
    setIsCorrect(false);
    setShowSolution(false);
  }

  const studentAnswerForDiag = question.choices && selectedChoice !== null ? question.choices[selectedChoice] : answer;
  const diagnosis = checked && !isCorrect ? diagnoseMistake(question, studentAnswerForDiag) : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {typeof index === "number" && <span className="font-bold text-slate-400">Q{index + 1}</span>}
        <span className={`rounded-full px-2 py-0.5 font-bold uppercase ${DIFFICULTY_COLORS[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold uppercase text-blue-700">{question.type}</span>
        <span className="text-slate-400">{question.subtopic}</span>
      </div>

      {question.scenario && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-700">📌 {question.scenario}</div>
      )}

      <p className="mt-3 text-base font-medium text-slate-900">{question.prompt}</p>

      {question.choices ? (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.choices.map((c, i) => (
            <button
              key={i}
              disabled={checked}
              onClick={() => setSelectedChoice(i)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                selectedChoice === i ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
              } ${checked && i === question.correctIndex ? "!border-emerald-500 !bg-emerald-50" : ""} ${
                checked && selectedChoice === i && i !== question.correctIndex ? "!border-rose-500 !bg-rose-50" : ""
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={checked}
            placeholder="Type your answer (include units where relevant)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      )}

      {!checked && <HintPanel hints={question.hints} />}

      <div className="mt-4 flex flex-wrap gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Check Answer
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowSolution((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-900"
            >
              <Eye className="h-4 w-4" /> {showSolution ? "Hide" : "Show"} Full Solution
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" /> Try Again
            </button>
            {onNext && (
              <button
                onClick={() => {
                  reset();
                  onNext();
                }}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600"
              >
                Next Question →
              </button>
            )}
          </>
        )}
      </div>

      {checked && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
            isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-800"
          }`}
        >
          {isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          <div>
            <p className="font-bold">{isCorrect ? "Correct! Well done." : "Not quite right."}</p>
            {!isCorrect && (
              <>
                <p className="mt-1">
                  Correct answer: <span className="font-semibold">{question.correctAnswer}</span>
                </p>
                {diagnosis && (
                  <div className="mt-2 rounded-lg bg-white/70 p-2">
                    <p className="font-bold uppercase text-xs tracking-wide text-rose-600">
                      Here's where you went wrong ({diagnosis.type.replace(/-/g, " ")}):
                    </p>
                    <p className="mt-1">{diagnosis.explanation}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {checked && showSolution && (
        <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
          <SolutionSteps solution={question.solution} />
          {question.commonMistakes.length > 0 && (
            <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm">
              <p className="font-bold text-orange-800">⚠️ Common Mistakes to Avoid</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-orange-900">
                {question.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
