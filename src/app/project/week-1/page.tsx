"use client";

import { Eye, EyeOff, FolderTree, ListChecks } from "lucide-react";
import { useState } from "react";
import { week1 } from "@/content/week-1";

export default function ProjectWeekOnePage() {
  const [revealed, setRevealed] = useState(false);
  const project = week1.project;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Mini-projet semaine 1</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">{project.title}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          {project.brief}
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Fonctionnalités obligatoires" items={project.requiredFeatures} />
        <Panel title="Bonus" items={project.bonusFeatures} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FolderTree size={18} aria-hidden="true" />
            Structure conseillée
          </div>
          <pre className="mt-4 overflow-x-auto rounded-md border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
            <code>{project.fileStructure}</code>
          </pre>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListChecks size={18} aria-hidden="true" />
            Étapes
          </div>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {project.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-accent-soft font-mono text-xs text-accent-strong">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Critères de réussite" items={project.successCriteria} />
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Grille d’évaluation</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-line">
            <table className="w-full text-left text-sm">
              <tbody>
                {project.grading.map((row) => (
                  <tr key={row.criterion} className="border-t border-line first:border-t-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.criterion}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Solution exemple</p>
            <h2 className="text-xl font-semibold text-foreground">Correction séparée</h2>
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
          <pre className="mt-4 overflow-x-auto rounded-md border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
            <code>{project.solution}</code>
          </pre>
        ) : (
          <p className="mt-4 rounded-md bg-amber-soft px-4 py-3 text-sm text-foreground">
            Commence par ton menu, puis chaque fonction séparément. La solution est là pour comparer, pas pour démarrer.
          </p>
        )}
      </section>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
