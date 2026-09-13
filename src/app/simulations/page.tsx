"use client";

import { useState } from "react";
import VectorSimulator from "@/components/simulations/VectorSimulator";
import ProjectileSimulator from "@/components/simulations/ProjectileSimulator";
import CircularMotionSimulator from "@/components/simulations/CircularMotionSimulator";
import CollisionSimulator from "@/components/simulations/CollisionSimulator";
import BeamBalanceSimulator from "@/components/simulations/BeamBalanceSimulator";
import SHMSimulator from "@/components/simulations/SHMSimulator";
import ElasticityGrapher from "@/components/simulations/ElasticityGrapher";
import OrbitalSimulator from "@/components/simulations/OrbitalSimulator";
import FBDBuilder from "@/components/simulations/FBDBuilder";

const SIMULATIONS = [
  { id: "vectors", label: "🧭 Vector Simulator", component: VectorSimulator, blurb: "Resolve vectors and add resultants interactively." },
  { id: "projectile", label: "🚀 Projectile Motion", component: ProjectileSimulator, blurb: "Launch a projectile and study its trajectory." },
  { id: "circular", label: "🔄 Circular Motion", component: CircularMotionSimulator, blurb: "See centripetal acceleration and force live." },
  { id: "collision", label: "💥 Collisions", component: CollisionSimulator, blurb: "Explore momentum conservation in 1D collisions." },
  { id: "beam", label: "⚖️ Beam Balance", component: BeamBalanceSimulator, blurb: "Balance a beam using the principle of moments." },
  { id: "shm", label: "🌊 SHM Spring-Mass", component: SHMSimulator, blurb: "Visualise simple harmonic motion of a spring." },
  { id: "elasticity", label: "📈 Force-Extension Grapher", component: ElasticityGrapher, blurb: "Explore Hooke's Law and elastic energy." },
  { id: "orbital", label: "🌍 Orbital Motion", component: OrbitalSimulator, blurb: "Change orbital radius and speed to see the effect." },
  { id: "fbd", label: "📐 Free Body Diagram Builder", component: FBDBuilder, blurb: "Practise identifying every force on an object." },
];

export default function SimulationsPage() {
  const [active, setActive] = useState(SIMULATIONS[0].id);
  const Active = SIMULATIONS.find((s) => s.id === active)!.component;

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🧪 Interactive Simulations</h1>
        <p className="mt-1 text-sm text-slate-600">
          Change the variables and watch the physics respond in real time. Every simulation explains its results.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SIMULATIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active === s.id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Active />
      </div>
    </main>
  );
}
