"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { glossary } from "@/content/glossary";
import { getSearchIndex } from "@/lib/content";

const index = getSearchIndex();

export function SearchClient() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) {
      return index.slice(0, 12);
    }

    return index.filter((item) =>
      [item.title, item.description, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [normalized]);

  const glossaryMatches = useMemo(() => {
    if (!normalized) {
      return glossary.slice(0, 6);
    }

    return glossary.filter((entry) =>
      [entry.term, entry.definition, ...entry.aliases]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [normalized]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Recherche</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Trouver une notion</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Cherche terminal, variable, input, condition, boucle, fonction, liste, chemin relatif...
        </p>
      </section>

      <label className="relative mt-8 block">
        <Search
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-14 w-full rounded-lg border border-line bg-surface pl-12 pr-4 text-base outline-none transition focus:border-accent"
          placeholder="Mot-clé, compétence, exercice..."
          autoFocus
        />
      </label>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">Résultats</h2>
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-lg border border-line bg-surface p-4 shadow-sm hover:border-accent"
            >
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>

        <aside className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Glossaire</h2>
          <div className="mt-4 space-y-3">
            {glossaryMatches.map((entry) => (
              <div key={entry.term} className="rounded-md bg-surface-muted p-3">
                <p className="font-semibold text-foreground">{entry.term}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.definition}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
