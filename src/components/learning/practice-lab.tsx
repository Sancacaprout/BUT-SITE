"use client";

import { CheckCircle2, Code2, Play, RotateCcw, Terminal, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { Exercise } from "@/content/week-1";
import { useProgress } from "@/lib/progress/progress-store";
import {
  createBaseTerminalState,
  ensureParents,
  executeTerminalCommand,
  normalizePath,
  shortPath,
  type FsEntry,
  type TerminalState,
} from "@/lib/terminal-simulator";

type LabMode = "terminal" | "python" | "code";

type ValidationResult = {
  ok: boolean;
  title: string;
  message: string;
  missing?: string[];
};

const terminalTerms = [
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
  "man",
  "git",
  "status",
  "commit",
];

const pythonTerms = [
  "python",
  "script",
  "print",
  "input",
  "variable",
  "int",
  "float",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "range",
  "fonction",
  "return",
  "liste",
  "dictionnaire",
  "dict",
  "open",
  "write",
  "append",
  "split",
  "sort",
  "module",
  "import",
  "try",
  "exception",
  "pytest",
  "assert",
  "main",
];

export function PracticeLab({ exercise }: { exercise: Exercise }) {
  const { state, saveNote, setExerciseStatus } = useProgress();
  const mode = getLabMode(exercise);
  const [terminalState, setTerminalState] = useState(() => createInitialTerminalState(exercise));
  const [command, setCommand] = useState("");
  const [code, setCode] = useState(state.notes[`lab-code-${exercise.id}`] ?? getStarterCode(exercise, mode));
  const [inputs, setInputs] = useState(state.notes[`lab-inputs-${exercise.id}`] ?? "Thomas\n18\n12\n5");
  const [output, setOutput] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const labTitle = mode === "terminal" ? "Terminal Linux prêt" : mode === "python" ? "Terminal Python" : "Atelier code";
  const LabIcon = mode === "terminal" ? Terminal : Code2;

  const checks = useMemo(() => getVisibleChecks(exercise, mode), [exercise, mode]);

  function markIfDone(result: ValidationResult) {
    setValidation(result);
    if (result.ok) {
      setExerciseStatus(exercise.id, "done");
    }
  }

  function runCommand(rawCommand: string) {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      return;
    }

    const next = executeTerminalCommand(terminalState, trimmed);
    setTerminalState(next);
    setCommand("");
    markIfDone(validateTerminalExercise(exercise, next));
  }

  function runCode() {
    saveNote(`lab-code-${exercise.id}`, code);
    saveNote(`lab-inputs-${exercise.id}`, inputs);

    const run = mode === "python" ? runPythonLite(code, inputs.split(/\r?\n/)) : runStaticCodePreview(code);
    setOutput(run.output);
    markIfDone(validateCodeExercise(exercise, code, run.output));
  }

  function resetLab() {
    setValidation(null);
    setOutput("");
    if (mode === "terminal") {
      setTerminalState(createInitialTerminalState(exercise));
      setCommand("");
    } else {
      setCode(getStarterCode(exercise, mode));
      setInputs("Thomas\n18\n12\n5");
      saveNote(`lab-code-${exercise.id}`, "");
      saveNote(`lab-inputs-${exercise.id}`, "");
    }
  }

  function goNext() {
    const current = document.getElementById(exercise.id);
    const next = current?.nextElementSibling;
    if (next instanceof HTMLElement) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-code text-code-foreground shadow-sm">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LabIcon size={17} aria-hidden="true" />
            {labTitle}
          </div>
          <details className="mt-1 text-xs text-code-foreground/75">
            <summary className="cursor-pointer">À savoir</summary>
            <p className="mt-1 leading-5">
              Environnement simulé dans le navigateur : pas besoin d’installer Ubuntu pour t’entraîner. Tape `help`
              si tu veux voir les commandes disponibles.
            </p>
          </details>
        </div>
        <button
          type="button"
          onClick={resetLab}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-xs font-medium text-code-foreground hover:bg-white/10"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Réinitialiser
        </button>
      </div>

      {mode === "terminal" ? (
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-h-[300px] p-4">
            <div className="max-h-[360px] overflow-auto rounded-md bg-black/25 p-3 font-mono text-sm leading-6">
              {terminalState.transcript.map((line, index) => (
                <div key={`${line}-${index}`} className={line.startsWith("$") ? "text-emerald-200" : "text-code-foreground/85"}>
                  {line || " "}
                </div>
              ))}
            </div>
            <form
              className="mt-3 flex items-center gap-2 rounded-md border border-white/15 bg-black/25 px-3 py-2 font-mono text-sm"
              onSubmit={(event) => {
                event.preventDefault();
                runCommand(command);
              }}
            >
              <span className="shrink-0 text-emerald-200">student:{shortPath(terminalState.cwd)}$</span>
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-code-foreground outline-none placeholder:text-code-foreground/40"
                placeholder="pwd, ls, cd, mkdir, echo..."
                autoCapitalize="off"
                spellCheck={false}
              />
            </form>
          </div>
          <LabChecklist checks={checks} validation={validation} onNext={goNext} />
        </div>
      ) : (
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_270px]">
          <div className="space-y-3 p-4">
            <textarea
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                saveNote(`lab-code-${exercise.id}`, event.target.value);
              }}
              className="min-h-[260px] w-full resize-y rounded-md border border-white/15 bg-black/25 p-3 font-mono text-sm leading-6 text-code-foreground outline-none focus:border-accent"
              placeholder={mode === "python" ? "Écris ton Python ici..." : "Écris ta réponse ou ton code ici..."}
              spellCheck={false}
            />
            {mode === "python" ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-code-foreground/80">Entrées de test, une par ligne</span>
                <textarea
                  value={inputs}
                  onChange={(event) => {
                    setInputs(event.target.value);
                    saveNote(`lab-inputs-${exercise.id}`, event.target.value);
                  }}
                  className="min-h-20 w-full resize-y rounded-md border border-white/15 bg-black/20 p-2 font-mono text-xs leading-5 text-code-foreground outline-none focus:border-accent"
                />
              </label>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={runCode}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-accent-contrast hover:bg-accent-hover"
              >
                <Play size={16} aria-hidden="true" />
                Tester
              </button>
            </div>
            {output ? (
              <pre className="max-h-48 overflow-auto rounded-md border border-white/15 bg-black/30 p-3 font-mono text-xs leading-5 text-code-foreground/90">
                {output}
              </pre>
            ) : null}
          </div>
          <LabChecklist checks={checks} validation={validation} onNext={goNext} />
        </div>
      )}
    </section>
  );
}

