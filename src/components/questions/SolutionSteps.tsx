import type { SolutionStep } from "@/lib/types";
import WhyButton from "@/components/common/WhyButton";

export default function SolutionSteps({ solution }: { solution: SolutionStep }) {
  return (
    <div className="space-y-4 text-sm">
      <StepBlock title="GIVEN">
        <ul className="list-disc space-y-0.5 pl-5">
          {solution.given.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </StepBlock>

      <StepBlock title="FIND">{solution.find}</StepBlock>

      <StepBlock title="PHYSICS PRINCIPLE">{solution.principle}</StepBlock>

      <StepBlock title="FORMULA">
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded bg-slate-900 px-2 py-1 font-mono text-amber-300">{solution.formula}</code>
          <WhyButton explanation={solution.whyFormula} />
        </div>
      </StepBlock>

      <StepBlock title="SUBSTITUTION">
        <code className="rounded bg-slate-100 px-2 py-1 font-mono">{solution.substitution}</code>
      </StepBlock>

      <StepBlock title="CALCULATION">
        <ol className="list-decimal space-y-1 pl-5">
          {solution.calculation.map((c, i) => (
            <li key={i} className="font-mono text-slate-800">
              {c}
            </li>
          ))}
        </ol>
      </StepBlock>

      <StepBlock title="UNITS CHECK">{solution.units}</StepBlock>

      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-emerald-700">Final Answer</div>
        <div className="mt-1 text-lg font-extrabold text-emerald-800">{solution.finalAnswer}</div>
      </div>

      <StepBlock title="PHYSICAL MEANING">{solution.meaning}</StepBlock>
    </div>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-slate-800">{children}</div>
    </div>
  );
}
