"use client";

import { CheckCircle2, ExternalLink, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import type { Exercise } from "@/content/week-1";
import {
  type ProgressStatus,
  useProgress,
} from "@/lib/progress/progress-store";
import { HintReveal } from "@/components/learning/hint-reveal";
import { SkillBadge } from "@/components/learning/skill-badge";

const statusOptions: Array<{
  value: ProgressStatus;
  label: string;
  icon: typeof CheckCircle2;
}> = [
  { value: "done", label: "Réussi", icon: CheckCircle2 },
  { value: "review", label: "À revoir", icon: RotateCcw },
  { value: "stuck", label: "Non compris", icon: XCircle },
];

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { state, setExerciseStatus, saveNote } = useProgress();
  const status = state.exercises[exercise.id] ?? "not-started";

  return (
    <article id={exercise.id} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-ink px-2 py-1 font-mono text-xs text-white">
              Jour {exercise.day}
            </span>
            <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {exercise.difficulty}
            </span>
            <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {exercise.estimatedMinutes} min
            </span>
          </div>
          <h3 className="text-xl font-semibold text-foreground">{exercise.title}</h3>
          <p className="leading-7 text-muted-foreground">{exercise.statement}</p>
          <div className="flex flex-wrap gap-2">
            {exercise.skills.map((skill) => (
              <SkillBadge key={skill}>{skill}</SkillBadge>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const active = status === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setExerciseStatus(exercise.id, option.value)}
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  active
                    ? "bg-accent text-white"
                    : "border border-line bg-surface hover:bg-surface-muted"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Réponse personnelle
            </span>
            <textarea
              value={state.notes[`answer-${exercise.id}`] ?? ""}
              onChange={(event) => saveNote(`answer-${exercise.id}`, event.target.value)}
              className="min-h-36 w-full resize-y rounded-md border border-line bg-background p-3 text-sm leading-6 outline-none transition focus:border-accent"
              placeholder="Écris ton raisonnement, ton code ou les commandes testées."
            />
          </label>

          <HintReveal exerciseId={exercise.id} hints={exercise.hints} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-line bg-surface-muted p-4">
            <p className="text-sm font-semibold text-foreground">Erreurs fréquentes</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {exercise.frequentMistakes.map((mistake) => (
                <li key={mistake}>• {mistake}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-line bg-surface-muted p-4">
            <p className="text-sm font-semibold text-foreground">Correction</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Accès direct à la bonne solution.
            </p>
            <Link
              href={`/corrections?focus=${exercise.correctionId}#${exercise.correctionId}`}
              className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-medium text-white hover:bg-ink-strong"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Voir la correction
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
