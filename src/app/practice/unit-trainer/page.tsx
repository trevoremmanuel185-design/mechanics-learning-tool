"use client";

import { useState } from "react";
import Link from "next/link";
import { generateQuestion } from "@/lib/questions/generators";
import QuestionCard from "@/components/questions/QuestionCard";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export default function UnitTrainerPage() {
  const [question, setQuestion] = useState(() => generateQuestion("units"));
  const [key, setKey] = useState(0);

  function next() {
    setQuestion(generateQuestion("units"));
    setKey((k) => k + 1);
  }

  return (
    <main className="flex flex-col gap-6">
      <Link href="/practice" className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Practice
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📏 Unit Conversion Trainer</h1>
        <p className="mt-1 text-sm text-slate-600">
          Practice converting between km/h, m/s, g, kg, cm, m, minutes and seconds — unlimited questions.
        </p>
      </div>
      <button onClick={next} className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
        <RefreshCcw className="h-4 w-4" /> New Question
      </button>
      <QuestionCard key={key} question={question} trackProgress={false} onNext={next} />
    </main>
  );
}
