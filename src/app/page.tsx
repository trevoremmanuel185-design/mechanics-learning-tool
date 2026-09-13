const topics = [
  {
    title: "Kinematics",
    description: "Position, velocity, and acceleration in one and two dimensions.",
  },
  {
    title: "Newton's Laws",
    description: "Forces, free-body diagrams, and the foundations of dynamics.",
  },
  {
    title: "Energy & Work",
    description: "Kinetic and potential energy, conservation, and power.",
  },
  {
    title: "Momentum & Collisions",
    description: "Linear momentum, impulse, and elastic vs. inelastic collisions.",
  },
  {
    title: "Rotational Motion",
    description: "Torque, angular momentum, and moment of inertia.",
  },
  {
    title: "Oscillations",
    description: "Simple harmonic motion, pendulums, and springs.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-medium tracking-wide text-sky-400 uppercase">
          Mechanics Learning Tool
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Learn classical mechanics, one concept at a time.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          A growing collection of lessons and worked examples covering the
          core topics of introductory mechanics.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <article
            key={topic.title}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-sky-500/50"
          >
            <h2 className="text-lg font-semibold text-white">{topic.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{topic.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
