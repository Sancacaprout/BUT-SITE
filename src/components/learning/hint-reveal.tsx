"use client";

import { Lightbulb } from "lucide-react";
import { useProgress } from "@/lib/progress/progress-store";

export function HintReveal({
  exerciseId,
  hints,
}: {
  exerciseId: string;
  hints: string[];
}) {
  const { state, revealHint } = useProgress();
  const visibleCount = state.hints[exerciseId] ?? 0;
  const canReveal = visibleCount < hints.length;

  return (
    <div className="rounded-md border border-line bg-surface-muted p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-foreground">Indices progressifs</p>
        <button
          type="button"
          onClick={() => revealHint(exerciseId, hints.length)}
          disabled={!canReveal}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-contrast transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-muted"
        >
          <Lightbulb size={16} aria-hidden="true" />
          {canReveal ? "Je bloque" : "Tous révélés"}
        </button>
      </div>

      {visibleCount > 0 ? (
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          {hints.slice(0, visibleCount).map((hint, index) => (
            <li key={hint} className="rounded-md bg-surface px-3 py-2">
              <span className="font-mono text-xs text-accent">Indice {index + 1}</span>
              <span className="block text-foreground">{hint}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Essaie d’abord sans aide. Le premier indice ne donne qu’une direction.
        </p>
      )}
    </div>
  );
}
