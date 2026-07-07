"use client";

import { CheckCircle2 } from "lucide-react";
import type { LessonSection } from "@/content/week-1";
import { useProgress } from "@/lib/progress/progress-store";

export function LessonCard({ section }: { section: LessonSection }) {
  const { state, markLesson } = useProgress();
  const done = Boolean(state.lessons[section.id]);

  return (
    <article className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
          <p className="max-w-3xl leading-7 text-muted-foreground">{section.content}</p>
          {section.analogy ? (
            <p className="border-l-4 border-amber-accent bg-amber-soft px-4 py-3 text-sm text-foreground">
              {section.analogy}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => markLesson(section.id, !done)}
          className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition ${
            done
              ? "bg-success text-white"
              : "border border-line bg-surface hover:bg-surface-muted"
          }`}
        >
          <CheckCircle2 size={17} aria-hidden="true" />
          {done ? "Revu" : "J'ai compris"}
        </button>
      </div>

      {section.exampleCode ? (
        <pre className="mt-4 overflow-x-auto rounded-md border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
          <code>{section.exampleCode}</code>
        </pre>
      ) : null}

      {section.keyTakeaways?.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {section.keyTakeaways.map((item) => (
            <div key={item} className="rounded-md bg-surface-muted px-3 py-2 text-sm text-foreground">
              {item}
            </div>
          ))}
        </div>
      ) : null}

      {section.frequentMistakes?.length ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-danger">Erreurs fréquentes</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {section.frequentMistakes.map((mistake) => (
              <li key={mistake}>• {mistake}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
