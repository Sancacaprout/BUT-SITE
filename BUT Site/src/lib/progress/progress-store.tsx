"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z } from "zod";

const ProgressStatusSchema = z.enum(["not-started", "done", "review", "stuck"]);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

const SettingsSchema = z.object({
  theme: z.enum(["system", "light", "dark"]).default("system"),
  textSize: z.enum(["normal", "large", "xl"]).default("normal"),
  showMotivationalMessages: z.boolean().default(true),
});

const ProgressStateSchema = z.object({
  lessons: z.record(z.string(), z.boolean()).default({}),
  exercises: z.record(z.string(), ProgressStatusSchema).default({}),
  hints: z.record(z.string(), z.number().min(0)).default({}),
  quizScores: z.record(z.string(), z.number().min(0)).default({}),
  notes: z.record(z.string(), z.string()).default({}),
  reviewQueue: z.array(z.string()).default([]),
  lastActivity: z.string().nullable().default(null),
  settings: SettingsSchema.default({ theme: "system", textSize: "normal", showMotivationalMessages: true }),
});

export type ProgressState = z.infer<typeof ProgressStateSchema>;
export type UserSettings = z.infer<typeof SettingsSchema>;

const STORAGE_KEY = "but-info-progress-v1";

const emptyState: ProgressState = {
  lessons: {},
  exercises: {},
  hints: {},
  quizScores: {},
  notes: {},
  reviewQueue: [],
  lastActivity: null,
  settings: {
    theme: "system",
    textSize: "normal",
    showMotivationalMessages: true,
  },
};

type ProgressContextValue = {
  state: ProgressState;
  markLesson: (lessonId: string, done: boolean) => void;
  setExerciseStatus: (exerciseId: string, status: ProgressStatus) => void;
  revealHint: (exerciseId: string, max: number) => void;
  saveQuizScore: (quizId: string, score: number) => void;
  saveNote: (contentId: string, note: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadState(): ProgressState {
  if (typeof window === "undefined") {
    return emptyState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return emptyState;
  }

  try {
    return ProgressStateSchema.parse(JSON.parse(raw));
  } catch {
    return emptyState;
  }
}

function applySettings(settings: UserSettings) {
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.dataset.textSize = settings.textSize;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      const next = loadState();
      setState(next);
      applySettings(next.settings);
      setLoaded(true);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applySettings(state.settings);
  }, [loaded, state]);

  const update = useCallback((recipe: (current: ProgressState) => ProgressState) => {
    setState((current) => ({
      ...recipe(current),
      lastActivity: new Date().toISOString(),
    }));
  }, []);

  const markLesson = useCallback(
    (lessonId: string, done: boolean) => {
      update((current) => ({
        ...current,
        lessons: {
          ...current.lessons,
          [lessonId]: done,
        },
      }));
    },
    [update],
  );

  const setExerciseStatus = useCallback(
    (exerciseId: string, status: ProgressStatus) => {
      update((current) => {
        const reviewQueue = new Set(current.reviewQueue);
        if (status === "review" || status === "stuck") {
          reviewQueue.add(exerciseId);
        } else {
          reviewQueue.delete(exerciseId);
        }

        return {
          ...current,
          exercises: {
            ...current.exercises,
            [exerciseId]: status,
          },
          reviewQueue: Array.from(reviewQueue),
        };
      });
    },
    [update],
  );

  const revealHint = useCallback(
    (exerciseId: string, max: number) => {
      update((current) => ({
        ...current,
        hints: {
          ...current.hints,
          [exerciseId]: Math.min((current.hints[exerciseId] ?? 0) + 1, max),
        },
      }));
    },
    [update],
  );

  const saveQuizScore = useCallback(
    (quizId: string, score: number) => {
      update((current) => ({
        ...current,
        quizScores: {
          ...current.quizScores,
          [quizId]: Math.max(current.quizScores[quizId] ?? 0, score),
        },
      }));
    },
    [update],
  );

  const saveNote = useCallback(
    (contentId: string, note: string) => {
      update((current) => ({
        ...current,
        notes: {
          ...current.notes,
          [contentId]: note,
        },
      }));
    },
    [update],
  );

  const updateSettings = useCallback(
    (settings: Partial<UserSettings>) => {
      update((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...settings,
        },
      }));
    },
    [update],
  );

  const resetProgress = useCallback(() => {
    setState(emptyState);
    window.localStorage.removeItem(STORAGE_KEY);
    applySettings(emptyState.settings);
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      markLesson,
      setExerciseStatus,
      revealHint,
      saveQuizScore,
      saveNote,
      updateSettings,
      resetProgress,
    }),
    [
      markLesson,
      revealHint,
      resetProgress,
      saveNote,
      saveQuizScore,
      setExerciseStatus,
      state,
      updateSettings,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }

  return context;
}
