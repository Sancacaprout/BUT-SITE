"use client";

import {
  Calculator,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  FolderTree,
  ListChecks,
  Repeat2,
  Sparkles,
  Trophy,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { week1 } from "@/content/week-1";

const featureCards: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: "Moyenne",
    text: "Notes + coefficients.",
    icon: Calculator,
  },
  {
    title: "Conversions",
    text: "Température et durée.",
    icon: Repeat2,
  },
  {
    title: "Minuteur",
    text: "Compte à rebours simple.",
    icon: Clock3,
  },
  {
    title: "Journal",
    text: "Une ligne sauvegardée.",
    icon: FileText,
  },
];

export default function ProjectWeekOnePage() {
  const [revealed, setRevealed] = useState(false);
  const project = week1.project;
  const requiredEssentials = project.requiredFeatures.slice(0, 5);
  const firstSteps = project.steps.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <p className="font-mono text-sm text-accent-strong">Mini-projet semaine 1</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
            {project.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
            Un menu console qui regroupe quatre outils utiles pour réviser et travailler.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-line bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-strong">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {feature.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{feature.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-line bg-ink p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-white/60">Aperçu final</p>
              <h2 className="mt-1 text-xl font-semibold">Menu du programme</h2>
            </div>
            <Wrench size={24} aria-hidden="true" />
          </div>
          <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4 font-mono text-sm leading-7 text-code-foreground">
            <p>1. Moyenne pondérée</p>
            <p>2. Convertir</p>
            <p>3. Lancer un minuteur</p>
            <p>4. Ajouter au journal</p>
            <p>5. Quitter</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Objectif : un programme clair, testable, et agréable à utiliser dans le terminal.
          </p>
        </aside>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListChecks size={18} aria-hidden="true" />
            À faire absolument
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {requiredEssentials.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg bg-surface-muted p-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-success"
                  size={18}
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-line bg-amber-soft p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles size={18} aria-hidden="true" />
            Bonus utiles
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground">
            {project.bonusFeatures.slice(0, 3).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FolderTree size={18} aria-hidden="true" />
            Dossier attendu
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
            <code>{project.fileStructure}</code>
          </pre>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Trophy size={18} aria-hidden="true" />
            Plan de réalisation
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {firstSteps.map((step, index) => (
              <li key={step} className="rounded-lg border border-line bg-background p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Grille sur 20</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.grading.map((row) => (
              <div
                key={row.criterion}
                className="flex items-center justify-between gap-3 rounded-lg bg-surface-muted px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">{row.criterion}</span>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {row.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Réussi si...</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
            {project.successCriteria.slice(0, 5).map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-success"
                  size={16}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
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
            Commence par le menu, puis teste chaque outil séparément. La solution sert à comparer.
          </p>
        )}
      </section>
    </div>
  );
}
