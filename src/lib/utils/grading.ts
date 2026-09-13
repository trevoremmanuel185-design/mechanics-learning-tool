import type { Question } from "@/lib/types";

/** Extracts the first signed floating point number found in a string. */
export function extractNumber(text: string): number | null {
  const match = text.replace(/,/g, "").match(/-?\d+(\.\d+)?(e-?\d+)?/i);
  if (!match) return null;
  const n = parseFloat(match[0]);
  return Number.isFinite(n) ? n : null;
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/√/g, "sqrt")
    .replace(/²/g, "^2")
    .replace(/π/g, "pi");
}

export interface GradeResult {
  correct: boolean;
  studentValue: number | null;
  expectedValue: number | null;
}

export function gradeAnswer(question: Question, studentAnswer: string): GradeResult {
  if (typeof question.correctIndex === "number" && question.choices) {
    const idx = question.choices.findIndex(
      (c) => normalizeText(c) === normalizeText(studentAnswer)
    );
    return { correct: idx === question.correctIndex, studentValue: idx, expectedValue: question.correctIndex };
  }

  const expectedNum = extractNumber(question.correctAnswer);
  const studentNum = extractNumber(studentAnswer);

  if (expectedNum !== null && studentNum !== null && question.tolerance !== undefined) {
    const correct = Math.abs(studentNum - expectedNum) <= question.tolerance;
    return { correct, studentValue: studentNum, expectedValue: expectedNum };
  }

  // Fallback: normalized text comparison (for conceptual/rearrangement answers).
  const correct = normalizeText(studentAnswer) === normalizeText(question.correctAnswer);
  return { correct, studentValue: studentNum, expectedValue: expectedNum };
}

export type MistakeType =
  | "wrong-formula"
  | "wrong-unit"
  | "algebra-mistake"
  | "arithmetic-mistake"
  | "sign-error"
  | "vector-error"
  | "incorrect-assumption"
  | "conceptual-misunderstanding"
  | "graph-interpretation"
  | "incorrect-substitution"
  | "unknown";

export interface MistakeDiagnosis {
  type: MistakeType;
  explanation: string;
}

/**
 * Heuristically diagnoses the likely cause of a wrong numeric answer by
 * comparing the student's value with the expected value and checking for
 * common error signatures (sign flip, factor of 2, unit-conversion slip, etc).
 */
export function diagnoseMistake(question: Question, studentAnswer: string): MistakeDiagnosis {
  const expected = extractNumber(question.correctAnswer);
  const given = extractNumber(studentAnswer);

  if (question.choices) {
    return {
      type: "conceptual-misunderstanding",
      explanation:
        "You selected an option that doesn't match the correct physics reasoning. Re-read the definitions involved — this is usually a conceptual mix-up rather than a calculation error.",
    };
  }

  if (expected === null || given === null) {
    return {
      type: "unknown",
      explanation: "We could not automatically compare your answer numerically. Please check your working against the full solution below.",
    };
  }

  if (Math.abs(given + expected) < Math.max(0.001, Math.abs(expected) * 0.02) && expected !== 0) {
    return {
      type: "sign-error",
      explanation: "Your answer has the correct magnitude but the wrong sign. Double-check your choice of positive direction, or a subtraction order (e.g. v−u vs u−v).",
    };
  }

  const ratio = expected !== 0 ? given / expected : null;
  if (ratio !== null) {
    if (Math.abs(ratio - 2) < 0.05) {
      return {
        type: "algebra-mistake",
        explanation: "Your answer is roughly double the correct value — check whether you forgot a factor of ½ (common in KE = ½mv² or E = ½kx²).",
      };
    }
    if (Math.abs(ratio - 0.5) < 0.05) {
      return {
        type: "algebra-mistake",
        explanation: "Your answer is about half the correct value — you may have applied a ½ factor where it wasn't needed, or divided instead of squaring.",
      };
    }
    if (Math.abs(ratio - 3.6) < 0.1) {
      return {
        type: "wrong-unit",
        explanation: "Your answer is off by a factor of 3.6 — this strongly suggests a km/h ↔ m/s conversion slip (remember: divide by 3.6 to go from km/h to m/s).",
      };
    }
    if (Math.abs(ratio - 1000) < 20 || Math.abs(ratio - 0.001) < 0.0002) {
      return {
        type: "wrong-unit",
        explanation: "Your answer is off by a factor of 1000 — check for a kg↔g or km↔m conversion error.",
      };
    }
    if (Math.abs(ratio - 100) < 5 || Math.abs(ratio - 0.01) < 0.002) {
      return {
        type: "wrong-unit",
        explanation: "Your answer is off by a factor of 100 — check for a cm↔m conversion error.",
      };
    }
    if (expected > 0 && Math.abs(given - Math.sqrt(expected)) < Math.max(0.05, expected * 0.02)) {
      return {
        type: "arithmetic-mistake",
        explanation: "It looks like you may have forgotten to square (or square-root) a quantity partway through the calculation.",
      };
    }
  }

  const diff = Math.abs(given - expected);
  if (diff <= Math.max(1, Math.abs(expected) * 0.15)) {
    return {
      type: "arithmetic-mistake",
      explanation: "You are close to the correct answer — this looks like a small arithmetic slip. Recheck your substitution and calculation line by line.",
    };
  }

  return {
    type: "incorrect-substitution",
    explanation: "Your answer is quite far from the expected value. Check that you substituted the correct values into the correct formula, and that you selected the right physics principle for this question.",
  };
}
