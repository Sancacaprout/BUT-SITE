"use client";

import { AlertTriangle, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { weeks } from "@/content/weeks";
import { ProgressBar } from "@/components/progress/progress-bar";
import { useProgress } from "@/lib/progress/progress-store";

export function DashboardClient() {
  const { state } = useProgress();
  const lessonsTotal = weeks.reduce(
    (total, week) => total + week.days.reduce((sum, day) => sum + day.morning.length, 0),
    0,
  );
  const exercises = weeks.flatMap((week) => week.days.flatMap((day) => day.afternoonExercises));
  const doneLessons = Object.values(state.lessons).filter(Boolean).length;
  const doneExercises = exercises.filter((exercise) => state.exercises[exercise.id] === "done").length;
  const reviewExercises = exercises.filter((exercise) =>
    ["review", "stuck"].includes(state.exercises[exercise.id] ?? ""),
  );
  const quizTotal = weeks.reduce(
    (total, week) => total + week.days.reduce((sum, day) => sum + day.eveningQuiz.length, 0),
    0,
  );
  const quizBest = weeks.reduce(
    (total, week) =>
      total +
      week.days.reduce(
        (sum, day) => sum + (state.quizScores[`week-${day.week}-day-${day.dayNumber}`] ?? 0),
        0,
      ),
    0,
  );
  const globalProgress =
    ((doneLessons + doneExercises + quizBest) /
      Math.max(1, lessonsTotal + exercises.length + quizTotal)) *
    100;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Tableau de bord</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Progression du parcours</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Suis ta progression sur les semaines 1 à 5 : cours, exercices, quiz et points à reprendre.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Progression globale" value={`${Math.round(globalProgress)}%`} icon={CheckCircle2} />
        <Metric title="Cours revus" value={`${doneLessons}/${lessonsTotal}`} icon={Clock} />
        <Metric title="Exercices réussis" value={`${doneExercises}/${exercises.length}`} icon={CheckCircle2} />
        <Metric title="À revoir" value={String(reviewExercises.length)} icon={RotateCcw} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Par semaine</h2>
          <div className="mt-5 space-y-5">
            {weeks.map((week) => {
              const weekLessons = week.days.reduce((sum, day) => sum + day.morning.length, 0);
              const weekLessonDone = week.days.reduce(
                (sum, day) => sum + day.morning.filter((section) => state.lessons[section.id]).length,
                0,
              );
              const weekExercises = week.days.flatMap((day) => day.afternoonExercises);
              const weekExerciseDone = weekExercises.filter(
                (exercise) => state.exercises[exercise.id] === "done",
              ).length;
              const weekQuiz = week.days.reduce(
                (sum, day) => sum + (state.quizScores[`week-${day.week}-day-${day.dayNumber}`] ?? 0),
                0,
              );
              const weekQuizTotal = week.days.reduce((sum, day) => sum + day.eveningQuiz.length, 0);
              const weekValue =
                ((weekLessonDone + weekExerciseDone + weekQuiz) /
                  Math.max(1, weekLessons + weekExercises.length + weekQuizTotal)) *
                100;

              return (
                <div key={week.id} className="rounded-md border border-line p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Semaine {week.weekNumber} - {week.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{week.subtitle}</p>
                    </div>
                    <Link
                      href={`/week/${week.id}`}
                      className="text-sm font-medium text-accent-strong hover:text-accent"
                    >
                      Continuer
                    </Link>
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={weekValue} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Dernière activité</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {state.lastActivity
                ? new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(state.lastActivity))
                : "Aucune activité enregistrée pour le moment."}
            </p>
          </div>

          <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Exercices à revoir</h2>
            {reviewExercises.length ? (
              <div className="mt-3 space-y-2">
                {reviewExercises.slice(0, 8).map((exercise) => (
                  <Link
                    key={exercise.id}
                    href={`/corrections?focus=${exercise.correctionId}#${exercise.correctionId}`}
                    className="block rounded-md bg-surface-muted px-3 py-2 text-sm text-foreground hover:bg-accent-soft"
                  >
                    {exercise.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Aucun exercice marqué à revoir. Quand tu bloques, marque-le ici plutôt que de le laisser disparaître.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-line bg-amber-soft p-5 shadow-sm">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-strong" size={20} aria-hidden="true" />
              <p className="text-sm leading-6 text-foreground">
                Les corrections restent séparées. Essaie, écris ta réponse, puis compare.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof CheckCircle2;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon size={20} className="text-accent" aria-hidden="true" />
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
