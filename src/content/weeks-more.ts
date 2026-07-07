import type {
  Correction,
  Day,
  Difficulty,
  Exercise,
  LessonSection,
  QuizQuestion,
  Week,
} from "@/content/week-1";

type ExerciseSeed = {
  letter: string;
  title: string;
  difficulty: Difficulty;
  minutes: number;
  skills: string[];
  statement: string;
  mistakes: string[];
  hints: string[];
  solution: string;
  explanation: string;
  reasoning: string;
};

function lesson(
  id: string,
  title: string,
  content: string,
  exampleCode?: string,
  keyTakeaways: string[] = [],
): LessonSection {
  return { id, title, content, exampleCode, keyTakeaways };
}

function quiz(
  week: number,
  day: number,
  index: number,
  question: string,
  choices: string[],
  answer: number,
  explanation: string,
): QuizQuestion {
  return {
    id: `q-w${week}-d${day}-${index}`,
    question,
    choices,
    answer,
    explanation,
  };
}

function buildDay({
  week,
  dayNumber,
  title,
  theme,
  duration,
  morning,
  exercises,
  quizQuestions,
  revisionPrompts,
  checklist,
}: {
  week: number;
  dayNumber: number;
  title: string;
  theme: string;
  duration: string;
  morning: LessonSection[];
  exercises: ExerciseSeed[];
  quizQuestions: QuizQuestion[];
  revisionPrompts: string[];
  checklist: string[];
}): { day: Day; corrections: Correction[] } {
  const afternoonExercises: Exercise[] = [];
  const corrections: Correction[] = [];

  for (const seed of exercises) {
    const id = `w${week}-d${dayNumber}-${seed.letter.toLowerCase()}`;
    const correctionId = `c-${id}`;
    afternoonExercises.push({
      id,
      title: seed.title,
      day: dayNumber,
      difficulty: seed.difficulty,
      estimatedMinutes: seed.minutes,
      skills: seed.skills,
      statement: seed.statement,
      frequentMistakes: seed.mistakes,
      hints: seed.hints,
      correctionId,
    });
    corrections.push({
      id: correctionId,
      week,
      day: dayNumber,
      exerciseId: id,
      title: seed.title,
      solution: seed.solution,
      explanation: seed.explanation,
      reasoning: seed.reasoning,
      commonTraps: seed.mistakes,
      howToTest: [
        "Teste avec un cas simple.",
        "Teste un cas limite.",
        "Explique pourquoi le résultat est correct.",
      ],
    });
  }

  return {
    day: {
      id: `day-${dayNumber}`,
      week,
      dayNumber,
      title,
      theme,
      duration,
      morning,
      afternoonExercises,
      eveningQuiz: quizQuestions,
      revisionPrompts,
      checklist,
    },
    corrections,
  };
}

function collect(parts: Array<{ day: Day; corrections: Correction[] }>) {
  return {
    days: parts.map((part) => part.day),
    corrections: parts.flatMap((part) => part.corrections),
  };
}

