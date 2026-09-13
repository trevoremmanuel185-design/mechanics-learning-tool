"use client";

import { useMemo, useState } from "react";
import { searchFormulas } from "@/lib/content/formulas";
import { AREAS, TOPICS } from "@/lib/content/areas";
import WhyButton from "@/components/common/WhyButton";
import { Search } from "lucide-react";

export default function FormulaBankPage() {
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const results = useMemo(() => {
    let list = searchFormulas(query);
    if (topicFilter !== "all") list = list.filter((f) => f.topicId === topicFilter);
    return list;
  }, [query, topicFilter]);

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📚 Formula Bank</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every formula, explained: what it means, when to use it — and when NOT to.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas by name, symbol, or keyword…"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All topics</option>
          {TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-500">{results.length} formula(s) found</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {results.map((f) => {
          const topic = TOPICS.find((t) => t.id === f.topicId);
          const area = AREAS.find((a) => a.id === topic?.areaId);
          return (
            <div key={f.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">{area?.title}</p>
                  <h3 className="text-sm font-bold text-slate-800">{f.name}</h3>
                </div>
              </div>
              <p className="mt-2 rounded-lg bg-slate-900 px-3 py-2 font-mono text-lg font-bold text-amber-300">{f.expression}</p>

              <div className="mt-3">
                <p className="text-xs font-bold uppercase text-slate-500">Variables</p>
                <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
                  {f.variables.map((v) => (
                    <li key={v.symbol}>
                      <span className="font-mono font-bold">{v.symbol}</span> — {v.meaning}{" "}
                      <span className="text-slate-400">({v.unit})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <InfoBox label="✅ When to use" text={f.whenToUse} tone="emerald" />
                <InfoBox label="🚫 When NOT to use" text={f.whenNotToUse} tone="rose" />
              </div>

              {f.rearrangements.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold uppercase text-slate-500">Common rearrangements</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {f.rearrangements.map((r) => (
                      <code key={r} className="rounded bg-slate-100 px-2 py-1 text-xs">
                        {r}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>
                  <span className="font-bold">Example: </span>
                  {f.example}
                </span>
                <WhyButton explanation={f.commonMistake} />
              </div>
              {topic && (
                <a href={`/learn/${topic.id}`} className="mt-3 inline-block text-xs font-semibold text-blue-700 hover:underline">
                  Learn more in: {topic.title} →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function InfoBox({ label, text, tone }: { label: string; text: string; tone: "emerald" | "rose" }) {
  const cls = tone === "emerald" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800";
  return (
    <div className={`rounded-lg p-2 text-xs ${cls}`}>
      <p className="font-bold">{label}</p>
      <p className="mt-0.5">{text}</p>
    </div>
  );
}
