"use client";

import { useEffect, useRef, useState } from "react";
import { getTutorReply, INITIAL_TUTOR_CONTEXT, type TutorContext } from "@/lib/tutor/engine";
import { Send, Bot, User } from "lucide-react";

interface ChatMessage {
  role: "tutor" | "student";
  text: string;
}

const SUGGESTIONS = [
  "Explain moments",
  "Why is acceleration negative?",
  "Where did v=u+at come from?",
  "Test me",
  "Make it easier",
  "Make it harder",
  "Give me another question",
  "Explain projectile motion like I'm completely new",
];

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "tutor",
      text: "Hi! I'm your Senior 6 Mechanics tutor. Ask me to explain any topic, ask 'why' something works, or say 'test me' to practise. What would you like to work on?",
    },
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState<TutorContext>(INITIAL_TUTOR_CONTEXT);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { role: "student", text: value }]);
    const { reply, context: newContext } = getTutorReply(value, context);
    setContext(newContext);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "tutor", text: reply }]);
    }, 250);
    setInput("");
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-160px)] max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🤖 Ask Your Physics Tutor</h1>
        <p className="mt-1 text-sm text-slate-600">
          A rule-based Mechanics tutor that adapts to what you ask — available anytime, even offline.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-2 ${m.role === "student" ? "flex-row-reverse" : ""}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "tutor" ? "bg-blue-600" : "bg-slate-700"}`}>
              {m.role === "tutor" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
            </div>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                m.role === "tutor" ? "bg-slate-100 text-slate-800" : "bg-blue-600 text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question, e.g. 'Explain centripetal force'…"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button onClick={() => send()} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
