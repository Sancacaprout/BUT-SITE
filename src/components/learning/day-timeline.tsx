import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Day } from "@/content/week-1";

export function DayTimeline({ days, weekId }: { days: Day[]; weekId: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {days.map((day) => (
        <Link
          key={day.id}
          href={`/week/${weekId}/day/${day.id}`}
          className="group rounded-lg border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs text-accent-strong">
              Jour {day.dayNumber}
            </span>
            <ArrowRight
              size={17}
              className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-foreground">{day.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{day.theme}</p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">{day.duration}</p>
        </Link>
      ))}
    </div>
  );
}
