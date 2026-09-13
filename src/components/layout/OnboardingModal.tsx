"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgressStore, type ConfidenceLevel } from "@/lib/store/progress";

const OPTIONS: { value: ConfidenceLevel; label: string; detail: string }[] = [
  { value: "none", label: "A. I know almost nothing.", detail: "We'll start from the absolute basics — quantities, units and vectors." },
  { value: "basics", label: "B. I know the basics.", detail: "We'll take you through kinematics and forces with plenty of practice." },
  { value: "concepts-struggle-calc", label: "C. I understand concepts but struggle with calculations.", detail: "We'll focus heavily on worked examples and step-by-step calculation practice." },
  { value: "exam-prep", label: "D. I am preparing for exams.", detail: "We'll prioritise exam-style questions, past-paper technique and timed practice." },
  { value: "test-me", label: "E. Test me first.", detail: "We'll start with the full diagnostic test to find your strengths and weaknesses." },
];

export default function OnboardingModal() {
  const [mounted, setMounted] = useState(false);
  const onboarding = useProgressStore((s) => s.onboarding);
  const setOnboarding = useProgressStore((s) => s.setOnboarding);
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !onboarding.completed) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [mounted, onboarding.completed]);

  if (!mounted || !visible) return null;

  function choose(value: ConfidenceLevel) {
    setOnboarding(value);
    setVisible(false);
    if (value === "test-me") router.push("/diagnostic");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How confident are you with Mechanics?</h2>
        <p className="mt-1 text-sm text-slate-600">Your answer helps us personalise your learning path. You can change this anytime.</p>
        <div className="mt-5 flex flex-col gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => choose(opt.value)}
              className="rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="font-semibold text-slate-900">{opt.label}</div>
              <div className="mt-1 text-sm text-slate-600">{opt.detail}</div>
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setVisible(false);
          }}
          className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
