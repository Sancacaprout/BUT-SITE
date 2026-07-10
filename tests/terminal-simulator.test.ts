import assert from "node:assert/strict";
import { createBaseTerminalState, executeTerminalCommand, type TerminalState } from "../src/lib/terminal-simulator";

function createState(): TerminalState {
  const state = createBaseTerminalState();
  return {
    ...state,
    transcript: [],
    entries: {
      ...state.entries,
      "/home/student/dossier": { type: "dir" },
      "/home/student/dossier/note.txt": { type: "file", content: "ok\n" },
      "/home/student/readme.txt": { type: "file", content: "hello\n" },
      "/home/student/.cache": { type: "dir" },
    },
  };
}

function run(input: string, state = createState()) {
  return executeTerminalCommand(state, input);
}

function outputOf(state: TerminalState) {
  return state.transcript.filter((line) => !line.startsWith("$")).join("\n");
}

function assertNoLsPathError(state: TerminalState) {
  assert(!outputOf(state).includes("/ls"), outputOf(state));
}

{
  const state = run("ls");
  const output = outputOf(state);
  assert(output.includes("dossier"), output);
  assert(output.includes("readme.txt"), output);
  assert(!output.includes(".cache"), output);
  assertNoLsPathError(state);
}

{
  const state = run("ls -l");
  const output = outputOf(state);
  assert(output.includes("d dossier"), output);
  assert(output.includes("- readme.txt"), output);
  assertNoLsPathError(state);
}

{
  const state = run("ls -a");
  const output = outputOf(state);
  assert(output.includes(".cache"), output);
  assertNoLsPathError(state);
}

{
  const state = run("ls dossier");
  const output = outputOf(state);
  assert(output.includes("note.txt"), output);
  assertNoLsPathError(state);
}

{
  const state = run("ls /home");
  const output = outputOf(state);
  assert(output.includes("student"), output);
  assertNoLsPathError(state);
}

{
  const state = run("ls dossier-inexistant");
  const output = outputOf(state);
  assert(output.includes("/home/student/dossier-inexistant"), output);
  assert(!output.includes("/home/student/ls"), output);
}

{
  const afterCd = run("cd ..");
  const afterLs = run("ls", afterCd);
  const output = outputOf(afterLs);
  assert.equal(afterLs.cwd, "/home");
  assert(output.includes("student"), output);
  assert(!output.includes("/home/ls"), output);
}

{
  const state = run("   ls   ");
  const output = outputOf(state);
  assert(output.includes("dossier"), output);
  assertNoLsPathError(state);
}

{
  const state = run("   ");
  assert.deepEqual(state, createState());
}

{
  const afterFirstMkdir = run("mkdir test");
  const afterSecondMkdir = run("mkdir test", afterFirstMkdir);
  const output = outputOf(afterSecondMkdir);
  const directTestEntries = Object.keys(afterSecondMkdir.entries).filter((path) => path === "/home/student/test");

  assert.equal(afterSecondMkdir.entries["/home/student/test"]?.type, "dir");
  assert(output.includes("mkdir: impossible de créer le répertoire « test »: Le fichier existe"), output);
  assert.equal(directTestEntries.length, 1);

  const afterLs = run("ls", afterSecondMkdir);
  const lsOutput = outputOf(afterLs);
  assert(lsOutput.includes("test"), lsOutput);
  assert(!lsOutput.includes("/home/student/ls"), lsOutput);
  assertNoLsPathError(afterLs);
}

console.log("terminal-simulator tests passed");