const week4Parts = [
  buildDay({
    week: 4,
    dayNumber: 1,
    title: "Modules Python",
    theme: "Découper un programme en fichiers importables",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w4-d1-modules",
        "Pourquoi séparer les fichiers",
        "Un module Python est un fichier qui contient des fonctions réutilisables. Séparer le code évite les fichiers trop longs et rend les tests plus faciles.",
        "from calculs import moyenne\n\nprint(moyenne([12, 14, 16]))",
        ["un module se réutilise", "import relie les fichiers", "main.py garde le scénario principal"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Créer calculs.py",
        difficulty: "facile",
        minutes: 10,
        skills: ["module", "import"],
        statement: "Crée calculs.py avec une fonction moyenne(notes), puis importe-la dans main.py.",
        mistakes: ["Mettre tout le code dans main.py.", "Oublier que le nom du fichier devient le nom du module."],
        hints: ["Crée calculs.py.", "Écris def moyenne(notes).", "Dans main.py : from calculs import moyenne."],
        solution: `# calculs.py
def moyenne(notes):
    return sum(notes) / len(notes)

# main.py
from calculs import moyenne
print(moyenne([12, 14, 16]))`,
        explanation: "main.py importe la fonction depuis calculs.py et garde le programme principal lisible.",
        reasoning: "On sépare les calculs réutilisables du scénario d'exécution.",
      },
      {
        letter: "b",
        title: "Module affichage",
        difficulty: "moyen",
        minutes: 12,
        skills: ["module", "responsabilité"],
        statement: "Crée affichage.py avec afficher_titre(texte), puis appelle-la depuis main.py.",
        mistakes: ["Mélanger affichage et calculs dans le même module."],
        hints: ["Un module pour afficher.", "Un module pour calculer.", "main orchestre."],
        solution: `# affichage.py
def afficher_titre(texte):
    print("===")
    print(texte)
    print("===")

# main.py
from affichage import afficher_titre
afficher_titre("Gestionnaire")`,
        explanation: "Le module affichage porte une responsabilité visuelle simple.",
        reasoning: "Un bon découpage rend le projet plus prévisible.",
      },
      {
        letter: "c",
        title: "Éviter l'exécution au mauvais moment",
        difficulty: "difficile",
        minutes: 15,
        skills: ["__name__", "main"],
        statement: "Ajoute un bloc if __name__ == '__main__' pour éviter qu'un test se lance à l'import.",
        mistakes: ["Laisser des print de test au niveau global du module."],
        hints: ["Les tests rapides vont sous le if.", "Import ne doit pas lancer le programme.", "main.py reste le point d'entrée."],
        solution: `def moyenne(notes):
    return sum(notes) / len(notes)

if __name__ == "__main__":
    print(moyenne([10, 20]))`,
        explanation: "Le bloc ne s'exécute que si le fichier est lancé directement.",
        reasoning: "Un module doit pouvoir être importé sans effet surprise.",
      },
    ],
    quizQuestions: [
      quiz(4, 1, 1, "Un module Python est surtout...", ["un fichier réutilisable", "une base SQL", "un commit"], 0, "Un module est un fichier Python importable."),
      quiz(4, 1, 2, "Quel fichier garde le scénario principal ?", ["main.py", "README.md", "notes.txt"], 0, "main.py orchestre le programme."),
      quiz(4, 1, 3, "__name__ == '__main__' sert à...", ["éviter l'exécution à l'import", "trier une liste", "créer du CSS"], 0, "Le bloc ne tourne qu'en lancement direct."),
    ],
    revisionPrompts: ["Module vs script ?", "Pourquoi éviter les effets à l'import ?", "Quel rôle pour main.py ?"],
    checklist: ["Je sais créer un module.", "Je sais importer une fonction.", "Je sais isoler le point d'entrée."],
  }),
  buildDay({
    week: 4,
    dayNumber: 2,
    title: "Erreurs et exceptions",
    theme: "Gérer les erreurs utilisateur sans faire planter le programme",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w4-d2-exceptions",
        "try / except",
        "Une exception signale une erreur pendant l'exécution. try/except permet d'afficher un message clair et de continuer proprement.",
        `try:
    age = int(input("Âge : "))
except ValueError:
    print("Âge invalide")`,
        ["ValueError arrive souvent avec int/float", "un message clair vaut mieux qu'une trace incompréhensible"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Conversion sécurisée",
        difficulty: "facile",
        minutes: 8,
        skills: ["try", "ValueError"],
        statement: "Demande un entier et affiche un message clair si la saisie n'est pas un nombre.",
        mistakes: ["Mettre tout le programme dans except.", "Afficher une erreur trop vague."],
        hints: ["Essaie int(input()).", "Capture ValueError.", "Teste avec abc."],
        solution: `try:
    nombre = int(input("Nombre : "))
    print(nombre * 2)
except ValueError:
    print("Saisie invalide : entier attendu")`,
        explanation: "ValueError capture l'échec de conversion en entier.",
        reasoning: "On protège uniquement la zone qui peut échouer.",
      },
      {
        letter: "b",
        title: "Redemander tant que c'est faux",
        difficulty: "moyen",
        minutes: 15,
        skills: ["while", "exception"],
        statement: "Redemande une note tant que la saisie n'est pas un nombre valide entre 0 et 20.",
        mistakes: ["Sortir de la boucle trop tôt.", "Accepter 25."],
        hints: ["while note is None.", "try/except.", "Teste l'intervalle après conversion."],
        solution: `note = None
while note is None:
    try:
        saisie = float(input("Note : "))
        if 0 <= saisie <= 20:
            note = saisie
        else:
            print("Entre 0 et 20")
    except ValueError:
        print("Nombre attendu")
print(note)`,
        explanation: "La boucle continue tant que la variable n'a pas reçu de valeur valide.",
        reasoning: "Un programme robuste guide l'utilisateur au lieu de s'arrêter.",
      },
      {
        letter: "c",
        title: "Lecture de fichier prudente",
        difficulty: "difficile",
        minutes: 15,
        skills: ["FileNotFoundError", "fichier"],
        statement: "Lis config.txt et affiche un message clair si le fichier manque.",
        mistakes: ["Créer silencieusement un fichier vide sans prévenir."],
        hints: ["Exception FileNotFoundError.", "Message utile.", "Ne masque pas toutes les erreurs."],
        solution: `try:
    with open("config.txt", "r", encoding="utf-8") as fichier:
        print(fichier.read())
except FileNotFoundError:
    print("config.txt introuvable")`,
        explanation: "FileNotFoundError cible précisément l'absence du fichier.",
        reasoning: "Une exception précise évite de cacher d'autres vrais problèmes.",
      },
    ],
    quizQuestions: [
      quiz(4, 2, 1, "Quelle exception arrive souvent avec int('abc') ?", ["ValueError", "KeyError", "IndexError"], 0, "La conversion échoue avec ValueError."),
      quiz(4, 2, 2, "Pourquoi éviter except: tout seul ?", ["Il cache trop d'erreurs", "Il ralentit Git", "Il supprime les fichiers"], 0, "Un except trop large masque le diagnostic."),
      quiz(4, 2, 3, "Fichier absent ?", ["FileNotFoundError", "ZeroDivisionError", "NameError"], 0, "C'est l'exception dédiée."),
    ],
    revisionPrompts: ["Quand utiliser try/except ?", "Pourquoi cibler l'exception ?", "Comment redemander une saisie ?"],
    checklist: ["Je sais gérer ValueError.", "Je sais redemander une saisie.", "Je sais gérer un fichier absent."],
  }),
  buildDay({
    week: 4,
    dayNumber: 3,
    title: "Tests unitaires",
    theme: "Vérifier automatiquement les fonctions importantes",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w4-d3-tests",
        "Tester une fonction",
        "Un test automatique vérifie qu'une fonction donne toujours le résultat attendu. Il sécurise les changements.",
        `def test_moyenne():
    assert moyenne([10, 20]) == 15`,
        ["un test doit être petit", "assert compare attendu et obtenu", "tester évite les régressions"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Tester une moyenne",
        difficulty: "facile",
        minutes: 10,
        skills: ["assert", "test"],
        statement: "Écris deux assert pour vérifier moyenne([10, 20]) et moyenne([12, 14, 16]).",
        mistakes: ["Tester seulement un cas.", "Comparer à une mauvaise valeur attendue."],
        hints: ["Calcule à la main.", "Un assert par cas.", "Teste plusieurs listes."],
        solution: `assert moyenne([10, 20]) == 15
assert moyenne([12, 14, 16]) == 14`,
        explanation: "Chaque assert valide un exemple simple et vérifiable.",
        reasoning: "Un bon test part d'un résultat connu.",
      },
      {
        letter: "b",
        title: "Tester une erreur",
        difficulty: "moyen",
        minutes: 12,
        skills: ["cas limite", "None"],
        statement: "Teste que moyenne([]) renvoie None si tu as prévu ce cas.",
        mistakes: ["Oublier les listes vides."],
        hints: ["Appelle moyenne([]).", "Compare à None avec is.", "Le test doit documenter le comportement."],
        solution: `assert moyenne([]) is None`,
        explanation: "Le test fixe clairement le comportement attendu pour une liste vide.",
        reasoning: "Les cas limites doivent être aussi explicites que les cas normaux.",
      },
      {
        letter: "c",
        title: "Regrouper les tests",
        difficulty: "difficile",
        minutes: 15,
        skills: ["pytest", "organisation"],
        statement: "Crée test_calculs.py avec trois fonctions de test pour calculs.py.",
        mistakes: ["Mélanger tests et programme principal."],
        hints: ["Fichier séparé.", "Noms qui commencent par test_.", "Un comportement par test."],
        solution: `from calculs import moyenne

def test_moyenne_simple():
    assert moyenne([10, 20]) == 15

def test_moyenne_trois_notes():
    assert moyenne([12, 14, 16]) == 14

def test_moyenne_vide():
    assert moyenne([]) is None`,
        explanation: "Les fonctions test_ sont faciles à repérer et à lancer avec un outil de test.",
        reasoning: "Séparer les tests rend le projet plus professionnel.",
      },
    ],
    quizQuestions: [
      quiz(4, 3, 1, "assert sert à...", ["vérifier une condition", "écrire un fichier", "déployer"], 0, "assert échoue si la condition est fausse."),
      quiz(4, 3, 2, "Pourquoi tester plusieurs cas ?", ["Pour couvrir plus de situations", "Pour changer la police", "Pour éviter Git"], 0, "Un seul exemple ne suffit pas."),
      quiz(4, 3, 3, "Un fichier de test doit idéalement être...", ["séparé", "dans le CSS", "dans le terminal"], 0, "On sépare tests et application."),
    ],
    revisionPrompts: ["Qu'est-ce qu'un cas limite ?", "Pourquoi un test protège une modification ?", "Que signifie assert ?"],
    checklist: ["Je sais écrire un assert.", "Je sais tester un cas limite.", "Je sais organiser des tests."],
  }),
  buildDay({
    week: 4,
    dayNumber: 4,
    title: "Algorithmes classiques",
    theme: "Recherche, tri simple et complexité intuitive",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w4-d4-algo",
        "Recherche et tri",
        "Un algorithme est une méthode précise. On commence par des versions simples pour comprendre le raisonnement avant d'utiliser les fonctions prêtes.",
        `def contient(liste, valeur):
    for element in liste:
        if element == valeur:
            return True
    return False`,
        ["la recherche parcourt", "le tri compare", "la complexité mesure l'effort"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Recherche linéaire",
        difficulty: "facile",
        minutes: 10,
        skills: ["recherche", "boucle"],
        statement: "Écris contient(liste, valeur) sans utiliser in.",
        mistakes: ["Retourner False trop tôt dans la boucle."],
        hints: ["Parcours chaque élément.", "Retourne True si trouvé.", "False seulement après la boucle."],
        solution: `def contient(liste, valeur):
    for element in liste:
        if element == valeur:
            return True
    return False`,
        explanation: "False arrive uniquement après avoir vérifié tous les éléments.",
        reasoning: "Une recherche linéaire élimine les possibilités une par une.",
      },
      {
        letter: "b",
        title: "Compter les occurrences",
        difficulty: "moyen",
        minutes: 12,
        skills: ["compteur", "liste"],
        statement: "Compte combien de fois une valeur apparaît dans une liste.",
        mistakes: ["S'arrêter à la première occurrence."],
        hints: ["Compteur à 0.", "Incrémente si égal.", "Retourne à la fin."],
        solution: `def compter(liste, valeur):
    total = 0
    for element in liste:
        if element == valeur:
            total = total + 1
    return total`,
        explanation: "Le compteur augmente à chaque correspondance.",
        reasoning: "On ne cherche pas seulement l'existence, mais la quantité.",
      },
      {
        letter: "c",
        title: "Tri par sélection",
        difficulty: "difficile",
        minutes: 20,
        skills: ["tri", "minimum"],
        statement: "Explique puis code le principe du tri par sélection sur une petite liste.",
        mistakes: ["Confondre trouver le minimum et échanger."],
        hints: ["Cherche le plus petit restant.", "Échange avec la position courante.", "Répète."],
        solution: `def tri_selection(liste):
    for i in range(len(liste)):
        indice_min = i
        for j in range(i + 1, len(liste)):
            if liste[j] < liste[indice_min]:
                indice_min = j
        liste[i], liste[indice_min] = liste[indice_min], liste[i]
    return liste`,
        explanation: "À chaque tour, le plus petit élément restant est placé à sa position définitive.",
        reasoning: "Ce tri est simple à comprendre même s'il n'est pas le plus efficace.",
      },
    ],
    quizQuestions: [
      quiz(4, 4, 1, "Dans une recherche linéaire, False arrive...", ["après la boucle", "au premier élément", "avant le test"], 0, "Il faut tout vérifier avant de conclure."),
      quiz(4, 4, 2, "Compter des occurrences demande...", ["un compteur", "un fichier CSS", "une jointure"], 0, "Chaque occurrence augmente le compteur."),
      quiz(4, 4, 3, "Le tri par sélection place à chaque tour...", ["le minimum restant", "un fichier", "un serveur"], 0, "Il sélectionne le plus petit restant."),
    ],
    revisionPrompts: ["Recherche vs comptage ?", "Pourquoi False après la boucle ?", "Quel est le principe du tri par sélection ?"],
    checklist: ["Je sais chercher une valeur.", "Je sais compter.", "Je sais expliquer un tri simple."],
  }),
  buildDay({
    week: 4,
    dayNumber: 5,
    title: "Qualité de code",
    theme: "Nommage, commentaires utiles, README et revue avant rendu",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w4-d5-quality",
        "Code lisible",
        "Un code lisible se comprend sans deviner. Les noms sont clairs, les fonctions sont courtes, et les commentaires expliquent les choix difficiles.",
        `def calculer_moyenne(notes):
    if len(notes) == 0:
        return None
    return sum(notes) / len(notes)`,
        ["nom clair", "fonction courte", "commentaire seulement si utile"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Renommer proprement",
        difficulty: "facile",
        minutes: 8,
        skills: ["lisibilité", "noms"],
        statement: "Réécris un petit code avec des noms de variables clairs au lieu de a, b, c.",
        mistakes: ["Choisir des noms trop longs ou flous."],
        hints: ["Le nom doit dire le rôle.", "prix_ht vaut mieux que p.", "total_notes vaut mieux que t."],
        solution: `prix_ht = 20
taux_tva = 0.20
prix_ttc = prix_ht * (1 + taux_tva)
print(prix_ttc)`,
        explanation: "Les noms expliquent le calcul sans commentaire inutile.",
        reasoning: "La lisibilité réduit les erreurs de maintenance.",
      },
      {
        letter: "b",
        title: "README minimal",
        difficulty: "moyen",
        minutes: 12,
        skills: ["README", "documentation"],
        statement: "Écris un README avec objectif, lancement, fichiers et limites du projet.",
        mistakes: ["Écrire un roman ou ne rien expliquer."],
        hints: ["4 sections courtes.", "Commande de lancement.", "Limites honnêtes."],
        solution: `# Projet

## Objectif
Analyser une liste de notes.

## Lancer
python3 main.py

## Fichiers
main.py, calculs.py, tests.

## Limites
Pas de base de données.`,
        explanation: "Un README court aide quelqu'un d'autre à lancer le projet.",
        reasoning: "Documenter fait partie du rendu informatique.",
      },
      {
        letter: "c",
        title: "Checklist de revue",
        difficulty: "moyen",
        minutes: 12,
        skills: ["revue", "qualité"],
        statement: "Crée une checklist de 6 points à vérifier avant de rendre un projet.",
        mistakes: ["Vérifier seulement que ça marche une fois."],
        hints: ["Lisibilité.", "Tests.", "Git.", "README.", "Cas limites.", "Fichiers inutiles."],
        solution: `- Le programme se lance.
- Les noms sont clairs.
- Les cas limites sont testés.
- Le README explique le projet.
- Git status est propre.
- Aucun fichier temporaire n'est rendu.`,
        explanation: "La checklist transforme la qualité en gestes concrets.",
        reasoning: "Un bon rendu est aussi un rendu propre.",
      },
    ],
    quizQuestions: [
      quiz(4, 5, 1, "Un bon commentaire explique plutôt...", ["le pourquoi", "chaque caractère", "la couleur"], 0, "Le code explique souvent le quoi."),
      quiz(4, 5, 2, "Un README doit permettre...", ["de lancer le projet", "de remplacer le code", "de cacher les bugs"], 0, "Il guide l'utilisateur."),
      quiz(4, 5, 3, "Avant rendu, git status doit être...", ["compris", "ignoré", "supprimé"], 0, "Il faut savoir ce qui est rendu."),
    ],
    revisionPrompts: ["Qu'est-ce qu'un nom clair ?", "Que mettre dans un README ?", "Pourquoi une checklist ?"],
    checklist: ["Je sais améliorer les noms.", "Je sais écrire un README.", "Je sais faire une revue simple."],
  }),
  buildDay({
    week: 4,
    dayNumber: 6,
    title: "Mini-projet Python propre",
    theme: "Assembler modules, exceptions, tests et qualité dans un analyseur de notes",
    duration: "Projet 3 h · Tests 1 h · Bilan 30 min",
    morning: [
      lesson(
        "w4-d6-project",
        "Un projet maintenable",
        "Le projet de semaine 4 doit ressembler à un petit vrai projet : plusieurs fichiers, fonctions testées, erreurs gérées et README.",
        "notes-analyzer/\n├── main.py\n├── calculs.py\n├── test_calculs.py\n└── README.md",
        ["structure claire", "tests", "README", "gestion d'erreurs"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Créer la structure",
        difficulty: "facile",
        minutes: 12,
        skills: ["organisation", "modules"],
        statement: "Crée notes-analyzer avec main.py, calculs.py, test_calculs.py et README.md.",
        mistakes: ["Coder avant de structurer."],
        hints: ["Crée les fichiers.", "Initialise Git.", "Premier commit structure."],
        solution: "notes-analyzer/\n├── main.py\n├── calculs.py\n├── test_calculs.py\n└── README.md",
        explanation: "La structure sépare application, logique, tests et documentation.",
        reasoning: "Un projet bien rangé est plus facile à finir.",
      },
      {
        letter: "b",
        title: "Calculs testables",
        difficulty: "moyen",
        minutes: 20,
        skills: ["fonction", "test"],
        statement: "Code moyenne, minimum et maximum dans calculs.py, puis ajoute trois tests.",
        mistakes: ["Tester seulement l'affichage de main.py."],
        hints: ["Les fonctions retournent.", "Les tests appellent calculs.py.", "Un assert par comportement."],
        solution: `def moyenne(notes):
    if len(notes) == 0:
        return None
    return sum(notes) / len(notes)

def minimum(notes):
    return min(notes)

def maximum(notes):
    return max(notes)`,
        explanation: "Les fonctions retournent des valeurs faciles à tester.",
        reasoning: "La logique métier doit être indépendante de l'interface console.",
      },
      {
        letter: "c",
        title: "Interface robuste",
        difficulty: "difficile",
        minutes: 25,
        skills: ["exception", "menu"],
        statement: "Dans main.py, demande des notes en gérant les saisies invalides, puis affiche moyenne/min/max.",
        mistakes: ["Planter sur une saisie vide ou non numérique."],
        hints: ["try/except.", "Boucle de saisie.", "Appelle les fonctions de calculs.py."],
        solution: `from calculs import moyenne, minimum, maximum

notes = []
while True:
    saisie = input("Note ou fin : ")
    if saisie == "fin":
        break
    try:
        notes.append(float(saisie))
    except ValueError:
        print("Nombre attendu")

if notes:
    print("Moyenne", moyenne(notes))
    print("Min", minimum(notes))
    print("Max", maximum(notes))`,
        explanation: "Les erreurs de saisie sont absorbées et la logique de calcul reste dans calculs.py.",
        reasoning: "Le projet combine robustesse et découpage.",
      },
    ],
    quizQuestions: [
      quiz(4, 6, 1, "Pourquoi séparer calculs.py et main.py ?", ["Pour tester la logique", "Pour changer la couleur", "Pour éviter Python"], 0, "Les calculs deviennent indépendants et testables."),
      quiz(4, 6, 2, "Un projet propre contient souvent...", ["README + tests", "seulement main.py", "aucun commit"], 0, "Documentation et tests aident le rendu."),
      quiz(4, 6, 3, "Que faire d'une saisie invalide ?", ["message clair", "crash", "suppression du projet"], 0, "On guide l'utilisateur."),
    ],
    revisionPrompts: ["Quels fichiers dans le projet ?", "Que tester ?", "Comment gérer une saisie invalide ?"],
    checklist: ["Projet structuré.", "Fonctions testées.", "README écrit."],
  }),
];

