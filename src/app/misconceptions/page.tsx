import { MISCONCEPTIONS } from "@/lib/content/misconceptions";
import { XCircle, CheckCircle2 } from "lucide-react";

export default function MisconceptionsPage() {
  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">⚠️ Common Misconceptions</h1>
        <p className="mt-1 text-sm text-slate-600">
          These are the mistakes Senior 6 students make most often. Read each one carefully — recognising them is
          half the battle.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MISCONCEPTIONS.map((m) => (
          <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{m.wrong}</p>
            </div>
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{m.right}</p>
            </div>
            <p className="mt-3 text-sm text-slate-700">{m.explanation}</p>
            <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs italic text-slate-600">Example: {m.example}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
