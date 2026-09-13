"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getTopicById } from "@/lib/content/areas";
import { getPracticeSet } from "@/lib/questions";
import QuestionCard from "@/components/questions/QuestionCard";
import type { Difficulty } from "@/lib/types";
import { ArrowLeft, RefreshCcw } from "lucide-react";

const DIFFICULTIES: (Difficulty | "all")[] = ["all", "beginner", "easy", "medium", "hard", "exam", "challenge"];

export default function TopicPracticePage() {
  const params = useParams<{ topicId: string }>();
  const router = useRouter();
  const topic = getTopicById(params.topicId);
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [seed, setSeed] = useState(0);

  const questions = useMemo(() => {
    const set = getPracticeSet(params.topicId, { extra: 8 });
    return difficulty === "all" ? set : set.filter((q) => q.difficulty === difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.topicId, difficulty, seed]);

  if (!topic) {
    return (
      <main className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p>Topic not found.</p>
        <Link href="/practice" className="text-blue-700 underline">Back to practice</Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6">
      <button onClick={() => router.push("/practice")} className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Practice
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{topic.title}</h1>
          <p className="text-sm text-slate-600">{topic.blurb}</p>
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          <RefreshCcw className="h-4 w-4" /> New Question Set
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase ${
              difficulty === d ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No questions at this difficulty for this topic yet — try &quot;all&quot; or another level.
          </p>
        )}
      </div>
    </main>
  );
}
