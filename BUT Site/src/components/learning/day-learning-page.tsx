"use client";

import { ArrowLeft, ListChecks } from "lucide-react";
import Link from "next/link";
import type { Day } from "@/content/week-1";
import { ExerciseCard } from "@/components/learning/exercise-card";
import { LessonCard } from "@/components/learning/lesson-card";
import { NoteBox } from "@/components/learning/note-box";
import { QuizCard } from "@/components/quiz/quiz-card";

export function DayLearningPage({ day }: { day: Day }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <Link
        href="/week/week-1"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Retour semaine 1
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
            <h2 className="text-2xl font-semibold text-foreground">Exercices sans correction visible</h2>
          </div>
          {day.afternoonExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <QuizCard quizId={`day-${day.dayNumber}`} questions={day.eveningQuiz} />
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
