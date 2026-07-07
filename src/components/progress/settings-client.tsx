"use client";

import { Download, RotateCcw, Settings } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useProgress } from "@/lib/progress/progress-store";

export function SettingsClient() {
  const { state, updateSettings, resetProgress } = useProgress();
  const supabaseConfigured = isSupabaseConfigured();

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "but-info-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-6">
      <section>
        <p className="font-mono text-sm text-accent-strong">Paramètres</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">Préférences</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Le site fonctionne en localStorage. Supabase peut prendre le relais dès que les variables d’environnement sont configurées.
        </p>
      </section>

      <section className="mt-8 space-y-5">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Settings size={18} aria-hidden="true" />
            Affichage
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Thème</span>
              <select
                value={state.settings.theme}
                onChange={(event) =>
                  updateSettings({
                    theme: event.target.value as typeof state.settings.theme,
                  })
                }
                className="h-11 w-full rounded-md border border-line bg-background px-3 text-sm outline-none focus:border-accent"
              >
                <option value="system">Système</option>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Taille du texte</span>
              <select
                value={state.settings.textSize}
                onChange={(event) =>
                  updateSettings({
                    textSize: event.target.value as typeof state.settings.textSize,
                  })
                }
                className="h-11 w-full rounded-md border border-line bg-background px-3 text-sm outline-none focus:border-accent"
              >
                <option value="normal">Normale</option>
                <option value="large">Grande</option>
                <option value="xl">Très grande</option>
              </select>
            </label>
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={state.settings.showMotivationalMessages}
              onChange={(event) =>
                updateSettings({ showMotivationalMessages: event.target.checked })
              }
              className="size-4 accent-[var(--accent)]"
            />
            Encouragements sobres dans les écrans de progression
          </label>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Persistance</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            État actuel : {supabaseConfigured ? "Supabase configuré" : "localStorage uniquement"}. Aucune clé sensible n’est utilisée côté client.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportProgress}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-muted"
            >
              <Download size={17} aria-hidden="true" />
              Exporter
            </button>
            <button
              type="button"
              onClick={resetProgress}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-danger px-4 text-sm font-medium text-white"
            >
              <RotateCcw size={17} aria-hidden="true" />
              Réinitialiser
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
