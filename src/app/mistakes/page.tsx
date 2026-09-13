"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/store/progress";
import { TOPICS } from "@/lib/content/areas";
import { CheckCircle2, XCircle } from "lucide-react";

export default function MistakesPage() {
  const [mounted, setMounted] = useState(false);
  const mistakes = useProgressStore((s) => s.mistakes);
  const resolveMistake = useProgressStore((s) => s.resolveMistake);
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const filtered = mistakes.filter((m) => (filter === "all" ? true : filter === "resolved" ? m.resolved : !m.resolved));

  const byType: Record<string, number> = {};
  mistakes.forEach((m) => {
    byType[m.mistakeType] = (byType[m.mistakeType] ?? 0) + 1;
  });

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🔍 Mistake Analyser</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every wrong answer is automatically diagnosed. Review these regularly to stop repeating the same mistakes.
        </p>
      </div>

      {mistakes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(byType).map(([type, count]) => (
            <span key={type} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {type.replace(/-/g, " ")}: {count}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {(["unresolved", "resolved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${
              filter === f ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No {filter !== "all" ? filter : ""} mistakes logged. Keep practising to build this list — and then clear it!
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const topic = TOPICS.find((t) => t.id === m.topicId);
            return (
              <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    {m.resolved ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
                    <span className="font-bold uppercase text-rose-600">{m.mistakeType.replace(/-/g, " ")}</span>
                    <span className="text-slate-400">{topic?.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(m.timestamp).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{m.prompt}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Your answer: <span className="font-semibold text-rose-700">{m.studentAnswer}</span> — Correct:{" "}
                  <span className="font-semibold text-emerald-700">{m.correctAnswer}</span>
                </p>
                <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">{m.explanation}</p>
                <div className="mt-2 flex gap-2">
                  {!m.resolved && (
                    <button onClick={() => resolveMistake(m.id)} className="text-xs font-bold text-emerald-700 hover:underline">
                      Mark as fixed
                    </button>
                  )}
                  <Link href={`/practice/${m.topicId}`} className="text-xs font-bold text-blue-700 hover:underline">
                    Practise similar questions →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
