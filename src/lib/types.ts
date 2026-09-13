// Core shared types for the Senior 6 Mechanics Master Lab

export type Difficulty =
  | "beginner"
  | "easy"
  | "medium"
  | "hard"
  | "exam"
  | "challenge";

export type QuestionType =
  | "mcq"
  | "structured"
  | "calculation"
  | "conceptual"
  | "graph"
  | "diagram"
  | "experimental"
  | "scenario"
  | "multistep"
  | "mixed";

export interface SolutionStep {
  given: string[];
  find: string;
  principle: string;
  formula: string;
  whyFormula: string;
  substitution: string;
  calculation: string[];
  units: string;
  finalAnswer: string;
  meaning: string;
}

export interface Hint {
  hint1: string;
  hint2: string;
  hint3: string;
}

export interface Question {
  id: string;
  topicId: string;
  subtopic: string;
  difficulty: Difficulty;
  type: QuestionType;
  scenario?: string;
  prompt: string;
  choices?: string[];
  correctIndex?: number;
  correctAnswer: string;
  tolerance?: number; // for numeric answers
  hints: Hint;
  solution: SolutionStep;
  commonMistakes: string[];
  tags?: string[];
}

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit: string;
}

export interface Formula {
  id: string;
  topicId: string;
  name: string;
  expression: string;
  variables: FormulaVariable[];
  siUnitsNote?: string;
  conditions: string[];
  rearrangements: string[];
  example: string;
  commonMistake: string;
  whenToUse: string;
  whenNotToUse: string;
  tags?: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  simple: string;
  formal: string;
  formula?: string;
  unit?: string;
  example: string;
}

export interface Misconception {
  id: string;
  title: string;
  wrong: string;
  right: string;
  explanation: string;
  example: string;
}

export interface LessonSection {
  heading: string;
  body: string[];
}

export interface WorkedExample {
  title: string;
  solution: SolutionStep;
}

export interface Lesson {
  topicId: string;
  simpleExplanation: string;
  definition: string;
  realLifeExplanation: string;
  formulaIds: string[];
  derivation?: string[];
  workedExamples: WorkedExample[];
  commonMistakes: string[];
  summary: string[];
  simulationId?: string;
}

export type CurriculumStatus = "core" | "extension";

export interface Topic {
  id: string;
  areaId: string;
  title: string;
  icon: string;
  status: CurriculumStatus;
  blurb: string;
  subtopics: string[];
}

export interface Area {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export type MasteryLevel =
  | "Needs serious revision"
  | "Developing"
  | "Improving"
  | "Strong"
  | "Mastered";

export function masteryFromPercent(pct: number): MasteryLevel {
  if (pct >= 90) return "Mastered";
  if (pct >= 75) return "Strong";
  if (pct >= 60) return "Improving";
  if (pct >= 40) return "Developing";
  return "Needs serious revision";
}

export function masteryColor(level: MasteryLevel): string {
  switch (level) {
    case "Mastered":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "Strong":
      return "text-teal-600 bg-teal-50 border-teal-200";
    case "Improving":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "Developing":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-rose-600 bg-rose-50 border-rose-200";
  }
}
