import type { Day, Exercise, Week } from "@/content/week-1";

type DayGuidance = {
  purpose: string;
  before: string[];
  outcome: string[];
};

type ExerciseGuidance = {
  context: string;
  usefulness: string;
  setup: string[];
  actionPlan: string[];
};

type SkillRule = {
  keywords: string[];
  step: string;
};

const terminalKeywords = [
  "terminal",
  "ubuntu",
  "linux",
  "pwd",
  "ls",
  "cd",
  "mkdir",
  "cp",
  "mv",
  "rm",
  "cat",
  "echo",
  "redirection",
  "chemin",
  "fichier",
  "dossier",
];

const pythonKeywords = [
  "python",
  "print",
  "input",
  "variable",
  "int",
  "float",
  "condition",
  "if",
  "elif",
  "else",
  "boucle",
  "for",
  "while",
  "range",
  "fonction",
  "return",
  "liste",
  "dictionnaire",
  "chaîne",
  "slice",
  "index",
];

const webKeywords = ["html", "css", "javascript", "dom", "formulaire", "page", "responsive"];
const testKeywords = ["test", "pytest", "assert", "cas limite", "debug"];
const dataKeywords = ["csv", "json", "tableau", "donnée", "tri", "filtre"];

const skillRules: SkillRule[] = [
  { keywords: ["pwd"], step: "Commence par `pwd` pour savoir dans quel dossier tu travailles." },
  { keywords: ["ls"], step: "Utilise `ls` pour regarder ce qui existe avant de modifier quoi que ce soit." },
  { keywords: ["cd", "chemin"], step: "Déplace-toi avec `cd`, puis vérifie ton emplacement avant la commande suivante." },
  { keywords: ["mkdir"], step: "Crée les dossiers un par un avec `mkdir`, en gardant des noms simples et lisibles." },
  { keywords: ["cp"], step: "Quand tu copies, garde en tête l'ordre : source puis destination." },
  { keywords: ["mv"], step: "Quand tu renommes ou déplaces, vérifie avant/après avec `ls`." },
  { keywords: ["rm"], step: "Avant `rm`, relis le chemin et vérifie que tu ne supprimes que l'élément demandé." },
  { keywords: ["echo", "redirection"], step: "Si tu écris dans un fichier, rappelle-toi que `>` remplace et `>>` ajoute." },
  { keywords: ["print"], step: "Affiche d'abord une valeur simple avec `print` pour vérifier que ton script se lance." },
  { keywords: ["input"], step: "Demande la saisie avec `input`, puis affiche temporairement la valeur reçue pour la contrôler." },
  { keywords: ["int", "float", "conversion"], step: "Convertis les saisies texte avant les calculs avec `int(...)` ou `float(...)`." },
  { keywords: ["condition", "if", "elif", "else"], step: "Écris les cas possibles au brouillon, puis transforme-les en `if`, `elif`, `else`." },
  { keywords: ["boucle", "for", "while", "range"], step: "Repère ce qui doit se répéter, puis choisis `for` si tu connais le nombre de tours." },
  { keywords: ["accumulateur", "compteur", "somme"], step: "Crée une variable de départ, souvent `total = 0`, puis mets-la à jour dans la boucle." },
  { keywords: ["fonction", "return"], step: "Écris d'abord la signature `def nom(...):`, puis un seul rôle clair pour la fonction." },
  { keywords: ["liste"], step: "Teste avec une petite liste de 3 valeurs avant d'essayer un cas plus long." },
  { keywords: ["index", "slice", "chaîne"], step: "Souviens-toi que les index commencent à 0 et teste un exemple très court." },
  { keywords: ["html"], step: "Construis d'abord la structure HTML, sans chercher le style parfait tout de suite." },
  { keywords: ["css", "responsive"], step: "Ajoute le style ensuite, puis vérifie en réduisant la largeur de la fenêtre." },
  { keywords: ["test", "pytest", "assert"], step: "Écris au moins un test facile et un test limite avant de considérer l'exercice terminé." },
  { keywords: ["json", "csv", "donnée"], step: "Regarde la forme exacte des données avant d'écrire le traitement." },
];

