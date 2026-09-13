"use client";

import { useState } from "react";
import type { Hint } from "@/lib/types";
import { Lightbulb } from "lucide-react";

export default function HintPanel({ hints }: { hints: Hint }) {
  const [level, setLevel] = useState(0);

  const items = [hints.hint1, hints.hint2, hints.hint3];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 text-sm font-bold text-amber-800">
          <Lightbulb className="h-4 w-4" /> Need a hint?
        </h4>
        {level < 3 && (
          <button
            onClick={() => setLevel((l) => l + 1)}
            className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"
          >
            Show Hint {level + 1}
          </button>
        )}
      </div>
      {level > 0 && (
        <ol className="mt-3 space-y-2 text-sm text-amber-900">
          {items.slice(0, level).map((h, i) => (
            <li key={i} className="animate-fade-in rounded-lg bg-white/70 p-2">
              <span className="font-bold">Hint {i + 1}: </span>
              {h}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