const week5Parts = [
  buildDay({
    week: 5,
    dayNumber: 1,
    title: "JSON et API",
    theme: "Comprendre les données échangées entre client et serveur",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w5-d1-json",
        "JSON",
        "JSON est un format texte pour échanger des données structurées. Il ressemble aux dictionnaires Python et aux objets JavaScript.",
        `{
  "nom": "Nadia",
  "moyenne": 14.5
}`,
        ["JSON transporte des données", "une API renvoie souvent du JSON", "clé + valeur"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Lire un JSON",
        difficulty: "facile",
        minutes: 10,
        skills: ["JSON", "données"],
        statement: "Écris un objet JSON représentant un étudiant avec nom, groupe et moyenne.",
        mistakes: ["Oublier les guillemets autour des clés."],
        hints: ["Accolades.", "Clés entre guillemets.", "Valeurs séparées par virgules."],
        solution: `{
  "nom": "Nadia",
  "groupe": "A",
  "moyenne": 14.5
}`,
        explanation: "JSON structure les données avec des paires clé-valeur.",
        reasoning: "C'est le format courant entre front-end, API et base.",
      },
      {
        letter: "b",
        title: "Liste JSON",
        difficulty: "moyen",
        minutes: 12,
        skills: ["tableau", "JSON"],
        statement: "Représente trois tâches avec titre et statut dans un tableau JSON.",
        mistakes: ["Mélanger syntaxe Python et JSON."],
        hints: ["Un tableau utilise [].", "Chaque tâche est un objet.", "true/false en minuscules."],
        solution: `[
  { "titre": "SQL", "fait": true },
  { "titre": "Web", "fait": false },
  { "titre": "Sécurité", "fait": false }
]`,
        explanation: "Un tableau JSON contient plusieurs objets de même forme.",
        reasoning: "Une API renvoie souvent une liste d'éléments.",
      },
      {
        letter: "c",
        title: "Endpoint mental",
        difficulty: "moyen",
        minutes: 12,
        skills: ["API", "GET"],
        statement: "Explique ce que pourrait renvoyer GET /api/tasks.",
        mistakes: ["Confondre URL et fichier local."],
        hints: ["GET lit.", "tasks = tâches.", "Réponse JSON."],
        solution: "GET /api/tasks peut renvoyer un tableau JSON de tâches, avec id, titre et statut.",
        explanation: "L'URL décrit une ressource et la réponse transporte les données.",
        reasoning: "On pense API comme contrat entre client et serveur.",
      },
    ],
    quizQuestions: [
      quiz(5, 1, 1, "JSON sert à...", ["échanger des données", "styler une page", "committer"], 0, "C'est un format de données."),
      quiz(5, 1, 2, "Une liste JSON utilise...", ["[]", "()", "<>"], 0, "Les tableaux JSON utilisent des crochets."),
      quiz(5, 1, 3, "GET sert surtout à...", ["lire", "supprimer", "compiler"], 0, "GET demande une ressource."),
    ],
    revisionPrompts: ["JSON vs dictionnaire ?", "À quoi sert une API ?", "Que renvoie un GET ?"],
    checklist: ["Je sais lire du JSON.", "Je sais représenter une liste.", "Je comprends une route API simple."],
  }),
  buildDay({
    week: 5,
    dayNumber: 2,
    title: "CRUD",
    theme: "Créer, lire, modifier et supprimer des données",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w5-d2-crud",
        "Les 4 opérations",
        "CRUD résume les actions de base sur une donnée : Create, Read, Update, Delete.",
        "POST /tasks\nGET /tasks\nPATCH /tasks/1\nDELETE /tasks/1",
        ["POST crée", "GET lit", "PATCH modifie", "DELETE supprime"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Classer les routes",
        difficulty: "facile",
        minutes: 8,
        skills: ["CRUD", "HTTP"],
        statement: "Associe POST, GET, PATCH et DELETE aux actions créer, lire, modifier, supprimer.",
        mistakes: ["Dire que GET modifie une donnée."],
        hints: ["GET lit.", "POST crée.", "DELETE est explicite."],
        solution: "POST = créer, GET = lire, PATCH = modifier, DELETE = supprimer.",
        explanation: "Chaque méthode HTTP porte une intention.",
        reasoning: "CRUD donne une grille simple pour concevoir une application.",
      },
      {
        letter: "b",
        title: "Modèle tâche",
        difficulty: "moyen",
        minutes: 10,
        skills: ["modèle", "données"],
        statement: "Définis les champs minimaux d'une tâche pour une application de révision.",
        mistakes: ["Oublier l'identifiant."],
        hints: ["id.", "titre.", "statut terminé ou non.", "catégorie optionnelle."],
        solution: `{
  "id": 1,
  "titre": "Réviser SQL",
  "fait": false,
  "categorie": "sql"
}`,
        explanation: "id identifie, titre décrit, fait indique l'état.",
        reasoning: "Un modèle clair rend les routes CRUD plus simples.",
      },
      {
        letter: "c",
        title: "Pseudo-code suppression",
        difficulty: "difficile",
        minutes: 15,
        skills: ["DELETE", "sécurité"],
        statement: "Décris les étapes pour supprimer une tâche en évitant de supprimer au hasard.",
        mistakes: ["Supprimer sans vérifier l'id."],
        hints: ["Recevoir id.", "Vérifier existence.", "Supprimer.", "Répondre."],
        solution: "Recevoir l'id, chercher la tâche, répondre 404 si elle n'existe pas, supprimer si elle existe, puis répondre succès.",
        explanation: "La vérification évite de prétendre supprimer une donnée absente.",
        reasoning: "Une API doit gérer le cas normal et le cas erreur.",
      },
    ],
    quizQuestions: [
      quiz(5, 2, 1, "CRUD signifie...", ["Create Read Update Delete", "Code Run Upload Deploy", "Client Route User Data"], 0, "Ce sont les quatre opérations de base."),
      quiz(5, 2, 2, "PATCH sert à...", ["modifier", "lire", "trier"], 0, "PATCH modifie partiellement."),
      quiz(5, 2, 3, "Pourquoi avoir un id ?", ["identifier une donnée", "changer la couleur", "ouvrir Git"], 0, "L'id rend la donnée ciblable."),
    ],
    revisionPrompts: ["Explique CRUD.", "Quelle méthode pour créer ?", "Pourquoi vérifier avant suppression ?"],
    checklist: ["Je sais nommer les opérations.", "Je sais proposer un modèle.", "Je sais penser les cas erreur."],
  }),
  buildDay({
    week: 5,
    dayNumber: 3,
    title: "Authentification",
    theme: "Comprendre session, rôle, accès et protection des données",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w5-d3-auth",
        "Identifier et autoriser",
        "Authentifier, c'est savoir qui est l'utilisateur. Autoriser, c'est décider ce qu'il peut faire.",
        "Utilisateur connecté -> session -> accès à ses données",
        ["authentification = identité", "autorisation = droits", "une session évite de redemander le mot de passe"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Auth vs droits",
        difficulty: "facile",
        minutes: 8,
        skills: ["auth", "sécurité"],
        statement: "Explique la différence entre authentification et autorisation avec un exemple.",
        mistakes: ["Utiliser les deux mots comme synonymes."],
        hints: ["Qui es-tu ?", "Qu'as-tu le droit de faire ?", "Exemple admin."],
        solution: "Authentification : prouver son identité. Autorisation : vérifier les actions permises. Un utilisateur connecté n'est pas forcément administrateur.",
        explanation: "Les deux notions se suivent mais ne disent pas la même chose.",
        reasoning: "Cette distinction est centrale pour protéger une application.",
      },
      {
        letter: "b",
        title: "Donnée propriétaire",
        difficulty: "moyen",
        minutes: 12,
        skills: ["user_id", "RLS"],
        statement: "Explique pourquoi une tâche devrait stocker user_id.",
        mistakes: ["Croire que cacher le bouton suffit."],
        hints: ["La donnée appartient à quelqu'un.", "Le serveur doit vérifier.", "user_id relie tâche et utilisateur."],
        solution: "user_id permet de savoir à quel utilisateur appartient la tâche et de filtrer les accès côté serveur ou base.",
        explanation: "L'interface ne suffit pas : la règle doit exister dans la couche de données.",
        reasoning: "Une vraie protection ne dépend pas seulement du front-end.",
      },
      {
        letter: "c",
        title: "Règle d'accès",
        difficulty: "difficile",
        minutes: 15,
        skills: ["policy", "sécurité"],
        statement: "Écris en français une règle : un utilisateur ne peut lire que ses propres tâches.",
        mistakes: ["Autoriser tout le monde par défaut."],
        hints: ["Comparer user connecté et user_id.", "Lire seulement si égal.", "Refuser sinon."],
        solution: "Autoriser la lecture d'une tâche seulement si task.user_id est égal à l'id de l'utilisateur connecté.",
        explanation: "La règle compare propriétaire de la ligne et utilisateur courant.",
        reasoning: "C'est le principe derrière les politiques de sécurité en base.",
      },
    ],
    quizQuestions: [
      quiz(5, 3, 1, "Authentification répond à...", ["qui es-tu ?", "combien ?", "quelle couleur ?"], 0, "Elle identifie."),
      quiz(5, 3, 2, "Autorisation répond à...", ["as-tu le droit ?", "quel CSS ?", "quel tri ?"], 0, "Elle vérifie les droits."),
      quiz(5, 3, 3, "Pourquoi user_id ?", ["lier une donnée à un utilisateur", "agrandir le texte", "créer un fichier"], 0, "C'est la propriété de la donnée."),
    ],
    revisionPrompts: ["Auth vs autorisation ?", "Pourquoi user_id ?", "Pourquoi ne pas faire confiance au front ?"],
    checklist: ["Je sais distinguer identité et droits.", "Je sais expliquer user_id.", "Je sais formuler une règle d'accès."],
  }),
  buildDay({
    week: 5,
    dayNumber: 4,
    title: "Déploiement",
    theme: "Comprendre build, variables d'environnement et production",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w5-d4-deploy",
        "Local vs production",
        "En local tu développes. En production, l'application est construite, optimisée et servie publiquement. Les variables d'environnement configurent les services.",
        "pnpm build\nvercel deploy --prod",
        ["build vérifie", "production publie", "env configure"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Lire un log de build",
        difficulty: "facile",
        minutes: 8,
        skills: ["build", "logs"],
        statement: "Liste trois informations utiles à chercher dans un log de build.",
        mistakes: ["Lire seulement la dernière ligne."],
        hints: ["Erreur TypeScript.", "Route générée.", "Variable manquante."],
        solution: "Chercher : erreur de compilation, erreur TypeScript, routes générées, variable d'environnement manquante.",
        explanation: "Un log de build raconte où la construction s'arrête ou réussit.",
        reasoning: "Savoir lire un log évite de corriger au hasard.",
      },
      {
        letter: "b",
        title: "Variable publique ou secrète",
        difficulty: "moyen",
        minutes: 12,
        skills: ["env", "secret"],
        statement: "Classe une URL publique Supabase et une clé serveur secrète.",
        mistakes: ["Mettre une clé serveur côté navigateur."],
        hints: ["NEXT_PUBLIC est visible.", "Service role est secret.", "Le navigateur peut lire le JS."],
        solution: "Une URL publique peut être exposée. Une clé serveur/service role doit rester côté serveur et dans les variables secrètes.",
        explanation: "Toutes les variables d'environnement n'ont pas le même niveau de confidentialité.",
        reasoning: "Le déploiement demande de distinguer configuration publique et secret.",
      },
      {
        letter: "c",
        title: "Checklist avant prod",
        difficulty: "difficile",
        minutes: 15,
        skills: ["production", "qualité"],
        statement: "Écris une checklist de 6 points avant déploiement production.",
        mistakes: ["Déployer sans build local ni vérification."],
        hints: ["lint.", "build.", "env.", "routes.", "console.", "rollback."],
        solution: "- lint OK\n- build OK\n- variables env configurées\n- routes principales testées\n- pas d'erreurs console\n- plan de retour arrière connu",
        explanation: "Une checklist réduit les oublis avant publication.",
        reasoning: "La production impose une discipline minimale.",
      },
    ],
    quizQuestions: [
      quiz(5, 4, 1, "build sert à...", ["construire et vérifier", "écrire le README", "supprimer Git"], 0, "Le build prépare la production."),
      quiz(5, 4, 2, "Un secret doit être...", ["côté serveur", "dans le HTML", "dans le CSS"], 0, "Un secret ne doit pas être envoyé au navigateur."),
      quiz(5, 4, 3, "Avant prod, on vérifie...", ["lint et build", "seulement la couleur", "rien"], 0, "Les contrôles évitent les régressions."),
    ],
    revisionPrompts: ["Local vs production ?", "Variable publique vs secrète ?", "Que lire dans les logs ?"],
    checklist: ["Je sais lire un build.", "Je sais classer les variables.", "Je sais préparer une mise en prod."],
  }),
  buildDay({
    week: 5,
    dayNumber: 5,
    title: "Revue et correction",
    theme: "Déboguer méthodiquement et améliorer sans casser",
    duration: "Matin 2 h · Exercices 2 h · Soir 30 min",
    morning: [
      lesson(
        "w5-d5-debug",
        "Méthode de debug",
        "Un bug se traite en reproduisant, observant, isolant, corrigeant et vérifiant. On évite les changements au hasard.",
        "reproduire -> observer -> isoler -> corriger -> tester",
        ["reproduire d'abord", "une hypothèse à la fois", "vérifier après correction"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Rapport de bug",
        difficulty: "facile",
        minutes: 10,
        skills: ["debug", "communication"],
        statement: "Écris un rapport de bug avec étapes, résultat obtenu et résultat attendu.",
        mistakes: ["Dire seulement ça ne marche pas."],
        hints: ["Étapes précises.", "Ce que tu vois.", "Ce que tu voulais."],
        solution: "Étapes : ouvrir /tasks, cliquer Ajouter sans texte. Obtenu : tâche vide créée. Attendu : message d'erreur.",
        explanation: "Un rapport précis rend le bug reproductible.",
        reasoning: "Sans reproduction, la correction devient une devinette.",
      },
      {
        letter: "b",
        title: "Isoler la cause",
        difficulty: "moyen",
        minutes: 12,
        skills: ["hypothèse", "test"],
        statement: "Pour une moyenne fausse, propose trois hypothèses à vérifier.",
        mistakes: ["Changer toute la fonction d'un coup."],
        hints: ["Conversion.", "Compteur.", "Division.", "Liste vide."],
        solution: "Hypothèses : les notes sont du texte, le compteur est faux, la division utilise le mauvais dénominateur.",
        explanation: "Chaque hypothèse se teste séparément.",
        reasoning: "Le debug efficace réduit le champ de recherche.",
      },
      {
        letter: "c",
        title: "Revue de code",
        difficulty: "difficile",
        minutes: 18,
        skills: ["review", "qualité"],
        statement: "Relis un petit projet et note 5 améliorations possibles sans tout réécrire.",
        mistakes: ["Transformer la revue en réécriture totale."],
        hints: ["Noms.", "Fonctions.", "Tests.", "Erreurs.", "README."],
        solution: "- Renommer les variables floues\n- Extraire une fonction\n- Ajouter un test de cas vide\n- Gérer ValueError\n- Compléter README",
        explanation: "Une revue utile propose des améliorations concrètes et limitées.",
        reasoning: "Savoir améliorer sans casser est une compétence essentielle.",
      },
    ],
    quizQuestions: [
      quiz(5, 5, 1, "Première étape debug ?", ["reproduire", "tout réécrire", "déployer"], 0, "Il faut voir le bug."),
      quiz(5, 5, 2, "Une hypothèse doit être...", ["testable", "vague", "secrète"], 0, "On doit pouvoir la vérifier."),
      quiz(5, 5, 3, "Une revue utile est...", ["concrète", "méchante", "hors sujet"], 0, "Elle aide à améliorer."),
    ],
    revisionPrompts: ["Comment écrire un bug report ?", "Pourquoi une hypothèse à la fois ?", "Que regarder en revue ?"],
    checklist: ["Je sais reproduire.", "Je sais isoler.", "Je sais proposer une amélioration."],
  }),
  buildDay({
    week: 5,
    dayNumber: 6,
    title: "Projet intégrateur",
    theme: "Assembler données, web, sécurité, debug et déploiement",
    duration: "Projet 4 h · Tests 1 h · Bilan 30 min",
    morning: [
      lesson(
        "w5-d6-final",
        "Rendu final",
        "Le dernier projet doit montrer que tu sais construire, expliquer, tester et publier un petit outil cohérent.",
        "idée -> modèle -> interface -> validation -> tests -> déploiement",
        ["cohérence", "tests", "sécurité", "explication"],
      ),
    ],
    exercises: [
      {
        letter: "a",
        title: "Choisir le sujet",
        difficulty: "facile",
        minutes: 12,
        skills: ["cadrage", "produit"],
        statement: "Choisis un outil simple : tâches, notes, révisions ou journal, puis écris son objectif en une phrase.",
        mistakes: ["Choisir un projet trop grand."],
        hints: ["Un utilisateur.", "Un problème.", "Une action principale."],
        solution: "Objectif : permettre à un étudiant d'ajouter des notions à réviser et de suivre celles qui sont terminées.",
        explanation: "Un objectif court évite de partir dans tous les sens.",
        reasoning: "Un bon projet commence par un périmètre maîtrisé.",
      },
      {
        letter: "b",
        title: "Modèle et routes",
        difficulty: "moyen",
        minutes: 20,
        skills: ["modèle", "CRUD"],
        statement: "Décris le modèle de donnée et les routes CRUD de ton outil.",
        mistakes: ["Coder sans savoir quelles données existent."],
        hints: ["id.", "titre.", "statut.", "GET/POST/PATCH/DELETE."],
        solution: "Modèle : task(id, title, done, user_id). Routes : GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id.",
        explanation: "Le modèle et les routes forment le contrat de l'application.",
        reasoning: "Ce cadrage relie base, API et interface.",
      },
      {
        letter: "c",
        title: "Plan de rendu",
        difficulty: "difficile",
        minutes: 25,
        skills: ["déploiement", "qualité"],
        statement: "Écris le plan final : tests, sécurité, README, capture et URL de production.",
        mistakes: ["Rendre seulement le code."],
        hints: ["Tests.", "Validation.", "Secrets.", "README.", "Lien."],
        solution: "- Tests principaux OK\n- Validation des entrées\n- Secrets hors client\n- README clair\n- Capture écran\n- URL production vérifiée",
        explanation: "Un rendu complet prouve le fonctionnement et la démarche.",
        reasoning: "Le BUT évalue autant la construction que la capacité à expliquer.",
      },
    ],
    quizQuestions: [
      quiz(5, 6, 1, "Un projet final doit surtout être...", ["cohérent et testable", "énorme", "sans README"], 0, "Le périmètre maîtrisé compte."),
      quiz(5, 6, 2, "Le modèle de donnée sert à...", ["clarifier ce qu'on stocke", "changer la police", "lancer Git"], 0, "Il structure le projet."),
      quiz(5, 6, 3, "Une URL prod doit être...", ["vérifiée", "inventée", "cachée"], 0, "Il faut tester la page publique."),
    ],
    revisionPrompts: ["Quel sujet choisir ?", "Quelles routes CRUD ?", "Quelle checklist finale ?"],
    checklist: ["Sujet cadré.", "Modèle écrit.", "Rendu vérifié."],
  }),
];

