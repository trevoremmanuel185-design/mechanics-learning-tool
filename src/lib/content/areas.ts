import type { Area, Topic } from "@/lib/types";

export const AREAS: Area[] = [
  {
    id: "measurement-vectors",
    title: "Measurement, Scalars & Vectors",
    icon: "Ruler",
    description: "Physical quantities, units, dimensions, scalars and vectors.",
  },
  {
    id: "kinematics",
    title: "Kinematics / Motion",
    icon: "MoveRight",
    description: "Describing motion: distance, speed, velocity, acceleration, graphs and projectiles.",
  },
  {
    id: "forces",
    title: "Newton's Laws & Forces",
    icon: "Zap",
    description: "Forces, friction, Newton's three laws, connected particles and inclined planes.",
  },
  {
    id: "momentum",
    title: "Momentum & Impulse",
    icon: "Target",
    description: "Conservation of momentum, impulse, collisions and explosions.",
  },
  {
    id: "energy",
    title: "Work, Energy & Power",
    icon: "Flame",
    description: "Work, kinetic & potential energy, conservation of energy, power and efficiency.",
  },
  {
    id: "circular",
    title: "Circular Motion",
    icon: "RotateCw",
    description: "Angular quantities, centripetal acceleration and centripetal force.",
  },
  {
    id: "gravitation",
    title: "Gravitation",
    icon: "Globe2",
    description: "Newton's law of gravitation, fields, potential and satellite motion.",
  },
  {
    id: "statics",
    title: "Statics, Equilibrium & Moments",
    icon: "Scale",
    description: "Moments, couples, centre of gravity, stability and beams.",
  },
  {
    id: "shm",
    title: "SHM & Oscillations",
    icon: "Waves",
    description: "Simple harmonic motion, springs, pendulums and energy in oscillations.",
  },
  {
    id: "elasticity",
    title: "Elasticity",
    icon: "GitBranch",
    description: "Hooke's law, stress, strain, Young's modulus and energy stored in materials.",
  },
];

