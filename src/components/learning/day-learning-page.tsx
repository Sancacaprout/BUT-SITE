"use client";

import { ArrowLeft, Compass, Goal, ListChecks, PlayCircle } from "lucide-react";
import Link from "next/link";
import type { Day } from "@/content/week-1";
import { getDayGuidance } from "@/content/guidance";
import { ExerciseCard } from "@/components/learning/exercise-card";
import { LessonCard } from "@/components/learning/lesson-card";
import { NoteBox } from "@/components/learning/note-box";
import { QuizCard } from "@/components/quiz/quiz-card";

export function DayLearningPage({ day }: { day: Day }) {
  const guidance = getDayGuidance(day);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <Link
        href={`/week/week-${day.week}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Retour semaine {day.week}
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="font-mono text-sm text-accent-strong">Jour {day.dayNumber}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal text-foreground">
            {day.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
            {day.theme}
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListChecks size={18} aria-hidden="true" />
            Checklist avant de continuer
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {day.checklist.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Goal size={17} aria-hidden="true" />
              But du jour
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Objectif : {day.theme.toLowerCase()}. Comprends le contexte, prépare ton environnement, puis passe aux exercices.
            </p>
          </div>

          <details className="rounded-lg border border-line bg-surface-muted/70 px-3 py-2 text-sm md:w-[320px]">
            <summary className="cursor-pointer font-semibold text-foreground">
              Préparation rapide
            </summary>
            <div className="mt-3 grid gap-3">
              <CompactDayList icon={PlayCircle} title="Démarrage" items={guidance.before.slice(0, 3)} />
              <CompactDayList icon={Compass} title="Objectif final" items={guidance.outcome.slice(0, 2)} />
            </div>
          </details>
        </div>
      </section>

      <div className="mt-8 space-y-8">
        <section className="space-y-4">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Matin</p>
            <h2 className="text-2xl font-semibold text-foreground">Cours guidé</h2>
          </div>
          {day.morning.map((section) => (
            <LessonCard key={section.id} section={section} />
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Après-midi</p>
            <h2 className="text-2xl font-semibold text-foreground">Exercices</h2>
          </div>
          {day.afternoonExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <QuizCard quizId={`week-${day.week}-day-${day.dayNumber}`} questions={day.eveningQuiz} />
          <div className="space-y-5">
            <section className="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Révision active</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {day.revisionPrompts.map((prompt) => (
                  <li key={prompt}>• {prompt}</li>
                ))}
              </ul>
            </section>
            <NoteBox contentId={`day-note-${day.dayNumber}`} />
          </div>
        </section>
      </div>
    </div>
  );
}

function CompactDayList({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Goal;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted/70 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
        <Icon size={15} aria-hidden="true" />
        {title}
      </div>
      <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
