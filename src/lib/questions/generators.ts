import type { Difficulty, Question } from "@/lib/types";

// Procedural question generators. Each call produces a freshly randomised,
// fully verified numeric question with a complete step-by-step solution.
// This is what allows the platform to supply effectively unlimited practice
// questions rather than a fixed, memorisable set.

function rand(min: number, max: number, step = 1): number {
  const n = Math.floor(Math.random() * ((max - min) / step + 1));
  return +(min + n * step).toFixed(4);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function round(n: number, dp = 2): number {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---- SUVAT generator: v = u + at ----
function genSuvatVUAT(difficulty: Difficulty): Question {
  const u = rand(0, 15);
  const a = rand(1, 6);
  const t = rand(2, 10);
  const v = round(u + a * t, 2);
  return {
    id: uid("gen-suvat1"),
    topicId: "suvat",
    subtopic: "v = u + at",
    difficulty,
    type: "calculation",
    prompt: `An object starts with velocity ${u} m/s and accelerates uniformly at ${a} m/s² for ${t} s. Find its final velocity.`,
    correctAnswer: `${v} m/s`,
    tolerance: 0.3,
    hints: {
      hint1: "You are given initial velocity, acceleration, and time.",
      hint2: "Use v = u + at.",
      hint3: `Substitute u=${u}, a=${a}, t=${t}.`,
    },
    solution: {
      given: [`u = ${u} m/s`, `a = ${a} m/s²`, `t = ${t} s`],
      find: "final velocity v",
      principle: "Uniform acceleration links velocity change directly to acceleration and time.",
      formula: "v = u + at",
      whyFormula: "u, a, and t are all known, and v is required — this is the direct SUVAT equation linking exactly these variables.",
      substitution: `v = ${u} + (${a})(${t})`,
      calculation: [`${a} × ${t} = ${round(a * t, 2)}`, `v = ${u} + ${round(a * t, 2)} = ${v}`],
      units: "m/s",
      finalAnswer: `${v} m/s`,
      meaning: `After ${t} seconds of steady acceleration, the object is moving at ${v} m/s.`,
    },
    commonMistakes: ["Forgetting to multiply a by t before adding u.", "Mixing up u and v."],
    tags: ["suvat", "generated"],
  };
}

// ---- SUVAT generator: s = ut + 1/2 a t^2 ----
function genSuvatDisplacement(difficulty: Difficulty): Question {
  const u = rand(0, 10);
  const a = rand(1, 5);
  const t = rand(2, 8);
  const s = round(u * t + 0.5 * a * t * t, 2);
  return {
    id: uid("gen-suvat2"),
    topicId: "suvat",
    subtopic: "s = ut + ½at²",
    difficulty,
    type: "calculation",
    prompt: `A body moving initially at ${u} m/s accelerates uniformly at ${a} m/s² for ${t} s. Find the distance travelled.`,
    correctAnswer: `${s} m`,
    tolerance: Math.max(1, s * 0.03),
    hints: {
      hint1: "You know u, a and t, and need displacement.",
      hint2: "Use s = ut + ½at².",
      hint3: "Calculate ut and ½at² separately, then add.",
    },
    solution: {
      given: [`u = ${u} m/s`, `a = ${a} m/s²`, `t = ${t} s`],
      find: "displacement s",
      principle: "Displacement under constant acceleration equals the initial-velocity term plus the acceleration term.",
      formula: "s = ut + ½at²",
      whyFormula: "This equation gives displacement directly from u, a and t without needing to find v first.",
      substitution: `s = (${u})(${t}) + 0.5(${a})(${t}²)`,
      calculation: [`ut = ${round(u * t, 2)}`, `½at² = ${round(0.5 * a * t * t, 2)}`, `s = ${round(u * t, 2)} + ${round(0.5 * a * t * t, 2)} = ${s}`],
      units: "m",
      finalAnswer: `${s} m`,
      meaning: `The body covers ${s} m during this ${t}-second period of acceleration.`,
    },
    commonMistakes: ["Forgetting to square t.", "Forgetting the factor of ½."],
    tags: ["suvat", "generated"],
  };
}

// ---- Newton's Second Law generator ----
function genNewtonSecondLaw(difficulty: Difficulty): Question {
  const m = rand(2, 50);
  const a = rand(1, 8);
  const F = round(m * a, 1);
  const askFor = pick(["F", "a", "m"]);
  let prompt = "";
  let correctAnswer = "";
  let formula = "";
  let substitution = "";
  let calc: string[] = [];
  let finalAnswer = "";
  if (askFor === "F") {
    prompt = `Find the resultant force needed to give a mass of ${m} kg an acceleration of ${a} m/s².`;
    correctAnswer = `${F} N`;
    formula = "F = ma";
    substitution = `F = ${m} × ${a}`;
    calc = [`F = ${F}`];
    finalAnswer = `${F} N`;
  } else if (askFor === "a") {
    prompt = `A resultant force of ${F} N acts on a mass of ${m} kg. Find the acceleration produced.`;
    correctAnswer = `${a} m/s²`;
    formula = "a = F/m";
    substitution = `a = ${F} / ${m}`;
    calc = [`a = ${a}`];
    finalAnswer = `${a} m/s²`;
  } else {
    prompt = `A resultant force of ${F} N gives an object an acceleration of ${a} m/s². Find its mass.`;
    correctAnswer = `${m} kg`;
    formula = "m = F/a";
    substitution = `m = ${F} / ${a}`;
    calc = [`m = ${m}`];
    finalAnswer = `${m} kg`;
  }
  return {
    id: uid("gen-newton"),
    topicId: "newton-laws",
    subtopic: "F = ma",
    difficulty,
    type: "calculation",
    prompt,
    correctAnswer,
    tolerance: askFor === "F" ? Math.max(1, F * 0.03) : askFor === "a" ? 0.2 : Math.max(0.5, m * 0.03),
    hints: {
      hint1: "Newton's Second Law relates resultant force, mass and acceleration.",
      hint2: `Use ${formula}.`,
      hint3: "Identify which two quantities you already know and substitute.",
    },
    solution: {
      given: [`m = ${m} kg`, `a = ${a} m/s²`, `F = ${F} N`].filter((s) => !s.includes("undefined")),
      find: askFor === "F" ? "resultant force F" : askFor === "a" ? "acceleration a" : "mass m",
      principle: "Newton's Second Law: resultant force equals mass times acceleration.",
      formula,
      whyFormula: "This is the direct rearrangement of F = ma for the requested unknown.",
      substitution,
      calculation: calc,
      units: askFor === "F" ? "N" : askFor === "a" ? "m/s²" : "kg",
      finalAnswer,
      meaning: "This shows how force, mass and acceleration are locked together by Newton's Second Law — changing any two determines the third.",
    },
    commonMistakes: ["Dividing the wrong way round (F/m vs m/F).", "Forgetting F must be the RESULTANT force, not just one applied force."],
    tags: ["newton", "generated"],
  };
}

// ---- Momentum conservation generator (perfectly inelastic) ----
function genMomentumConservation(difficulty: Difficulty): Question {
  const m1 = rand(1, 10);
  const m2 = rand(1, 10);
  const u1 = rand(2, 12);
  const u2 = 0;
  const v = round((m1 * u1 + m2 * u2) / (m1 + m2), 2);
  return {
    id: uid("gen-mom"),
    topicId: "momentum-impulse",
    subtopic: "Conservation of momentum",
    difficulty,
    type: "calculation",
    prompt: `A ${m1} kg trolley moving at ${u1} m/s collides and sticks to a stationary ${m2} kg trolley. Find their common velocity after collision.`,
    correctAnswer: `${v} m/s`,
    tolerance: Math.max(0.1, v * 0.05),
    hints: {
      hint1: "Total momentum before collision equals total momentum after.",
      hint2: "The trolleys stick together, so they share one final velocity.",
      hint3: `m1u1 + m2u2 = (m1+m2)v`,
    },
    solution: {
      given: [`m1 = ${m1} kg, u1 = ${u1} m/s`, `m2 = ${m2} kg, u2 = 0 m/s`],
      find: "common velocity v after collision",
      principle: "Conservation of momentum for a perfectly inelastic collision.",
      formula: "m1u1 + m2u2 = (m1+m2)v",
      whyFormula: "No external horizontal force acts during the brief collision, so total momentum is conserved; the trolleys stick together and share velocity v.",
      substitution: `(${m1}×${u1}) + (${m2}×0) = (${m1 + m2})v`,
      calculation: [`${m1 * u1} = ${m1 + m2}v`, `v = ${m1 * u1}/${m1 + m2} = ${v}`],
      units: "m/s",
      finalAnswer: `${v} m/s`,
      meaning: "The combined trolleys move off together slower than the original moving trolley, since momentum is now shared between more mass.",
    },
    commonMistakes: ["Forgetting the second trolley's initial momentum is zero, not ignoring it entirely from the setup.", "Not combining masses correctly after collision."],
    tags: ["momentum", "generated"],
  };
}

// ---- Work-energy: kinetic energy generator ----
function genKineticEnergy(difficulty: Difficulty): Question {
  const m = rand(1, 20, 1);
  const v = rand(2, 25, 1);
  const KE = round(0.5 * m * v * v, 1);
  return {
    id: uid("gen-ke"),
    topicId: "work-energy-power",
    subtopic: "Kinetic energy",
    difficulty,
    type: "calculation",
    prompt: `Find the kinetic energy of a ${m} kg object moving at ${v} m/s.`,
    correctAnswer: `${KE} J`,
    tolerance: Math.max(1, KE * 0.03),
    hints: { hint1: "KE depends on both mass and the SQUARE of speed.", hint2: "Use KE = ½mv².", hint3: `Compute v² = ${v}² first.` },
    solution: {
      given: [`m = ${m} kg`, `v = ${v} m/s`],
      find: "kinetic energy",
      principle: "Kinetic energy is the energy possessed by a moving object.",
      formula: "KE = ½mv²",
      whyFormula: "Direct formula for translational kinetic energy.",
      substitution: `KE = 0.5 × ${m} × ${v}²`,
      calculation: [`${v}² = ${v * v}`, `0.5 × ${m} × ${v * v} = ${KE}`],
      units: "J",
      finalAnswer: `${KE} J`,
      meaning: "This is the energy that would need to be removed (e.g. by brakes) to bring the object to rest.",
    },
    commonMistakes: ["Forgetting to square v.", "Forgetting the factor of ½."],
    tags: ["energy", "generated"],
  };
}

// ---- Circular motion generator ----
function genCentripetalForce(difficulty: Difficulty): Question {
  const m = rand(1, 20);
  const r = rand(1, 10, 0.5);
  const v = rand(2, 15);
  const F = round((m * v * v) / r, 1);
  return {
    id: uid("gen-cm"),
    topicId: "circular-motion",
    subtopic: "Centripetal force",
    difficulty,
    type: "calculation",
    prompt: `An object of mass ${m} kg moves in a circle of radius ${r} m at a constant speed of ${v} m/s. Find the centripetal force required.`,
    correctAnswer: `${F} N`,
    tolerance: Math.max(1, F * 0.04),
    hints: { hint1: "Use F = mv²/r.", hint2: "Square the speed first.", hint3: `Compute ${v}² then multiply by ${m}, then divide by ${r}.` },
    solution: {
      given: [`m = ${m} kg`, `r = ${r} m`, `v = ${v} m/s`],
      find: "centripetal force F",
      principle: "Any object moving in a circle needs a resultant force directed toward the centre.",
      formula: "F = mv²/r",
      whyFormula: "This is the direct centripetal force formula from mass, speed and radius.",
      substitution: `F = ${m} × ${v}² / ${r}`,
      calculation: [`${v}² = ${v * v}`, `${m} × ${v * v} = ${m * v * v}`, `${m * v * v} / ${r} = ${F}`],
      units: "N",
      finalAnswer: `${F} N`,
      meaning: "This is the size of the resultant inward force (from friction, tension, or gravity, depending on context) needed to maintain this circular path.",
    },
    commonMistakes: ["Using diameter instead of radius.", "Forgetting to square the velocity."],
    tags: ["circular motion", "generated"],
  };
}

// ---- Moments generator ----
function genMoments(difficulty: Difficulty): Question {
  const F1 = rand(10, 100);
  const d1 = rand(1, 5, 0.5);
  const d2 = rand(1, 5, 0.5);
  const F2 = round((F1 * d1) / d2, 2);
  return {
    id: uid("gen-mom-beam"),
    topicId: "moments-equilibrium",
    subtopic: "Principle of moments",
    difficulty,
    type: "calculation",
    prompt: `A uniform beam is pivoted at its centre. A force of ${F1} N acts ${d1} m from the pivot on one side. What force placed ${d2} m from the pivot on the other side would balance it?`,
    correctAnswer: `${F2} N`,
    tolerance: Math.max(0.5, F2 * 0.04),
    hints: { hint1: "Clockwise moment = anticlockwise moment.", hint2: `${F1} × ${d1} = F × ${d2}`, hint3: "Solve for F." },
    solution: {
      given: [`F1 = ${F1} N at d1 = ${d1} m`, `d2 = ${d2} m (other side)`],
      find: "Balancing force F2",
      principle: "Principle of moments: for equilibrium, clockwise moments = anticlockwise moments about the pivot.",
      formula: `${F1} × ${d1} = F2 × ${d2}`,
      whyFormula: "Balancing requires equal turning effects on both sides of the pivot.",
      substitution: `F2 = (${F1} × ${d1}) / ${d2}`,
      calculation: [`${F1} × ${d1} = ${round(F1 * d1, 2)}`, `F2 = ${round(F1 * d1, 2)} / ${d2} = ${F2}`],
      units: "N",
      finalAnswer: `${F2} N`,
      meaning: "A smaller force placed further from the pivot (or a larger force placed closer) can still balance the beam — this is the principle behind levers.",
    },
    commonMistakes: ["Confusing which side is clockwise vs anticlockwise.", "Using distance from an end instead of from the pivot."],
    tags: ["moments", "generated"],
  };
}

// ---- Unit conversion generator ----
function genUnitConversion(difficulty: Difficulty): Question {
  const conversions = [
    { desc: (v: number) => `Convert ${v} km/h to m/s.`, calc: (v: number) => round(v / 3.6, 2), unit: "m/s", explain: "divide by 3.6" },
    { desc: (v: number) => `Convert ${v} m/s to km/h.`, calc: (v: number) => round(v * 3.6, 2), unit: "km/h", explain: "multiply by 3.6" },
    { desc: (v: number) => `Convert ${v} g to kg.`, calc: (v: number) => round(v / 1000, 4), unit: "kg", explain: "divide by 1000" },
    { desc: (v: number) => `Convert ${v} cm to m.`, calc: (v: number) => round(v / 100, 3), unit: "m", explain: "divide by 100" },
    { desc: (v: number) => `Convert ${v} minutes to seconds.`, calc: (v: number) => round(v * 60, 1), unit: "s", explain: "multiply by 60" },
  ];
  const c = pick(conversions);
  const v = rand(5, 200);
  const ans = c.calc(v);
  return {
    id: uid("gen-unit"),
    topicId: "quantities-units",
    subtopic: "Unit conversion",
    difficulty,
    type: "calculation",
    prompt: c.desc(v),
    correctAnswer: `${ans} ${c.unit}`,
    tolerance: Math.max(0.05, Math.abs(ans) * 0.03),
    hints: { hint1: "Identify the conversion factor between the two units.", hint2: `You need to ${c.explain}.`, hint3: `Apply this to the value ${v}.` },
    solution: {
      given: [`Value = ${v}`],
      find: `Equivalent value in ${c.unit}`,
      principle: "Unit conversion requires multiplying/dividing by the correct fixed conversion factor.",
      formula: `${c.explain}`,
      whyFormula: "This conversion factor connects the two unit systems exactly.",
      substitution: `${v} → ${c.explain}`,
      calculation: [`${v} → ${ans}`],
      units: c.unit,
      finalAnswer: `${ans} ${c.unit}`,
      meaning: "Correct unit conversion is essential before combining quantities in any formula.",
    },
    commonMistakes: ["Multiplying when you should divide, or vice versa."],
    tags: ["units", "generated"],
  };
}

// ---- Formula rearrangement drill generator ----
interface RearrangeTemplate {
  base: string;
  subject: string;
  rearranged: string;
}
const REARRANGE_TEMPLATES: RearrangeTemplate[] = [
  { base: "F = ma", subject: "a", rearranged: "a = F/m" },
  { base: "F = ma", subject: "m", rearranged: "m = F/a" },
  { base: "v = u + at", subject: "u", rearranged: "u = v - at" },
  { base: "v = u + at", subject: "a", rearranged: "a = (v - u)/t" },
  { base: "v = u + at", subject: "t", rearranged: "t = (v - u)/a" },
  { base: "s = ut + ½at²", subject: "u", rearranged: "u = (s - ½at²)/t" },
  { base: "p = mv", subject: "m", rearranged: "m = p/v" },
  { base: "p = mv", subject: "v", rearranged: "v = p/m" },
  { base: "W = Fs", subject: "F", rearranged: "F = W/s" },
  { base: "KE = ½mv²", subject: "v", rearranged: "v = √(2KE/m)" },
  { base: "KE = ½mv²", subject: "m", rearranged: "m = 2KE/v²" },
  { base: "GPE = mgh", subject: "h", rearranged: "h = GPE/(mg)" },
  { base: "P = W/t", subject: "W", rearranged: "W = Pt" },
  { base: "P = W/t", subject: "t", rearranged: "t = W/P" },
  { base: "F = mv²/r", subject: "v", rearranged: "v = √(Fr/m)" },
  { base: "F = mv²/r", subject: "r", rearranged: "r = mv²/F" },
  { base: "a = v²/r", subject: "r", rearranged: "r = v²/a" },
  { base: "T = 2π√(m/k)", subject: "k", rearranged: "k = 4π²m/T²" },
  { base: "F = kx", subject: "x", rearranged: "x = F/k" },
  { base: "F = kx", subject: "k", rearranged: "k = F/x" },
  { base: "g = GM/r²", subject: "M", rearranged: "M = gr²/G" },
  { base: "E = ½kx²", subject: "x", rearranged: "x = √(2E/k)" },
];

function genRearrangement(difficulty: Difficulty): Question {
  const t = pick(REARRANGE_TEMPLATES);
  return {
    id: uid("gen-rearrange"),
    topicId: "formula-bank",
    subtopic: "Formula rearrangement",
    difficulty,
    type: "conceptual",
    prompt: `Make ${t.subject} the subject of the formula: ${t.base}`,
    correctAnswer: t.rearranged,
    hints: {
      hint1: "Identify what is currently multiplying or dividing the subject.",
      hint2: "Apply the same inverse operation to both sides of the equation.",
      hint3: "Isolate the requested variable step by step.",
    },
    solution: {
      given: [`Original formula: ${t.base}`],
      find: `${t.subject} as the subject`,
      principle: "Algebraic rearrangement: whatever you do to one side of an equation, you must do to the other.",
      formula: t.base,
      whyFormula: "We rearrange the same physical relationship — the physics doesn't change, only which variable is isolated.",
      substitution: "Apply inverse operations to isolate the required variable.",
      calculation: [`${t.base}  ⟹  ${t.rearranged}`],
      units: "depends on the variable",
      finalAnswer: t.rearranged,
      meaning: "Being able to rearrange formulas fluently lets you solve for ANY unknown, not just the one the formula is 'set up' for.",
    },
    commonMistakes: ["Forgetting to apply an inverse operation to BOTH sides.", "Losing a square root or square when rearranging."],
    tags: ["formula", "rearrangement", "generated"],
  };
}

export type GeneratorKey =
  | "suvat-v"
  | "suvat-s"
  | "newton"
  | "momentum"
  | "kinetic-energy"
  | "circular"
  | "moments"
  | "units"
  | "rearrangement";

export const GENERATORS: Record<GeneratorKey, (d: Difficulty) => Question> = {
  "suvat-v": genSuvatVUAT,
  "suvat-s": genSuvatDisplacement,
  newton: genNewtonSecondLaw,
  momentum: genMomentumConservation,
  "kinetic-energy": genKineticEnergy,
  circular: genCentripetalForce,
  moments: genMoments,
  units: genUnitConversion,
  rearrangement: genRearrangement,
};

export function generateQuestion(key: GeneratorKey, difficulty: Difficulty = "medium"): Question {
  return GENERATORS[key](difficulty);
}

export function generateBatch(key: GeneratorKey, count: number, difficulty: Difficulty = "medium"): Question[] {
  return Array.from({ length: count }, () => generateQuestion(key, difficulty));
}

export const TOPIC_GENERATORS: Record<string, GeneratorKey[]> = {
  "quantities-units": ["units"],
  suvat: ["suvat-v", "suvat-s"],
  "newton-laws": ["newton"],
  "momentum-impulse": ["momentum"],
  "work-energy-power": ["kinetic-energy"],
  "circular-motion": ["circular"],
  "moments-equilibrium": ["moments"],
};

export function generateForTopic(topicId: string, difficulty: Difficulty = "medium"): Question | null {
  const keys = TOPIC_GENERATORS[topicId];
  if (!keys || keys.length === 0) return null;
  return generateQuestion(pick(keys), difficulty);
}
