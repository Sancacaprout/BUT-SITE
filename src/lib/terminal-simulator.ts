export type FsEntry =
  | { type: "dir" }
  | { type: "file"; content: string };

export type TerminalState = {
  cwd: string;
  entries: Record<string, FsEntry>;
  transcript: string[];
  history: string[];
};

type TerminalWriter = (line?: string) => void;

const knownCommands = ["pwd", "ls", "dir", "cd", "mkdir", "touch", "echo", "cat", "type", "cp", "mv", "rm", "man", "git", "help"];

export function createBaseTerminalState(): TerminalState {
  return {
    cwd: "/home/student",
    entries: {
      "/": { type: "dir" },
      "/home": { type: "dir" },
      "/home/student": { type: "dir" },
    },
    transcript: [
      "Ubuntu éducatif prêt. Ce terminal est simulé dans le navigateur.",
      "Tape une commande puis Entrée. Exemples : pwd, ls, cd ~, mkdir test.",
    ],
    history: [],
  };
}

export function executeTerminalCommand(state: TerminalState, input: string): TerminalState {
  const originalInput = input;
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return state;
  }

  const tokens = tokenizeTerminalCommand(trimmedInput);
  const rawCommand = tokens[0] ?? "";
  const command = rawCommand.toLowerCase();
  const args = tokens.slice(1);

  if (command === "clear" || command === "cls") {
    return { ...state, transcript: [] };
  }

  const entries = { ...state.entries };
  const transcript = [...state.transcript, `$ ${originalInput}`];
  const history = command ? [...state.history, [command, ...args].join(" ").trim()] : [...state.history, trimmedInput];
  let cwd = state.cwd;

  const write: TerminalWriter = (line = "") => transcript.push(line);
  const fail = (message: string) => write(message);

  if (rawCommand && rawCommand !== command && knownCommands.includes(command)) {
    write("Astuce : Linux distingue les majuscules et les minuscules. Ici j'accepte la commande, mais retiens la forme en minuscules.");
  }

  try {
    switch (command) {
      case "help":
        executeHelp(write);
        break;
      case "pwd":
        write(cwd);
        break;
      case "ls":
      case "dir":
        executeLs(args, cwd, entries, write);
        break;
      case "cd":
        cwd = executeCd(args, cwd, entries, fail);
        break;
      case "mkdir":
        executeMkdir(args, cwd, entries, fail);
        break;
      case "touch":
        executeTouch(args, cwd, entries, fail);
        break;
      case "echo":
        executeEcho(args, cwd, entries, write);
        break;
      case "cat":
      case "type":
        executeCat(command, args, cwd, entries, write, fail);
        break;
      case "cp":
        executeCp(args, cwd, entries, fail);
        break;
      case "mv":
        executeMv(args, cwd, entries, fail);
        break;
      case "rm":
        executeRm(args, cwd, entries, fail);
        break;
      case "man":
        executeMan(args, write);
        break;
      case "git":
        executeGit(args, cwd, entries, write);
        break;
      default:
        fail(`${rawCommand || trimmedInput}: commande non disponible dans ce simulateur. Tape 'help' pour voir les commandes du jour.`);
    }
  } catch {
    fail("Erreur du simulateur : vérifie la syntaxe de ta commande.");
  }

  return { cwd, entries, transcript, history };
}

function executeHelp(write: TerminalWriter) {
  write("Commandes utiles aujourd'hui :");
  write("pwd : afficher le dossier actuel");
  write("ls : lister le contenu du dossier");
  write("cd dossier : entrer dans un dossier, cd .. : revenir au parent, cd ~ : revenir au départ");
  write("mkdir nom : créer un dossier");
  write("touch fichier.txt : créer un fichier vide");
  write("echo \"texte\" > fichier.txt : écrire dans un fichier, >> ajoute une ligne");
  write("cat fichier.txt : afficher un fichier");
  write("cp source destination : copier");
  write("mv source destination : déplacer ou renommer");
  write("rm fichier, rm -r dossier : supprimer");
}

function executeLs(args: string[], cwd: string, entries: Record<string, FsEntry>, write: TerminalWriter) {
  const options = args.filter((arg) => arg.startsWith("-"));
  const paths = args.filter((arg) => !arg.startsWith("-"));
  const target = normalizePath(paths[0] ?? ".", cwd);
  const entry = entries[target];
  const includeHidden = options.some((option) => option.includes("a"));
  const longFormat = options.some((option) => option.includes("l"));

  if (!entry) {
    write(`ls: impossible d'accéder à '${target}' : dossier ou fichier introuvable`);
    return;
  }

  if (entry.type === "file") {
    write(longFormat ? formatEntryLine(target, entry) : basename(target));
    return;
  }

  const children = Object.entries(entries)
    .filter(([path]) => dirname(path) === target && path !== target)
    .filter(([path]) => includeHidden || !basename(path).startsWith("."))
    .sort(([a], [b]) => basename(a).localeCompare(basename(b)));

  if (!children.length) {
    write("");
    return;
  }

  write(longFormat ? children.map(([path, child]) => formatEntryLine(path, child)).join("\n") : children.map(([path]) => basename(path)).join("  "));
}

