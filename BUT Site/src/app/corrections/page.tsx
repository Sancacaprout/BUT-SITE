import { ShieldCheck } from "lucide-react";
import { week1 } from "@/content/week-1";
import { CorrectionsBrowser } from "@/components/learning/corrections-browser";

export default function CorrectionsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="font-mono text-sm text-accent-strong">Corrections</p>
          <h1 className="mt-2 text-4xl font-semibold text-foreground">Solutions détaillées séparées</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
            Les solutions ne s’ouvrent pas automatiquement dans les exercices. Ici,
            elles sont classées par jour avec raisonnement, pièges et tests rapides.
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-amber-soft p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck size={18} aria-hidden="true" />
            Règle anti-spoiler
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground">
            Tente l’exercice, écris ta réponse, demande des indices si besoin,
            puis compare avec la correction.
          </p>
        </aside>
      </section>

      <section className="mt-8">
        <CorrectionsBrowser corrections={week1.corrections} />
      </section>
    </div>
  );
}
