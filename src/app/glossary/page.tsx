"use client";

import { useMemo, useState } from "react";
import { searchGlossary } from "@/lib/content/glossary";
import { Search } from "lucide-react";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchGlossary(query), [query]);

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🔎 Physics Glossary</h1>
        <p className="mt-1 text-sm text-slate-600">Searchable definitions for every key Mechanics term.</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <p className="text-xs text-slate-500">{results.length} term(s) found</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((g) => (
          <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">{g.term}</h3>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-semibold text-blue-700">Simple: </span>
              {g.simple}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-500">Formal: </span>
              {g.formal}
            </p>
            {g.formula && (
              <p className="mt-1 font-mono text-sm font-bold text-amber-700">{g.formula}</p>
            )}
            {g.unit && <p className="text-xs text-slate-500">SI unit: {g.unit}</p>}
            <p className="mt-1 text-xs italic text-slate-500">e.g. {g.example}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
