"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MasteryLevel } from "@/lib/types";
import { masteryFromPercent } from "@/lib/types";
import type { MistakeType } from "@/lib/utils/grading";

export interface TopicStat {
  attempted: number;
  correct: number;
  lastPracticed: string | null;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  topicId: string;
  prompt: string;
  studentAnswer: string;
  correctAnswer: string;
  mistakeType: MistakeType;
  explanation: string;
  timestamp: string;
  resolved: boolean;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  durationMin: number;
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export interface DailyChallengeState {
  date: string;
  completedIds: string[];
  correctIds: string[];
}

export type ConfidenceLevel = "none" | "basics" | "concepts-struggle-calc" | "exam-prep" | "test-me";

export interface OnboardingState {
  completed: boolean;
  confidence: ConfidenceLevel | null;
}

export const BADGES: { id: string; label: string; description: string; icon: string }[] = [
  { id: "first-10", label: "First 10 Questions", icon: "🏆", description: "Answered 10 practice questions." },
  { id: "kinematics-master", label: "Kinematics Master", icon: "⚡", description: "80%+ accuracy in Kinematics topics with 10+ attempts." },
  { id: "forces-expert", label: "Forces Expert", icon: "💪", description: "80%+ accuracy in Newton's Laws/Friction with 10+ attempts." },
  { id: "momentum-master", label: "Momentum Master", icon: "🎯", description: "80%+ accuracy in Momentum & Impulse with 10+ attempts." },
  { id: "projectile-pro", label: "Projectile Pro", icon: "🚀", description: "80%+ accuracy in Projectile Motion with 5+ attempts." },
  { id: "energy-engineer", label: "Energy Engineer", icon: "⚙️", description: "80%+ accuracy in Work, Energy & Power with 10+ attempts." },
  { id: "gravity-guru", label: "Gravity Guru", icon: "🌍", description: "80%+ accuracy in Gravitation with 5+ attempts." },
  { id: "circular-champion", label: "Circular Motion Champion", icon: "🔄", description: "80%+ accuracy in Circular Motion with 5+ attempts." },
  { id: "mechanics-master", label: "Mechanics Master", icon: "🏅", description: "75%+ overall accuracy across all topics with 100+ attempts." },
];

interface ProgressState {
  topicStats: Record<string, TopicStat>;
  mistakes: MistakeRecord[];
  xp: number;
  streakCurrent: number;
  streakLongest: number;
  lastActiveDate: string | null;
  badges: string[];
  examResults: ExamResult[];
  diagnostic: Record<string, number> | null;
  onboarding: OnboardingState;
  daily: DailyChallengeState | null;