const week4Collected = collect(week4Parts);
const week5Collected = collect(week5Parts);

export const week4: Week = {
  id: "week-4",
  weekNumber: 4,
  title: "Python solide et qualité",
  subtitle: "Tu apprends à structurer, tester, corriger et relire du code Python comme un vrai petit projet.",
  objectives: [
    "Découper un programme en modules.",
    "Gérer les erreurs utilisateur avec des exceptions ciblées.",
    "Écrire des tests unitaires simples.",
    "Comprendre recherche, comptage et tri simple.",
    "Préparer un rendu propre avec README et checklist.",
  ],
  overview:
    "La semaine 4 transforme les scripts en projets maintenables : modules, exceptions, tests, algorithmes et qualité.",
  schedule: [
    { block: "Jour 1", theme: "Modules Python", duration: "2 h 30" },
    { block: "Jour 2", theme: "Exceptions", duration: "2 h 30" },
    { block: "Jour 3", theme: "Tests unitaires", duration: "2 h 30" },
    { block: "Jour 4", theme: "Algorithmes", duration: "2 h 30" },
    { block: "Jour 5", theme: "Qualité de code", duration: "2 h 30" },
    { block: "Jour 6", theme: "Mini-projet Python propre", duration: "3 h" },
  ],
  targetLevel: [
    "Je sais séparer main.py et modules.",
    "Je sais gérer une saisie invalide.",
    "Je sais écrire des assert utiles.",
    "Je peux expliquer une recherche linéaire.",
    "Je sais préparer un rendu propre.",
  ],
  days: week4Collected.days,
  corrections: week4Collected.corrections,
  project: {
    id: "project-week-4",
    title: "Analyseur de notes propre",
    brief: "Créer un projet Python structuré avec modules, tests, gestion d'erreurs et README.",
    requiredFeatures: [
      "Séparer main.py et calculs.py.",
      "Calculer moyenne, minimum et maximum.",
      "Gérer les saisies invalides.",
      "Ajouter des tests automatiques.",
      "Écrire un README de lancement.",
    ],
    bonusFeatures: [
      "Importer des notes depuis un fichier.",
      "Afficher un histogramme texte.",
      "Ajouter un test pour liste vide.",
      "Créer une checklist de rendu.",
    ],
    fileStructure: "notes-analyzer/\n├── main.py\n├── calculs.py\n├── test_calculs.py\n└── README.md",
    steps: [
      "Créer la structure.",
      "Coder calculs.py.",
      "Ajouter les tests.",
      "Coder main.py avec try/except.",
      "Relire et documenter.",
    ],
    successCriteria: [
      "Les modules sont séparés.",
      "Les calculs retournent des valeurs.",
      "Les tests passent.",
      "Les erreurs de saisie sont gérées.",
      "Le README explique le lancement.",
    ],
    grading: [
      { criterion: "Modules", points: 4 },
      { criterion: "Calculs", points: 4 },
      { criterion: "Exceptions", points: 4 },
      { criterion: "Tests", points: 5 },
      { criterion: "README", points: 3 },
    ],
    solution: `# calculs.py
def moyenne(notes):
    if len(notes) == 0:
        return None
    return sum(notes) / len(notes)

def minimum(notes):
    return min(notes)

def maximum(notes):
    return max(notes)

# main.py
from calculs import moyenne, minimum, maximum

notes = []
while True:
    saisie = input("Note ou fin : ")
    if saisie == "fin":
        break
    try:
        notes.append(float(saisie))
    except ValueError:
        print("Nombre attendu")

if notes:
    print("Moyenne", moyenne(notes))
    print("Min", minimum(notes))
    print("Max", maximum(notes))`,
  },
  checkpoint: {
    id: "checkpoint-week-4",
    title: "Bilan semaine 4 - Python solide",
    duration: "1 h 45",
    totalPoints: 100,
    tasks: [
      { id: "w4-cp-modules", block: "Modules", title: "Import propre", points: 20, statement: "Sépare moyenne(notes) dans calculs.py et importe-la dans main.py." },
      { id: "w4-cp-exceptions", block: "Exceptions", title: "Saisie robuste", points: 20, statement: "Gère une saisie non numérique avec ValueError." },
      { id: "w4-cp-tests", block: "Tests", title: "Assert", points: 20, statement: "Écris trois assert pour moyenne(notes)." },
      { id: "w4-cp-algo", block: "Algo", title: "Recherche", points: 20, statement: "Écris contient(liste, valeur) sans utiliser in." },
      { id: "w4-cp-quality", block: "Qualité", title: "README", points: 20, statement: "Rédige un README minimal et une checklist de rendu." },
    ],
    passCriteria: ["70 points ou plus.", "Tests et exceptions compris.", "Projet structuré rendu."],
    reviewAdvice: [
      { if: "Tu bloques sur modules", then: "Refais import depuis un fichier calculs.py minimal." },
      { if: "Tu bloques sur tests", then: "Commence avec assert 1 + 1 == 2 puis teste tes fonctions." },
    ],
  },
  sheets: [
    { id: "w4-sheet-modules", title: "Modules Python", items: ["main.py orchestre", "un module regroupe des fonctions", "import relie les fichiers", "__main__ évite les effets à l'import"] },
    { id: "w4-sheet-tests", title: "Tests rapides", items: ["assert vérifie", "un cas simple", "un cas limite", "un fichier test_ séparé"] },
  ],
  revisionCards: [
    { id: "w4-card-module", title: "Module", front: "Pourquoi séparer calculs.py ?", back: "Pour réutiliser et tester la logique.", skill: "modules" },
    { id: "w4-card-exception", title: "Exception", front: "Quelle exception pour int('abc') ?", back: "ValueError.", skill: "exceptions" },
    { id: "w4-card-test", title: "Test", front: "Que fait assert ?", back: "Il vérifie qu'une condition est vraie.", skill: "tests" },
  ],
};

