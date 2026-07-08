"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { RevisionCard } from "@/content/week-1";
import { useProgress } from "@/lib/progress/progress-store";

export function ReviewClient({ cards }: { cards: RevisionCard[] }) {
  const { setExerciseStatus } = useProgress();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = cards[index % cards.length];

  const grouped = useMemo(
    () =>
      cards.reduce<Record<string, number>>((acc, item) => {
        acc[item.skill] = (acc[item.skill] ?? 0) + 1;
        return acc;
      }, {}),
    [cards],
  );

  function next() {
    setIndex((current) => (current + 1) % cards.length);
    setRevealed(false);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Mode révision</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Cartes rapides</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Réponds mentalement avant de révéler. Les notions non sues reviennent dans la liste de travail.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-lg border border-line bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs text-accent-strong">
              {card.skill}
            </span>
            <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {index + 1}/{cards.length}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">{card.title}</h2>
          <p className="mt-5 rounded-md bg-surface-muted p-5 text-lg leading-8 text-foreground">
            {revealed ? card.back : card.front}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRevealed((current) => !current)}
              className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-sm font-medium text-ink-contrast hover:bg-ink-strong"
            >
              {revealed ? "Cacher" : "Révéler"}
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-success/35 bg-success-soft px-4 text-sm font-medium text-success-strong hover:border-success"
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              Je sais
            </button>
            <button
              type="button"
              onClick={() => {
                setExerciseStatus(`review-${card.id}`, "review");
                next();
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-warning/35 bg-warning-soft px-4 text-sm font-medium text-warning-strong hover:border-warning"
            >
              <RotateCcw size={17} aria-hidden="true" />
              Je ne sais pas
            </button>
          </div>
        </article>

        <aside className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Notions couvertes</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(grouped).map(([skill, count]) => (
              <div key={skill} className="flex items-center justify-between rounded-md bg-surface-muted px-3 py-2 text-sm">
                <span className="text-foreground">{skill}</span>
                <span className="font-mono text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
