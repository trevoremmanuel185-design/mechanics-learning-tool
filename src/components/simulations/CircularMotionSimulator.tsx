"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 360;
const CENTER = SIZE / 2;

export default function CircularMotionSimulator() {
  const [radius, setRadius] = useState(100);
  const [mass, setMass] = useState(2);
  const [speed, setSpeed] = useState(20);
  const [angleDeg, setAngleDeg] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number | null>(null);

  const radiusM = radius / 20; // pixel-to-metre scale for display purposes
  const omega = speed / radiusM; // rad/s
  const aCentripetal = (speed * speed) / radiusM;
  const fCentripetal = mass * aCentripetal;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      setAngleDeg((prev) => (prev + (omega * dt * 180) / Math.PI) % 360);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, omega]);

  const rad = (angleDeg * Math.PI) / 180;
  const px = CENTER + radius * Math.cos(rad);
  const py = CENTER + radius * Math.sin(rad);

  // tangential velocity direction (perpendicular to radius)
  const tvx = -Math.sin(rad);
  const tvy = Math.cos(rad);
  const velScale = 30;

  // centripetal direction (toward centre)
  const cvx = (CENTER - px) / radius;
  const cvy = (CENTER - py) / radius;
  const accelScale = 26;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full rounded-lg bg-slate-50">
          <circle cx={CENTER} cy={CENTER} r={radius} fill="none" stroke="#cbd5e1" strokeDasharray="4 4" />
          <circle cx={CENTER} cy={CENTER} r={4} fill="#0f172a" />
          <line x1={px} y1={py} x2={px + tvx * velScale} y2={py + tvy * velScale} stroke="#059669" strokeWidth={2.5} markerEnd="url(#tArrow)" />
          <line x1={px} y1={py} x2={px + cvx * accelScale} y2={py + cvy * accelScale} stroke="#dc2626" strokeWidth={2.5} markerEnd="url(#cArrow)" />
          <circle cx={px} cy={py} r={9} fill="#1d4ed8" />
          <defs>
            <marker id="tArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
            </marker>
            <marker id="cArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#dc2626" />
            </marker>
          </defs>
          <text x={12} y={20} fontSize="11" fill="#059669" fontWeight="bold">green = velocity (tangential)</text>
          <text x={12} y={34} fontSize="11" fill="#dc2626" fontWeight="bold">red = centripetal acceleration (toward centre)</text>
        </svg>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="space-y-4">
        <Slider label={`Radius (display) — r ≈ ${radiusM.toFixed(1)} m`} min={40} max={160} value={radius} onChange={setRadius} />
        <Slider label={`Mass m = ${mass} kg`} min={1} max={20} value={mass} onChange={setMass} />
        <Slider label={`Speed v = ${speed} m/s`} min={5} max={60} value={speed} onChange={setSpeed} />

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">Live Results</h4>
          <ul className="mt-2 space-y-1 font-mono">
            <li>ω = v/r = {omega.toFixed(2)} rad/s</li>
            <li>Centripetal acceleration a = v²/r = {aCentripetal.toFixed(1)} m/s²</li>
            <li>Centripetal force F = mv²/r = {fCentripetal.toFixed(1)} N</li>
          </ul>
        </div>
        <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          Even though the speed is constant, the direction of velocity is always changing — that changing direction
          IS the acceleration. Remember: the {fCentripetal.toFixed(1)} N shown here is not a new separate force; it is
          whatever real force (tension, friction, gravity) is actually pulling this object toward the centre.
        </p>
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
