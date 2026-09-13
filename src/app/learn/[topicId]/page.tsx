"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getTopicById, getAreaById } from "@/lib/content/areas";
import { getLessonByTopic } from "@/lib/content/lessons";
import { getFormulasByTopic } from "@/lib/content/formulas";
import { getQuestionsByTopic } from "@/lib/questions/bank";
import { generateForTopic } from "@/lib/questions/generators";
import IDontUnderstandButton from "@/components/common/IDontUnderstandButton";
import SolutionSteps from "@/components/questions/SolutionSteps";
import QuestionCard from "@/components/questions/QuestionCard";
import type { Difficulty } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

import VectorSimulator from "@/components/simulations/VectorSimulator";
import ProjectileSimulator from "@/components/simulations/ProjectileSimulator";
import CircularMotionSimulator from "@/components/simulations/CircularMotionSimulator";
import CollisionSimulator from "@/components/simulations/CollisionSimulator";
import BeamBalanceSimulator from "@/components/simulations/BeamBalanceSimulator";
import SHMSimulator from "@/components/simulations/SHMSimulator";
import ElasticityGrapher from "@/components/simulations/ElasticityGrapher";
import OrbitalSimulator from "@/components/simulations/OrbitalSimulator";
import FBDBuilder from "@/components/simulations/FBDBuilder";
import { TOPICS } from "@/lib/content/areas";

const SIMULATION_MAP: Record<string, React.ComponentType> = {
  "vector-simulator": VectorSimulator,
  "suvat-explorer": ProjectileSimulator,
  "graph-trainer": ProjectileSimulator,
  "projectile-simulator": ProjectileSimulator,
  "fbd-builder": FBDBuilder,
  "collision-simulator": CollisionSimulator,
  "circular-motion-simulator": CircularMotionSimulator,
  "orbital-simulator": OrbitalSimulator,
  "beam-balance-simulator": BeamBalanceSimulator,
  "shm-simulator": SHMSimulator,
  "elasticity-grapher": ElasticityGrapher,
};

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard", "exam"];