export function getWeekGuidance(week: Week) {
  return {
    purpose: `Cette semaine sert à construire une base concrète : ${week.overview}`,
    method: [
      "Lis le but de la semaine avant de commencer le jour 1.",
      "Fais les jours dans l'ordre : les exercices réutilisent souvent ce qui vient juste avant.",
      "Quand une notion semble floue, relis le cours guidé puis tente l'exercice sans ouvrir la correction.",
      "Termine par le projet et le bilan seulement quand les exercices principaux sont compris.",
    ],
  };
}

export function getDayGuidance(day: Day): DayGuidance {
  const skills = day.afternoonExercises.flatMap((exercise) => exercise.skills);
  const terminal = hasAny(skills, terminalKeywords) || includesAny(day.theme, terminalKeywords);
  const python = hasAny(skills, pythonKeywords) || includesAny(day.theme, pythonKeywords);
  const web = hasAny(skills, webKeywords) || includesAny(day.theme, webKeywords);

  return {
    purpose: `Aujourd'hui, le but est de comprendre ${day.theme.toLowerCase()} et de savoir l'utiliser dans de petits exercices. Tu ne dois pas seulement copier une commande ou un code : tu dois pouvoir expliquer ce que tu fais, où tu le fais et pourquoi.`,
    before: buildDayPreparation({ terminal, python, web }),
    outcome: [
      `Expliquer avec tes mots le sujet du jour : ${day.title}.`,
      "Lancer les exercices sans rester bloqué sur l'environnement de départ.",
      "Identifier l'erreur la plus probable avant de regarder la correction.",
    ],
  };
}

export function getExerciseGuidance(exercise: Exercise): ExerciseGuidance {
  const skills = exercise.skills;
  const terminal = hasAny(skills, terminalKeywords) || includesAny(exercise.statement, terminalKeywords);
  const python = hasAny(skills, pythonKeywords) || includesAny(exercise.statement, pythonKeywords);
  const web = hasAny(skills, webKeywords) || includesAny(exercise.statement, webKeywords);
  const tests = hasAny(skills, testKeywords) || includesAny(exercise.statement, testKeywords);
  const data = hasAny(skills, dataKeywords) || includesAny(exercise.statement, dataKeywords);

  return {
    context: buildExerciseContext({ terminal, python, web, tests, data }),
    usefulness: buildUsefulness({ terminal, python, web, tests, data, skills }),
    setup: buildExerciseSetup({ terminal, python, web, tests, data }),
    actionPlan: buildActionPlan(exercise),
  };
}

function buildDayPreparation({
  terminal,
  python,
  web,
}: {
  terminal: boolean;
  python: boolean;
  web: boolean;
}) {
  const items = [
    "Prépare un endroit calme et garde la page du jour ouverte.",
    "Crée ou ouvre ton dossier de travail `but-prepa` pour ranger tes fichiers.",
  ];

  if (terminal) {
    items.push(
      "Si le cours parle d'Ubuntu, il s'agit du terminal Linux utilisé sous Windows avec WSL. Ouvre l'application Ubuntu depuis le menu Démarrer, puis commence par `pwd`.",
    );
  }

  if (python) {
    items.push(
      "Pour Python, ouvre VS Code dans ton dossier de travail, crée un fichier `.py`, puis lance-le depuis le terminal avec `python nom_du_fichier.py`.",
    );
  }

  if (web) {
    items.push(
      "Pour le web, prépare un fichier HTML, un fichier CSS si demandé, puis vérifie le résultat dans le navigateur.",
    );
  }

  items.push("Garde une trace de ce que tu as essayé : commande, résultat, erreur éventuelle.");
  return items;
}

function buildExerciseContext({
  terminal,
  python,
  web,
  tests,
  data,
}: {
  terminal: boolean;
  python: boolean;
  web: boolean;
  tests: boolean;
  data: boolean;
}) {
  if (terminal) {
    return "Le terminal est une application où tu écris des commandes au lieu de cliquer dans des menus. Ubuntu est ici l'environnement Linux qui te donne ces commandes. Avant chaque action, le réflexe important est de savoir dans quel dossier tu te trouves.";
  }

  if (python) {
    return "Python est le langage dans lequel tu écris un petit programme. Un programme lit parfois des données, calcule quelque chose, puis affiche un résultat. L'exercice sert à transformer une idée en instructions précises.";
  }

  if (web) {
    return "Une page web se construit par couches : HTML pour le contenu, CSS pour la présentation, puis parfois JavaScript pour les interactions. L'objectif est de séparer clairement ces rôles.";
  }

  if (tests) {
    return "Un test sert à prouver qu'un programme fait bien ce qui est prévu. Il évite de croire qu'un code marche juste parce qu'un seul exemple a fonctionné.";
  }

  if (data) {
    return "Un exercice sur les données consiste à lire une structure, comprendre sa forme, puis produire une information fiable sans modifier le reste au hasard.";
  }

  return "Cet exercice sert à passer d'une consigne écrite à une action concrète. Commence petit, vérifie chaque étape, puis seulement ensuite améliore ta réponse.";
}

