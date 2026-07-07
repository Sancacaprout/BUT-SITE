"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { Correction } from "@/content/week-1";

export function CorrectionPanel({
  correction,
  defaultRevealed = false,
  highlighted = false,
}: {
  correction: Correction;
  defaultRevealed?: boolean;
  highlighted?: boolean;
}) {
  const [revealed, setRevealed] = useState(defaultRevealed);

  return (
    <article
      id={correction.id}
      className={`scroll-mt-24 rounded-lg border bg-surface p-5 shadow-sm ${
        highlighted ? "border-accent ring-2 ring-accent/20" : "border-line"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            Semaine {correction.week} - Jour {correction.day}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">{correction.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-white hover:bg-ink-strong"
        >
          {revealed ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          {revealed ? "Masquer" : "Révéler"}
        </button>
      </div>

      {revealed ? (
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-semibold text-foreground">Solution</p>
            <pre className="mt-2 overflow-x-auto rounded-md border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
              <code>{correction.solution}</code>
            </pre>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-md bg-surface-muted p-4">
              <p className="text-sm font-semibold text-foreground">Pourquoi ça marche</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {correction.explanation}
              </p>
            </section>
            <section className="rounded-md bg-surface-muted p-4">
              <p className="text-sm font-semibold text-foreground">Raisonnement</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {correction.reasoning}
              </p>
            </section>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <section>
              <p className="text-sm font-semibold text-danger">Pièges fréquents</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {correction.commonTraps.map((trap) => (
                  <li key={trap}>• {trap}</li>
                ))}
              </ul>
            </section>
            <section>
              <p className="text-sm font-semibold text-foreground">Comment tester</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {correction.howToTest.map((test) => (
                  <li key={test}>• {test}</li>
                ))}
              </ul>
            </section>
            {correction.variant ? (
              <section>
                <p className="text-sm font-semibold text-foreground">Variante</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {correction.variant}
                </p>
              </section>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-amber-soft px-4 py-3 text-sm text-foreground">
          Correction masquée. Essaie avant de comparer avec la solution.
        </p>
      )}
    </article>
  );
}