function LabChecklist({
  checks,
  validation,
  onNext,
}: {
  checks: string[];
  validation: ValidationResult | null;
  onNext: () => void;
}) {
  return (
    <aside className="border-t border-white/10 bg-black/15 p-4 lg:border-l lg:border-t-0">
      <details className="text-xs text-code-foreground/75">
        <summary className="cursor-pointer font-semibold uppercase tracking-wide text-code-foreground/70">
          Objectif vérifié
        </summary>
        <ul className="mt-3 space-y-2 leading-5">
          {checks.map((check) => (
            <li key={check} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent-strong" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </details>

      {validation ? (
        <div
          className={`mt-4 rounded-md border p-3 text-sm ${
            validation.ok
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-amber-400/40 bg-amber-400/10 text-amber-100"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {validation.ok ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
            {validation.title}
          </div>
          <p className="mt-1 text-xs leading-5">{validation.message}</p>
          {validation.missing?.length ? (
            <ul className="mt-2 space-y-1 text-xs">
              {validation.missing.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          ) : null}
          {validation.ok ? (
            <button
              type="button"
              onClick={onNext}
              className="mt-3 inline-flex h-8 items-center justify-center rounded-md bg-emerald-500 px-3 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
            >
              Passer au suivant
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-white/10 bg-white/5 p-3 text-xs leading-5 text-code-foreground/70">
          Lance une commande ou teste ton code. Le site te dira si l’exercice est validé.
        </p>
      )}
    </aside>
  );
}

function getLabMode(exercise: Exercise): LabMode {
  const haystack = `${exercise.title} ${exercise.statement} ${exercise.skills.join(" ")}`.toLowerCase();
  if (exercise.id.startsWith("d1-")) {
    return "terminal";
  }
  if (terminalTerms.some((term) => haystack.includes(term))) {
    return "terminal";
  }
  if (pythonTerms.some((term) => haystack.includes(term))) {
    return "python";
  }
  return "code";
}

function getVisibleChecks(exercise: Exercise, mode: LabMode) {
  if (mode === "terminal") {
    return [
      "Utiliser les commandes demandées dans un dossier virtuel.",
      "Créer, déplacer ou afficher les fichiers sans rien installer.",
      "Valider automatiquement l’état attendu.",
    ];
  }

  if (mode === "python") {
    return [
      "Écrire du Python dans le navigateur.",
      "Tester avec des entrées simples.",
      "Vérifier que les notions de l’exercice sont présentes.",
    ];
  }

  return [
    "Écrire une réponse structurée.",
    "Vérifier les mots-clés importants.",
    "Marquer l’exercice quand le minimum est présent.",
  ];
}

function getStarterCode(exercise: Exercise, mode: LabMode) {
  if (mode === "python") {
    if (exercise.skills.some((skill) => skill.toLowerCase().includes("fonction"))) {
      return "# Écris ta fonction ici\n\n";
    }
    if (exercise.statement.toLowerCase().includes("demande")) {
      return "# Exemple\nprenom = input(\"Prénom : \")\nprint(prenom)\n";
    }
    return "# Écris ton script Python ici\n";
  }

  return "";
}

function createInitialTerminalState(exercise: Exercise): TerminalState {
  const base = createBaseTerminalState();
  const entries: Record<string, FsEntry> = { ...base.entries };

  const addDir = (path: string) => {
    entries[normalizePath(path, "/home/student")] = { type: "dir" };
  };
  const addFile = (path: string, content: string) => {
    const fullPath = normalizePath(path, "/home/student");
    ensureParents(entries, fullPath);
    entries[fullPath] = { type: "file", content };
  };

  const id = exercise.id;
  if (["d1-c", "d1-d", "d1-e", "d1-f", "d1-g", "d1-h", "d1-bonus"].includes(id)) {
    addDir("~/but-prepa");
    addDir("~/but-prepa/00_admin");
    addDir("~/but-prepa/00_admin/checklists");
    addDir("~/but-prepa/01_python_algo");
    addDir("~/but-prepa/02_linux");
    addDir("~/but-prepa/02_linux/commandes");
  }
  if (["d1-e", "d1-f"].includes(id)) {
    addFile("~/but-prepa/02_linux/commandes/commandes.txt", "pwd\nls\ncd\n");
  }
  if (id === "d1-f") {
    addFile("~/but-prepa/02_linux/commandes/mes_commandes.txt", "pwd\nls\ncd\n");
  }
  if (id === "d1-h") {
    addFile("~/but-prepa/jour_test/a/note.txt", "note\n");
    addDir("~/but-prepa/jour_test/b");
  }

  return {
    cwd: base.cwd,
    entries,
    transcript: base.transcript,
    history: base.history,
  };
}

function validateTerminalExercise(exercise: Exercise, state: TerminalState): ValidationResult {
  const hasCommand = (command: string) => state.history.some((item) => item.trim().startsWith(command));
  const hasDir = (path: string) => state.entries[normalizePath(path, "/home/student")]?.type === "dir";
  const hasFile = (path: string, includes?: string[]) => {
    const entry = state.entries[normalizePath(path, "/home/student")];
    return entry?.type === "file" && (!includes || includes.every((part) => entry.content.includes(part)));
  };

  let ok = false;
  const missing: string[] = [];

  switch (exercise.id) {
    case "d1-a":
      ok = hasCommand("pwd");
      if (!ok) missing.push("Tape `pwd` pour afficher le dossier courant.");
      break;
    case "d1-b":
      ok = hasDir("~/but-prepa/00_admin") && hasDir("~/but-prepa/01_python_algo") && hasDir("~/but-prepa/02_linux");
      if (!ok) missing.push("Crée `but-prepa`, puis `00_admin`, `01_python_algo`, `02_linux` dedans.");
      break;
    case "d1-c":
      ok = state.cwd.endsWith("/but-prepa/02_linux") && hasCommand("cd");
      if (!ok) missing.push("Place-toi dans `~/but-prepa/02_linux` avec des chemins relatifs.");
      break;
    case "d1-d":
      ok = hasFile("~/but-prepa/02_linux/commandes/commandes.txt", ["pwd", "ls", "cd"]);
      if (!ok) missing.push("Crée `commandes.txt` avec les lignes `pwd`, `ls`, `cd`.");
      break;
    case "d1-e":
      ok = hasFile("~/but-prepa/02_linux/commandes/mes_commandes.txt") && !hasFile("~/but-prepa/02_linux/commandes/commandes_backup.txt");
      if (!ok) missing.push("Copie puis renomme la sauvegarde en `mes_commandes.txt`.");
      break;
    case "d1-f":
      ok = hasFile("~/but-prepa/02_linux/commandes/archives/mes_commandes.txt");
      if (!ok) missing.push("Déplace `mes_commandes.txt` dans le dossier `archives`.");
      break;
    case "d1-g":
      ok = hasFile("~/but-prepa/jour_test/b/copie_note.txt");
      if (!ok) missing.push("Depuis `b`, copie `../a/note.txt` vers `copie_note.txt`.");
      break;
    case "d1-h":
      ok = !hasDir("~/but-prepa/jour_test") && hasCommand("rm");
      if (!ok) missing.push("Supprime seulement `jour_test` avec `rm -r`.");
      break;
    case "d1-bonus":
      ok = hasCommand("man rm") && hasFile("~/but-prepa/00_admin/checklists/reponse.txt");
      if (!ok) missing.push("Consulte `man rm`, puis écris une réponse dans `reponse.txt`.");
      break;
    default:
      ok = getRequiredTerminalCommands(exercise).every((command) => hasCommand(command));
      if (!ok) missing.push("Utilise les commandes clés de l’exercice dans le terminal simulé.");
  }

  return ok
    ? { ok: true, title: "Exercice validé", message: "Bien joué. L’état attendu est présent dans le simulateur." }
    : { ok: false, title: "Pas encore", message: "Il manque encore une étape pour valider l’exercice.", missing };
}

function getRequiredTerminalCommands(exercise: Exercise) {
  const text = `${exercise.statement} ${exercise.skills.join(" ")}`.toLowerCase();
  return ["pwd", "ls", "cd", "mkdir", "cp", "mv", "rm", "cat", "echo", "git"]
    .filter((command) => text.includes(command))
    .slice(0, 3);
}

function validateCodeExercise(exercise: Exercise, code: string, output: string): ValidationResult {
  const text = `${exercise.statement} ${exercise.skills.join(" ")}`.toLowerCase();
  const source = code.toLowerCase();
  const missing: string[] = [];

  if (text.includes("demande") || text.includes("saisie") || text.includes("input")) requirePattern(source, "input(", "Ajoute une saisie avec `input(...)`.", missing);
  if (text.includes("affiche") || text.includes("print")) requirePattern(source, "print(", "Affiche le résultat avec `print(...)`.", missing);
  if (text.includes("entier") || text.includes("int") || text.includes("conversion")) requirePattern(source, "int(", "Convertis au moins une saisie avec `int(...)`.", missing);
  if (text.includes("float") || text.includes("décimal") || text.includes("prix")) requirePattern(source, "float(", "Utilise `float(...)` pour les nombres décimaux.", missing);
  if (text.includes("if") || text.includes("condition") || text.includes("sinon")) requirePattern(source, "if ", "Ajoute une condition `if`.", missing);
  if (text.includes("elif")) requirePattern(source, "elif ", "Utilise `elif` pour les cas intermédiaires.", missing);
  if (text.includes("for") || text.includes("range")) requirePattern(source, "for ", "Ajoute une boucle `for`.", missing);
  if (text.includes("while")) requirePattern(source, "while ", "Ajoute une boucle `while`.", missing);
  if (text.includes("fonction") || text.includes("return") || text.includes("renvoie")) {
    requirePattern(source, "def ", "Déclare une fonction avec `def`.", missing);
    requirePattern(source, "return", "Renvoie une valeur avec `return`.", missing);
  }
  if (text.includes("liste")) {
    if (!source.includes("[") && !source.includes("append(")) {
      missing.push("Utilise une liste ou `append(...)`.");
    }
  }

  if (code.trim().length < 10) {
    missing.push("Écris un peu de code avant de tester.");
  }

  return missing.length === 0
    ? { ok: true, title: "Exercice validé", message: output ? "Ton code contient les éléments attendus et produit une sortie." : "Ton code contient les éléments attendus." }
    : { ok: false, title: "Pas encore", message: "Ton code est sur la bonne voie, mais il manque quelques éléments.", missing };
}

function requirePattern(source: string, pattern: string, message: string, missing: string[]) {
  if (!source.includes(pattern)) {
    missing.push(message);
  }
}

function runPythonLite(code: string, inputs: string[]) {
  const lines = code.split(/\r?\n/);
  const env: Record<string, unknown> = {};
  const output: string[] = [];
  let inputIndex = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.endsWith(":")) continue;

    if (line.startsWith("print(") && line.endsWith(")")) {
      output.push(String(evaluateExpression(line.slice(6, -1), env, inputs, () => inputs[inputIndex++] ?? "")));
    } else if (/^[a-zA-Z_]\w*\s*=/.test(line)) {
      const [name, ...rest] = line.split("=");
      env[name.trim()] = evaluateExpression(rest.join("="), env, inputs, () => inputs[inputIndex++] ?? "");
    } else if (line.includes("input(")) {
      output.push(String(evaluateExpression(line, env, inputs, () => inputs[inputIndex++] ?? "")));
    }
  }

  return {
    output: output.length ? output.join("\n") : "Mini-runner : aucune sortie. Ajoute `print(...)` pour voir un résultat.",
  };
}

function evaluateExpression(
  expression: string,
  env: Record<string, unknown>,
  inputs: string[],
  nextInput: () => string,
): unknown {
  let expr = expression.trim();
  expr = expr.replace(/input\([^)]*\)/g, () => JSON.stringify(nextInput()));
  expr = expr.replace(/int\(([^)]+)\)/g, (_, inner) => `Number.parseInt(${inner}, 10)`);
  expr = expr.replace(/float\(([^)]+)\)/g, (_, inner) => `Number.parseFloat(${inner})`);
  expr = expr.replace(/str\(([^)]+)\)/g, (_, inner) => `String(${inner})`);
  expr = expr.replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
    if (["Number", "parseInt", "parseFloat", "String", "true", "false"].includes(match)) return match;
    if (Object.prototype.hasOwnProperty.call(env, match)) return JSON.stringify(env[match]);
    return match;
  });

  if (!/^[\w\s"'().,+\-*/%:[\]]+$/.test(expr)) {
    return expression.trim();
  }

  try {
    // Browser-side educational evaluator for simple arithmetic/string expressions only.
    return Function(`"use strict"; return (${expr});`)();
  } catch {
    return expression.trim();
  }
}

function runStaticCodePreview(code: string) {
  return {
    output: code.trim() ? "Réponse enregistrée. Le validateur vérifie les éléments attendus." : "",
  };
}
