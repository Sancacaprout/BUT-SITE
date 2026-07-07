import { Library } from "lucide-react";
import { week1 } from "@/content/week-1";

export default function LibraryPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Bibliothèque</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Fiches de révision</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Des fiches courtes à relire le soir et avant le checkpoint. Elles reprennent
          les réflexes du PDF sans noyer les notions.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {week1.sheets.map((sheet) => (
          <article id={sheet.id} key={sheet.id} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Library size={18} className="text-accent" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-foreground">{sheet.title}</h2>
            </div>
            {sheet.code ? (
              <pre className="mt-4 overflow-x-auto rounded-md border border-line bg-code p-4 text-sm leading-6 text-code-foreground">
                <code>{sheet.code}</code>
              </pre>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
              {sheet.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
