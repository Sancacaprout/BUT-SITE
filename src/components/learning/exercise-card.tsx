"use client";

import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ListChecks,
  PlayCircle,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { getExerciseGuidance } from "@/content/guidance";
import type { Exercise } from "@/content/week-1";
import {
  type ProgressStatus,
  useProgress,
} from "@/lib/progress/progress-store";
import { HintReveal } from "@/components/learning/hint-reveal";
import { PracticeLab } from "@/components/learning/practice-lab";
import { SkillBadge } from "@/components/learning/skill-badge";

const statusOptions: Array<{
  value: ProgressStatus;
  label: string;
  icon: typeof CheckCircle2;
  activeClassName: string;
  inactiveClassName: string;
}> = [
  {
    value: "done",
    label: "Réussi",
    icon: CheckCircle2,
    activeClassName: "status-done-active shadow-sm",
    inactiveClassName: "status-done hover:brightness-105",
  },
  {
    value: "review",
    label: "À revoir",
    icon: RotateCcw,
    activeClassName: "status-review-active shadow-sm",
    inactiveClassName: "status-review hover:brightness-105",
  },
  {
    value: "stuck",
    label: "Non compris",
    icon: XCircle,
    activeClassName: "status-stuck-active shadow-sm",
    inactiveClassName: "status-stuck hover:brightness-105",
  },
];

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { state, setExerciseStatus } = useProgress();
  const status = state.exercises[exercise.id] ?? "not-started";
  const guidance = getExerciseGuidance(exercise);

  return (
    <article id={exercise.id} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-ink px-2 py-1 font-mono text-xs text-ink-contrast">
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
          <ExerciseContext context={guidance.context} usefulness={guidance.usefulness} />
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
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                  active ? option.activeClassName : option.inactiveClassName
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <PracticeLab exercise={exercise} />

          <HintReveal exerciseId={exercise.id} hints={exercise.hints} />
        </div>

        <aside className="space-y-3">
          <QuickHelpPanel setup={guidance.setup} actionPlan={guidance.actionPlan} />

          <div className="rounded-md border border-line bg-surface-muted p-3">
            <p className="text-sm font-semibold text-foreground">Erreurs fréquentes</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
              {exercise.frequentMistakes.map((mistake) => (
                <li key={mistake}>• {mistake}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-line bg-surface-muted p-3">
            <p className="text-sm font-semibold text-foreground">Correction</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Accès direct à la bonne solution.
            </p>
            <Link
              href={`/corrections?focus=${exercise.correctionId}#${exercise.correctionId}`}
              className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-medium text-ink-contrast hover:bg-ink-strong"
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

function ExerciseContext({
  context,
  usefulness,
}: {
  context: string;
  usefulness: string;
}) {
  return (
    <div className="rounded-md border border-line bg-surface-muted/70 p-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
            <BookOpen size={14} aria-hidden="true" />
            Contexte
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{context}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
            <Target size={14} aria-hidden="true" />
            Utilité
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{usefulness}</p>
        </div>
      </div>
    </div>
  );
}

function QuickHelpPanel({
  setup,
  actionPlan,
}: {
  setup: string[];
  actionPlan: string[];
}) {
  const visibleSetup = setup.slice(0, 1);
  const visiblePlan = actionPlan.slice(0, 2);
  const hiddenSetup = setup.slice(1);
  const hiddenPlan = actionPlan.slice(2);

  return (
    <div className="rounded-md border border-line bg-surface-muted/80 p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <PlayCircle size={16} aria-hidden="true" />
        Aide rapide
      </div>

      <div className="mt-3 space-y-3">
        <MiniList icon={PlayCircle} title="Départ" items={visibleSetup} />
        <MiniList icon={ListChecks} title="Plan" items={visiblePlan} ordered />
      </div>

      {hiddenSetup.length > 0 || hiddenPlan.length > 0 ? (
        <details className="mt-3 rounded-md border border-line bg-surface px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium text-foreground">
            Voir toutes les étapes
          </summary>
          <div className="mt-3 grid gap-3">
            {hiddenSetup.length ? (
              <MiniList icon={PlayCircle} title="Suite départ" items={hiddenSetup} />
            ) : null}
            {hiddenPlan.length ? (
              <MiniList icon={ListChecks} title="Suite plan" items={hiddenPlan} ordered start={3} />
            ) : null}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function MiniList({
  icon: Icon,
  title,
  items,
  ordered = false,
  start,
}: {
  icon: typeof BookOpen;
  title: string;
  items: string[];
  ordered?: boolean;
  start?: number;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
        <Icon size={14} aria-hidden="true" />
        {title}
      </div>
      <List
        start={start}
        className={`mt-1.5 space-y-1.5 text-xs leading-5 text-muted-foreground ${
          ordered ? "list-decimal pl-5" : ""
        }`}
      >
        {items.map((item) => (
          <li key={item} className={ordered ? "" : "flex gap-2"}>
            {ordered ? (
              item
            ) : (
              <>
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </>
            )}
          </li>
        ))}
      </List>
    </div>
  );
}
