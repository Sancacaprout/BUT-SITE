import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { weeks } from "@/content/weeks";

export default function ProjectsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Mini-projets</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Projets par semaine</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Chaque projet assemble les notions de la semaine dans un rendu court, testable et compréhensible.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {weeks.map((week) => (
          <Link
            key={week.id}
            href={`/project/${week.id}`}
            className="group rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                <FileText size={20} aria-hidden="true" />
              </span>
              <ArrowRight size={18} className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
            </div>
            <p className="mt-4 font-mono text-sm text-accent-strong">Semaine {week.weekNumber}</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">{week.project.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{week.project.brief}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
