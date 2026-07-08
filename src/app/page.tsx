import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { weeks } from "@/content/weeks";

export default function Home() {
  return (
    <div>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-6">
          <div className="max-w-4xl">
            <p className="font-mono text-sm text-accent-strong">Préparation BUT Informatique</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-normal text-foreground">
              Parcours de préparation
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Avance semaine par semaine : fondamentaux Python, données, SQL, web, qualité de code, sécurité et projet final.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/week"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-contrast hover:bg-accent-hover"
            >
              <BookOpen size={18} aria-hidden="true" />
              Voir les semaines
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-background px-4 text-sm font-semibold hover:bg-surface-muted"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Voir la progression
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Parcours</p>
            <h2 className="text-2xl font-semibold text-foreground">Les semaines</h2>
          </div>
          <Link
            href="/week"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-strong hover:text-accent"
          >
            Tout ouvrir
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {weeks.map((week) => (
            <Link
              key={week.id}
              href={`/week/${week.id}`}
              className="group rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent-soft font-mono text-sm font-semibold text-accent-strong">
                  {week.weekNumber}
                </span>
                <ArrowRight size={17} className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{week.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{week.subtitle}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">{week.days.length} jours</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickLink href="/project" icon={FileText} title="Projets" text="Un mini-projet par semaine." />
          <QuickLink href="/checkpoint" icon={ClipboardCheck} title="Bilans" text="Un contrôle final par semaine." />
          <QuickLink href="/corrections" icon={ShieldCheck} title="Corrections" text="Toutes les solutions au même endroit." />
          <QuickLink href="/library" icon={BookOpen} title="Fiches" text="Les rappels essentiels à relire." />
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-6">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Objectifs</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Ce que tu vas construire</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {weeks.flatMap((week) => week.objectives.slice(0, 2)).map((objective) => (
              <div
                key={objective}
                className="rounded-lg border border-line bg-background p-4 text-sm leading-6 text-muted-foreground"
              >
                {objective}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof BookOpen;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong">
          <Icon size={20} aria-hidden="true" />
        </span>
        <ArrowRight size={17} className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </Link>
  );
}
