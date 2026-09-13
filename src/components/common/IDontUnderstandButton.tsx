"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { getSimplified } from "@/lib/content/simplify";

export default function IDontUnderstandButton({ topicId }: { topicId: string }) {
  const [open, setOpen] = useState(false);
  const simplified = getSimplified(topicId);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-200"
      >
        <Lightbulb className="h-4 w-4" /> I DON&apos;T UNDERSTAND
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 animate-fade-in">
          <h4 className="text-sm font-bold text-rose-800">Let's try again, differently:</h4>
          {simplified ? (
            <div className="mt-2 space-y-3 text-sm text-rose-900">
              <p>
                <span className="font-semibold">🔗 Analogy: </span>
                {simplified.analogy}
              </p>
              <p>
                <span className="font-semibold">🌍 Everyday example: </span>
                {simplified.everyday}
              </p>
              <p>
                <span className="font-semibold">🔢 With easier numbers: </span>
                {simplified.easierNumbers}
              </p>
              <div>
                <span className="font-semibold">🪜 Smaller steps:</span>
                <ol className="mt-1 list-decimal space-y-1 pl-5">
                  {simplified.smallSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-rose-900">
              Try breaking the idea into a real-life example you already know, use smaller/round numbers, and work
              through it one small step at a time. Visit the AI Tutor for a personalised explanation.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
