"use client";

import { NotebookPen } from "lucide-react";
import { useProgress } from "@/lib/progress/progress-store";

export function NoteBox({ contentId }: { contentId: string }) {
  const { state, saveNote } = useProgress();

  return (
    <label className="block rounded-lg border border-line bg-surface p-5 shadow-sm">
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <NotebookPen size={17} aria-hidden="true" />
        Notes personnelles
      </span>
      <textarea
        value={state.notes[contentId] ?? ""}
        onChange={(event) => saveNote(contentId, event.target.value)}
        className="mt-3 min-h-28 w-full resize-y rounded-md border border-line bg-background p-3 text-sm leading-6 outline-none transition focus:border-accent"
        placeholder="Blocages, erreurs à revoir, phrase de synthèse..."
      />
    </label>
  );
}
