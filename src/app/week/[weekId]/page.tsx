import { notFound } from "next/navigation";
import { BookOpenCheck, CalendarDays, CheckCircle2, Route, Target } from "lucide-react";
import Link from "next/link";
import { getWeekGuidance } from "@/content/guidance";
import { getWeekById, weeks } from "@/content/weeks";
import { DayTimeline } from "@/components/learning/day-timeline";

export function generateStaticParams() {
  return weeks.map((week) => ({ weekId: week.id }));
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const week = getWeekById(weekId);
  if (!week) {
    notFound();
  }
  const guidance = getWeekGuidance(week);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-sm text-accent-strong">Semaine {week.weekNumber}</p>
          <h1 className="mt-2 text-4xl font-semibold text-foreground">{week.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
            {week.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/week/${week.id}/day/day-1`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-contrast hover:bg-accent-hover"
            >
              <CalendarDays size={18} aria-hidden="true" />
              Commencer jour 1
            </Link>
            <Link
              href={`/checkpoint/${week.id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-muted"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Bilan final
            </Link>
          </div>
        </div>
        <aside className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target size={18} aria-hidden="true" />
            Niveau attendu
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            {week.targetLevel.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpenCheck size={18} aria-hidden="true" />
            But de la semaine
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{guidance.purpose}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {week.objectives.slice(0, 4).map((objective) => (
              <li key={objective} className="rounded-md bg-surface-muted px-3 py-2 text-sm text-foreground">
                {objective}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Route size={18} aria-hidden="true" />
            Comment utiliser cette semaine
          </div>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {guidance.method.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground">Jours</h2>
        <div className="mt-5">
          <DayTimeline weekId={week.id} days={week.days} />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="font-mono text-sm text-muted-foreground">Calendrier</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Volume conseillé</h2>
        </div>
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-muted text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Bloc</th>
                <th className="px-4 py-3 font-semibold">Thème</th>
                <th className="px-4 py-3 font-semibold">Temps</th>
              </tr>
            </thead>
            <tbody>
              {week.schedule.map((item) => (
                <tr key={item.block} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-foreground">{item.block}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.theme}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
