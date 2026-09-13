"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const FORCE_OPTIONS = ["Weight", "Normal Reaction", "Tension", "Friction", "Applied Force", "Air Resistance / Drag", "Upthrust"];

interface Scenario {
  id: string;
  description: string;
  expected: string[];
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "book-table",
    description: "A book rests on a horizontal table. Nothing is pushing it sideways.",
    expected: ["Weight", "Normal Reaction"],
    explanation: "With no sideways push, there is no tendency to slide, so friction is zero here. Only weight (down) and the table's normal reaction (up) act — and they must be equal since the book is in equilibrium.",
  },
  {
    id: "hanging-mass",
    description: "A mass hangs at rest from a single vertical string attached to the ceiling.",
    expected: ["Weight", "Tension"],
    explanation: "Only two forces act: gravity pulling down (weight) and the string pulling up (tension). For equilibrium, tension must equal weight.",
  },
  {
    id: "dragged-box",
    description: "A box is pulled at constant velocity by a horizontal rope across a rough floor.",
    expected: ["Weight", "Normal Reaction", "Tension", "Friction"],
    explanation: "Vertically: weight down, normal reaction up (balanced). Horizontally: tension pulls it forward, friction opposes the sliding motion — at constant velocity these two also balance.",
  },
  {
    id: "falling-ball",
    description: "A ball falls freely through the air. Assume air resistance is negligible.",
    expected: ["Weight"],
    explanation: "With air resistance ignored, the only force acting is gravity (weight) — this is why all objects in free fall (ignoring air resistance) accelerate at the same rate, g.",
  },
  {
    id: "incline-friction",
    description: "A box sits stationary on a rough inclined plane, held in place only by friction (no rope or other support).",
    expected: ["Weight", "Normal Reaction", "Friction"],
    explanation: "Weight acts straight down. The incline pushes back perpendicular to its surface (normal reaction). Friction acts up the slope, preventing sliding — it exactly balances the component of weight along the slope.",
  },
  {
    id: "accelerating-car",
    description: "A car accelerates forward along a flat road; air resistance and rolling friction are both present.",
    expected: ["Weight", "Normal Reaction", "Applied Force", "Air Resistance / Drag", "Friction"],
    explanation: "Weight and normal reaction balance vertically. The engine provides a forward applied (driving) force through the wheels, while air resistance and friction/rolling resistance oppose the motion — the resultant of these horizontal forces causes the car's acceleration.",
  },
];

export default function FBDBuilder() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  const scenario = SCENARIOS[scenarioIndex];

  function toggle(force: string) {
    if (checked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(force)) next.delete(force);
      else next.add(force);
      return next;
    });
  }

  function checkAnswer() {
    setChecked(true);
  }

  function nextScenario() {
    setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
    setSelected(new Set());
    setChecked(false);
  }

  const missing = scenario.expected.filter((f) => !selected.has(f));
  const extra = Array.from(selected).filter((f) => !scenario.expected.includes(f));
  const isCorrect = missing.length === 0 && extra.length === 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase text-slate-400">Scenario {scenarioIndex + 1} of {SCENARIOS.length}</p>
        <p className="mt-2 text-base font-medium text-slate-900">{scenario.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {FORCE_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => toggle(f)}
              disabled={checked}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                selected.has(f) ? "border-blue-500 bg-blue-100 text-blue-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
              } ${
                checked && scenario.expected.includes(f) ? "!border-emerald-500 !bg-emerald-100 !text-emerald-800" : ""
              } ${checked && selected.has(f) && !scenario.expected.includes(f) ? "!border-rose-500 !bg-rose-100 !text-rose-800" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          {!checked ? (
            <button onClick={checkAnswer} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              Check My Free Body Diagram
            </button>
          ) : (
            <button onClick={nextScenario} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
              Next Scenario →
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {!checked ? (
          <p className="text-sm text-slate-500">Select every force you think acts on the object, then check your diagram.</p>
        ) : (
          <div className={`rounded-xl p-4 ${isCorrect ? "bg-emerald-50" : "bg-rose-50"}`}>
            <div className="flex items-center gap-2">
              {isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}
              <p className={`font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                {isCorrect ? "Correct diagram!" : "Not quite — here's why:"}
              </p>
            </div>
            {missing.length > 0 && (
              <p className="mt-2 text-sm text-rose-800">
                <span className="font-bold">Missing forces: </span>
                {missing.join(", ")}
              </p>
            )}
            {extra.length > 0 && (
              <p className="mt-1 text-sm text-rose-800">
                <span className="font-bold">Forces that shouldn't be here: </span>
                {extra.join(", ")}
              </p>
            )}
            <p className="mt-3 text-sm text-slate-700">{scenario.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
