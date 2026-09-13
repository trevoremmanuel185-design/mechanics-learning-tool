"use client";

import { useMemo, useRef, useState } from "react";

const BEAM_LENGTH_M = 4; // metres, pivot at centre
const SVG_W = 560;
const SVG_H = 220;
const PIVOT_X = SVG_W / 2;
const PIVOT_Y = 150;
const PX_PER_M = 110;

interface MassItem {
  id: number;
  weight: number; // N
  position: number; // metres from pivot, negative = left
}

export default function BeamBalanceSimulator() {
  const [masses, setMasses] = useState<MassItem[]>([
    { id: 1, weight: 20, position: -1.5 },
    { id: 2, weight: 15, position: 1.5 },
  ]);
  const nextId = useRef(3);

  const netMoment = useMemo(
    () => masses.reduce((sum, m) => sum + m.weight * m.position, 0),
    [masses]
  );
  const balanced = Math.abs(netMoment) < 1;
  const tiltDeg = Math.max(-15, Math.min(15, netMoment * 0.6));

  function updateMass(id: number, field: "weight" | "position", value: number) {
    setMasses((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function addMass() {
    setMasses((prev) => [...prev, { id: nextId.current++, weight: 10, position: 0 }]);
  }

  function removeMass(id: number) {
    setMasses((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-lg bg-slate-50">
          <polygon points={`${PIVOT_X - 18},${PIVOT_Y + 40} ${PIVOT_X + 18},${PIVOT_Y + 40} ${PIVOT_X},${PIVOT_Y + 10}`} fill="#475569" />
          <g transform={`rotate(${tiltDeg} ${PIVOT_X} ${PIVOT_Y})`}>
            <rect x={PIVOT_X - BEAM_LENGTH_M * PX_PER_M} y={PIVOT_Y - 6} width={BEAM_LENGTH_M * 2 * PX_PER_M} height={12} rx={4} fill="#1d4ed8" />
            {masses.map((m) => {
              const x = PIVOT_X + m.position * PX_PER_M;
              const size = 10 + m.weight * 0.8;
              return (
                <g key={m.id}>
                  <line x1={x} y1={PIVOT_Y} x2={x} y2={PIVOT_Y + size} stroke="#334155" />
                  <circle cx={x} cy={PIVOT_Y + size} r={size / 2} fill="#f59e0b" />
                  <text x={x} y={PIVOT_Y + size + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">
                    {m.weight}N
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        <p className={`mt-3 rounded-lg p-2 text-center text-sm font-bold ${balanced ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {balanced ? "✓ BALANCED — clockwise moments equal anticlockwise moments" : `NOT balanced — net moment = ${netMoment.toFixed(1)} N·m (${netMoment > 0 ? "tips right/clockwise" : "tips left/anticlockwise"})`}
        </p>
      </div>

      <div className="space-y-3">
        {masses.map((m) => (
          <div key={m.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-700">Mass (weight in N)</h4>
              <button onClick={() => removeMass(m.id)} className="text-xs font-bold text-rose-600 hover:underline">
                Remove
              </button>
            </div>
            <label className="mt-1 block text-xs text-slate-600">Weight: {m.weight} N</label>
            <input type="range" min={5} max={50} value={m.weight} onChange={(e) => updateMass(m.id, "weight", +e.target.value)} className="w-full" />
            <label className="mt-1 block text-xs text-slate-600">
              Position: {m.position.toFixed(1)} m {m.position < 0 ? "(left of pivot)" : m.position > 0 ? "(right of pivot)" : "(at pivot)"}
            </label>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={m.position}
              onChange={(e) => updateMass(m.id, "position", +e.target.value)}
              className="w-full"
            />
            <p className="mt-1 text-xs text-slate-500">
              Moment = {m.weight} × {Math.abs(m.position).toFixed(1)} = {(m.weight * Math.abs(m.position)).toFixed(1)} N·m (
              {m.position < 0 ? "anticlockwise" : m.position > 0 ? "clockwise" : "none"})
            </p>
          </div>
        ))}
        <button onClick={addMass} className="w-full rounded-lg border border-dashed border-slate-400 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
          + Add another mass
        </button>
        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          Try making the sum of (clockwise moments) exactly equal to the sum of (anticlockwise moments) to balance the
          beam — this is the Principle of Moments.
        </div>
      </div>
    </div>
  );
}


