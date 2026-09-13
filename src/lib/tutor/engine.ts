import { TOPICS } from "@/lib/content/areas";
import { getLessonByTopic } from "@/lib/content/lessons";
import { getSimplified } from "@/lib/content/simplify";
import { searchGlossary } from "@/lib/content/glossary";
import { getFormulasByTopic, searchFormulas } from "@/lib/content/formulas";
import { getQuestionsByTopic } from "@/lib/questions/bank";
import { generateForTopic } from "@/lib/questions/generators";
import { gradeAnswer, diagnoseMistake } from "@/lib/utils/grading";
import type { Question } from "@/lib/types";

export interface TutorContext {
  currentTopicId: string | null;
  pendingQuestion: Question | null;
  difficultyBias: number; // -1 easier, 0 normal, +1 harder
}

export const INITIAL_TUTOR_CONTEXT: TutorContext = {
  currentTopicId: null,
  pendingQuestion: null,
  difficultyBias: 0,
};

function findTopicByKeyword(text: string) {
  const t = text.toLowerCase();
  return TOPICS.find(
    (topic) =>
      t.includes(topic.title.toLowerCase()) ||
      t.includes(topic.id.replace(/-/g, " ")) ||
      topic.subtopics.some((s) => t.includes(s.toLowerCase()))
  );
}

function pickQuestionForTopic(topicId: string, bias: number): Question | null {
  const curated = getQuestionsByTopic(topicId);
  let pool = curated;
  if (bias < 0) pool = curated.filter((q) => ["beginner", "easy"].includes(q.difficulty));
  if (bias > 0) pool = curated.filter((q) => ["hard", "exam", "challenge"].includes(q.difficulty));
  if (pool.length === 0) pool = curated;
  if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
  return generateForTopic(topicId, bias < 0 ? "easy" : bias > 0 ? "hard" : "medium");
}

export interface TutorReply {
  reply: string;
  context: TutorContext;
  question?: Question;
}