function buildUsefulness({
  terminal,
  python,
  web,
  tests,
  data,
  skills,
}: {
  terminal: boolean;
  python: boolean;
  web: boolean;
  tests: boolean;
  data: boolean;
  skills: string[];
}) {
  if (terminal) {
    return "Ça te servira à te repérer, organiser tes fichiers, lancer des outils de développement et comprendre les messages d'erreur pendant tout le BUT.";
  }

  if (python && hasAny(skills, ["fonction", "return"])) {
    return "Ça te servira à découper un programme en petits blocs réutilisables, au lieu d'avoir un seul fichier difficile à corriger.";
  }

  if (python && hasAny(skills, ["boucle", "for", "while", "liste"])) {
    return "Ça te servira à traiter plusieurs valeurs sans répéter le même code à la main.";
  }

  if (python) {
    return "Ça te servira à écrire des scripts simples, lire des entrées, faire des calculs et afficher un résultat compréhensible.";
  }

  if (web) {
    return "Ça te servira à produire une interface lisible, à comprendre ce que voit l'utilisateur et à corriger plus vite les problèmes d'affichage.";
  }

  if (tests) {
    return "Ça te servira à vérifier ton travail sans dépendre seulement de ton intuition.";
  }

  if (data) {
    return "Ça te servira à manipuler des informations proprement, compétence centrale pour les projets, bases de données et tableaux de bord.";
  }

  return "Ça te servira à construire une méthode : lire, essayer, vérifier, corriger, puis expliquer.";
}

function buildExerciseSetup({
  terminal,
  python,
  web,
  tests,
  data,
}: {
  terminal: boolean;
  python: boolean;
  web: boolean;
  tests: boolean;
  data: boolean;
}) {
  const setup: string[] = [];

  if (terminal) {
    setup.push(
      "Ouvre Ubuntu depuis le menu Démarrer. Si tu ne l'as jamais installé, Ubuntu correspond à Linux via WSL : installe WSL/Ubuntu ou utilise un terminal Linux déjà prêt.",
      "Tape `pwd` pour connaître ton dossier actuel, puis `cd ~` pour revenir dans ton dossier personnel.",
      "Crée ou ouvre le dossier `but-prepa` pour éviter de mélanger tes essais avec d'autres fichiers.",
    );
  }

  if (python) {
    setup.push(
      "Ouvre VS Code ou ton éditeur, puis place-toi dans le dossier de travail du cours.",
      "Crée un fichier Python clair, par exemple `exercice.py`.",
      "Lance le fichier dans le terminal avec `python exercice.py` après chaque petite étape.",
    );
  }

  if (web) {
    setup.push(
      "Crée les fichiers demandés, par exemple `index.html` et `style.css`.",
      "Ouvre la page dans le navigateur et garde la fenêtre visible pendant que tu modifies.",
    );
  }

  if (tests) {
    setup.push("Prépare deux exemples de test : un cas normal et un cas limite.");
  }

  if (data) {
    setup.push("Observe d'abord un petit échantillon de données avant d'écrire le traitement.");
  }

  setup.push("Relis la consigne et surligne mentalement le résultat exact attendu.");
  return unique(setup).slice(0, 5);
}

function buildActionPlan(exercise: Exercise) {
  const steps = skillRules
    .filter((rule) => hasAny(exercise.skills, rule.keywords) || includesAny(exercise.statement, rule.keywords))
    .map((rule) => rule.step);

  return unique([
    "Reformule la consigne en une phrase : ce que je dois obtenir à la fin.",
    ...steps,
    "Teste avec un cas très simple avant de passer à l'exercice complet.",
    "Écris dans ta réponse ce que tu as fait et ce que tu as observé.",
  ]).slice(0, 6);
}

function hasAny(values: string[], keywords: string[]) {
  return values.some((value) => includesAny(value, keywords));
}

function includesAny(value: string, keywords: string[]) {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}