  recordAttempt: (topicId: string, correct: boolean, xpGain?: number) => void;
  addMistake: (m: Omit<MistakeRecord, "id" | "timestamp" | "resolved">) => void;
  resolveMistake: (id: string) => void;
  saveExamResult: (r: Omit<ExamResult, "id" | "date">) => void;
  setDiagnostic: (results: Record<string, number>) => void;
  setOnboarding: (c: ConfidenceLevel) => void;
  touchStreak: () => void;
  ensureDaily: (ids: string[]) => void;
  completeDailyQuestion: (id: string, correct: boolean) => void;
  resetProgress: () => void;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeBadges(state: ProgressState): string[] {
  const earned = new Set(state.badges);
  const totalAttempted = Object.values(state.topicStats).reduce((s, t) => s + t.attempted, 0);
  const totalCorrect = Object.values(state.topicStats).reduce((s, t) => s + t.correct, 0);

  if (totalAttempted >= 10) earned.add("first-10");

  const pctFor = (topicIds: string[]) => {
    let attempted = 0;
    let correct = 0;
    for (const id of topicIds) {
      const t = state.topicStats[id];
      if (t) {
        attempted += t.attempted;
        correct += t.correct;
      }
    }
    return { attempted, pct: attempted > 0 ? (correct / attempted) * 100 : 0 };
  };

  const kin = pctFor(["kinematics-basics", "suvat", "motion-graphs"]);
  if (kin.attempted >= 10 && kin.pct >= 80) earned.add("kinematics-master");

  const forces = pctFor(["newton-laws", "friction", "free-body-diagrams"]);
  if (forces.attempted >= 10 && forces.pct >= 80) earned.add("forces-expert");

  const momentum = pctFor(["momentum-impulse"]);
  if (momentum.attempted >= 10 && momentum.pct >= 80) earned.add("momentum-master");

  const projectile = pctFor(["projectiles"]);
  if (projectile.attempted >= 5 && projectile.pct >= 80) earned.add("projectile-pro");

  const energy = pctFor(["work-energy-power"]);
  if (energy.attempted >= 10 && energy.pct >= 80) earned.add("energy-engineer");

  const gravity = pctFor(["gravitation-fields"]);
  if (gravity.attempted >= 5 && gravity.pct >= 80) earned.add("gravity-guru");

  const circular = pctFor(["circular-motion"]);
  if (circular.attempted >= 5 && circular.pct >= 80) earned.add("circular-champion");

  if (totalAttempted >= 100 && totalAttempted > 0 && (totalCorrect / totalAttempted) * 100 >= 75) {
    earned.add("mechanics-master");
  }

  return Array.from(earned);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      topicStats: {},
      mistakes: [],
      xp: 0,
      streakCurrent: 0,
      streakLongest: 0,
      lastActiveDate: null,
      badges: [],
      examResults: [],
      diagnostic: null,
      onboarding: { completed: false, confidence: null },
      daily: null,

      recordAttempt: (topicId, correct, xpGain) => {
        set((state) => {
          const existing = state.topicStats[topicId] ?? { attempted: 0, correct: 0, lastPracticed: null };
          const updated: TopicStat = {
            attempted: existing.attempted + 1,
            correct: existing.correct + (correct ? 1 : 0),
            lastPracticed: new Date().toISOString(),
          };
          const newState = {
            ...state,
            topicStats: { ...state.topicStats, [topicId]: updated },
            xp: state.xp + (xpGain ?? (correct ? 10 : 2)),
          };
          newState.badges = computeBadges(newState as ProgressState);
          return newState;
        });
        get().touchStreak();
      },

      addMistake: (m) => {
        set((state) => ({
          mistakes: [
            {
              ...m,
              id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: new Date().toISOString(),
              resolved: false,
            },
            ...state.mistakes,
          ].slice(0, 200),
        }));
      },

      resolveMistake: (id) => {
        set((state) => ({
          mistakes: state.mistakes.map((m) => (m.id === id ? { ...m, resolved: true } : m)),
        }));
      },

      saveExamResult: (r) => {
        set((state) => ({
          examResults: [
            { ...r, id: `exam-${Date.now()}`, date: new Date().toISOString() },
            ...state.examResults,
          ].slice(0, 50),
        }));
      },

      setDiagnostic: (results) => set({ diagnostic: results }),

      setOnboarding: (c) => set({ onboarding: { completed: true, confidence: c } }),

      touchStreak: () => {
        const today = todayStr();
        set((state) => {
          if (state.lastActiveDate === today) return state;
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newCurrent = state.lastActiveDate === yesterday ? state.streakCurrent + 1 : 1;
          return {
            lastActiveDate: today,
            streakCurrent: newCurrent,
            streakLongest: Math.max(state.streakLongest, newCurrent),
          };
        });
      },

      ensureDaily: (ids) => {
        const today = todayStr();
        set((state) => {
          if (state.daily && state.daily.date === today) return state;
          return { daily: { date: today, completedIds: [], correctIds: [] } };
        });
        void ids;
      },

      completeDailyQuestion: (id, correct) => {
        set((state) => {
          if (!state.daily) return state;
          if (state.daily.completedIds.includes(id)) return state;
          return {
            daily: {
              ...state.daily,
              completedIds: [...state.daily.completedIds, id],
              correctIds: correct ? [...state.daily.correctIds, id] : state.daily.correctIds,
            },
          };
        });
      },

      resetProgress: () =>
        set({
          topicStats: {},
          mistakes: [],
          xp: 0,
          streakCurrent: 0,
          streakLongest: 0,
          lastActiveDate: null,
          badges: [],
          examResults: [],
          diagnostic: null,
          onboarding: { completed: false, confidence: null },
          daily: null,
        }),
    }),
    { name: "s6-mechanics-progress" }
  )
);

export function topicMastery(stat: TopicStat | undefined): { pct: number; level: MasteryLevel } {
  if (!stat || stat.attempted === 0) return { pct: 0, level: masteryFromPercent(0) };
  const pct = Math.round((stat.correct / stat.attempted) * 100);
  return { pct, level: masteryFromPercent(pct) };
}