export default function TopicLessonPage() {
  const params = useParams<{ topicId: string }>();
  const router = useRouter();
  const topicId = params.topicId;
  const topic = getTopicById(topicId);
  const area = topic ? getAreaById(topic.areaId) : undefined;
  const lesson = getLessonByTopic(topicId);
  const formulas = getFormulasByTopic(topicId);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("easy");
  const [miniTestQuestion, setMiniTestQuestion] = useState(0);

  const questionsForDifficulty = useMemo(() => {
    if (!topic) return [];
    const curated = getQuestionsByTopic(topic.id).filter((q) => q.difficulty === activeDifficulty);
    if (curated.length > 0) return curated;
    const generated = generateForTopic(topic.id, activeDifficulty);
    return generated ? [generated] : [];
  }, [topic, activeDifficulty]);

  const scenarioQuestions = useMemo(
    () => (topic ? getQuestionsByTopic(topic.id).filter((q) => q.scenario || q.type === "scenario") : []),
    [topic]
  );

  const miniTest = useMemo(() => {
    if (!topic) return [];
    const all = getQuestionsByTopic(topic.id);
    return all.slice(0, Math.min(4, all.length));
  }, [topic]);

  const topicIndex = TOPICS.findIndex((t) => t.id === topicId);
  const prevTopic = topicIndex > 0 ? TOPICS[topicIndex - 1] : null;
  const nextTopic = topicIndex >= 0 && topicIndex < TOPICS.length - 1 ? TOPICS[topicIndex + 1] : null;

  if (!topic || !lesson) {
    return (
      <main className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Topic not found.</p>
        <Link href="/learn" className="mt-3 inline-block text-blue-700 underline">
          Back to Learn
        </Link>
      </main>
    );
  }

  const SimulationComponent = lesson.simulationId ? SIMULATION_MAP[lesson.simulationId] : undefined;

  return (
    <main className="flex flex-col gap-8 pb-16">
      <div>
        <button onClick={() => router.push("/learn")} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all topics
        </button>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{topic.title}</h1>
          {topic.status === "extension" && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
              Extension / Further Study
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">{area?.title}</p>
      </div>

      <LessonBlock title="1. Simple Explanation">
        <p>{lesson.simpleExplanation}</p>
      </LessonBlock>

      <LessonBlock title="2. Physics Definition">
        <p className="rounded-lg bg-slate-900 p-3 font-medium text-slate-100">{lesson.definition}</p>
      </LessonBlock>

      <LessonBlock title="3. Real-Life Explanation">
        <p>{lesson.realLifeExplanation}</p>
      </LessonBlock>

      <div>
        <IDontUnderstandButton topicId={topic.id} />
      </div>

      {formulas.length > 0 && (
        <LessonBlock title="4. Formulae &amp; Symbols">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {formulas.map((f) => (
              <div key={f.id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-mono text-sm font-bold text-blue-700">{f.expression}</p>
                <ul className="mt-2 space-y-0.5 text-xs text-slate-600">
                  {f.variables.map((v) => (
                    <li key={v.symbol}>
                      <span className="font-mono font-semibold">{v.symbol}</span> = {v.meaning} ({v.unit})
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ {f.whenToUse}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/formulas" className="mt-2 inline-block text-xs font-semibold text-blue-700 hover:underline">
            View full Formula Bank entries →
          </Link>
        </LessonBlock>
      )}

      {lesson.derivation && (
        <LessonBlock title="5. Derivation">
          <ol className="list-decimal space-y-2 pl-5">
            {lesson.derivation.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </LessonBlock>
      )}

      <LessonBlock title="6. Worked Example(s)">
        <div className="space-y-4">
          {lesson.workedExamples.map((ex, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <h4 className="font-bold text-slate-800">{ex.title}</h4>
              <div className="mt-3">
                <SolutionSteps solution={ex.solution} />
              </div>
            </div>
          ))}
        </div>
      </LessonBlock>

      {SimulationComponent && (
        <LessonBlock title="7. Interactive Demonstration">
          <SimulationComponent />
        </LessonBlock>
      )}

      <LessonBlock title="8–11. Practice Questions (Easy → Exam)">
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_ORDER.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDifficulty(d)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase ${
                activeDifficulty === d ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-4">
          {questionsForDifficulty.length > 0 ? (
            questionsForDifficulty.map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)
          ) : (
            <p className="text-sm text-slate-500">No questions of this difficulty yet for this topic — try another level.</p>
          )}
        </div>
      </LessonBlock>

      {scenarioQuestions.length > 0 && (
        <LessonBlock title="12–13. Scenario &amp; Examination Questions">
          <div className="space-y-4">
            {scenarioQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        </LessonBlock>
      )}

      <LessonBlock title="14. Common Mistakes">
        <ul className="list-disc space-y-1 pl-5 text-orange-800">
          {lesson.commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </LessonBlock>

      <LessonBlock title="15. Summary">
        <ul className="list-disc space-y-1 pl-5">
          {lesson.summary.map((s, i) => (
            <li key={i} className="font-medium text-slate-800">
              {s}
            </li>
          ))}
        </ul>
      </LessonBlock>

      {miniTest.length > 0 && (
        <LessonBlock title="16. Mini-Test">
          <p className="text-sm text-slate-600">
            Question {miniTestQuestion + 1} of {miniTest.length}
          </p>
          <div className="mt-3">
            <QuestionCard
              question={miniTest[miniTestQuestion]}
              index={miniTestQuestion}
              onNext={miniTestQuestion < miniTest.length - 1 ? () => setMiniTestQuestion((i) => i + 1) : undefined}
            />
          </div>
        </LessonBlock>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        {prevTopic ? (
          <Link href={`/learn/${prevTopic.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
            <ArrowLeft className="h-4 w-4" /> {prevTopic.title}
          </Link>
        ) : (
          <span />
        )}
        {nextTopic && (
          <Link href={`/learn/${nextTopic.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
            {nextTopic.title} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </main>
  );
}

function LessonBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-slate-900">{title}</h2>
      <div className="prose-physics space-y-2 text-sm text-slate-700">{children}</div>
      {title.startsWith("4.") && null}
    </section>
  );
}
