import type { Difficulty, Question } from "@/lib/types";
import { QUESTION_BANK, getQuestionsByTopic } from "./bank";
import { TOPIC_GENERATORS, generateQuestion } from "./generators";

export { QUESTION_BANK, getQuestionsByTopic };
export * from "./generators";

export function getAllTopicIds(): string[] {
  return Array.from(new Set(QUESTION_BANK.map((q) => q.topicId)));
}

/**
 * Returns the curated questions for a topic, plus a number of freshly
 * generated procedural questions if a generator exists for that topic.
 * This is how the app supports a practically unlimited practice pool.
 */
export function getPracticeSet(topicId: string, opts?: { difficulty?: Difficulty; extra?: number }): Question[] {
  const curated = getQuestionsByTopic(topicId).filter((q) => !opts?.difficulty || q.difficulty === opts.difficulty);
  const extra = opts?.extra ?? 6;
  const keys = TOPIC_GENERATORS[topicId] ?? [];
  const generated: Question[] = [];
  if (keys.length > 0) {
    for (let i = 0; i < extra; i++) {
      const key = keys[i % keys.length];
      generated.push(generateQuestion(key, opts?.difficulty ?? "medium"));
    }
  }
  return [...curated, ...generated];
}

export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
  return QUESTION_BANK.filter((q) => q.difficulty === difficulty);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Builds a mixed-topic exam/quiz question set of the requested size. */
export function buildQuestionSet(count: number, opts?: { topicIds?: string[]; difficulties?: Difficulty[] }): Question[] {
  let pool = QUESTION_BANK.slice();
  if (opts?.topicIds && opts.topicIds.length > 0) {
    pool = pool.filter((q) => opts.topicIds!.includes(q.topicId));
  }
  if (opts?.difficulties && opts.difficulties.length > 0) {
    pool = pool.filter((q) => opts.difficulties!.includes(q.difficulty));
  }
  pool = shuffle(pool);
  const result: Question[] = [];
  const topics = Array.from(new Set(QUESTION_BANK.map((q) => q.topicId)));
  let i = 0;
  while (result.length < count && pool.length > 0) {
    result.push(pool[i % pool.length]);
    i++;
    if (i > pool.length * 3) break;
  }
  // Top up with generated questions if the bank is smaller than requested count.
  while (result.length < count) {
    const topicId = topics[Math.floor(Math.random() * topics.length)];
    const keys = TOPIC_GENERATORS[topicId];
    if (keys && keys.length > 0) {
      result.push(generateQuestion(keys[Math.floor(Math.random() * keys.length)], "medium"));
    } else {
      break;
    }
  }
  return shuffle(result).slice(0, count);
}
