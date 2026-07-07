export type GlossaryEntry = {
  term: string;
  definition: string;
  aliases: string[];
};

export const glossary: GlossaryEntry[] = [
  {
    term: "terminal",
    definition: "Interface textuelle pour donner des commandes au système.",
    aliases: ["console", "shell", "ligne de commande"],
  },
  {
    term: "chemin relatif",
    definition: "Chemin décrit depuis le dossier courant, par exemple ../a/note.txt.",
    aliases: ["relatif", ".."],
  },
  {
    term: "chemin absolu",
    definition: "Chemin complet depuis la racine ou le dossier personnel.",
    aliases: ["absolu", "adresse complète"],
  },
  {
    term: "variable",
    definition: "Nom qui désigne une valeur stockée pour être réutilisée.",
    aliases: ["boîte", "stockage"],
  },
  {
    term: "input",
    definition: "Fonction Python qui demande une saisie et renvoie du texte.",
    aliases: ["saisie", "entrée"],
  },
  {
    term: "condition",
    definition: "Question qui produit True ou False et permet de choisir un bloc de code.",
    aliases: ["if", "elif", "else", "booléen"],
  },
  {
    term: "boucle",
    definition: "Structure qui répète une action, avec for ou while.",
    aliases: ["for", "while", "range"],
  },
  {
    term: "accumulateur",
    definition: "Variable mise à jour à chaque tour pour construire un total ou un produit.",
    aliases: ["total", "somme", "compteur"],
  },
  {
    term: "fonction",
    definition: "Bloc nommé qui reçoit des paramètres, réalise une tâche et peut renvoyer une valeur.",
    aliases: ["def", "return", "paramètre", "argument"],
  },
  {
    term: "liste",
    definition: "Collection ordonnée de valeurs, indexée à partir de 0.",
    aliases: ["array", "notes", "append"],
  },
  {
    term: "slice",
    definition: "Syntaxe d'extraction d'un morceau de chaîne ou de liste, comme mot[::-1].",
    aliases: ["tranche", "index"],
  },
];