export function getTutorReply(rawInput: string, context: TutorContext): TutorReply {
  const input = rawInput.trim();
  const lower = input.toLowerCase();

  // 1. If there's a pending question, treat this message as an answer attempt.
  if (context.pendingQuestion) {
    const q = context.pendingQuestion;
    const result = gradeAnswer(q, input);
    if (result.correct) {
      return {
        reply: `✅ Correct! ${q.solution.meaning}\n\nWant another question? Just say "test me" or "give me another question".`,
        context: { ...context, pendingQuestion: null, currentTopicId: q.topicId },
      };
    }
    const diag = diagnoseMistake(q, input);
    return {
      reply: `❌ Not quite. The correct answer is **${q.correctAnswer}**.\n\nLikely issue: ${diag.type.replace(/-/g, " ")} — ${diag.explanation}\n\nFull method:\n${formatSolutionForChat(q)}`,
      context: { ...context, pendingQuestion: null, currentTopicId: q.topicId },
    };
  }

  // 2. "Test me"
  if (/test me|quiz me|give me a question/.test(lower)) {
    const topicId = context.currentTopicId ?? TOPICS[Math.floor(Math.random() * TOPICS.length)].id;
    const q = pickQuestionForTopic(topicId, context.difficultyBias);
    if (!q) {
      return { reply: "I don't have a question ready for that topic yet — try naming another topic first.", context };
    }
    return {
      reply: `Here's a question on **${TOPICS.find((t) => t.id === topicId)?.title}**:\n\n${q.scenario ? `📌 ${q.scenario}\n\n` : ""}${q.prompt}\n\n(Type your answer and I'll check it!)`,
      context: { ...context, currentTopicId: topicId, pendingQuestion: q },
      question: q,
    };
  }

  // 3. "Give me another question"
  if (/another question|next question|more question/.test(lower)) {
    const topicId = context.currentTopicId ?? TOPICS[Math.floor(Math.random() * TOPICS.length)].id;
    const q = pickQuestionForTopic(topicId, context.difficultyBias);
    if (!q) return { reply: "Tell me which topic you'd like a question on first.", context };
    return {
      reply: `${q.scenario ? `📌 ${q.scenario}\n\n` : ""}${q.prompt}`,
      context: { ...context, currentTopicId: topicId, pendingQuestion: q },
      question: q,
    };
  }

  // 4. "Make it easier" / "make it harder"
  if (/make it easier|too hard|simpler please/.test(lower)) {
    const newContext = { ...context, difficultyBias: Math.max(-1, context.difficultyBias - 1) };
    if (context.currentTopicId) {
      const simplified = getSimplified(context.currentTopicId);
      if (simplified) {
        return {
          reply: `Let's slow down. Here's a simpler way to think about it:\n\n🔗 ${simplified.analogy}\n\n🌍 ${simplified.everyday}\n\n🔢 ${simplified.easierNumbers}`,
          context: newContext,
        };
      }
    }
    return { reply: "Okay, I'll use easier questions and simpler language from now on. What topic should we focus on?", context: newContext };
  }

  if (/make it harder|too easy|challenge me/.test(lower)) {
    const newContext = { ...context, difficultyBias: Math.min(1, context.difficultyBias + 1) };
    return { reply: "Alright — let's push further. I'll give you harder, exam-style questions from now on. Say 'test me' when ready.", context: newContext };
  }

  // 5. "Explain like I'm new / completely new"
  if (/completely new|i'?m new|explain simply|dumb it down|explain like/.test(lower)) {
    const topicId = context.currentTopicId ?? findTopicByKeyword(lower)?.id ?? null;
    if (topicId) {
      const simplified = getSimplified(topicId);
      const lesson = getLessonByTopic(topicId);
      if (simplified) {
        return {
          reply: `Let's start from scratch on **${TOPICS.find((t) => t.id === topicId)?.title}**:\n\n${lesson?.simpleExplanation ?? ""}\n\n🔗 Think of it like this: ${simplified.analogy}\n\n🌍 ${simplified.everyday}`,
          context: { ...context, currentTopicId: topicId },
        };
      }
    }
    return { reply: "Sure! Which topic should I explain from the very beginning? (e.g. 'explain vectors', 'explain momentum')", context };
  }

  // 6. "Why did you use sine/cosine" or general WHY questions
  if (/why.*(sine|sin\b)/.test(lower)) {
    return {
      reply: "We use sine for whichever component is OPPOSITE the given angle in the vector triangle, and cosine for the component ADJACENT to the angle. If the angle is measured from the horizontal, the vertical component uses sine, and the horizontal component uses cosine.",
      context,
    };
  }
  if (/why.*negative|why is acceleration negative/.test(lower)) {
    return {
      reply: "Acceleration is negative when it points in the OPPOSITE direction to whichever direction you defined as positive. It doesn't necessarily mean 'slowing down' — a negative acceleration on an object already moving in the negative direction actually means it's speeding up! Always check your chosen positive direction first.",
      context,
    };
  }
  if (/why.*formula|where did.*formula.*come from|derive/.test(lower)) {
    const topicId = context.currentTopicId ?? findTopicByKeyword(lower)?.id;
    const lesson = topicId ? getLessonByTopic(topicId) : undefined;
    if (lesson?.derivation) {
      return { reply: `Here's where that formula comes from, step by step:\n\n${lesson.derivation.map((d, i) => `${i + 1}. ${d}`).join("\n")}`, context: { ...context, currentTopicId: topicId ?? context.currentTopicId } };
    }
    return { reply: "Tell me which formula or topic you'd like derived, e.g. 'why does v=u+at work' or 'derive the SUVAT equations'.", context };
  }
  if (lower.startsWith("why")) {
    const formulaMatches = searchFormulas(lower.replace("why", ""));
    if (formulaMatches.length > 0) {
      const f = formulaMatches[0];
      return { reply: `${f.name} (${f.expression}): ${f.whenToUse} It works because ${f.commonMistake.toLowerCase().includes("forgetting") ? "it directly represents the physical relationship being tested — just be careful not to fall into this trap: " + f.commonMistake : f.commonMistake}`, context };
    }
  }

  // 7. Explicit "explain <topic>" or glossary term match
  const topicMatch = findTopicByKeyword(lower);
  if (topicMatch) {
    const lesson = getLessonByTopic(topicMatch.id);
    const formulas = getFormulasByTopic(topicMatch.id);
    return {
      reply: `**${topicMatch.title}**\n\n${lesson?.simpleExplanation ?? topicMatch.blurb}\n\n${
        formulas.length > 0 ? `Key formula: ${formulas[0].expression}\n\n` : ""
      }Want a question on this? Say "test me". Want it simpler? Say "make it easier".`,
      context: { ...context, currentTopicId: topicMatch.id },
    };
  }

  const glossaryMatch = searchGlossary(lower).find((g) => lower.includes(g.term.toLowerCase()));
  if (glossaryMatch) {
    return {
      reply: `**${glossaryMatch.term}**\n\nSimple: ${glossaryMatch.simple}\n\nFormal definition: ${glossaryMatch.formal}${
        glossaryMatch.formula ? `\n\nFormula: ${glossaryMatch.formula}` : ""
      }${glossaryMatch.unit ? ` (${glossaryMatch.unit})` : ""}\n\nExample: ${glossaryMatch.example}`,
      context,
    };
  }

  // 8. Greeting / fallback
  if (/^(hi|hello|hey)\b/.test(lower)) {
    return {
      reply: "Hello! I'm your Mechanics tutor. Ask me to explain a topic (e.g. 'explain moments'), ask 'why' about a formula, say 'test me', or say 'make it easier/harder' anytime.",
      context,
    };
  }

  return {
    reply:
      "I'm not sure exactly what you're asking, but I can help if you: name a topic ('explain circular motion'), ask 'why' something works, say 'test me', 'give me another question', or 'make it easier/harder'. You can also browse the Glossary or Formula Bank for quick lookups.",
    context,
  };
}

function formatSolutionForChat(q: Question): string {
  const s = q.solution;
  return [
    `GIVEN: ${s.given.join("; ")}`,
    `FORMULA: ${s.formula}`,
    `SUBSTITUTION: ${s.substitution}`,
    `CALCULATION: ${s.calculation.join(" → ")}`,
    `FINAL ANSWER: ${s.finalAnswer}`,
    `MEANING: ${s.meaning}`,
  ].join("\n");
}
