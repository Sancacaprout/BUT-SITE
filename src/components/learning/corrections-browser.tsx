"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Correction } from "@/content/week-1";
import { CorrectionPanel } from "@/components/learning/correction-panel";

export function CorrectionsBrowser({ corrections }: { corrections: Correction[] }) {
  const [query, setQuery] = useState("");
  const [focusedId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const focus = new URLSearchParams(window.location.search).get("focus");
    return corrections.some((correction) => correction.id === focus) ? focus : null;
  });
  const [day, setDay] = useState(() => {
    if (typeof window === "undefined") {
      return "all";
    }

    const focus = new URLSearchParams(window.location.search).get("focus");
    const target = corrections.find((correction) => correction.id === focus);
    return target ? String(target.day) : "all";
  });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!focusedId) {
      return;
    }

    window.setTimeout(() => {
      document.getElementById(focusedId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }, [focusedId]);

  const filtered = useMemo(() => {
    if (focusedId && !showAll && !query.trim()) {
      const target = corrections.find((correction) => correction.id === focusedId);
      return target ? [target] : [];
    }

    const normalized = query.trim().toLowerCase();
    return corrections.filter((correction) => {
      const matchesDay = day === "all" || String(correction.day) === day;
      const matchesQuery =
        !normalized ||
        correction.id.toLowerCase().includes(normalized) ||
        correction.title.toLowerCase().includes(normalized) ||
        correction.solution.toLowerCase().includes(normalized) ||
        correction.explanation.toLowerCase().includes(normalized);
      return matchesDay && matchesQuery;
    });
  }, [corrections, day, focusedId, query, showAll]);

  const focusedCorrection = focusedId
    ? corrections.find((correction) => correction.id === focusedId)
    : null;

  return (
    <div className="space-y-5">
      {focusedCorrection && !showAll ? (
        <div className="rounded-lg border border-accent bg-surface p-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground">
            Correction ouverte : {focusedCorrection.title}
          </p>
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-3 inline-flex h-9 items-center rounded-md border border-line bg-surface px-3 text-sm font-medium hover:bg-surface-muted"
          >
            Voir toutes les corrections
          </button>
        </div>
      ) : null}

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
              onChange={(event) => {
                setQuery(event.target.value);
                setShowAll(true);
              }}
              className="h-11 w-full rounded-md border border-line bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent"
              placeholder="Chercher par titre, jour ou commande..."
            />
          </label>
          <select
            value={day}
            onChange={(event) => {
              setDay(event.target.value);
              setShowAll(true);
            }}
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
          <CorrectionPanel
            key={correction.id}
            correction={correction}
            defaultRevealed={correction.id === focusedId}
            highlighted={correction.id === focusedId}
          />
        ))}
      </div>
    </div>
  );
}
