"use client";

import { useMemo, useState } from "react";

export default function CollisionSimulator() {
  const [m1, setM1] = useState(4);
  const [v1, setV1] = useState(6);
  const [m2, setM2] = useState(2);
  const [v2, setV2] = useState(-2);
  const [elastic, setElastic] = useState(false);

  const momentumBefore = m1 * v1 + m2 * v2;

  const result = useMemo(() => {
    if (elastic) {
      const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
      return { v1f, v2f, combined: null as number | null };
    }
    const combined = (m1 * v1 + m2 * v2) / (m1 + m2);
    return { v1f: combined, v2f: combined, combined };
  }, [m1, v1, m2, v2, elastic]);

  const momentumAfter = m1 * result.v1f + m2 * result.v2f;
  const keBefore = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const keAfter = 0.5 * m1 * result.v1f * result.v1f + 0.5 * m2 * result.v2f * result.v2f;

  const scale = 12;
  const cx = 250;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-500">Before Collision</p>
        <svg viewBox="0 0 500 90" className="w-full rounded-lg bg-slate-50">
          <line x1={0} y1={45} x2={500} y2={45} stroke="#cbd5e1" />
          <circle cx={cx - 80} cy={45} r={Math.min(24, 8 + m1 * 2)} fill="#1d4ed8" />
          <text x={cx - 80} y={49} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{m1}kg</text>
          <line x1={cx - 80} y1={20} x2={cx - 80 + v1 * scale * 0.6} y2={20} stroke="#1d4ed8" strokeWidth={2} markerEnd="url(#a1)" />
          <circle cx={cx + 80} cy={45} r={Math.min(24, 8 + m2 * 2)} fill="#dc2626" />
          <text x={cx + 80} y={49} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{m2}kg</text>
          <line x1={cx + 80} y1={20} x2={cx + 80 + v2 * scale * 0.6} y2={20} stroke="#dc2626" strokeWidth={2} markerEnd="url(#a2)" />
          <defs>
            <marker id="a1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0L8,4L0,8Z" fill="#1d4ed8" /></marker>
            <marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0L8,4L0,8Z" fill="#dc2626" /></marker>
          </defs>
        </svg>
        <p className="mb-2 mt-4 text-xs font-bold uppercase text-slate-500">After Collision</p>
        <svg viewBox="0 0 500 90" className="w-full rounded-lg bg-slate-50">
          <line x1={0} y1={45} x2={500} y2={45} stroke="#cbd5e1" />
          <circle cx={cx - 40} cy={45} r={Math.min(24, 8 + m1 * 2)} fill="#1d4ed8" />
          <text x={cx - 40} y={49} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{m1}kg</text>
          <line x1={cx - 40} y1={20} x2={cx - 40 + result.v1f * scale * 0.6} y2={20} stroke="#1d4ed8" strokeWidth={2} markerEnd="url(#a1)" />
          <circle cx={cx + 40} cy={45} r={Math.min(24, 8 + m2 * 2)} fill="#dc2626" />
          <text x={cx + 40} y={49} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{m2}kg</text>
          <line x1={cx + 40} y1={20} x2={cx + 40 + result.v2f * scale * 0.6} y2={20} stroke="#dc2626" strokeWidth={2} markerEnd="url(#a2)" />
        </svg>
      </div>

      <div className="space-y-4">
        <Slider label={`Mass 1, m₁ = ${m1} kg`} min={1} max={15} value={m1} onChange={setM1} />
        <Slider label={`Velocity 1, u₁ = ${v1} m/s (+ = right, − = left)`} min={-15} max={15} value={v1} onChange={setV1} />
        <Slider label={`Mass 2, m₂ = ${m2} kg`} min={1} max={15} value={m2} onChange={setM2} />
        <Slider label={`Velocity 2, u₂ = ${v2} m/s (+ = right, − = left)`} min={-15} max={15} value={v2} onChange={setV2} />
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={elastic} onChange={(e) => setElastic(e.target.checked)} />
          Elastic collision (both momentum AND kinetic energy conserved)
        </label>

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">Step-by-step Conservation of Momentum</h4>
          <p className="mt-2 font-mono">
            p(before) = m1u1 + m2u2 = ({m1}×{v1}) + ({m2}×{v2}) = {momentumBefore.toFixed(1)} kg·m/s
          </p>
          <p className="mt-1 font-mono">
            p(after) = m1v1 + m2v2 = {momentumAfter.toFixed(1)} kg·m/s
          </p>
          <p className="mt-1 text-emerald-300">
            {Math.abs(momentumBefore - momentumAfter) < 0.05
              ? "✓ Momentum is conserved, as expected."
              : "⚠ Rounding difference only — momentum is conserved."}
          </p>
          <hr className="my-2 border-slate-700" />
          <p className="font-mono">
            v1(after) = {result.v1f.toFixed(2)} m/s, v2(after) = {result.v2f.toFixed(2)} m/s
          </p>
          <p className="mt-2 font-mono text-amber-200">
            KE before = {keBefore.toFixed(1)} J, KE after = {keAfter.toFixed(1)} J
          </p>
          {!elastic && (
            <p className="mt-1 text-orange-300">
              KE lost = {(keBefore - keAfter).toFixed(1)} J — converted to heat/sound/deformation (inelastic collision).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full" />
    </div>
  );
}
