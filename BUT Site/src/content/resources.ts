export type Resource = {
  id: string;
  title: string;
  href: string;
  description: string;
  tags: string[];
};

export const resources: Resource[] = [
  {
    id: "python-docs",
    title: "Documentation Python",
    href: "https://docs.python.org/fr/3/",
    description: "La référence officielle pour vérifier une fonction, un type ou un module Python.",
    tags: ["python", "documentation", "référence"],
  },
  {
    id: "python-tutorial",
    title: "Tutoriel Python officiel",
    href: "https://docs.python.org/fr/3/tutorial/",
    description: "Un parcours progressif pour revoir les bases après les exercices de la semaine.",
    tags: ["python", "cours"],
  },
  {
    id: "mdn-cli",
    title: "MDN - Command line crash course",
    href: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line",
    description: "Une introduction claire à la ligne de commande et au vocabulaire terminal.",
    tags: ["terminal", "ligne de commande"],
  },
  {
    id: "linux-journey",
    title: "Linux Journey",
    href: "https://linuxjourney.com/",
    description: "Des leçons courtes pour consolider navigation, fichiers et commandes Linux.",
    tags: ["linux", "terminal"],
  },
  {
    id: "git-book",
    title: "Pro Git",
    href: "https://git-scm.com/book/fr/v2",
    description: "À garder pour la suite : Git deviendra central dès que les projets grossissent.",
    tags: ["git", "versioning"],
  },
];
