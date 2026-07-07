"use client";

import { Eye, EyeOff, FileText, ListChecks, Trophy } from "lucide-react";
import { useState } from "react";
import type { Week } from "@/content/week-1";

export function ProjectClient({ week }: { week: Week }) {
  const [revealed, setRevealed] = useState(false);
  const project = week.project;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <p className="font-mono text-sm text-accent-strong">Projet semaine {week.weekNumber}</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">{project.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
            {project.brief}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.requiredFeatures.slice(0, 4).map((item) => (
              <div key={item} className="rounded-xl border border-line bg-background p-4">
                <FileText size={18} className="text-accent" aria-hidden="true" />
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-line bg-ink p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ListChecks size={18} aria-hidden="true" />
            Dossier attendu
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-code-foreground">
            <code>{project.fileStructure}</code>
          </pre>
        </aside>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Trophy size={18} aria-hidden="true" />
            Étapes
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.steps.map((step, index) => (
              <li key={step} className="rounded-lg border border-line bg-background p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-xl border border-line bg-amber-soft p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Bonus</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground">
            {project.bonusFeatures.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Grille</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.grading.map((row) => (
              <div key={row.criterion} className="flex items-center justify-between gap-3 rounded-lg bg-surface-muted px-4 py-3">
                <span className="text-sm text-muted-foreground">{row.criterion}</span>
                <span className="font-mono text-sm font-semibold text-foreground">{row.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Réussi si...</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
            {project.successCriteria.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Solution exemple</p>
            <h2 className="text-xl font-semibold text-foreground">À ouvrir après ton essai</h2>
          </div>
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-white hover:bg-ink-strong"
          >
            {revealed ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            {revealed ? "Masquer" : "Révéler"}
          </button>
        </div>
        {revealed ? (
          <pre className="mt-4 max-h-[520px] overflow-auto rounded-lg border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
            <code>{project.solution}</code>
          </pre>
        ) : (
          <p className="mt-4 rounded-lg bg-amber-soft px-4 py-3 text-sm text-foreground">
            Commence par le plan, teste petit à petit, puis compare avec cette solution.
          </p>
        )}
      </section>
    </div>
  );
}
