"use client";

import { Calculator, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Week } from "@/content/week-1";
import { useProgress } from "@/lib/progress/progress-store";

export function CheckpointClient({ week }: { week: Week }) {
  const { state, saveNote } = useProgress();
  const [points, setPoints] = useState<Record<string, number>>({});
  const total = useMemo(
    () =>
      week.checkpoint.tasks.reduce(
        (sum, task) => sum + Math.min(task.points, Math.max(0, points[task.id] ?? 0)),
        0,
      ),
    [points, week.checkpoint.tasks],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="font-mono text-sm text-accent-strong">Bilan</p>
          <h1 className="mt-2 text-4xl font-semibold text-foreground">{week.checkpoint.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
            Durée conseillée : {week.checkpoint.duration}. Barème total : {week.checkpoint.totalPoints} points.
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calculator size={18} aria-hidden="true" />
            Score actuel
          </div>
          <p className="mt-4 font-mono text-4xl font-semibold text-foreground">
            {total}/{week.checkpoint.totalPoints}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {total >= 70 ? "Seuil de passage atteint." : "Objectif : 70 points ou plus."}
          </p>
        </aside>
      </section>

      <section className="mt-8 space-y-4">
        {week.checkpoint.tasks.map((task) => (
          <article key={task.id} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{task.block}</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{task.title}</h2>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Points</span>
                <input
                  type="number"
                  min={0}
                  max={task.points}
                  value={points[task.id] ?? ""}
                  onChange={(event) =>
                    setPoints((current) => ({
                      ...current,
                      [task.id]: Number(event.target.value),
                    }))
                  }
                  className="h-10 w-20 rounded-md border border-line bg-background px-3 font-mono outline-none focus:border-accent"
                />
                <span className="font-mono text-muted-foreground">/{task.points}</span>
              </label>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{task.statement}</p>
            <textarea
              value={state.notes[`checkpoint-${task.id}`] ?? ""}
              onChange={(event) => saveNote(`checkpoint-${task.id}`, event.target.value)}
              className="mt-4 min-h-28 w-full resize-y rounded-md border border-line bg-background p-3 text-sm leading-6 outline-none focus:border-accent"
              placeholder="Réponse, commandes, code ou explication..."
            />
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 size={18} aria-hidden="true" />
            Critères de passage
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {week.checkpoint.passCriteria.map((criterion) => (
              <li key={criterion}>• {criterion}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Quoi revoir selon les erreurs</h2>
          <div className="mt-3 space-y-3">
            {week.checkpoint.reviewAdvice.map((advice) => (
              <div key={advice.if} className="rounded-md bg-surface-muted p-3 text-sm">
                <p className="font-semibold text-foreground">{advice.if}</p>
                <p className="mt-1 leading-6 text-muted-foreground">{advice.then}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
