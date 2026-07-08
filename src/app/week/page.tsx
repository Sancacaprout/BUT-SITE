import { ArrowRight, CalendarDays, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { weeks } from "@/content/weeks";

export default function WeeksIndexPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Parcours</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Semaines</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Choisis une semaine, puis entre dans ses jours. Chaque semaine contient cours, exercices, corrections, projet et bilan.
        </p>
      </section>

      <section className="mt-8 grid gap-5">
        {weeks.map((week) => (
          <article
            key={week.id}
            className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
          >
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <div>
                <p className="font-mono text-sm text-accent-strong">Semaine {week.weekNumber}</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{week.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {week.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionLink href={`/week/${week.id}`} icon={CalendarDays} label="Voir les jours" primary />
                  <ActionLink href={`/project/${week.id}`} icon={FileText} label="Projet" />
                  <ActionLink href={`/checkpoint/${week.id}`} icon={CheckCircle2} label="Bilan" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                {week.days.map((day) => (
                  <Link
                    key={day.id}
                    href={`/week/${week.id}/day/${day.id}`}
                    className="rounded-lg border border-line bg-background px-3 py-2 text-sm transition hover:border-accent hover:bg-surface-muted"
                  >
                    <span className="font-mono text-xs text-accent-strong">Jour {day.dayNumber}</span>
                    <span className="mt-1 block truncate font-medium text-foreground">{day.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
  primary = false,
}: {
  href: string;
  icon: typeof CalendarDays;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
        primary
          ? "bg-accent text-accent-contrast hover:bg-accent-hover"
          : "border border-line bg-background text-foreground hover:bg-surface-muted"
      }`}
    >
      <Icon size={17} aria-hidden="true" />
      {label}
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}
