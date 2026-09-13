"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function SHMSimulator() {
  const [mass, setMass] = useState(0.5);
  const [k, setK] = useState(20);
  const [amplitude, setAmplitude] = useState(60);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number | null>(null);

  const omega = Math.sqrt(k / mass);
  const period = (2 * Math.PI) / omega;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => prev + dt);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const x = amplitude * Math.cos(omega * t); // pixel displacement from centre
  const xMetres = (amplitude / 100) * Math.cos(omega * t);
  const vMetres = -(amplitude / 100) * omega * Math.sin(omega * t);
  const aMetres = -(amplitude / 100) * omega * omega * Math.cos(omega * t);

  const graphPoints = useMemo(() => {
    const pts: string[] = [];
    const steps = 200;
    const totalT = period * 2;
    for (let i = 0; i <= steps; i++) {
      const tt = (totalT * i) / steps;
      const xx = amplitude * Math.cos(omega * tt);
      const px = 10 + (i / steps) * 480;
      const py = 90 - (xx / 100) * 70;
      pts.push(`${px},${py}`);
    }
    return pts.join(" ");
  }, [amplitude, omega, period]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox="0 0 220 320" className="mx-auto w-40 rounded-lg bg-slate-50">
          <line x1={110} y1={0} x2={110} y2={20} stroke="#334155" strokeWidth={4} />
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={100 + (i % 2 === 0 ? -10 : 10)}
              y1={20 + i * ((140 + x) / 10)}
              x2={100 + (i % 2 === 0 ? 10 : -10)}
              y2={20 + (i + 1) * ((140 + x) / 10)}
              stroke="#64748b"
              strokeWidth={2}
            />
          ))}
          <rect x={80} y={160 + x} width={60} height={40} rx={6} fill="#1d4ed8" />
          <text x={110} y={185 + x} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
            {mass}kg
          </text>
          <line x1={20} y1={160} x2={200} y2={160} stroke="#cbd5e1" strokeDasharray="4 3" />
        </svg>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="mx-auto mt-2 block rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          {playing ? "Pause" : "Play"}
        </button>

        <svg viewBox="0 0 500 100" className="mt-4 w-full rounded-lg bg-slate-50">
          <line x1={10} y1={20} x2={10} y2={90} stroke="#cbd5e1" />
          <line x1={10} y1={90} x2={490} y2={90} stroke="#cbd5e1" />
          <line x1={10} y1={55} x2={490} y2={55} stroke="#e2e8f0" strokeDasharray="3 3" />
          <polyline points={graphPoints} fill="none" stroke="#dc2626" strokeWidth={2} />
          <text x={12} y={14} fontSize="9" fill="#64748b">
            x (displacement) vs t — two full periods shown
          </text>
        </svg>
      </div>

      <div className="space-y-4">
        <Slider label={`Mass m = ${mass} kg`} min={0.1} max={3} step={0.1} value={mass} onChange={setMass} />
        <Slider label={`Spring constant k = ${k} N/m`} min={5} max={100} value={k} onChange={setK} />
        <Slider label={`Amplitude (display) A ≈ ${(amplitude / 100).toFixed(2)} m`} min={10} max={90} value={amplitude} onChange={setAmplitude} />

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">Live Results</h4>
          <ul className="mt-2 space-y-1 font-mono">
            <li>ω = √(k/m) = {omega.toFixed(2)} rad/s</li>
            <li>Period T = 2π/ω = {period.toFixed(2)} s</li>
            <li>x(t) = {xMetres.toFixed(3)} m</li>
            <li>v(t) = {vMetres.toFixed(3)} m/s</li>
            <li>a(t) = {aMetres.toFixed(3)} m/s²</li>
          </ul>
        </div>
        <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          Notice velocity is greatest as the mass passes through the centre (x=0), while acceleration is greatest (and
          directed back toward the centre) at the extremes of the motion — exactly as SHM theory predicts.
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
  step = 1,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full" />
    </div>
  );
}
