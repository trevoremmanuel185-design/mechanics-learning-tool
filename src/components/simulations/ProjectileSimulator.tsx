"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const W = 560;
const H = 360;
const PAD = 30;

export default function ProjectileSimulator() {
  const [u, setU] = useState(25);
  const [angle, setAngle] = useState(40);
  const [h0, setH0] = useState(0);
  const [g, setG] = useState(10);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  const rad = (angle * Math.PI) / 180;
  const ux = u * Math.cos(rad);
  const uy = u * Math.sin(rad);

  // Time of flight (lands at y = 0, starting at h0)
  const T = useMemo(() => {
    // 0 = h0 + uy*t - 0.5*g*t^2  => solve quadratic
    const a = -0.5 * g;
    const b = uy;
    const c = h0;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return 0;
    const t1 = (-b - Math.sqrt(disc)) / (2 * a);
    const t2 = (-b + Math.sqrt(disc)) / (2 * a);
    return Math.max(t1, t2);
  }, [uy, g, h0]);

  const maxHeight = h0 + (uy * uy) / (2 * g);
  const range = ux * T;
  const timeAtApex = uy / g;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const next = prev + dt;
        if (next >= T) {
          setPlaying(false);
          return T;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, T]);

  function reset() {
    setPlaying(false);
    setT(0);
  }

  const xNow = ux * t;
  const yNow = h0 + uy * t - 0.5 * g * t * t;
  const vyNow = uy - g * t;

  const maxX = Math.max(range, 1);
  const maxY = Math.max(maxHeight, h0, 1) * 1.15;
  const sx = (x: number) => PAD + (x / maxX) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - (y / maxY) * (H - 2 * PAD);

  const pathPoints = useMemo(() => {
    const pts: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const tt = (T * i) / steps;
      const x = ux * tt;
      const y = h0 + uy * tt - 0.5 * g * tt * tt;
      pts.push(`${sx(x)},${sy(Math.max(y, 0))}`);
    }
    return pts.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [T, ux, uy, g, h0, maxX, maxY]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-sky-50">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#94a3b8" />
          <polyline points={pathPoints} fill="none" stroke="#1d4ed8" strokeWidth={2} strokeDasharray="5 4" />
          <circle cx={sx(xNow)} cy={sy(Math.max(yNow, 0))} r={7} fill="#dc2626" />
          <line x1={sx(0)} y1={sy(h0)} x2={sx(0)} y2={H - PAD} stroke="#64748b" strokeDasharray="3 3" />
        </svg>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            {playing ? "Pause" : t >= T && T > 0 ? "Replay" : "Launch"}
          </button>
          <button onClick={reset} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">
            Reset
          </button>
          <input
            type="range"
            min={0}
            max={T}
            step={T / 200 || 0.01}
            value={t}
            onChange={(e) => {
              setPlaying(false);
              setT(+e.target.value);
            }}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Slider label={`Initial speed u = ${u} m/s`} min={5} max={50} value={u} onChange={setU} />
        <Slider label={`Launch angle θ = ${angle}°`} min={0} max={90} value={angle} onChange={setAngle} />
        <Slider label={`Launch height h₀ = ${h0} m`} min={0} max={40} value={h0} onChange={setH0} />
        <Slider label={`Gravity g = ${g} m/s²`} min={1} max={20} value={g} onChange={setG} />

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">At time t = {t.toFixed(2)} s</h4>
          <ul className="mt-2 grid grid-cols-2 gap-1 font-mono">
            <li>x = {xNow.toFixed(1)} m</li>
            <li>y = {Math.max(yNow, 0).toFixed(1)} m</li>
            <li>vx = {ux.toFixed(1)} m/s</li>
            <li>vy = {vyNow.toFixed(1)} m/s</li>
          </ul>
          <hr className="my-2 border-slate-700" />
          <ul className="space-y-1 font-mono text-amber-200">
            <li>Time of flight T = {T.toFixed(2)} s</li>
            <li>Time to reach apex = {timeAtApex.toFixed(2)} s</li>
            <li>Maximum height = {maxHeight.toFixed(2)} m</li>
            <li>Range = {range.toFixed(2)} m</li>
          </ul>
        </div>
        <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          Explanation: The horizontal velocity (vx = {ux.toFixed(1)} m/s) never changes — only gravity acts vertically,
          steadily reducing vy from +{uy.toFixed(1)} m/s to 0 at the apex, then increasingly negative on the way down.
        </p>
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full" />
    </div>
  );
}
