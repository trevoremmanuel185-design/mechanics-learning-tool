"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const G = 6.674e-11;
const M_EARTH = 5.972e24;
const R_EARTH = 6.371e6;

const SIZE = 360;
const CENTER = SIZE / 2;

export default function OrbitalSimulator() {
  const [radiusMultiple, setRadiusMultiple] = useState(1.5); // multiples of Earth's radius
  const [speedFactor, setSpeedFactor] = useState(1); // fraction of required circular speed
  const [angleDeg, setAngleDeg] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number | null>(null);

  const r = radiusMultiple * R_EARTH;
  const requiredV = Math.sqrt((G * M_EARTH) / r);
  const actualV = requiredV * speedFactor;
  const period = (2 * Math.PI * r) / requiredV; // period at correct circular speed, for animation only

  const displayRadius = 40 + radiusMultiple * 55;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      const degPerSec = (360 / period) * 2000 * speedFactor;
      setAngleDeg((prev) => (prev + degPerSec * dt) % 360);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, period, speedFactor]);

  const rad = (angleDeg * Math.PI) / 180;
  const px = CENTER + displayRadius * Math.cos(rad);
  const py = CENTER + displayRadius * Math.sin(rad);

  const status = useMemo(() => {
    if (speedFactor < 0.9) return { text: "Too slow: gravity dominates — the satellite would spiral inward and could crash.", color: "text-rose-600" };
    if (speedFactor > 1.1) return { text: "Too fast: the satellite would fly outward into a higher/escape trajectory.", color: "text-amber-600" };
    return { text: "Just right: gravity exactly supplies the centripetal force for a stable circular orbit.", color: "text-emerald-600" };
  }, [speedFactor]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full rounded-lg bg-slate-950">
          <circle cx={CENTER} cy={CENTER} r={displayRadius} fill="none" stroke="#334155" strokeDasharray="4 4" />
          <circle cx={CENTER} cy={CENTER} r={30} fill="#1d4ed8" />
          <circle cx={px} cy={py} r={7} fill="#f59e0b" />
        </svg>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="space-y-4">
        <Slider label={`Orbital radius = ${radiusMultiple.toFixed(1)} × Earth's radius`} min={1.1} max={6} step={0.1} value={radiusMultiple} onChange={setRadiusMultiple} />
        <Slider label={`Actual speed = ${(speedFactor * 100).toFixed(0)}% of required circular speed`} min={0.5} max={1.5} step={0.02} value={speedFactor} onChange={setSpeedFactor} />

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">Live Results</h4>
          <ul className="mt-2 space-y-1 font-mono">
            <li>Orbital radius r = {(r / 1000).toFixed(0)} km</li>
            <li>Required orbital speed v = √(GM/r) = {(requiredV / 1000).toFixed(2)} km/s</li>
            <li>Actual speed = {(actualV / 1000).toFixed(2)} km/s</li>
          </ul>
        </div>
        <p className={`rounded-lg bg-blue-50 p-3 text-sm font-semibold ${status.color}`}>{status.text}</p>
        <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          This demonstrates why v = √(GM/r): gravity must supply exactly the centripetal force mv²/r needed for a
          circular orbit of radius r. Larger orbits need lower speeds.
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
