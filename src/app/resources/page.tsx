import { ExternalLink } from "lucide-react";
import { resources } from "@/content/resources";
import { SkillBadge } from "@/components/learning/skill-badge";

export default function ResourcesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Ressources</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Liens utiles</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          Des références fiables pour approfondir sans remplacer l’entraînement.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">{resource.title}</h2>
              <ExternalLink
                size={18}
                className="shrink-0 text-muted-foreground transition group-hover:text-accent"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {resource.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <SkillBadge key={tag}>{tag}</SkillBadge>
              ))}
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