function executeCd(args: string[], cwd: string, entries: Record<string, FsEntry>, fail: (message: string) => void) {
  const target = normalizePath(args[0] ?? "~", cwd);
  if (entries[target]?.type === "dir") {
    return target;
  }
  if (entries[target]?.type === "file") {
    fail(`cd: ${args[0] ?? ""}: ce n'est pas un dossier`);
    return cwd;
  }
  fail(`cd: ${args[0] ?? ""}: dossier introuvable. Tape 'ls' pour voir les dossiers disponibles, ou 'cd ~' pour revenir au départ.`);
  return cwd;
}

function executeMkdir(args: string[], cwd: string, entries: Record<string, FsEntry>, fail: (message: string) => void) {
  const recursive = args.includes("-p");
  const paths = args.filter((token) => token !== "-p");
  if (!paths.length) {
    fail("mkdir: indique le nom du dossier à créer. Exemple : mkdir but-prepa");
  }
  for (const path of paths) {
    const fullPath = normalizePath(path, cwd);
    const parent = dirname(fullPath);
    if (entries[fullPath]) {
      if (recursive && entries[fullPath].type === "dir") {
        continue;
      }
      fail(`mkdir: impossible de créer le répertoire « ${path} »: Le fichier existe`);
      continue;
    }
    if (!isDir(entries, parent) && !recursive) {
      fail(`mkdir: impossible de créer '${path}' : le dossier parent '${shortPath(parent)}' n'existe pas. Crée-le d'abord ou utilise mkdir -p.`);
      continue;
    }
    if (recursive) {
      ensureDirectory(entries, fullPath);
    } else {
      entries[fullPath] = { type: "dir" };
    }
  }
}

function executeTouch(args: string[], cwd: string, entries: Record<string, FsEntry>, fail: (message: string) => void) {
  if (!args.length) {
    fail("touch: indique le nom du fichier à créer. Exemple : touch notes.txt");
  }
  for (const path of args) {
    const fullPath = normalizePath(path, cwd);
    if (!isDir(entries, dirname(fullPath))) {
      fail(`touch: impossible de créer '${path}' : dossier parent introuvable`);
    } else {
      entries[fullPath] = { type: "file", content: entries[fullPath]?.type === "file" ? entries[fullPath].content : "" };
    }
  }
}

function executeEcho(tokens: string[], cwd: string, entries: Record<string, FsEntry>, write: TerminalWriter) {
  const redirectIndex = tokens.findIndex((token) => token === ">" || token === ">>");
  if (redirectIndex === -1) {
    write(tokens.join(" "));
    return;
  }

  const append = tokens[redirectIndex] === ">>";
  const content = tokens.slice(0, redirectIndex).join(" ");
  const targetRaw = tokens[redirectIndex + 1];
  if (!targetRaw) {
    write("echo: redirection sans fichier");
    return;
  }

  const target = normalizePath(targetRaw, cwd);
  if (!isDir(entries, dirname(target))) {
    write(`echo: impossible d'écrire dans '${targetRaw}' : dossier parent introuvable`);
    return;
  }

  const previous = entries[target]?.type === "file" ? entries[target].content : "";
  entries[target] = { type: "file", content: append ? `${previous}${content}\n` : `${content}\n` };
}

function executeCat(command: string, args: string[], cwd: string, entries: Record<string, FsEntry>, write: TerminalWriter, fail: (message: string) => void) {
  if (command === "type") {
    write("Astuce : sur Linux, la commande équivalente est plutôt 'cat fichier.txt'.");
  }
  if (!args.length) {
    fail("cat: indique le fichier à afficher. Exemple : cat commandes.txt");
  }
  for (const path of args) {
    const fullPath = normalizePath(path, cwd);
    const entry = entries[fullPath];
    if (entry?.type === "file") {
      write(entry.content.trimEnd());
    } else {
      fail(`cat: ${path}: fichier introuvable`);
    }
  }
}

function executeCp(args: string[], cwd: string, entries: Record<string, FsEntry>, fail: (message: string) => void) {
  const [sourceRaw, destRaw] = args;
  const source = normalizePath(sourceRaw ?? "", cwd);
  let dest = normalizePath(destRaw ?? "", cwd);
  const sourceEntry = entries[source];
  if (!sourceRaw || !destRaw) {
    fail("cp: utilise deux chemins. Exemple : cp source.txt copie.txt");
  } else if (!sourceEntry || sourceEntry.type !== "file") {
    fail(`cp: impossible de lire '${sourceRaw}' : fichier introuvable`);
  } else {
    if (entries[dest]?.type === "dir") {
      dest = `${dest}/${basename(source)}`;
    }
    if (!isDir(entries, dirname(dest))) {
      fail(`cp: impossible d'écrire vers '${destRaw}' : dossier parent introuvable`);
    } else {
      entries[dest] = { type: "file", content: sourceEntry.content };
    }
  }
}

