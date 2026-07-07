"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Correction } from "@/content/week-1";
import { CorrectionPanel } from "@/components/learning/correction-panel";

export function CorrectionsBrowser({ corrections }: { corrections: Correction[] }) {
  const [query, setQuery] = useState("");
  const [day, setDay] = useState("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return corrections.filter((correction) => {
      const matchesDay = day === "all" || String(correction.day) === day;
      const matchesQuery =
        !normalized ||
        correction.title.toLowerCase().includes(normalized) ||
        correction.solution.toLowerCase().includes(normalized) ||
        correction.explanation.toLowerCase().includes(normalized);
      return matchesDay && matchesQuery;
    });
  }, [corrections, day, query]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-md border border-line bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent"
              placeholder="Chercher une correction, un piège, une commande..."
            />
          </label>
          <select
            value={day}
            onChange={(event) => setDay(event.target.value)}
            className="h-11 rounded-md border border-line bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="all">Tous les jours</option>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <option key={item} value={String(item)}>
                Jour {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((correction) => (
          <CorrectionPanel key={correction.id} correction={correction} />
        ))}
      </div>
    </div>
  );
}
