export type Difficulty = "facile" | "moyen" | "difficile" | "bonus";

export type LessonSection = {
  id: string;
  title: string;
  content: string;
  exampleCode?: string;
  keyTakeaways?: string[];
  analogy?: string;
  frequentMistakes?: string[];
};

export type Exercise = {
  id: string;
  title: string;
  day: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  skills: string[];
  statement: string;
  frequentMistakes: string[];
  hints: string[];
  correctionId: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export type Day = {
  id: string;
  week: number;
  dayNumber: number;
  title: string;
  theme: string;
  duration: string;
  morning: LessonSection[];
  afternoonExercises: Exercise[];
  eveningQuiz: QuizQuestion[];
  revisionPrompts: string[];
  checklist: string[];
};

export type Correction = {
  id: string;
  week: number;
  day: number;
  exerciseId: string;
  title: string;
  solution: string;
  explanation: string;
  reasoning: string;
  commonTraps: string[];
  howToTest: string[];
  variant?: string;
};

export type RevisionCard = {
  id: string;
  title: string;
  front: string;
  back: string;
  skill: string;
};

export type ReferenceSheet = {
  id: string;
  title: string;
  items: string[];
  code?: string;
};

export type CheckpointTask = {
  id: string;
  block: string;
  title: string;
  points: number;
  statement: string;
};

export type Week = {
  id: string;
  weekNumber: number;
  title: string;
  subtitle: string;
  objectives: string[];
  overview: string;
  schedule: Array<{ block: string; theme: string; duration: string }>;
  targetLevel: string[];
  days: Day[];
  corrections: Correction[];
  project: {
    id: string;
    title: string;
    brief: string;
    requiredFeatures: string[];
    bonusFeatures: string[];
    fileStructure: string;
    steps: string[];
    successCriteria: string[];
    grading: Array<{ criterion: string; points: number }>;
    solution: string;
  };
  checkpoint: {
    id: string;
    title: string;
    duration: string;
    totalPoints: number;
    tasks: CheckpointTask[];
    passCriteria: string[];
    reviewAdvice: Array<{ if: string; then: string }>;
  };
  sheets: ReferenceSheet[];
  revisionCards: RevisionCard[];
};

const exercise = (
  day: number,
  letter: string,
  title: string,
  difficulty: Difficulty,
  estimatedMinutes: number,
  skills: string[],
  statement: string,
  frequentMistakes: string[],
  hints: string[],
): Exercise => {
  const id = `d${day}-${letter.toLowerCase()}`;
  return {
    id,
    title,
    day,
    difficulty,
    estimatedMinutes,
    skills,
    statement,
    frequentMistakes,
    hints,
    correctionId: `c-${id}`,
  };
};

const quiz = (
  day: number,
  index: number,
  question: string,
  choices: string[],
  answer: number,
  explanation: string,
): QuizQuestion => ({
  id: `q-d${day}-${index}`,
  question,
  choices,
  answer,
  explanation,
});

const day1Exercises = [
  exercise(1, "a", "Où suis-je ?", "facile", 3, ["pwd", "repérage spatial"], "Dans le terminal du site, commence dans ton dossier personnel avec `cd ~`, puis affiche le chemin du dossier courant avec `pwd`. Le but est de comprendre où tu te trouves avant d'agir.", ["Utiliser ls au lieu de pwd.", "Taper les commandes en majuscules alors que Linux utilise normalement les minuscules."], ["Cherche la commande qui dit où je suis.", "Elle tient en trois lettres.", "Elle commence par p."]),
  exercise(1, "b", "Construire le socle", "facile", 8, ["mkdir", "cd", "organisation"], "Dans ton dossier personnel, crée d'abord le dossier `but-prepa`, entre dedans avec `cd but-prepa`, puis crée les trois sous-dossiers `00_admin`, `01_python_algo` et `02_linux` avec `mkdir`. Vérifie avec `ls`.", ["Créer les dossiers au mauvais endroit.", "Oublier d'entrer dans but-prepa avant de créer les trois sous-dossiers."], ["Commence par cd ~.", "Crée but-prepa avec mkdir but-prepa.", "Entre dedans avant de créer les trois sous-dossiers."]),
  exercise(1, "c", "Aller au bon endroit sans te perdre", "facile", 5, ["cd", "chemin relatif"], "Depuis ~/but-prepa, va dans 01_python_algo, reviens dans but-prepa, puis va dans 02_linux sans retaper un chemin absolu complet.", ["Utiliser toujours ~ au lieu d'apprendre le relatif."], ["Entre dans 01_python_algo avec cd.", "Pour revenir au parent, pense à ...", "Repars ensuite vers 02_linux."]),
  exercise(1, "d", "Premier fichier texte", "moyen", 8, ["echo", "redirection", "cat"], "Dans ~/but-prepa/02_linux/commandes, crée un fichier commandes.txt qui contient trois lignes : pwd, ls, cd. Puis affiche son contenu.", ["Utiliser > plusieurs fois et écraser le fichier."], ["> écrit dans un fichier.", ">> ajoute à la fin.", "Utilise cat pour vérifier."]),
  exercise(1, "e", "Copier puis renommer", "moyen", 6, ["cp", "mv"], "Fais une copie de commandes.txt nommée commandes_backup.txt. Puis renomme cette copie en mes_commandes.txt.", ["Déplacer au lieu de copier."], ["La copie se fait avec cp.", "Le renommage se fait avec mv.", "Travaille dans le bon dossier."]),
  exercise(1, "f", "Déplacer dans une archive", "moyen", 6, ["mkdir", "mv", "ls"], "Crée un dossier archives dans ~/but-prepa/02_linux/commandes, puis déplace mes_commandes.txt dans ce dossier. Vérifie le résultat.", ["Confondre copier et déplacer."], ["Crée d'abord archives.", "Utilise mv fichier dossier/.", "Vérifie avec ls avant et après."]),
  exercise(1, "g", "Chemin relatif un peu plus sérieux", "difficile", 10, ["..", "chemins relatifs", "copie"], "Crée jour_test avec a/note.txt et b/. Place-toi dans b et copie note.txt vers b sous le nom copie_note.txt, sans chemin absolu.", ["Oublier qu'on part depuis b."], ["Depuis b, remonte d'un niveau.", "Entre dans a depuis le parent.", "La source ressemble à ../a/note.txt."]),
  exercise(1, "h", "Supprimer sans casser le monde", "difficile", 8, ["rm", "rm -r", "prudence"], "Supprime le dossier jour_test et tout son contenu sans toucher au reste de ~/but-prepa. Explique pourquoi rm -r doit être utilisé avec prudence.", ["Lancer rm -r au mauvais endroit."], ["Vérifie avec pwd.", "Vérifie avec ls.", "Ne supprime jamais à l'aveugle."]),
  exercise(1, "bonus", "Le manuel avant Google", "bonus", 7, ["man", "autonomie"], "Trouve avec man la signification de -r dans rm -r. Écris ta réponse dans reponse.txt dans ~/but-prepa/00_admin/checklists.", ["Partir sur internet immédiatement."], ["Tape man rm.", "Cherche l'option -r.", "Écris une phrase simple."]),
];

const day2Exercises = [
  exercise(2, "a", "Carte d'identité minimale", "facile", 5, ["variables", "print"], "Crée identite.py avec trois variables : prenom, age, ville. Affiche une phrase complète du type : Je m'appelle Thomas, j'ai 18 ans et j'habite à Lyon.", ["Oublier les guillemets autour du texte."], ["Les textes sont entre guillemets.", "age peut être un nombre.", "Utilise un ou plusieurs print."]),
  exercise(2, "b", "Petit calcul", "facile", 4, ["opérateurs", "variables"], "Crée deux variables a = 12 et b = 5. Affiche leur somme, leur différence et leur produit.", ["Confondre texte et calcul."], ["Écris d'abord les variables.", "Puis trois print.", "Utilise a + b, a - b, a * b."]),
  exercise(2, "c", "Saluer l'utilisateur", "facile", 5, ["input", "print"], "Crée un script qui demande le prénom de l'utilisateur puis affiche Bienvenue, prénom !", ["Écrire input sans parenthèses."], ["Range la saisie dans une variable.", "Affiche ensuite cette variable.", "Teste avec ton prénom."]),
  exercise(2, "d", "Addition utilisateur", "moyen", 7, ["conversion int", "calcul"], "Demande deux entiers à l'utilisateur puis affiche leur somme.", ["Oublier int(...)."], ["Deux appels à input.", "Convertis en entier.", "Additionne ensuite."]),
  exercise(2, "e", "Prix TTC", "moyen", 8, ["float", "calcul"], "Demande un prix HT, puis affiche le prix TTC avec une TVA de 20%.", ["Stocker un nombre décimal dans int au lieu de float."], ["Le prix peut avoir des centimes.", "Utilise float(input(...)).", "Formule : ttc = ht * 1.20."]),
  exercise(2, "f", "Convertisseur de temps", "moyen", 8, ["//", "%"], "Demande une durée en minutes et affiche l'équivalent en heures et minutes, par exemple 135 minutes = 2 h 15 min.", ["Utiliser seulement /."], ["Les heures se calculent avec // 60.", "Le reste se calcule avec % 60.", "Affiche les deux."]),
  exercise(2, "g", "Convertisseur de température", "difficile", 10, ["formule", "float"], "Demande une température en degrés Celsius et affiche l'équivalent en Fahrenheit avec F = C * 9 / 5 + 32.", ["Oublier l'ordre des opérations."], ["Lis la formule lentement.", "Mets le résultat dans f.", "Affiche proprement."]),
  exercise(2, "h", "Fiche étudiant", "difficile", 12, ["saisies", "conversions", "affichage"], "Demande le prénom, l'âge et la moyenne générale d'un étudiant. Affiche ensuite un résumé sur trois lignes.", ["Ne pas convertir l'âge, tout mettre dans une seule variable."], ["Une information = une variable.", "Âge en entier, moyenne en décimal.", "Affiche ligne par ligne."]),
  exercise(2, "bonus", "Budget repas", "bonus", 12, ["saisies multiples", "moyenne"], "Demande le prix de quatre repas. Affiche le total et le prix moyen.", ["Oublier de convertir les quatre entrées."], ["Utilise quatre variables.", "Somme-les.", "La moyenne = total / 4."]),
];

const day3Exercises = [
  exercise(3, "a", "Positif, négatif ou nul", "facile", 5, ["if", "comparaisons"], "Demande un nombre entier puis affiche s'il est positif, négatif ou nul.", ["Oublier le cas 0."], ["Il y a trois cas.", "Pense à > 0, < 0, puis le reste.", "else peut gérer le dernier cas."]),
  exercise(3, "b", "Majeur ou mineur", "facile", 4, ["condition simple"], "Demande l'âge puis affiche majeur si l'utilisateur a au moins 18 ans, sinon mineur.", ["Écrire = à la place de >=."], ["Une comparaison suffit.", "if age >= 18:", "Puis else."]),
  exercise(3, "c", "Pair ou impair", "facile", 5, ["modulo", "condition"], "Demande un entier puis affiche s'il est pair ou impair.", ["Tester % 2 == 1 sans réfléchir aux cas négatifs."], ["Un pair laisse un reste nul après division par 2.", "Utilise % 2.", "Compare à 0."]),
  exercise(3, "d", "Le plus grand des deux", "moyen", 6, ["comparaison", "sélection"], "Demande deux nombres puis affiche le plus grand. S'ils sont égaux, affiche égalité.", ["Oublier le cas d'égalité."], ["Compare a et b.", "Gère a > b, b > a, puis le reste.", "Le reste = égalité."]),
  exercise(3, "e", "Mention d'une note", "moyen", 10, ["if", "elif", "else"], "Demande une note sur 20 et affiche insuffisant, passable, assez bien, bien ou très bien selon les intervalles du cours.", ["Écrire les conditions dans le mauvais ordre."], ["Commence par les petites valeurs.", "elif évite plein de if.", "Lis les intervalles calmement."]),
  exercise(3, "f", "Accès sécurisé simple", "moyen", 8, ["and", "textes"], "Demande un nom d'utilisateur et un mot de passe. Autorise l'accès seulement si l'utilisateur est admin et le mot de passe butinfo.", ["Oublier les guillemets autour des chaînes."], ["Deux input.", "Deux comparaisons.", "Les deux doivent être vraies."]),
  exercise(3, "g", "Tarif de bibliothèque", "difficile", 12, ["plusieurs cas", "and"], "Affiche le tarif : 6 euros si âge < 12, 8 euros si l'utilisateur est étudiant et a 25 ans ou moins, 12 euros sinon.", ["Écrire les cas dans le mauvais ordre."], ["Commence par moins de 12 ans.", "Le deuxième cas utilise and.", "Le reste est le tarif normal."]),
  exercise(3, "h", "Année bissextile", "difficile", 15, ["logique booléenne", "%"], "Demande une année et affiche si elle est bissextile : divisible par 400, ou divisible par 4 mais pas par 100.", ["Se perdre dans les and et or."], ["Écris les deux conditions séparément.", "Utilise %.", "Regroupe avec des parenthèses."]),
  exercise(3, "bonus", "Retrait bancaire très simple", "bonus", 12, ["validation", "conditions enchaînées"], "Le solde vaut 150 euros. Demande un montant : montant invalide si <= 0, fonds insuffisants si > 150, sinon retrait accepté et nouveau solde.", ["Traiter le solde insuffisant avant le montant invalide."], ["Rejette d'abord les montants absurdes.", "Puis vérifie la disponibilité.", "Sinon, calcule le nouveau solde."]),
];

const day4Exercises = [
  exercise(4, "a", "Compter de 1 à 10", "facile", 4, ["for", "range"], "Affiche les nombres de 1 à 10.", ["Partir de 0 ou oublier que la borne de fin est exclue."], ["Utilise range(1, 11).", "Affiche i.", "Relis le résultat."]),
  exercise(4, "b", "Compte à rebours", "facile", 5, ["range avec pas négatif"], "Affiche les nombres de 10 à 0.", ["Oublier le pas -1."], ["Le troisième argument de range sert au pas.", "Pars de 10.", "Descends jusqu'à inclure 0."]),
  exercise(4, "c", "Table de 7", "facile", 5, ["multiplication", "boucle"], "Affiche la table de multiplication de 7, de 7 x 1 à 7 x 10.", ["Ne pas afficher le détail du calcul."], ["Une boucle de 1 à 10.", "Calcule 7 * i.", "Formate une phrase claire."]),
  exercise(4, "d", "Somme de 1 à n", "moyen", 8, ["accumulateur"], "Demande un entier n puis affiche la somme des nombres de 1 à n. Exemple : si n = 5, résultat 15.", ["Oublier d'initialiser total à 0."], ["Crée total = 0 avant la boucle.", "Boucle de 1 à n inclus.", "Ajoute i dans total."]),
  exercise(4, "e", "Compter les nombres pairs", "moyen", 8, ["boucle", "condition"], "Demande n, puis compte combien de nombres pairs il y a entre 1 et n.", ["Additionner les valeurs au lieu de compter les cas."], ["Crée un compteur.", "Teste si i % 2 == 0.", "Incrémente le compteur."]),
  exercise(4, "f", "Saisie jusqu'au bon mot", "moyen", 8, ["while", "répétition conditionnelle"], "Le mot secret vaut python2026. Demande une saisie tant que l'utilisateur n'a pas trouvé. Quand il trouve, affiche Bravo.", ["Ne pas mettre à jour la variable dans la boucle."], ["Initialise une variable avant la boucle.", "Tant que la réponse est différente, on continue.", "Redemande la saisie dans la boucle."]),
  exercise(4, "g", "Factorielle", "difficile", 12, ["accumulateur multiplicatif"], "Demande un entier n puis calcule n!. Exemples : 4! = 24, 5! = 120.", ["Initialiser à 0 au lieu de 1."], ["Une multiplication répétée commence à 1.", "Boucle de 1 à n.", "Utilise fact = fact * i."]),
  exercise(4, "h", "Nombre de chiffres", "difficile", 12, ["while", "division entière"], "Demande un entier positif et affiche combien de chiffres il contient. Exemple : 4821 contient 4 chiffres.", ["Oublier le cas 0."], ["À chaque tour, divise par 10 avec //.", "Compte le nombre de tours.", "0 doit donner 1 chiffre."]),
  exercise(4, "bonus", "Triangle d'étoiles", "bonus", 10, ["boucle", "construction progressive"], "Affiche cinq lignes d'étoiles : *, **, ***, ****, *****.", ["Afficher toujours une seule étoile."], ["Il y a 5 lignes.", "La ligne i contient i étoiles.", "Tu peux utiliser '*' * i."]),
];

const day5Exercises = [
  exercise(5, "a", "Dire bonjour", "facile", 5, ["définition de fonction"], "Écris une fonction bonjour(prenom) qui affiche Bonjour prénom. Puis appelle-la avec ton prénom.", ["Oublier d'appeler la fonction."], ["Commence par def bonjour(prenom):", "Mets un print dedans.", "Appelle-la après le bloc."]),
  exercise(5, "b", "Carré d'un nombre", "facile", 5, ["return"], "Écris une fonction carre(n) qui renvoie le carré de n. Teste-la avec 3 puis 5.", ["Mettre print à la place de return."], ["n * n.", "Renvoie le résultat.", "Utilise print(carre(3))."]),
  exercise(5, "c", "Pair ou non", "facile", 5, ["booléen", "fonction"], "Écris une fonction est_pair(n) qui renvoie True si n est pair, sinon False.", ["Renvoyer du texte au lieu d'un booléen."], ["Pense à % 2.", "La comparaison donne déjà un booléen.", "Tu peux directement return n % 2 == 0."]),
  exercise(5, "d", "Addition réutilisable", "moyen", 6, ["paramètres"], "Écris une fonction addition(a, b) qui renvoie la somme de deux nombres. Teste-la avec trois appels différents.", ["Écrire une fonction liée à une seule valeur fixe."], ["Utilise deux paramètres.", "Renvoie a + b.", "Appelle-la plusieurs fois."]),
  exercise(5, "e", "Maximum de deux nombres", "moyen", 8, ["fonction", "condition"], "Écris une fonction maximum(a, b) qui renvoie le plus grand des deux, ou l'un des deux s'ils sont égaux.", ["Afficher au lieu de renvoyer."], ["Une condition suffit.", "Si a > b, renvoie a.", "Sinon, renvoie b."]),
  exercise(5, "f", "Moyenne de trois notes", "moyen", 8, ["calcul", "fonction"], "Écris une fonction moyenne3(a, b, c) qui renvoie la moyenne des trois notes. Teste-la avec 12, 14 et 16.", ["Oublier les parenthèses autour de la somme."], ["Additionne les trois valeurs.", "Divise par 3.", "Renvoie le résultat."]),
  exercise(5, "g", "Mention sous forme de fonction", "difficile", 10, ["if/elif/else", "fonction"], "Écris une fonction mention(note) qui renvoie insuffisant, passable, assez bien, bien ou très bien selon le barème de la veille.", ["Renvoyer plusieurs fois sans penser à l'ordre."], ["Réutilise la logique d'hier.", "Place-la dans une fonction.", "Teste plusieurs notes."]),
  exercise(5, "h", "Moyenne pondérée à deux notes", "difficile", 12, ["fonction utile", "formule"], "Écris moyenne_ponderee(note1, coef1, note2, coef2) qui renvoie (note1 * coef1 + note2 * coef2) / (coef1 + coef2).", ["Oublier le dénominateur entier entre parenthèses."], ["Écris la formule au brouillon.", "Reproduis-la proprement.", "Teste avec de petits nombres."]),
  exercise(5, "bonus", "Mini bulletin", "bonus", 15, ["fonctions qui coopèrent"], "Écris somme_notes(a,b,c), moyenne_notes(a,b,c), appreciation(m). Demande trois notes et affiche somme, moyenne puis appréciation.", ["Tout mettre dans une seule fonction énorme."], ["Fais une fonction par rôle.", "Réutilise la moyenne dans l'appréciation.", "Assemble à la fin seulement."]),
];

const day6Exercises = [
  exercise(6, "a", "Premier et dernier caractère", "facile", 5, ["indexation"], "Demande un mot puis affiche son premier et son dernier caractère.", ["Oublier que l'index commence à 0."], ["Premier caractère = index 0.", "Dernier caractère = index -1.", "Affiche les deux."]),
  exercise(6, "b", "Mini liste de notes", "facile", 5, ["liste", "len"], "Crée une liste [12, 15, 9], affiche le deuxième élément puis la longueur de la liste.", ["Croire que le deuxième élément a l'index 2."], ["Les index commencent à 0.", "Le deuxième élément est à l'index 1.", "len(...) donne la longueur."]),
  exercise(6, "c", "Nom complet", "facile", 5, ["concaténation"], "Demande un prénom et un nom, puis affiche Nom complet : prénom nom.", ["Oublier l'espace entre les deux mots."], ["Deux input.", "Tu peux concaténer avec ' '.", "Ou utiliser print(prenom, nom)."]),
  exercise(6, "d", "Mot inversé", "moyen", 6, ["slicing"], "Demande un mot et affiche ce mot à l'envers.", ["Tenter une boucle compliquée alors qu'un slice suffit."], ["Pense au pas négatif.", "Il existe une écriture très courte.", "Elle ressemble à mot[::-1]."]),
  exercise(6, "e", "Moyenne d'une liste", "moyen", 8, ["liste", "boucle"], "Crée une liste de cinq notes, calcule leur moyenne sans utiliser sum(), puis affiche-la.", ["Oublier len(notes) au dénominateur."], ["Utilise un accumulateur.", "Parcours la liste avec for note in notes.", "Divise à la fin."]),
  exercise(6, "f", "Compter une lettre", "moyen", 8, ["boucle sur chaîne"], "Demande un mot et une lettre. Affiche combien de fois cette lettre apparaît dans le mot.", ["Comparer toute la chaîne au lieu d'un caractère à la fois."], ["Parcours le mot caractère par caractère.", "Compare à la lettre cherchée.", "Incrémente un compteur."]),
  exercise(6, "g", "Plus grande note sans max", "difficile", 10, ["boucle", "comparaison"], "À partir d'une liste de notes, affiche la plus grande sans utiliser max().", ["Initialiser la plus grande valeur à 0 sans réfléchir."], ["Pars du premier élément.", "Compare chaque note à la plus grande actuelle.", "Remplace quand tu trouves mieux."]),
  exercise(6, "h", "Palindrome simple", "difficile", 10, ["chaînes", "lower", "inversion"], "Demande un mot puis affiche s'il est palindrome. Exemple : radar oui, python non.", ["Oublier de normaliser en minuscules."], ["Mets le mot en minuscules.", "Compare le mot à son inverse.", "Un palindrome lit la même chose dans les deux sens."]),
  exercise(6, "bonus", "Adresse mail étudiante", "bonus", 10, ["nettoyage de chaînes"], "Demande un prénom et un nom, transforme-les en minuscules, retire les espaces inutiles, puis affiche prenom.nom@etu-univ.fr.", ["Oublier strip() et lower()."], ["Nettoie d'abord les chaînes.", "Mets-les en minuscules.", "Assemble avec . puis le domaine."]),
];

const allExercises = [
  ...day1Exercises,
  ...day2Exercises,
  ...day3Exercises,
  ...day4Exercises,
  ...day5Exercises,
  ...day6Exercises,
];

const days: Day[] = [
  {
    id: "day-1",
    week: 1,
    dayNumber: 1,
    title: "Terminal et installation",
    theme: "Se repérer, créer l'arborescence, manipuler les fichiers",
    duration: "2 h 15 + exercices",
    morning: [
      {
        id: "d1-terminal",
        title: "Ce qu'est le terminal",
        content: "Le terminal est une porte de commande textuelle vers ton système. Il t'oblige à savoir où tu es, ce qu'il y a dans le dossier courant, où tu veux aller et ce que tu veux faire au fichier.",
        analogy: "Explorateur Windows : tu vois les dossiers. Terminal : tu donnes des ordres directs au système.",
        exampleCode: "pwd\nls\ncd dossier",
        keyTakeaways: ["pwd affiche le dossier courant.", "ls liste le contenu.", "cd change d'endroit."],
      },
      {
        id: "d1-paths",
        title: "Chemin absolu et chemin relatif",
        content: "Un chemin absolu donne l'adresse complète depuis la racine. Un chemin relatif part de l'endroit où tu te trouves déjà.",
        exampleCode: "cd /home/thomas/but-prepa/01_python_algo\ncd 01_python_algo\ncd ..",
        keyTakeaways: ["~ désigne le dossier personnel.", ". désigne le dossier courant.", ".. désigne le dossier parent."],
        frequentMistakes: ["Retaper toujours des chemins absolus.", "Supprimer sans vérifier pwd et ls."],
      },
      {
        id: "d1-basic-commands",
        title: "Les commandes du jour",
        content: "Avant les exercices, retiens cette logique : on vérifie où l'on est, on regarde ce qu'il y a, on se déplace, puis seulement on crée ou modifie des dossiers et fichiers.",
        exampleCode: "pwd                  # où suis-je ?\nls                   # qu'y a-t-il ici ?\ncd ~                 # revenir au dossier personnel\nmkdir but-prepa      # créer un dossier\ncd but-prepa         # entrer dans ce dossier\nmkdir 00_admin 01_python_algo 02_linux\ncat fichier.txt      # lire un petit fichier",
        keyTakeaways: ["mkdir crée un dossier.", "cd change de dossier.", "ls vérifie le résultat.", "Les commandes Linux s'écrivent en minuscules."],
        frequentMistakes: ["Taper CD ou MKDIR : le vrai Linux est sensible aux majuscules.", "Créer les sous-dossiers avant d'être entré dans le bon dossier."],
      },
    ],
    afternoonExercises: day1Exercises,
    revisionPrompts: ["Que fait pwd ?", "Que fait ls ?", "Différence entre cp et mv ?", "Que veut dire .. ?", "Chemin absolu ou relatif ?"],
    eveningQuiz: [
      quiz(1, 1, "Quelle commande donne le dossier courant ?", ["ls", "pwd", "cat"], 1, "pwd signifie print working directory."),
      quiz(1, 2, "Quelle commande affiche le contenu du dossier courant ?", ["ls", "cd", "mkdir"], 0, "ls liste ce qui se trouve dans le dossier courant."),
      quiz(1, 3, "Comment revient-on au dossier parent ?", ["cd .", "cd ..", "cd ~"], 1, ".. représente le parent du dossier courant."),
      quiz(1, 4, "Quel symbole représente le dossier personnel ?", ["~", "/", "."], 0, "~ est le raccourci du home."),
      quiz(1, 5, "Quelle commande sert à lire le manuel d'une commande ?", ["history", "man", "less"], 1, "man ouvre le manuel."),
      quiz(1, 6, "Quelle est la différence entre cp et mv ?", ["cp copie, mv déplace ou renomme", "cp supprime, mv copie", "il n'y en a pas"], 0, "cp conserve l'original ; mv le déplace ou renomme."),
    ],
    checklist: ["J'ai créé but-prepa.", "Je sais expliquer pwd, ls et cd.", "Je vérifie pwd avant rm -r.", "Je sais faire un chemin relatif simple."],
  },
  {
    id: "day-2",
    week: 1,
    dayNumber: 2,
    title: "Variables et types",
    theme: "Boîtes, types, affichage, saisie et conversions",
    duration: "2 h + exercices",
    morning: [
      {
        id: "d2-variables",
        title: "Une variable est une boîte étiquetée",
        content: "Une variable porte un nom et contient une valeur. Le nom doit être clair : age, prenom, moyenne.",
        exampleCode: "age = 18\nprenom = \"Thomas\"\nmoyenne = 14.5",
        keyTakeaways: ["int = entier.", "float = nombre décimal.", "str = texte.", "bool = vrai/faux."],
      },
      {
        id: "d2-input",
        title: "print, input et conversions",
        content: "print affiche. input demande une saisie, mais renvoie toujours du texte. Pour calculer, convertis avec int(...) ou float(...).",
        exampleCode: "age = int(input(\"Ton âge : \"))\nprint(age + 1)",
        frequentMistakes: ["Faire age + 1 sans int(...).", "Utiliser int pour un prix avec centimes."],
      },
    ],
    afternoonExercises: day2Exercises,
    revisionPrompts: ["Différence entre int et float ?", "Pourquoi input oblige souvent à convertir ?", "Différence entre / et // ?", "À quoi sert % ?"],
    eveningQuiz: [
      quiz(2, 1, "Quel type renvoie input() par défaut ?", ["int", "str", "float"], 1, "input renvoie du texte."),
      quiz(2, 2, "Quel est le rôle de print() ?", ["Demander une saisie", "Afficher", "Créer une variable"], 1, "print affiche à l'écran."),
      quiz(2, 3, "Comment convertir \"12\" en entier ?", ["str(\"12\")", "int(\"12\")", "float = 12"], 1, "int(...) convertit une chaîne numérique en entier."),
      quiz(2, 4, "Quel type utiliser pour 14.5 ?", ["int", "bool", "float"], 2, "14.5 est un nombre décimal."),
      quiz(2, 5, "Que vaut 17 // 5 ?", ["3", "3.4", "2"], 0, "// donne la division entière."),
      quiz(2, 6, "Que vaut 17 % 5 ?", ["3", "2", "0"], 1, "% donne le reste de la division."),
    ],
    checklist: ["Je sais créer une variable claire.", "Je sais convertir input avec int ou float.", "Je connais +, -, *, /, //, %, **.", "Je sais lancer un script Python."],
  },
  {
    id: "day-3",
    week: 1,
    dayNumber: 3,
    title: "Conditions et logique",
    theme: "Comparer, choisir, chaîner les cas",
    duration: "2 h + exercices",
    morning: [
      {
        id: "d3-conditions",
        title: "Une condition est une question",
        content: "Python répond True ou False. Le signe = stocke, alors que == compare. Cette différence doit devenir automatique.",
        exampleCode: "age = int(input(\"Âge : \"))\nif age >= 18:\n    print(\"Majeur\")\nelse:\n    print(\"Mineur\")",
        keyTakeaways: ["== compare.", "elif gère plusieurs cas.", "L'indentation fait partie du code."],
      },
      {
        id: "d3-logic",
        title: "and, or, not",
        content: "and exige que les deux conditions soient vraies. or exige au moins une condition vraie. not inverse le résultat.",
        exampleCode: "if utilisateur == \"admin\" and code == \"python\":\n    print(\"Accès autorisé\")",
        frequentMistakes: ["Écrire = au lieu de ==.", "Mettre les intervalles de notes dans le mauvais ordre."],
      },
    ],
    afternoonExercises: day3Exercises,
    revisionPrompts: ["Différence entre = et ==.", "Rôle de elif.", "Rôle de and.", "Rôle de or.", "Pourquoi l'ordre des conditions compte."],
    eveningQuiz: [
      quiz(3, 1, "Que signifie == ?", ["Stocker", "Comparer", "Afficher"], 1, "== teste l'égalité."),
      quiz(3, 2, "Quelle différence entre and et or ?", ["and = les deux, or = au moins un", "and = au moins un, or = les deux", "aucune"], 0, "C'est la table de vérité minimale."),
      quiz(3, 3, "Que renvoie 5 > 8 ?", ["True", "False", "5"], 1, "5 n'est pas supérieur à 8."),
      quiz(3, 4, "Quand utilise-t-on elif ?", ["Pour plusieurs cas exclusifs", "Pour répéter", "Pour convertir"], 0, "elif évite une suite de if indépendants."),
      quiz(3, 5, "Que fait not True ?", ["True", "False", "None"], 1, "not inverse le booléen."),
      quiz(3, 6, "Pourquoi l'ordre des elif est-il important ?", ["Le premier cas vrai arrête la chaîne", "Python trie les cas", "Cela ne compte pas"], 0, "Un elif plus bas ne sera pas évalué si un cas précédent est vrai."),
    ],
    checklist: ["Je distingue = et ==.", "Je sais écrire if/elif/else.", "Je peux expliquer and et or.", "Je sais gérer les cas limites."],
  },
  {
    id: "day-4",
    week: 1,
    dayNumber: 4,
    title: "Boucles",
    theme: "Répéter, compter, accumuler, tracer",
    duration: "2 h + exercices",
    morning: [
      {
        id: "d4-for-range",
        title: "for et range",
        content: "On utilise souvent for quand on connaît le nombre de répétitions. Attention : la borne de fin de range est exclue.",
        exampleCode: "for i in range(1, 6):\n    print(i)",
        keyTakeaways: ["range(5) va de 0 à 4.", "range(1, 6) va de 1 à 5.", "range(10, 0, -1) descend de 10 à 1."],
      },
      {
        id: "d4-accumulator",
        title: "Compteur et accumulateur",
        content: "Un compteur compte des cas. Un accumulateur ajoute des valeurs. Dans les deux cas, on initialise avant la boucle.",
        exampleCode: "total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)",
        frequentMistakes: ["Initialiser une factorielle à 0.", "Oublier de modifier la condition d'une boucle while."],
      },
    ],
    afternoonExercises: day4Exercises,
    revisionPrompts: ["Que donne range(5) ?", "Pourquoi une boucle while peut-elle être infinie ?", "Différence entre compteur et accumulateur ?"],
    eveningQuiz: [
      quiz(4, 1, "Quelle différence entre for et while ?", ["for répète avec une séquence, while dépend d'une condition", "for est toujours infini", "while ne sert pas"], 0, "for est pratique quand la séquence est connue."),
      quiz(4, 2, "Que vaut range(1, 4) ?", ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"], 0, "La borne finale est exclue."),
      quiz(4, 3, "Pourquoi total doit-il être initialisé avant la boucle ?", ["Pour avoir une valeur de départ", "Pour accélérer Python", "Ce n'est pas nécessaire"], 0, "L'accumulateur doit exister avant d'être modifié."),
      quiz(4, 4, "Quel piège provoque une boucle infinie ?", ["Ne pas faire évoluer la condition", "Mettre un print", "Utiliser un nom court"], 0, "Une boucle while doit pouvoir devenir fausse."),
      quiz(4, 5, "À quoi sert le pas dans range ?", ["À choisir l'écart entre deux valeurs", "À convertir un entier", "À sortir d'une boucle"], 0, "Le pas est le troisième argument."),
      quiz(4, 6, "Pourquoi une factorielle ne démarre-t-elle pas à 0 ?", ["Toute multiplication par 0 donne 0", "Parce que range interdit 0", "Pour afficher plus vite"], 0, "L'accumulateur multiplicatif démarre à 1."),
    ],
    checklist: ["Je sais tracer une boucle au papier.", "Je connais range.", "Je sais initialiser un accumulateur.", "Je sais éviter une boucle infinie."],
  },
  {
    id: "day-5",
    week: 1,
    dayNumber: 5,
    title: "Fonctions",
    theme: "Découper, nommer, renvoyer, réutiliser",
    duration: "2 h + exercices",
    morning: [
      {
        id: "d5-function",
        title: "Pourquoi une fonction",
        content: "Une fonction découpe un programme en petits morceaux compréhensibles. Elle reçoit des données, fait une tâche précise et renvoie un résultat si besoin.",
        analogy: "Sans fonctions : un sac où tout est mélangé. Avec fonctions : des tiroirs étiquetés.",
        exampleCode: "def carre(n):\n    return n * n\n\nprint(carre(5))",
        keyTakeaways: ["Un paramètre est dans la définition.", "Un argument est la valeur passée à l'appel.", "return renvoie une valeur réutilisable."],
      },
      {
        id: "d5-print-return",
        title: "print n'est pas return",
        content: "print affiche. return renvoie. Si tu veux réutiliser le résultat d'un calcul, choisis return.",
        exampleCode: "def addition(a, b):\n    return a + b\n\nresultat = addition(4, 6)\nprint(resultat)",
        frequentMistakes: ["Mettre print partout.", "Écrire une fonction qui fait trop de choses."],
      },
    ],
    afternoonExercises: day5Exercises,
    revisionPrompts: ["Différence entre paramètre et argument.", "Différence entre print et return.", "Pourquoi les fonctions rendent le code plus propre."],
    eveningQuiz: [
      quiz(5, 1, "À quoi sert return ?", ["À afficher seulement", "À renvoyer une valeur", "À répéter"], 1, "return fournit une valeur au code appelant."),
      quiz(5, 2, "Différence entre paramètre et argument ?", ["Paramètre = nom dans la fonction, argument = valeur passée", "C'est identique", "Argument = type Python"], 0, "prenom est paramètre dans def, \"Thomas\" est argument dans l'appel."),
      quiz(5, 3, "Pourquoi une fonction évite-t-elle la répétition ?", ["On écrit le comportement une fois puis on l'appelle", "Elle supprime les variables", "Elle remplace Python"], 0, "C'est l'un des intérêts majeurs."),
      quiz(5, 4, "Quand choisir return plutôt que print ?", ["Quand le résultat doit être réutilisé", "Toujours", "Jamais"], 0, "print est pour l'affichage."),
      quiz(5, 5, "Peut-on appeler une fonction plusieurs fois ?", ["Oui, avec des arguments différents", "Non", "Seulement une fois par fichier"], 0, "La réutilisation est le but."),
      quiz(5, 6, "Pourquoi une fonction doit-elle avoir un rôle clair ?", ["Pour rendre le code lisible et testable", "Pour être plus longue", "Pour éviter les commentaires"], 0, "Un rôle clair réduit les erreurs."),
    ],
    checklist: ["Je sais définir une fonction.", "Je sais appeler une fonction.", "Je sais choisir print ou return.", "Je sais tester avec plusieurs arguments."],
  },
  {
    id: "day-6",
    week: 1,
    dayNumber: 6,
    title: "Chaînes, listes et mini-projet",
    theme: "Indexer, parcourir, écrire un petit outil console",
    duration: "2 h + projet",
    morning: [
      {
        id: "d6-strings",
        title: "Chaînes et slices",
        content: "Une chaîne est du texte. On peut accéder aux caractères par index et extraire des morceaux avec des slices.",
        exampleCode: "mot = \"bonjour\"\nprint(mot[0])\nprint(mot[-1])\nprint(mot[::-1])",
        keyTakeaways: ["Le premier index est 0.", "mot[-1] donne le dernier caractère.", "mot[::-1] renverse la chaîne."],
      },
      {
        id: "d6-lists-files",
        title: "Listes et fichier journal",
        content: "Une liste stocke plusieurs valeurs dans un ordre précis. Le mini-projet introduit aussi l'écriture dans un fichier texte avec with open(...).",
        exampleCode: "notes = [12, 15, 9, 17]\ntotal = 0\nfor note in notes:\n    total = total + note\nmoyenne = total / len(notes)",
        frequentMistakes: ["Croire que le deuxième élément a l'index 2.", "Ouvrir un fichier en mode écriture et écraser le journal."],
      },
    ],
    afternoonExercises: day6Exercises,
    revisionPrompts: ["Qu'est-ce qu'une chaîne ?", "Qu'est-ce qu'une liste ?", "Différence entre mot[0] et mot[-1] ?", "Pourquoi une liste est plus pratique que cinq variables séparées ?"],
    eveningQuiz: [
      quiz(6, 1, "Quel est le premier index d'une chaîne ?", ["0", "1", "-1"], 0, "Python indexe à partir de 0."),
      quiz(6, 2, "Comment récupérer le dernier caractère ?", ["mot[0]", "mot[-1]", "mot[1]"], 1, "-1 pointe vers la fin."),
      quiz(6, 3, "Que fait len(...) ?", ["Donne la longueur", "Inverse", "Convertit"], 0, "len compte les éléments ou caractères."),
      quiz(6, 4, "À quoi sert append sur une liste ?", ["Ajouter en fin", "Supprimer tout", "Trier"], 0, "append ajoute un élément."),
      quiz(6, 5, "Que fait mot[::-1] ?", ["Inverse la chaîne", "Supprime le premier caractère", "Convertit en liste"], 0, "C'est un slice avec pas négatif."),
      quiz(6, 6, "Pourquoi with open(...) est-il utile ?", ["Il referme proprement le fichier", "Il remplace une boucle", "Il crée une fonction"], 0, "with gère la fermeture du fichier."),
    ],
    checklist: ["Je sais indexer une chaîne.", "Je sais parcourir une liste.", "Je sais calculer une moyenne sans sum().", "Je sais lire le cahier des charges du mini-projet."],
  },
];

const solutionBank: Record<string, Omit<Correction, "id" | "week" | "day" | "title">> = {
  "d1-a": {
    exerciseId: "d1-a",
    solution: "cd ~\npwd",
    explanation: "pwd affiche le chemin du dossier courant. C'est la réponse exacte à la question où suis-je.",
    reasoning: "On revient dans le dossier personnel pour partir d'un endroit connu, puis on affiche le chemin.",
    commonTraps: ["Utiliser ls, qui liste le contenu.", "Copier une ancienne invite de terminal sans vérifier."],
    howToTest: ["Tape cd ~ puis pwd.", "Le chemin affiché doit correspondre à ton dossier personnel."],
    variant: "echo $PWD affiche aussi le dossier courant, mais pwd est le réflexe standard.",
  },
  "d1-b": {
    exerciseId: "d1-b",
    solution: "cd ~\nmkdir but-prepa\ncd but-prepa\nmkdir 00_admin 01_python_algo 02_linux",
    explanation: "Tu crées d'abord le dossier principal, puis les trois sous-dossiers au bon endroit.",
    reasoning: "Le cd but-prepa est indispensable : sans lui, les trois dossiers seraient créés directement dans ~.",
    commonTraps: ["Oublier cd but-prepa.", "Créer des noms légèrement différents."],
    howToTest: ["Depuis ~/but-prepa, tape ls.", "Tu dois voir 00_admin, 01_python_algo et 02_linux."],
  },
  "d1-c": {
    exerciseId: "d1-c",
    solution: "cd ~/but-prepa\ncd 01_python_algo\ncd ..\ncd 02_linux",
    explanation: "01_python_algo est un sous-dossier du dossier courant ; .. remonte au parent.",
    reasoning: "L'objectif est de pratiquer le relatif au lieu de retaper une adresse complète.",
    commonTraps: ["Utiliser ~ à chaque commande.", "Oublier que .. remonte d'un niveau."],
    howToTest: ["Fais pwd après chaque cd.", "Le dernier chemin doit finir par 02_linux."],
    variant: "Depuis ~/but-prepa/01_python_algo, cd ../02_linux fonctionne aussi.",
  },
  "d1-d": {
    exerciseId: "d1-d",
    solution: "cd ~/but-prepa/02_linux/commandes\necho \"pwd\" > commandes.txt\necho \"ls\" >> commandes.txt\necho \"cd\" >> commandes.txt\ncat commandes.txt",
    explanation: "> crée ou écrase le fichier ; >> ajoute une ligne à la fin ; cat vérifie le contenu.",
    reasoning: "On utilise une première redirection pour créer, puis des ajouts pour ne pas écraser.",
    commonTraps: ["Utiliser > trois fois.", "Oublier les guillemets autour des mots."],
    howToTest: ["Le fichier doit contenir exactement trois lignes.", "cat commandes.txt doit afficher pwd, ls, cd."],
  },
  "d1-e": {
    exerciseId: "d1-e",
    solution: "cp commandes.txt commandes_backup.txt\nmv commandes_backup.txt mes_commandes.txt",
    explanation: "cp duplique le fichier ; mv renomme la copie sans toucher à l'original.",
    reasoning: "On sépare copie et renommage pour conserver commandes.txt.",
    commonTraps: ["Faire mv commandes.txt commandes_backup.txt et perdre l'original."],
    howToTest: ["ls doit afficher commandes.txt et mes_commandes.txt."],
  },
  "d1-f": {
    exerciseId: "d1-f",
    solution: "mkdir archives\nmv mes_commandes.txt archives/\nls\nls archives",
    explanation: "Le dossier archives est créé, puis le fichier y est déplacé.",
    reasoning: "mv fichier dossier/ indique une destination déjà existante.",
    commonTraps: ["Déplacer avant d'avoir créé archives.", "Être dans le mauvais dossier."],
    howToTest: ["mes_commandes.txt ne doit plus être au niveau courant.", "Il doit apparaître dans archives."],
  },
  "d1-g": {
    exerciseId: "d1-g",
    solution: "mkdir -p jour_test/a jour_test/b\necho \"note\" > jour_test/a/note.txt\ncd jour_test/b\ncp ../a/note.txt copie_note.txt",
    explanation: "Depuis b, ../a/note.txt remonte au dossier jour_test puis entre dans a.",
    reasoning: "C'est le cas classique du dossier frère : on remonte puis on redescend.",
    commonTraps: ["Écrire a/note.txt depuis b.", "Utiliser un chemin absolu par réflexe."],
    howToTest: ["Depuis b, ls doit montrer copie_note.txt.", "cat copie_note.txt doit afficher la note."],
  },
  "d1-h": {
    exerciseId: "d1-h",
    solution: "cd ~/but-prepa\npwd\nls\nrm -r jour_test",
    explanation: "rm -r supprime un dossier et tout son contenu ; il faut vérifier où l'on se trouve avant.",
    reasoning: "La prudence fait partie de la compétence terminal.",
    commonTraps: ["Lancer rm -r depuis un mauvais dossier.", "Supprimer sans vérifier ls."],
    howToTest: ["ls ne doit plus afficher jour_test.", "Les autres dossiers doivent rester présents."],
  },
  "d1-bonus": {
    exerciseId: "d1-bonus",
    solution: "man rm\ncd ~/but-prepa/00_admin/checklists\necho \"L'option -r supprime récursivement un dossier et son contenu.\" > reponse.txt",
    explanation: "Le manuel donne la signification de l'option. L'intérêt est d'apprendre à chercher dans l'outil local.",
    reasoning: "Savoir lire man rend autonome face aux commandes.",
    commonTraps: ["Copier une phrase sans la comprendre.", "Chercher directement sur le web."],
    howToTest: ["cat reponse.txt doit contenir une phrase claire sur -r."],
  },
  "d2-a": {
    exerciseId: "d2-a",
    solution: "prenom = \"Thomas\"\nage = 18\nville = \"Lyon\"\nprint(\"Je m'appelle\", prenom, \"j'ai\", age, \"ans et j'habite à\", ville)",
    explanation: "Chaque information a sa variable, puis print assemble la phrase.",
    reasoning: "On sépare les données et l'affichage.",
    commonTraps: ["Oublier les guillemets autour de Thomas et Lyon."],
    howToTest: ["Le script doit afficher une phrase complète."],
  },
  "d2-b": {
    exerciseId: "d2-b",
    solution: "a = 12\nb = 5\nprint(a + b)\nprint(a - b)\nprint(a * b)",
    explanation: "Les opérateurs s'appliquent à des nombres, pas à du texte.",
    reasoning: "On commence par stocker, puis on affiche trois calculs.",
    commonTraps: ["Écrire \"a + b\" entre guillemets."],
    howToTest: ["Les sorties attendues sont 17, 7 et 60."],
  },
  "d2-c": {
    exerciseId: "d2-c",
    solution: "prenom = input(\"Ton prénom : \")\nprint(\"Bienvenue,\", prenom, \"!\")",
    explanation: "input récupère la saisie et print l'affiche dans une phrase.",
    reasoning: "La variable garde la réponse pour la réutiliser.",
    commonTraps: ["Oublier les parenthèses de input."],
    howToTest: ["Teste avec ton prénom."],
  },
  "d2-d": {
    exerciseId: "d2-d",
    solution: "a = int(input(\"Premier entier : \"))\nb = int(input(\"Deuxième entier : \"))\nprint(a + b)",
    explanation: "int(...) transforme le texte saisi en entier calculable.",
    reasoning: "Sans conversion, + concaténerait du texte ou déclencherait une erreur selon le mélange.",
    commonTraps: ["Additionner deux chaînes au lieu de deux entiers."],
    howToTest: ["Avec 12 et 5, le résultat doit être 17."],
  },
  "d2-e": {
    exerciseId: "d2-e",
    solution: "ht = float(input(\"Prix HT : \"))\nttc = ht * 1.20\nprint(\"Prix TTC :\", ttc)",
    explanation: "float accepte les décimales et la TVA de 20% correspond à un facteur 1.20.",
    reasoning: "On stocke le calcul pour rendre le programme lisible.",
    commonTraps: ["Utiliser int pour un prix à centimes."],
    howToTest: ["100 HT doit donner 120 TTC."],
  },
  "d2-f": {
    exerciseId: "d2-f",
    solution: "minutes = int(input(\"Minutes : \"))\nheures = minutes // 60\nreste = minutes % 60\nprint(minutes, \"minutes =\", heures, \"h\", reste, \"min\")",
    explanation: "// donne les heures complètes et % donne les minutes restantes.",
    reasoning: "C'est le duo division entière + reste.",
    commonTraps: ["Utiliser / et obtenir 2.25 h sans le reste."],
    howToTest: ["135 doit donner 2 h 15 min."],
  },
  "d2-g": {
    exerciseId: "d2-g",
    solution: "c = float(input(\"Température en °C : \"))\nf = c * 9 / 5 + 32\nprint(c, \"°C =\", f, \"°F\")",
    explanation: "La formule est appliquée dans l'ordre mathématique normal.",
    reasoning: "On met le résultat dans f pour pouvoir l'afficher proprement.",
    commonTraps: ["Oublier + 32."],
    howToTest: ["0 °C doit donner 32 °F."],
  },
  "d2-h": {
    exerciseId: "d2-h",
    solution: "prenom = input(\"Prénom : \")\nage = int(input(\"Âge : \"))\nmoyenne = float(input(\"Moyenne : \"))\nprint(\"Prénom :\", prenom)\nprint(\"Âge :\", age, \"ans\")\nprint(\"Moyenne :\", moyenne, \"/ 20\")",
    explanation: "Chaque donnée garde son type : texte, entier, décimal.",
    reasoning: "Une information = une variable rend l'affichage simple.",
    commonTraps: ["Tout stocker dans la même variable."],
    howToTest: ["Le résumé doit tenir sur trois lignes."],
  },
  "d2-bonus": {
    exerciseId: "d2-bonus",
    solution: "r1 = float(input(\"Repas 1 : \"))\nr2 = float(input(\"Repas 2 : \"))\nr3 = float(input(\"Repas 3 : \"))\nr4 = float(input(\"Repas 4 : \"))\ntotal = r1 + r2 + r3 + r4\nprint(\"Total :\", total)\nprint(\"Moyenne :\", total / 4)",
    explanation: "On convertit chaque saisie, puis on calcule total et moyenne.",
    reasoning: "La moyenne dépend du total, donc total est une variable utile.",
    commonTraps: ["Convertir seulement la première saisie."],
    howToTest: ["Avec 10, 10, 20, 20, la moyenne doit être 15."],
  },
  "d3-a": {
    exerciseId: "d3-a",
    solution: "n = int(input(\"Nombre : \"))\nif n > 0:\n    print(\"positif\")\nelif n < 0:\n    print(\"négatif\")\nelse:\n    print(\"nul\")",
    explanation: "Les deux premiers tests couvrent positif et négatif ; le reste est forcément 0.",
    reasoning: "else est parfait pour le dernier cas.",
    commonTraps: ["Oublier le cas nul."],
    howToTest: ["Teste 5, -2 et 0."],
  },
  "d3-b": {
    exerciseId: "d3-b",
    solution: "age = int(input(\"Âge : \"))\nif age >= 18:\n    print(\"majeur\")\nelse:\n    print(\"mineur\")",
    explanation: "18 est inclus, donc on utilise >=.",
    reasoning: "Deux cas seulement : condition vraie ou fausse.",
    commonTraps: ["Utiliser > 18 et exclure 18."],
    howToTest: ["Teste 17, 18 et 19."],
  },
  "d3-c": {
    exerciseId: "d3-c",
    solution: "n = int(input(\"Entier : \"))\nif n % 2 == 0:\n    print(\"pair\")\nelse:\n    print(\"impair\")",
    explanation: "Un nombre pair a un reste nul dans la division par 2.",
    reasoning: "Le modulo donne directement le critère de parité.",
    commonTraps: ["Tester seulement % 2 == 1."],
    howToTest: ["Teste 8 et 7."],
  },
  "d3-d": {
    exerciseId: "d3-d",
    solution: "a = float(input(\"a : \"))\nb = float(input(\"b : \"))\nif a > b:\n    print(a)\nelif b > a:\n    print(b)\nelse:\n    print(\"égalité\")",
    explanation: "On traite a plus grand, b plus grand, puis égalité.",
    reasoning: "Le troisième cas est le seul qui reste.",
    commonTraps: ["Ne jamais afficher égalité."],
    howToTest: ["Teste 4/2, 2/4 et 3/3."],
  },
  "d3-e": {
    exerciseId: "d3-e",
    solution: "note = float(input(\"Note : \"))\nif note < 10:\n    print(\"insuffisant\")\nelif note < 12:\n    print(\"passable\")\nelif note < 14:\n    print(\"assez bien\")\nelif note < 16:\n    print(\"bien\")\nelse:\n    print(\"très bien\")",
    explanation: "Les bornes sont testées dans l'ordre croissant.",
    reasoning: "Une fois qu'un cas est vrai, les elif suivants ne sont pas évalués.",
    commonTraps: ["Commencer par note < 16 et absorber trop de cas."],
    howToTest: ["Teste 9, 11, 13, 15 et 17."],
  },
  "d3-f": {
    exerciseId: "d3-f",
    solution: "user = input(\"Utilisateur : \")\npassword = input(\"Mot de passe : \")\nif user == \"admin\" and password == \"butinfo\":\n    print(\"accès autorisé\")\nelse:\n    print(\"accès refusé\")",
    explanation: "and impose que les deux comparaisons soient vraies.",
    reasoning: "Un seul identifiant faux doit refuser l'accès.",
    commonTraps: ["Utiliser or et accepter trop de monde."],
    howToTest: ["Teste admin/butinfo puis admin/test."],
  },
  "d3-g": {
    exerciseId: "d3-g",
    solution: "age = int(input(\"Âge : \"))\netudiant = input(\"Étudiant ? oui/non : \")\nif age < 12:\n    tarif = 6\nelif etudiant == \"oui\" and age <= 25:\n    tarif = 8\nelse:\n    tarif = 12\nprint(\"Tarif :\", tarif, \"€\")",
    explanation: "Le cas enfant est prioritaire, puis le cas étudiant jeune, puis le tarif normal.",
    reasoning: "L'ordre évite d'envoyer un enfant étudiant dans le mauvais bloc.",
    commonTraps: ["Mettre le cas étudiant avant le cas âge < 12."],
    howToTest: ["Teste 10 ans, 20 ans étudiant, 30 ans."],
  },
  "d3-h": {
    exerciseId: "d3-h",
    solution: "annee = int(input(\"Année : \"))\nif annee % 400 == 0 or (annee % 4 == 0 and annee % 100 != 0):\n    print(\"bissextile\")\nelse:\n    print(\"non bissextile\")",
    explanation: "La règle combine un cas divisible par 400 et un cas divisible par 4 sauf les siècles non divisibles par 400.",
    reasoning: "Les parenthèses rendent la logique lisible.",
    commonTraps: ["Oublier le cas des années divisibles par 100."],
    howToTest: ["2000 oui, 1900 non, 2024 oui."],
  },
  "d3-bonus": {
    exerciseId: "d3-bonus",
    solution: "solde = 150\nmontant = float(input(\"Montant : \"))\nif montant <= 0:\n    print(\"montant invalide\")\nelif montant > solde:\n    print(\"fonds insuffisants\")\nelse:\n    solde = solde - montant\n    print(\"retrait accepté\")\n    print(\"nouveau solde :\", solde)",
    explanation: "On rejette d'abord les montants absurdes, puis les montants trop élevés.",
    reasoning: "Les validations doivent être ordonnées du plus fondamental au plus spécifique.",
    commonTraps: ["Dire fonds insuffisants pour un montant négatif."],
    howToTest: ["Teste -5, 200 et 40."],
  },
  "d4-a": {
    exerciseId: "d4-a",
    solution: "for i in range(1, 11):\n    print(i)",
    explanation: "range(1, 11) produit 1 à 10 car 11 est exclu.",
    reasoning: "La borne finale doit être un cran au-dessus de la dernière valeur voulue.",
    commonTraps: ["Écrire range(1, 10)."],
    howToTest: ["La sortie doit commencer à 1 et finir à 10."],
  },
  "d4-b": {
    exerciseId: "d4-b",
    solution: "for i in range(10, -1, -1):\n    print(i)",
    explanation: "Le pas -1 descend, et la borne -1 permet d'inclure 0.",
    reasoning: "La borne finale reste exclue, même en descendant.",
    commonTraps: ["Écrire range(10, 0, -1) et oublier 0."],
    howToTest: ["La sortie doit finir par 0."],
  },
  "d4-c": {
    exerciseId: "d4-c",
    solution: "for i in range(1, 11):\n    print(\"7 x\", i, \"=\", 7 * i)",
    explanation: "La boucle parcourt les multiplicateurs de 1 à 10.",
    reasoning: "Afficher le détail aide à vérifier le calcul.",
    commonTraps: ["Afficher seulement les résultats."],
    howToTest: ["La dernière ligne doit être 7 x 10 = 70."],
  },
  "d4-d": {
    exerciseId: "d4-d",
    solution: "n = int(input(\"n : \"))\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(total)",
    explanation: "total accumule chaque entier de 1 à n inclus.",
    reasoning: "n + 1 compense la borne exclue de range.",
    commonTraps: ["Oublier total = 0.", "Écrire range(1, n)."],
    howToTest: ["Pour 5, résultat 15."],
  },
  "d4-e": {
    exerciseId: "d4-e",
    solution: "n = int(input(\"n : \"))\ncompteur = 0\nfor i in range(1, n + 1):\n    if i % 2 == 0:\n        compteur = compteur + 1\nprint(compteur)",
    explanation: "On compte les cas pairs au lieu d'additionner leurs valeurs.",
    reasoning: "compteur représente un nombre d'occurrences.",
    commonTraps: ["Faire compteur = compteur + i."],
    howToTest: ["Pour 10, il y a 5 nombres pairs."],
  },
  "d4-f": {
    exerciseId: "d4-f",
    solution: "mot = \"\"\nwhile mot != \"python2026\":\n    mot = input(\"Mot secret : \")\nprint(\"Bravo\")",
    explanation: "La saisie est redemandée tant que le mot n'est pas bon.",
    reasoning: "La variable mot change dans la boucle, donc la condition peut devenir fausse.",
    commonTraps: ["Demander la saisie seulement avant la boucle."],
    howToTest: ["Tape une mauvaise réponse puis python2026."],
  },
  "d4-g": {
    exerciseId: "d4-g",
    solution: "n = int(input(\"n : \"))\nfact = 1\nfor i in range(1, n + 1):\n    fact = fact * i\nprint(fact)",
    explanation: "La factorielle est un accumulateur multiplicatif.",
    reasoning: "On démarre à 1, élément neutre de la multiplication.",
    commonTraps: ["Démarrer fact à 0."],
    howToTest: ["4 doit donner 24, 5 doit donner 120."],
  },
  "d4-h": {
    exerciseId: "d4-h",
    solution: "n = int(input(\"Entier positif : \"))\nif n == 0:\n    print(1)\nelse:\n    compteur = 0\n    while n > 0:\n        compteur = compteur + 1\n        n = n // 10\n    print(compteur)",
    explanation: "Chaque division entière par 10 enlève un chiffre.",
    reasoning: "Le cas 0 doit être traité à part car la boucle ne tournerait pas.",
    commonTraps: ["Oublier 0.", "Utiliser / au lieu de //."],
    howToTest: ["4821 doit donner 4 ; 0 doit donner 1."],
  },
  "d4-bonus": {
    exerciseId: "d4-bonus",
    solution: "for i in range(1, 6):\n    print(\"*\" * i)",
    explanation: "La multiplication d'une chaîne répète le caractère.",
    reasoning: "La ligne i contient i étoiles.",
    commonTraps: ["Afficher une étoile fixe."],
    howToTest: ["La cinquième ligne doit contenir cinq étoiles."],
  },
  "d5-a": {
    exerciseId: "d5-a",
    solution: "def bonjour(prenom):\n    print(\"Bonjour\", prenom)\n\nbonjour(\"Thomas\")",
    explanation: "La fonction est définie, puis appelée après le bloc.",
    reasoning: "Une fonction non appelée ne produit aucun affichage.",
    commonTraps: ["Définir seulement la fonction."],
    howToTest: ["Le programme doit afficher Bonjour Thomas."],
  },
  "d5-b": {
    exerciseId: "d5-b",
    solution: "def carre(n):\n    return n * n\n\nprint(carre(3))\nprint(carre(5))",
    explanation: "return renvoie le résultat, que print affiche ensuite.",
    reasoning: "La valeur est réutilisable par d'autres calculs.",
    commonTraps: ["Mettre print dans carre au lieu de return."],
    howToTest: ["Les sorties attendues sont 9 et 25."],
  },
  "d5-c": {
    exerciseId: "d5-c",
    solution: "def est_pair(n):\n    return n % 2 == 0",
    explanation: "La comparaison renvoie déjà True ou False.",
    reasoning: "Inutile d'écrire un if si l'expression est déjà booléenne.",
    commonTraps: ["Renvoyer les textes pair/impair."],
    howToTest: ["est_pair(8) True, est_pair(7) False."],
  },
  "d5-d": {
    exerciseId: "d5-d",
    solution: "def addition(a, b):\n    return a + b\n\nprint(addition(2, 3))\nprint(addition(10, -4))\nprint(addition(1.5, 2.5))",
    explanation: "Deux paramètres rendent la fonction réutilisable.",
    reasoning: "Les arguments changent à chaque appel, pas la fonction.",
    commonTraps: ["Coder 12 + 5 directement dans la fonction."],
    howToTest: ["Teste plusieurs paires de nombres."],
  },
  "d5-e": {
    exerciseId: "d5-e",
    solution: "def maximum(a, b):\n    if a > b:\n        return a\n    return b",
    explanation: "Si a n'est pas plus grand, b convient, y compris en cas d'égalité.",
    reasoning: "Le return arrête la fonction.",
    commonTraps: ["Afficher au lieu de renvoyer."],
    howToTest: ["maximum(5, 2) vaut 5 ; maximum(2, 5) vaut 5."],
  },
  "d5-f": {
    exerciseId: "d5-f",
    solution: "def moyenne3(a, b, c):\n    return (a + b + c) / 3\n\nprint(moyenne3(12, 14, 16))",
    explanation: "Les parenthèses garantissent que la somme complète est divisée par 3.",
    reasoning: "Sans parenthèses, seul c serait divisé en dernier selon la priorité.",
    commonTraps: ["Écrire a + b + c / 3."],
    howToTest: ["12, 14, 16 doit donner 14."],
  },
  "d5-g": {
    exerciseId: "d5-g",
    solution: "def mention(note):\n    if note < 10:\n        return \"insuffisant\"\n    elif note < 12:\n        return \"passable\"\n    elif note < 14:\n        return \"assez bien\"\n    elif note < 16:\n        return \"bien\"\n    return \"très bien\"",
    explanation: "La logique des notes est encapsulée dans une fonction.",
    reasoning: "On peut tester mention avec plusieurs valeurs sans recopier le code.",
    commonTraps: ["Mettre les seuils dans le mauvais ordre."],
    howToTest: ["Teste 9, 11, 13, 15, 17."],
  },
  "d5-h": {
    exerciseId: "d5-h",
    solution: "def moyenne_ponderee(note1, coef1, note2, coef2):\n    return (note1 * coef1 + note2 * coef2) / (coef1 + coef2)",
    explanation: "Le numérateur additionne les notes pondérées ; le dénominateur additionne les coefficients.",
    reasoning: "Les parenthèses du dénominateur sont indispensables.",
    commonTraps: ["Diviser seulement par coef2."],
    howToTest: ["moyenne_ponderee(10, 1, 20, 1) doit donner 15."],
  },
  "d5-bonus": {
    exerciseId: "d5-bonus",
    solution: "def somme_notes(a, b, c):\n    return a + b + c\n\ndef moyenne_notes(a, b, c):\n    return somme_notes(a, b, c) / 3\n\ndef appreciation(m):\n    if m < 10:\n        return \"à revoir\"\n    elif m < 14:\n        return \"correct\"\n    return \"solide\"",
    explanation: "Chaque fonction a un rôle court et clair.",
    reasoning: "La moyenne réutilise la somme, puis l'appréciation réutilise la moyenne.",
    commonTraps: ["Créer une seule fonction géante."],
    howToTest: ["Teste trois notes faciles et vérifie somme, moyenne, appréciation."],
  },
  "d6-a": {
    exerciseId: "d6-a",
    solution: "mot = input(\"Mot : \")\nprint(mot[0])\nprint(mot[-1])",
    explanation: "0 pointe le premier caractère ; -1 pointe le dernier.",
    reasoning: "Les index négatifs partent de la fin.",
    commonTraps: ["Utiliser mot[1] pour le premier caractère."],
    howToTest: ["python doit donner p puis n."],
  },
  "d6-b": {
    exerciseId: "d6-b",
    solution: "notes = [12, 15, 9]\nprint(notes[1])\nprint(len(notes))",
    explanation: "Le deuxième élément est à l'index 1.",
    reasoning: "len donne le nombre d'éléments.",
    commonTraps: ["Utiliser notes[2] pour le deuxième élément."],
    howToTest: ["La sortie doit être 15 puis 3."],
  },
  "d6-c": {
    exerciseId: "d6-c",
    solution: "prenom = input(\"Prénom : \")\nnom = input(\"Nom : \")\nprint(\"Nom complet :\", prenom, nom)",
    explanation: "print avec des virgules ajoute des espaces lisibles.",
    reasoning: "On garde prénom et nom séparés, puis on compose l'affichage.",
    commonTraps: ["Oublier l'espace entre les deux mots."],
    howToTest: ["Thomas Durand doit s'afficher en deux mots."],
  },
  "d6-d": {
    exerciseId: "d6-d",
    solution: "mot = input(\"Mot : \")\nprint(mot[::-1])",
    explanation: "Le slice avec pas -1 lit la chaîne à l'envers.",
    reasoning: "C'est plus simple qu'une boucle au niveau débutant.",
    commonTraps: ["Écrire une boucle inutilement compliquée."],
    howToTest: ["python doit donner nohtyp."],
  },
  "d6-e": {
    exerciseId: "d6-e",
    solution: "notes = [12, 15, 9, 17, 14]\ntotal = 0\nfor note in notes:\n    total = total + note\nmoyenne = total / len(notes)\nprint(moyenne)",
    explanation: "On accumule les notes puis on divise par la longueur de la liste.",
    reasoning: "len(notes) évite d'écrire le nombre d'éléments en dur.",
    commonTraps: ["Diviser par une mauvaise valeur."],
    howToTest: ["Change une note et vérifie que la moyenne suit."],
  },
  "d6-f": {
    exerciseId: "d6-f",
    solution: "mot = input(\"Mot : \")\nlettre = input(\"Lettre : \")\ncompteur = 0\nfor caractere in mot:\n    if caractere == lettre:\n        compteur = compteur + 1\nprint(compteur)",
    explanation: "On compare chaque caractère à la lettre cherchée.",
    reasoning: "Un compteur compte les correspondances.",
    commonTraps: ["Comparer mot == lettre."],
    howToTest: ["banane avec a doit donner 2."],
  },
  "d6-g": {
    exerciseId: "d6-g",
    solution: "notes = [12, 15, 9, 17]\nplus_grande = notes[0]\nfor note in notes:\n    if note > plus_grande:\n        plus_grande = note\nprint(plus_grande)",
    explanation: "On part du premier élément plutôt que d'une valeur arbitraire.",
    reasoning: "Cela fonctionne même si toutes les notes sont négatives ou basses dans d'autres contextes.",
    commonTraps: ["Initialiser à 0 sans réfléchir."],
    howToTest: ["La liste donnée doit produire 17."],
  },
  "d6-h": {
    exerciseId: "d6-h",
    solution: "mot = input(\"Mot : \").lower()\nif mot == mot[::-1]:\n    print(\"palindrome\")\nelse:\n    print(\"pas palindrome\")",
    explanation: "On normalise en minuscules puis on compare au mot inversé.",
    reasoning: "Un palindrome se lit pareil dans les deux sens.",
    commonTraps: ["Oublier lower et rater Radar/radar."],
    howToTest: ["radar oui, python non."],
  },
  "d6-bonus": {
    exerciseId: "d6-bonus",
    solution: "prenom = input(\"Prénom : \").strip().lower()\nnom = input(\"Nom : \").strip().lower()\nprint(prenom + \".\" + nom + \"@etu-univ.fr\")",
    explanation: "strip nettoie les espaces inutiles ; lower met en minuscules.",
    reasoning: "On prépare les morceaux avant d'assembler l'adresse.",
    commonTraps: ["Oublier strip et garder des espaces."],
    howToTest: ["  Thomas / Durand doit produire thomas.durand@etu-univ.fr."],
  },
};

const corrections: Correction[] = allExercises.map((item) => {
  const base = solutionBank[item.id];
  if (!base) {
    throw new Error(`Missing correction for ${item.id}`);
  }

  return {
    id: item.correctionId,
    week: 1,
    day: item.day,
    title: item.title,
    ...base,
  };
});

export const week1: Week = {
  id: "week-1",
  weekNumber: 1,
  title: "Semaine 1 - Socle BUT Informatique",
  subtitle: "Terminal, Python de base, mini-projet et checkpoint final",
  overview:
    "Une semaine de 24 heures environ pour devenir à l'aise dans le terminal, lancer et modifier de petits scripts Python, comprendre variables, conditions, boucles, fonctions, chaînes et listes, puis assembler un mini-projet.",
  objectives: [
    "Créer, déplacer, copier et supprimer des fichiers sans aide.",
    "Comprendre chemins relatifs et chemins absolus.",
    "Écrire des scripts courts avec variables, conditions, boucles et fonctions.",
    "Tracer mentalement une boucle simple.",
    "Manipuler chaînes et listes pour résoudre de petits problèmes.",
    "Réaliser une Boîte à outils étudiant en console.",
  ],
  schedule: [
    { block: "Matin de lancement", theme: "Installation, WSL, Ubuntu, terminal de base", duration: "2 h 15" },
    { block: "Matin variables", theme: "Variables, types, print, input", duration: "2 h" },
    { block: "Matin logique", theme: "if, elif, else, comparaisons, booléens", duration: "2 h" },
    { block: "Matin boucles", theme: "for, while, range, accumulation", duration: "2 h" },
    { block: "Matin fonctions", theme: "paramètres, retour, découpage", duration: "2 h" },
    { block: "Matin chaînes et listes", theme: "index, slices, len, listes de notes", duration: "2 h" },
    { block: "Fin de semaine", theme: "test blanc + rangement", duration: "2 h" },
    { block: "Après-midis", theme: "entraînement précis et mini-projet", duration: "9 h à 10 h" },
    { block: "Soirs", theme: "rappel actif, mini quiz, fiches", duration: "3 h à 4 h" },
  ],
  targetLevel: [
    "Je me repère dans le terminal sans ouvrir l'explorateur toutes les deux minutes.",
    "Je sais créer une arborescence de dossiers.",
    "Je sais lancer un script avec python3.",
    "Je sais écrire des scripts courts avec conditions, boucles et fonctions.",
    "Je sais manipuler une chaîne et une liste simple.",
    "Je peux expliquer un code simple ligne par ligne.",
  ],
  days,
  corrections,
  project: {
    id: "project-week-1",
    title: "Boîte à outils étudiant",
    brief:
      "Créer un programme console avec un menu : moyenne pondérée, conversion, minuteur simple, journal de session et sortie propre.",
    requiredFeatures: [
      "Calculer une moyenne pondérée avec deux notes et deux coefficients.",
      "Proposer au moins deux conversions : Celsius vers Fahrenheit et minutes vers heures + minutes.",
      "Lancer un minuteur simple avec compte à rebours et message de fin.",
      "Écrire une ligne dans journal_sessions.txt avec nom de session, durée et ressenti.",
      "Quitter proprement depuis le menu.",
    ],
    bonusFeatures: [
      "Ajouter une troisième note à la moyenne pondérée.",
      "Gérer les erreurs de saisie.",
      "Enregistrer automatiquement une moyenne dans le journal.",
      "Afficher des séparateurs lisibles dans le menu.",
    ],
    fileStructure: "projet_1_outils_etudiant/\n├── main.py\n├── journal_sessions.txt\n└── README.md",
    steps: [
      "Créer le menu principal.",
      "Coder et tester séparément moyenne_ponderee(...), conversion, minuteur et journal.",
      "Relier les fonctions au menu avec un while.",
      "Tester les cas normaux : moyenne, conversions, minuteur court, écriture du journal.",
      "Relire : noms clairs, indentation propre, pas de lignes inutiles.",
    ],
    successCriteria: [
      "Le menu s'affiche correctement.",
      "Chaque choix appelle le bon bloc.",
      "La moyenne pondérée est juste.",
      "Au moins deux conversions fonctionnent.",
      "Le minuteur descend jusqu'à 0.",
      "Le journal texte reçoit une nouvelle ligne.",
      "Le programme peut quitter proprement.",
    ],
    grading: [
      { criterion: "Menu fonctionnel", points: 3 },
      { criterion: "Moyenne pondérée correcte", points: 4 },
      { criterion: "Convertisseur correct", points: 4 },
      { criterion: "Minuteur simple correct", points: 3 },
      { criterion: "Journal texte correct", points: 3 },
      { criterion: "Lisibilité du code", points: 3 },
    ],
    solution: "from time import sleep\n\n\ndef calculer_moyenne_ponderee():\n    note1 = float(input(\"Note 1 : \"))\n    coef1 = float(input(\"Coef 1 : \"))\n    note2 = float(input(\"Note 2 : \"))\n    coef2 = float(input(\"Coef 2 : \"))\n    total_coef = coef1 + coef2\n    if total_coef == 0:\n        print(\"Somme des coefficients invalide.\")\n        return\n    moyenne = (note1 * coef1 + note2 * coef2) / total_coef\n    print(\"Moyenne pondérée :\", round(moyenne, 2))\n\n\ndef faire_conversion():\n    print(\"1 - Celsius vers Fahrenheit\")\n    print(\"2 - Minutes vers heures/minutes\")\n    choix = input(\"Choix : \")\n    if choix == \"1\":\n        c = float(input(\"Température en °C : \"))\n        f = c * 9 / 5 + 32\n        print(c, \"°C =\", round(f, 2), \"°F\")\n    elif choix == \"2\":\n        minutes = int(input(\"Nombre de minutes : \"))\n        heures = minutes // 60\n        reste = minutes % 60\n        print(minutes, \"minutes =\", heures, \"h\", reste, \"min\")\n    else:\n        print(\"Choix invalide.\")\n\n\ndef lancer_minuteur():\n    secondes = int(input(\"Durée en secondes : \"))\n    while secondes > 0:\n        print(\"Temps restant :\", secondes, \"s\")\n        sleep(1)\n        secondes = secondes - 1\n    print(\"Session terminée.\")\n\n\ndef ajouter_journal():\n    session = input(\"Nom de la session : \")\n    duree = input(\"Durée : \")\n    ressenti = input(\"Ressenti : \")\n    with open(\"journal_sessions.txt\", \"a\", encoding=\"utf-8\") as fichier:\n        fichier.write(session + \";\" + duree + \";\" + ressenti + \"\\n\")\n    print(\"Ligne ajoutée au journal.\")",
  },
  checkpoint: {
    id: "checkpoint-week-1",
    title: "Checkpoint final - Test blanc semaine 1",
    duration: "1 h 45",
    totalPoints: 100,
    tasks: [
      {
        id: "cp-terminal-a",
        block: "Terminal",
        title: "Arborescence",
        points: 10,
        statement: "Crée checkpoint/sources/todo.txt et checkpoint/archives. Écris trois lignes dans todo.txt : réviser terminal, coder python, dormir. Copie todo.txt dans archives sous le nom todo_backup.txt.",
      },
      {
        id: "cp-terminal-b",
        block: "Terminal",
        title: "Déplacement relatif",
        points: 10,
        statement: "Depuis ~/checkpoint/sources, donne la commande pour aller dans archives avec un chemin relatif, la commande pour revenir au dossier personnel, puis explique absolu vs relatif.",
      },
      {
        id: "cp-read-a",
        block: "Lecture et logique",
        title: "Prévoir une sortie",
        points: 8,
        statement: "Prévois la sortie de : x = 4 ; y = x + 3 ; print(y) ; print(y > 10).",
      },
      {
        id: "cp-read-b",
        block: "Lecture et logique",
        title: "Dry-run de boucle",
        points: 12,
        statement: "Donne la valeur finale de total pour une boucle de 1 à 4 qui additionne dans total, puis explique le rôle de i.",
      },
      {
        id: "cp-code-a",
        block: "Programmation",
        title: "Pair ou impair",
        points: 12,
        statement: "Écris un script qui demande un entier et affiche s'il est pair ou impair.",
      },
      {
        id: "cp-code-b",
        block: "Programmation",
        title: "Somme de 1 à n",
        points: 18,
        statement: "Écris un script qui demande n puis affiche la somme de 1 à n.",
      },
      {
        id: "cp-code-c",
        block: "Programmation",
        title: "Fonction moyenne",
        points: 20,
        statement: "Écris une fonction moyenne(notes) qui reçoit une liste de notes et renvoie leur moyenne. Teste-la avec [12, 14, 16].",
      },
      {
        id: "cp-debug-a",
        block: "Débogage et expression",
        title: "Réparer un bug",
        points: 10,
        statement: "Corrige une fonction somme(n) qui utilise range(1, n), remplace total par i, puis retourne total.",
      },
      {
        id: "cp-logic-a",
        block: "Débogage et expression",
        title: "Booléens",
        points: 10,
        statement: "Donne les résultats : 5 > 2 and 3 < 1 ; 5 > 2 or 3 < 1 ; not (4 == 4) ; 7 % 2 == 0.",
      },
    ],
    passCriteria: [
      "70/100 ou plus.",
      "Bloc terminal réussi.",
      "Fonction correcte.",
      "Différence entre = et == expliquée sans flou.",
      "Au moins une boucle tracée correctement.",
    ],
    reviewAdvice: [
      { if: "Le terminal bloque", then: "Refais tous les exercices du premier jour, surtout les chemins relatifs." },
      { if: "Les conversions bloquent", then: "Refais variables/types, surtout int(input(...)) et float(input(...))." },
      { if: "Les boucles bloquent", then: "Refais les dry-runs au papier." },
      { if: "Les fonctions bloquent", then: "Reviens à carre, addition et moyenne3." },
    ],
  },
  sheets: [
    {
      id: "terminal",
      title: "Fiche terminal",
      items: ["pwd = où suis-je ?", "ls = qu'y a-t-il ici ?", "cd = se déplacer", "mkdir = créer un dossier", "cp = copier", "mv = déplacer / renommer", "rm = supprimer un fichier", "rm -r = supprimer un dossier et son contenu", "cat = afficher un petit fichier", "less = lire confortablement", "history = voir les commandes déjà tapées", "man = lire le manuel", "~ = dossier personnel", ". = dossier courant", ".. = dossier parent"],
    },
    {
      id: "python-bases",
      title: "Fiche Python bases",
      items: ["int = entier", "float = décimal", "str = texte", "bool = vrai/faux", "input renvoie du texte", "int(...) et float(...) convertissent avant calcul"],
      code: "nom = \"Thomas\"\nage = 18\nmoyenne = 14.5\npresent = True\nprenom = input(\"Prénom : \")\nage = int(input(\"Âge : \"))",
    },
    {
      id: "conditions",
      title: "Fiche conditions",
      items: ["= stocke", "== compare", "and = les deux", "or = au moins un", "not = inverse", "elif sert aux cas intermédiaires"],
      code: "if condition:\n    ...\nelif autre_condition:\n    ...\nelse:\n    ...",
    },
    {
      id: "boucles",
      title: "Fiche boucles",
      items: ["range(1, 6) va de 1 à 5", "La borne de fin est exclue", "while doit faire évoluer sa condition", "Un accumulateur commence souvent à 0", "Un accumulateur multiplicatif commence à 1"],
      code: "for i in range(1, 6):\n    print(i)\n\nmot = \"\"\nwhile mot != \"ok\":\n    mot = input(\"Tape ok : \")",
    },
    {
      id: "fonctions",
      title: "Fiche fonctions",
      items: ["Nom clair", "Rôle clair", "Paramètres utiles", "return pour renvoyer", "On teste après avoir défini"],
      code: "def carre(n):\n    return n * n",
    },
    {
      id: "chaines-listes",
      title: "Fiche chaînes et listes",
      items: ["mot[0] = premier caractère", "mot[-1] = dernier caractère", "mot[::-1] inverse", "len donne la longueur", "append ajoute en fin de liste"],
      code: "mot = \"python\"\nnotes = [12, 15, 9]\nnotes.append(14)",
    },
    {
      id: "anti-erreur",
      title: "Fiche réflexe anti-erreur",
      items: ["Suis-je dans le bon dossier ?", "Ai-je confondu = et == ?", "Ai-je oublié int(...) ou float(...) ?", "Ai-je bien indenté ?", "Ma variable de boucle change-t-elle ?", "Ai-je écrit return quand je veux réutiliser une valeur ?"],
    },
  ],
  revisionCards: [
    { id: "rc-pwd", skill: "Terminal", title: "pwd", front: "Quelle commande affiche le dossier courant ?", back: "pwd." },
    { id: "rc-relative", skill: "Terminal", title: "Chemin relatif", front: "Que signifie .. dans un chemin ?", back: "Le dossier parent." },
    { id: "rc-input", skill: "Python bases", title: "input", front: "Quel type renvoie input() ?", back: "str, donc du texte." },
    { id: "rc-equals", skill: "Conditions", title: "= vs ==", front: "Différence entre = et == ?", back: "= stocke, == compare." },
    { id: "rc-range", skill: "Boucles", title: "range", front: "Que produit range(1, 4) ?", back: "1, 2, 3." },
    { id: "rc-acc", skill: "Boucles", title: "Accumulateur", front: "Pourquoi initialiser total avant la boucle ?", back: "Pour avoir une valeur de départ à mettre à jour." },
    { id: "rc-return", skill: "Fonctions", title: "return", front: "Quand utiliser return ?", back: "Quand le résultat doit être réutilisé." },
    { id: "rc-index", skill: "Chaînes/listes", title: "Index", front: "Quel est le premier index en Python ?", back: "0." },
    { id: "rc-slice", skill: "Chaînes/listes", title: "Slice inverse", front: "Que fait mot[::-1] ?", back: "Il renverse la chaîne." },
  ],
};

export const week1CorrectionsById = Object.fromEntries(
  week1.corrections.map((correction) => [correction.id, correction]),
) as Record<string, Correction>;

export const week1ExercisesById = Object.fromEntries(
  allExercises.map((item) => [item.id, item]),
) as Record<string, Exercise>;

export function getWeekDay(dayId: string) {
  return week1.days.find((day) => day.id === dayId);
}

export function getWeekProgressTotals() {
  return {
    lessons: week1.days.reduce((count, day) => count + day.morning.length, 0),
    exercises: allExercises.length,
    quizzes: week1.days.length,
  };
}