function executeMv(args: string[], cwd: string, entries: Record<string, FsEntry>, fail: (message: string) => void) {
  const [sourceRaw, destRaw] = args;
  const source = normalizePath(sourceRaw ?? "", cwd);
  let dest = normalizePath(destRaw ?? "", cwd);
  const sourceEntry = entries[source];
  if (!sourceRaw || !destRaw) {
    fail("mv: utilise deux chemins. Exemple : mv ancien.txt nouveau.txt");
  } else if (!sourceEntry) {
    fail(`mv: impossible de trouver '${sourceRaw}'`);
  } else {
    if (entries[dest]?.type === "dir") {
      dest = `${dest}/${basename(source)}`;
    }
    if (!isDir(entries, dirname(dest))) {
      fail(`mv: impossible d'écrire vers '${destRaw}' : dossier parent introuvable`);
    } else {
      entries[dest] = sourceEntry;
      delete entries[source];
    }
  }
}

function executeRm(args: string[], cwd: string, entries: Record<string, FsEntry>, fail: (message: string) => void) {
  const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
  const paths = args.filter((token) => !token.startsWith("-"));
  if (!paths.length) {
    fail("rm: indique quoi supprimer. Exemple : rm fichier.txt");
  }
  for (const path of paths) {
    const fullPath = normalizePath(path, cwd);
    const entry = entries[fullPath];
    if (!entry) {
      fail(`rm: ${path}: introuvable`);
    } else if (entry.type === "dir" && !recursive) {
      fail(`rm: ${path}: est un dossier, ajoute -r si c'est volontaire`);
    } else {
      for (const key of Object.keys(entries)) {
        if (key === fullPath || key.startsWith(`${fullPath}/`)) {
          delete entries[key];
        }
      }
    }
  }
}

function executeMan(args: string[], write: TerminalWriter) {
  if (args[0]?.toLowerCase() === "rm") {
    write("RM(1) - remove files or directories");
    write("-r, -R, --recursive : supprimer les dossiers et leur contenu récursivement.");
  } else {
    write("Manuel simulé : essaie `man rm` pour cet exercice.");
  }
}

function executeGit(tokens: string[], cwd: string, entries: Record<string, FsEntry>, write: TerminalWriter) {
  const command = tokens[0];
  if (command === "init") {
    entries[`${cwd}/.git`] = { type: "dir" };
    write("Dépôt Git initialisé.");
  } else if (command === "status") {
    write(entries[`${cwd}/.git`] ? "Sur la branche main. Rien à valider pour l'instant." : "fatal: pas un dépôt git");
  } else if (command === "add") {
    write("Fichiers préparés.");
  } else if (command === "commit") {
    write("[main abc123] Commit simulé");
  } else if (command === "log") {
    write("abc123 Commit simulé");
  } else if (command === "diff") {
    write("Diff simulé : aucune différence affichée.");
  } else {
    write("git: commande simulée disponible : init, status, add, commit, log, diff.");
  }
}

export function tokenizeTerminalCommand(input: string) {
  const tokens: string[] = [];
  const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
  const normalizedInput = input.trim().replace(/(>>|>)/g, " $1 ");
  let match: RegExpExecArray | null;
  while ((match = regex.exec(normalizedInput))) {
    tokens.push(match[1] ?? match[2] ?? match[3]);
  }
  return tokens;
}

export function normalizePath(input: string, cwd: string) {
  let path = input || ".";
  if (path === "~") path = "/home/student";
  else if (path.startsWith("~/")) path = `/home/student/${path.slice(2)}`;
  else if (!path.startsWith("/")) path = `${cwd}/${path}`;

  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return `/${parts.join("/")}` || "/";
}

export function ensureParents(entries: Record<string, FsEntry>, path: string) {
  const parts = path.split("/").filter(Boolean);
  let current = "";
  for (const part of parts.slice(0, -1)) {
    current += `/${part}`;
    entries[current] = entries[current] ?? { type: "dir" };
  }
}

export function shortPath(path: string) {
  return path.replace("/home/student", "~");
}

function ensureDirectory(entries: Record<string, FsEntry>, path: string) {
  const parts = path.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    entries[current] = entries[current] ?? { type: "dir" };
  }
}

function isDir(entries: Record<string, FsEntry>, path: string) {
  return entries[path]?.type === "dir";
}

function dirname(path: string) {
  if (path === "/") return "/";
  const parts = path.split("/");
  parts.pop();
  return parts.join("/") || "/";
}

function basename(path: string) {
  return path.split("/").filter(Boolean).pop() ?? "/";
}

function formatEntryLine(path: string, entry: FsEntry) {
  return `${entry.type === "dir" ? "d" : "-"} ${basename(path)}`;
}
