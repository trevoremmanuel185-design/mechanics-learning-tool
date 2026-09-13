"use client";

import { useMemo, useState } from "react";

export default function ElasticityGrapher() {
  const [k, setK] = useState(150);
  const [elasticLimit, setElasticLimit] = useState(0.15);
  const [extension, setExtension] = useState(0.08);

  const inElasticRegion = extension <= elasticLimit;
  const force = inElasticRegion ? k * extension : k * elasticLimit;
  const energy = inElasticRegion
    ? 0.5 * k * extension * extension
    : 0.5 * k * elasticLimit * elasticLimit + force * (extension - elasticLimit) * 0.5;

  const maxX = 0.3;
  const maxF = k * elasticLimit * 1.6;
  const W = 480;
  const H = 300;
  const PAD = 40;
  const sx = (x: number) => PAD + (x / maxX) * (W - 2 * PAD);
  const sy = (f: number) => H - PAD - (f / maxF) * (H - 2 * PAD);

  const linePoints = useMemo(() => {
    const elasticEnd = `${sx(elasticLimit)},${sy(k * elasticLimit)}`;
    const plasticEnd = `${sx(maxX)},${sy(k * elasticLimit * 1.1)}`;
    return `${sx(0)},${sy(0)} ${elasticEnd} ${plasticEnd}`;
  }, [k, elasticLimit]);

  const areaPoints = `${sx(0)},${sy(0)} ${sx(extension)},${sy(force)} ${sx(extension)},${sy(0)}`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-slate-50">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#334155" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#334155" />
          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#475569">Extension, x (m)</text>
          <text x={14} y={H / 2} fontSize="11" fill="#475569" transform={`rotate(-90 14 ${H / 2})`}>Force, F (N)</text>
          <polygon points={areaPoints} fill="#93c5fd" opacity={0.5} />
          <polyline points={linePoints} fill="none" stroke="#1d4ed8" strokeWidth={2.5} />
          <line
            x1={sx(elasticLimit)}
            y1={PAD}
            x2={sx(elasticLimit)}
            y2={H - PAD}
            stroke="#dc2626"
            strokeDasharray="4 3"
          />
          <text x={sx(elasticLimit) + 4} y={PAD + 12} fontSize="10" fill="#dc2626" fontWeight="bold">
            Elastic limit
          </text>
          <circle cx={sx(extension)} cy={sy(force)} r={5} fill="#059669" />
        </svg>
      </div>

      <div className="space-y-4">
        <Slider label={`Spring constant k = ${k} N/m`} min={20} max={300} value={k} onChange={setK} />
        <Slider label={`Elastic limit = ${elasticLimit.toFixed(2)} m`} min={0.05} max={0.25} step={0.01} value={elasticLimit} onChange={setElasticLimit} />
        <Slider label={`Extension x = ${extension.toFixed(2)} m`} min={0.01} max={0.3} step={0.01} value={extension} onChange={setExtension} />

        <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <h4 className="font-bold text-amber-400">Live Results</h4>
          <ul className="mt-2 space-y-1 font-mono">
            <li>Region: {inElasticRegion ? "Elastic (Hooke's Law applies)" : "Beyond elastic limit — plastic deformation"}</li>
            <li>Force F = {inElasticRegion ? "kx" : "≈ constant beyond limit"} = {force.toFixed(1)} N</li>
            <li>Energy stored (shaded area) ≈ {energy.toFixed(2)} J</li>
          </ul>
        </div>
        <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          {inElasticRegion
            ? "While the graph is a straight line through the origin, F = kx holds exactly, and energy stored is the triangular area, ½kx²."
            : "Beyond the elastic limit, the material no longer obeys Hooke's Law — it stretches permanently (plastic deformation), and F = kx no longer applies."}
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