export const TOPICS: Topic[] = [
  {
    id: "quantities-units",
    areaId: "measurement-vectors",
    title: "Physical Quantities & SI Units",
    icon: "Ruler",
    status: "core",
    blurb: "Base and derived quantities, SI units, dimensions and unit conversion.",
    subtopics: ["Base quantities", "Derived quantities", "Dimensions", "Unit conversion"],
  },
  {
    id: "vectors",
    areaId: "measurement-vectors",
    title: "Scalars & Vectors",
    icon: "ArrowUpRight",
    status: "core",
    blurb: "Vector notation, addition, subtraction, resolution and equilibrium.",
    subtopics: ["Scalars vs vectors", "Vector addition", "Resolution of vectors", "Equilibrium of forces"],
  },
  {
    id: "kinematics-basics",
    areaId: "kinematics",
    title: "Distance, Displacement, Speed & Velocity",
    icon: "MoveRight",
    status: "core",
    blurb: "Foundations of motion description and the difference between scalar and vector motion quantities.",
    subtopics: ["Distance vs displacement", "Speed vs velocity", "Average vs instantaneous"],
  },
  {
    id: "suvat",
    areaId: "kinematics",
    title: "Equations of Motion (SUVAT)",
    icon: "Sigma",
    status: "core",
    blurb: "Uniform acceleration equations, derivations and conditions for use.",
    subtopics: ["Derivation of SUVAT", "Uniform acceleration", "Free fall"],
  },
  {
    id: "motion-graphs",
    areaId: "kinematics",
    title: "Motion Graphs",
    icon: "LineChart",
    status: "core",
    blurb: "Displacement-time, velocity-time and acceleration-time graphs; gradients and areas.",
    subtopics: ["Gradient interpretation", "Area under graphs", "Non-uniform motion"],
  },
  {
    id: "projectiles",
    areaId: "kinematics",
    title: "Projectile Motion",
    icon: "Rocket",
    status: "core",
    blurb: "Horizontal and angled projection, range, maximum height and time of flight.",
    subtopics: ["Horizontal projection", "Angled projection", "Range & max height"],
  },
  {
    id: "newton-laws",
    areaId: "forces",
    title: "Newton's Three Laws",
    icon: "Zap",
    status: "core",
    blurb: "Inertia, F = ma, and action-reaction pairs.",
    subtopics: ["First law", "Second law", "Third law"],
  },
  {
    id: "friction",
    areaId: "forces",
    title: "Friction & Inclined Planes",
    icon: "TrendingDown",
    status: "core",
    blurb: "Static and kinetic friction, coefficient of friction, slopes and connected particles.",
    subtopics: ["Static vs kinetic friction", "Coefficient of friction", "Inclined planes", "Connected particles & pulleys"],
  },
  {
    id: "free-body-diagrams",
    areaId: "forces",
    title: "Free Body Diagrams",
    icon: "Boxes",
    status: "core",
    blurb: "Identifying and drawing every force acting on an object.",
    subtopics: ["Weight", "Normal reaction", "Tension", "Applied force", "Friction"],
  },
  {
    id: "momentum-impulse",
    areaId: "momentum",
    title: "Momentum, Impulse & Collisions",
    icon: "Target",
    status: "core",
    blurb: "Conservation of momentum, impulse-momentum theorem, elastic and inelastic collisions.",
    subtopics: ["Momentum", "Impulse", "Elastic collisions", "Inelastic collisions", "Explosions"],
  },
  {
    id: "work-energy-power",
    areaId: "energy",
    title: "Work, Energy & Power",
    icon: "Flame",
    status: "core",
    blurb: "Work-energy theorem, KE, GPE, conservation of energy, power and efficiency.",
    subtopics: ["Work", "Kinetic energy", "GPE", "Conservation of energy", "Power & efficiency"],
  },
  {
    id: "circular-motion",
    areaId: "circular",
    title: "Uniform Circular Motion",
    icon: "RotateCw",
    status: "core",
    blurb: "Angular velocity, centripetal acceleration and centripetal force.",
    subtopics: ["Angular displacement & velocity", "Centripetal acceleration", "Centripetal force", "Banking"],
  },
  {
    id: "gravitation-fields",
    areaId: "gravitation",
    title: "Gravitational Fields & Satellites",
    icon: "Globe2",
    status: "core",
    blurb: "Newton's law of gravitation, field strength, potential and orbital motion.",
    subtopics: ["Newton's law of gravitation", "Field strength", "Gravitational potential", "Satellites & orbits"],
  },
  {
    id: "moments-equilibrium",
    areaId: "statics",
    title: "Moments & Equilibrium",
    icon: "Scale",
    status: "core",
    blurb: "Principle of moments, torque, couples, centre of gravity and stability.",
    subtopics: ["Principle of moments", "Couples", "Centre of gravity", "Stability & toppling"],
  },
  {
    id: "shm-oscillations",
    areaId: "shm",
    title: "Simple Harmonic Motion",
    icon: "Waves",
    status: "extension",
    blurb: "Oscillations, springs, pendulums and energy exchange in SHM.",
    subtopics: ["Displacement, velocity, acceleration in SHM", "Springs", "Pendulums", "Energy in SHM"],
  },
  {
    id: "elasticity-hooke",
    areaId: "elasticity",
    title: "Hooke's Law & Elasticity",
    icon: "GitBranch",
    status: "extension",
    blurb: "Force-extension graphs, stress, strain and Young's modulus.",
    subtopics: ["Hooke's law", "Stress & strain", "Young's modulus", "Energy stored"],
  },
];

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function getAreaById(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

export function getTopicsByArea(areaId: string): Topic[] {
  return TOPICS.filter((t) => t.areaId === areaId);
}
