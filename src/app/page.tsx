import { ArrowRight, BookOpen, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { week1 } from "@/content/week-1";
import { DayTimeline } from "@/components/learning/day-timeline";

export default function Home() {
  return (
    <div>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:px-6">
          <div className="flex flex-col justify-center py-8">
            <p className="font-mono text-sm text-accent-strong">Préparation BUT Informatique</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-normal text-foreground">
              {week1.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {week1.overview}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/week/week-1/day/day-1"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-strong"
              >
                <BookOpen size={18} aria-hidden="true" />
                Commencer la semaine 1
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-muted"
              >
                <CheckCircle2 size={18} aria-hidden="true" />
                Voir la progression
              </Link>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-line bg-surface-muted">
            <Image
              src="/learning-hero.png"
              alt="Bureau d'étude avec ordinateur, carnet Python et checklist de progression"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickLink href="/week/week-1" icon={BookOpen} title="Cours et jours" text="Une progression matin, après-midi, soir." />
          <QuickLink href="/corrections" icon={ShieldCheck} title="Corrections séparées" text="Solutions révélées après tentative." />
          <QuickLink href="/project/week-1" icon={FileText} title="Mini-projet" text="Boîte à outils étudiant, grille sur 20." />
          <QuickLink href="/checkpoint/week-1" icon={CheckCircle2} title="Checkpoint" text="Test blanc de 100 points." />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Timeline</p>
            <h2 className="text-2xl font-semibold text-foreground">Les 6 jours de construction</h2>
          </div>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-strong hover:text-accent"
          >
            Fiches de révision
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <DayTimeline days={week1.days} />
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-6">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Objectifs</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Ce que tu dois savoir faire</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {week1.objectives.map((objective) => (
              <div key={objective} className="rounded-md border border-line bg-background p-4 text-sm leading-6 text-muted-foreground">
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
      className="group rounded-lg border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-accent-soft text-accent-strong">
          <Icon size={20} aria-hidden="true" />
        </span>
        <ArrowRight size={17} className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </Link>
  );
}
