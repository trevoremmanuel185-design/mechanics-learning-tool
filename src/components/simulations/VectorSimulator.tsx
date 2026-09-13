"use client";

import { useMemo, useState } from "react";

const W = 420;
const H = 420;
const CX = W / 2;
const CY = H / 2;
const SCALE = 3.2;

function toXY(mag: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: mag * Math.cos(rad), y: mag * Math.sin(rad) };
}

export default function VectorSimulator() {
  const [mag1, setMag1] = useState(60);
  const [angle1, setAngle1] = useState(35);
  const [mag2, setMag2] = useState(40);
  const [angle2, setAngle2] = useState(120);
  const [showSecond, setShowSecond] = useState(true);

  const v1 = useMemo(() => toXY(mag1, angle1), [mag1, angle1]);
  const v2 = useMemo(() => toXY(mag2, angle2), [mag2, angle2]);
  const resultant = useMemo(
    () => (showSecond ? { x: v1.x + v2.x, y: v1.y + v2.y } : v1),
    [v1, v2, showSecond]
  );
  const resultantMag = Math.hypot(resultant.x, resultant.y);
  const resultantAngle = (Math.atan2(-resultant.y, resultant.x) * 180) / Math.PI;

  function arrow(x: number, y: number, color: string, label: string, dashed = false) {
    const px = CX + x * SCALE;
    const py = CY - y * SCALE;
    return (
      <g>
        <defs>
          <marker id={`arrow-${label}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={color} />
          </marker>
        </defs>
        <line
          x1={CX}
          y1={CY}
          x2={px}
          y2={py}
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray={dashed ? "6 4" : undefined}
          markerEnd={`url(#arrow-${label})`}
        />
        <text x={px + 6} y={py - 6} fontSize="11" fontWeight="bold" fill={color}>
          {label}
        </text>
      </g>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-slate-50">
          <line x1={0} y1={CY} x2={W} y2={CY} stroke="#cbd5e1" />
          <line x1={CX} y1={0} x2={CX} y2={H} stroke="#cbd5e1" />
          {/* components of vector 1 */}
          <line x1={CX} y1={CY} x2={CX + v1.x * SCALE} y2={CY} stroke="#94a3b8" strokeDasharray="4 3" />
          <line x1={CX + v1.x * SCALE} y1={CY} x2={CX + v1.x * SCALE} y2={CY - v1.y * SCALE} stroke="#94a3b8" strokeDasharray="4 3" />
          {arrow(v1.x, v1.y, "#1d4ed8", "V1")}
          {showSecond && arrow(v2.x, v2.y, "#059669", "V2")}
          {showSecond && arrow(resultant.x, resultant.y, "#dc2626", "R")}
        </svg>
      </div>

      <div className="space-y-5">
        <VectorControls label="Vector 1" mag={mag1} angle={angle1} setMag={setMag1} setAngle={setAngle1} color="text-blue-700" />
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={showSecond} onChange={(e) => setShowSecond(e.target.checked)} />
          Add a second vector (to find resultant)
        </label>
        {showSecond && (
          <VectorControls label="Vector 2" mag={mag2} angle={angle2} setMag={setMag2} setAngle={setAngle2} color="text-emerald-700" />
        )}

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">Live Results</h4>
          <ul className="mt-2 space-y-1 font-mono">
            <li>V1x = {v1.x.toFixed(1)}, V1y = {v1.y.toFixed(1)}</li>
            {showSecond && (
              <>
                <li>V2x = {v2.x.toFixed(1)}, V2y = {v2.y.toFixed(1)}</li>
                <li className="text-red-300">Resultant Rx = {resultant.x.toFixed(1)}, Ry = {resultant.y.toFixed(1)}</li>
              </>
            )}
            <li className="text-red-300">|{showSecond ? "R" : "V1"}| = {resultantMag.toFixed(1)}</li>
            <li className="text-red-300">
              Direction = {resultantAngle >= 0 ? resultantAngle.toFixed(1) : (resultantAngle + 360).toFixed(1)}° from horizontal
            </li>
          </ul>
        </div>
        <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          Notice: Vx = V cosθ and Vy = V sinθ for each vector. To find a resultant, add the x-components together and
          the y-components together separately, then recombine using Pythagoras — this works no matter how many
          vectors you add.
        </p>
      </div>
    </div>
  );
}

function VectorControls({
  label,
  mag,
  angle,
  setMag,
  setAngle,
  color,
}: {
  label: string;
  mag: number;
  angle: number;
  setMag: (n: number) => void;
  setAngle: (n: number) => void;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <h4 className={`text-sm font-bold ${color}`}>{label}</h4>
      <label className="mt-2 block text-xs text-slate-600">Magnitude: {mag}</label>
      <input type="range" min={0} max={100} value={mag} onChange={(e) => setMag(+e.target.value)} className="w-full" />
      <label className="mt-2 block text-xs text-slate-600">Angle: {angle}°</label>
      <input type="range" min={-180} max={180} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full" />
    </div>
  );
}
