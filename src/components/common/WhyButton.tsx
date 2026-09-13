"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function WhyButton({ explanation }: { explanation: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100"
        aria-expanded={open}
      >
        <HelpCircle className="h-3.5 w-3.5" /> WHY?
      </button>
      {open && (
        <div className="mt-2 max-w-md rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 animate-fade-in">
          {explanation}
        </div>
      )}
    </div>
  );
}
