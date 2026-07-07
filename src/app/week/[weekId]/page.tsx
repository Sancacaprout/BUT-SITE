import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { week1 } from "@/content/week-1";
import { DayTimeline } from "@/components/learning/day-timeline";

export function generateStaticParams() {
  return [{ weekId: week1.id }];
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  if (weekId !== week1.id) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-sm text-accent-strong">Semaine {week1.weekNumber}</p>
          <h1 className="mt-2 text-4xl font-semibold text-foreground">{week1.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
            {week1.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/week/week-1/day/day-1"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-strong"
            >
              <CalendarDays size={18} aria-hidden="true" />
              Commencer jour 1
            </Link>
            <Link
              href="/checkpoint/week-1"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-muted"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Checkpoint final
            </Link>
          </div>
        </div>
        <aside className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target size={18} aria-hidden="true" />
            Niveau attendu
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            {week1.targetLevel.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground">Jours</h2>
        <div className="mt-5">
          <DayTimeline days={week1.days} />
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
              {week1.schedule.map((item) => (
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