export const week5: Week = {
  id: "week-5",
  weekNumber: 5,
  title: "Projet web et production",
  subtitle: "Tu relies JSON, CRUD, auth, sécurité, debug et déploiement dans un projet intégrateur.",
  objectives: [
    "Lire et écrire des données JSON.",
    "Comprendre les opérations CRUD.",
    "Distinguer authentification et autorisation.",
    "Préparer un déploiement propre.",
    "Présenter un projet final vérifié.",
  ],
  overview:
    "La semaine 5 prépare un rendu final : API, données, sécurité, déploiement et revue de projet.",
  schedule: [
    { block: "Jour 1", theme: "JSON et API", duration: "2 h 30" },
    { block: "Jour 2", theme: "CRUD", duration: "2 h 30" },
    { block: "Jour 3", theme: "Authentification", duration: "2 h 30" },
    { block: "Jour 4", theme: "Déploiement", duration: "2 h 30" },
    { block: "Jour 5", theme: "Debug et revue", duration: "2 h 30" },
    { block: "Jour 6", theme: "Projet intégrateur", duration: "4 h" },
  ],
  targetLevel: [
    "Je sais expliquer une réponse JSON.",
    "Je sais associer CRUD et méthodes HTTP.",
    "Je sais expliquer user_id et droits.",
    "Je sais préparer un build et vérifier une URL prod.",
    "Je peux présenter un projet avec limites et tests.",
  ],
  days: week5Collected.days,
  corrections: week5Collected.corrections,
  project: {
    id: "project-week-5",
    title: "Outil de révision complet",
    brief: "Concevoir un petit outil de révision avec modèle de données, interactions, validation, sécurité et plan de déploiement.",
    requiredFeatures: [
      "Modèle de donnée clair.",
      "Actions CRUD décrites.",
      "Interface lisible.",
      "Validation des entrées.",
      "README avec sécurité et déploiement.",
    ],
    bonusFeatures: [
      "Sauvegarde en localStorage ou Supabase.",
      "Filtre par catégorie.",
      "Mode terminé / à revoir.",
      "Capture écran du rendu final.",
    ],
    fileStructure: "revision-final/\n├── index.html\n├── style.css\n├── app.js\n└── README.md",
    steps: [
      "Cadrer le besoin.",
      "Écrire le modèle de donnée.",
      "Créer l'interface.",
      "Ajouter les interactions.",
      "Valider, tester et documenter.",
    ],
    successCriteria: [
      "Le projet a un objectif clair.",
      "Les données sont structurées.",
      "Les actions principales fonctionnent.",
      "Les entrées sont validées.",
      "Le rendu explique ses limites.",
    ],
    grading: [
      { criterion: "Cadrage", points: 4 },
      { criterion: "Données", points: 4 },
      { criterion: "Interface", points: 4 },
      { criterion: "Interaction", points: 4 },
      { criterion: "Sécurité + README", points: 4 },
    ],
    solution: `const input = document.querySelector("#notion");
const liste = document.querySelector("#liste");
const total = document.querySelector("#total");
let compteur = 0;

document.querySelector("#ajouter").addEventListener("click", () => {
  const texte = input.value.trim();
  if (texte === "") {
    return;
  }
  const li = document.createElement("li");
  li.textContent = texte;
  liste.append(li);
  compteur = compteur + 1;
  total.textContent = compteur;
  input.value = "";
});`,
  },
  checkpoint: {
    id: "checkpoint-week-5",
    title: "Bilan semaine 5 - Projet et production",
    duration: "2 h",
    totalPoints: 100,
    tasks: [
      { id: "w5-cp-json", block: "Données", title: "JSON", points: 15, statement: "Écris un JSON représentant une tâche de révision." },
      { id: "w5-cp-crud", block: "API", title: "CRUD", points: 20, statement: "Associe routes et méthodes pour créer, lire, modifier, supprimer." },
      { id: "w5-cp-auth", block: "Sécurité", title: "Droits", points: 20, statement: "Explique authentification, autorisation et user_id." },
      { id: "w5-cp-deploy", block: "Production", title: "Checklist", points: 20, statement: "Écris une checklist avant déploiement." },
      { id: "w5-cp-final", block: "Projet", title: "Présentation", points: 25, statement: "Présente objectif, modèle, tests, limites et URL de ton projet." },
    ],
    passCriteria: ["70 points ou plus.", "Projet final expliqué.", "Sécurité et déploiement compris."],
    reviewAdvice: [
      { if: "Tu bloques sur CRUD", then: "Reviens au tableau POST/GET/PATCH/DELETE." },
      { if: "Tu bloques sur production", then: "Refais la checklist lint, build, env, URL." },
    ],
  },
  sheets: [
    { id: "w5-sheet-crud", title: "CRUD + HTTP", items: ["POST crée", "GET lit", "PATCH modifie", "DELETE supprime"] },
    { id: "w5-sheet-prod", title: "Production", items: ["lint OK", "build OK", "variables env", "URL vérifiée", "logs surveillés"] },
  ],
  revisionCards: [
    { id: "w5-card-json", title: "JSON", front: "À quoi sert JSON ?", back: "À échanger des données structurées.", skill: "json" },
    { id: "w5-card-crud", title: "CRUD", front: "Quelle méthode crée ?", back: "POST.", skill: "crud" },
    { id: "w5-card-auth", title: "Auth", front: "Auth vs autorisation ?", back: "Identité vs droits.", skill: "sécurité" },
  ],
};
