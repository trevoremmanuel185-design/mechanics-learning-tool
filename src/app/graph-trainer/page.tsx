"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RefreshCcw } from "lucide-react";

interface Segment {
  t0: number;
  t1: number;
  v0: number;
  v1: number;
}

interface GraphQuestion {
  segments: Segment[];
  prompt: string;
  answer: number;
  unit: string;
  explanation: string;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildGraph(): GraphQuestion {
  const segments: Segment[] = [];
  let t = 0;
  let v = rand(0, 10);
  const numSegments = 3;
  for (let i = 0; i < numSegments; i++) {
    const duration = rand(3, 8);
    const nextV = rand(0, 30);
    segments.push({ t0: t, t1: t + duration, v0: v, v1: nextV });
    t += duration;
    v = nextV;
  }

  const questionType = pick(["gradient", "area-segment", "area-total", "velocity-at"]);

  if (questionType === "gradient") {
    const segIndex = rand(0, segments.length - 1);
    const seg = segments[segIndex];
    const gradient = (seg.v1 - seg.v0) / (seg.t1 - seg.t0);
    return {
      segments,
      prompt: `Find the acceleration between t = ${seg.t0}s and t = ${seg.t1}s (Segment ${segIndex + 1}).`,
      answer: +gradient.toFixed(2),
      unit: "m/s²",
      explanation: `Gradient = Δv/Δt = (${seg.v1} − ${seg.v0}) / (${seg.t1} − ${seg.t0}) = ${gradient.toFixed(2)} m/s². A ${gradient >= 0 ? "positive" : "negative"} gradient means the object is ${gradient >= 0 ? "speeding up" : "slowing down"} during this segment.`,
    };
  }

  if (questionType === "area-segment") {
    const segIndex = rand(0, segments.length - 1);
    const seg = segments[segIndex];
    const duration = seg.t1 - seg.t0;
    const area = ((seg.v0 + seg.v1) / 2) * duration;
    return {
      segments,
      prompt: `Find the distance travelled during Segment ${segIndex + 1} (between t = ${seg.t0}s and t = ${seg.t1}s).`,
      answer: +area.toFixed(1),
      unit: "m",
      explanation: `Distance = area under the graph for this segment = average velocity × time = ((${seg.v0} + ${seg.v1})/2) × ${duration} = ${area.toFixed(1)} m.`,
    };
  }

  if (questionType === "area-total") {
    const total = segments.reduce((sum, seg) => sum + ((seg.v0 + seg.v1) / 2) * (seg.t1 - seg.t0), 0);
    return {
      segments,
      prompt: `Find the TOTAL distance travelled over the whole graph (t = 0s to t = ${segments[segments.length - 1].t1}s).`,
      answer: +total.toFixed(1),
      unit: "m",
      explanation: `Add up the area of every segment (each a trapezium): total distance = ${total.toFixed(1)} m.`,
    };
  }

  // velocity-at
  const segIndex = rand(0, segments.length - 1);
  const seg = segments[segIndex];
  const tMid = seg.t0 + (seg.t1 - seg.t0) / 2;
  const gradient = (seg.v1 - seg.v0) / (seg.t1 - seg.t0);
  const vAtMid = seg.v0 + gradient * (tMid - seg.t0);
  return {
    segments,
    prompt: `Find the velocity at t = ${tMid}s (within Segment ${segIndex + 1}).`,
    answer: +vAtMid.toFixed(1),
    unit: "m/s",
    explanation: `Using linear interpolation: v = v₀ + gradient×(t − t₀) = ${seg.v0} + (${gradient.toFixed(2)})×(${tMid} − ${seg.t0}) = ${vAtMid.toFixed(1)} m/s.`,
  };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function GraphTrainerPage() {
  const [graphQ, setGraphQ] = useState<GraphQuestion>(() => buildGraph());
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  const maxT = graphQ.segments[graphQ.segments.length - 1].t1;
  const maxV = Math.max(...graphQ.segments.flatMap((s) => [s.v0, s.v1]), 1);
  const W = 520;
  const H = 260;
  const PAD = 36;
  const sx = (t: number) => PAD + (t / maxT) * (W - 2 * PAD);
  const sy = (v: number) => H - PAD - (v / (maxV * 1.15)) * (H - 2 * PAD);

  const points = graphQ.segments.flatMap((s) => [`${sx(s.t0)},${sy(s.v0)}`, `${sx(s.t1)},${sy(s.v1)}`]).join(" ");

  const isCorrect = useMemo(() => {
    const n = parseFloat(answer);
    return Number.isFinite(n) && Math.abs(n - graphQ.answer) <= Math.max(0.3, Math.abs(graphQ.answer) * 0.05);
  }, [answer, graphQ]);

  function newGraph() {
    setGraphQ(buildGraph());
    setAnswer("");
    setChecked(false);
  }

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📈 Graph Trainer</h1>
        <p className="mt-1 text-sm text-slate-600">
          Randomly generated velocity-time graphs — practise reading gradients (acceleration) and areas (distance).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-slate-50">
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#334155" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#334155" />
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#475569">Time (s)</text>
            <text x={12} y={H / 2} fontSize="11" fill="#475569" transform={`rotate(-90 12 ${H / 2})`}>Velocity (m/s)</text>
            <polyline points={points} fill="none" stroke="#1d4ed8" strokeWidth={2.5} />
            {graphQ.segments.map((s, i) => (
              <circle key={i} cx={sx(s.t0)} cy={sy(s.v0)} r={3} fill="#1d4ed8" />
            ))}
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-medium text-slate-900">{graphQ.prompt}</p>
            <input
              type="text"
              value={answer}
              disabled={checked}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={`Answer in ${graphQ.unit}`}
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-3 flex gap-2">
              {!checked ? (
                <button onClick={() => setChecked(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                  Check Answer
                </button>
              ) : (
                <button onClick={newGraph} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
                  <RefreshCcw className="h-4 w-4" /> New Graph
                </button>
              )}
            </div>
            {checked && (
              <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />}
                <div>
                  <p className="font-bold">{isCorrect ? "Correct!" : `Correct answer: ${graphQ.answer} ${graphQ.unit}`}</p>
                  <p className="mt-1">{graphQ.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
