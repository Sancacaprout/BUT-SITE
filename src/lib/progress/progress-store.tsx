"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase/client";

const ProgressStatusSchema = z.enum(["not-started", "done", "review", "stuck"]);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

const SettingsSchema = z.object({
  theme: z.enum(["system", "light", "dark"]).default("system"),
  textSize: z.enum(["normal", "large", "xl"]).default("normal"),
  showMotivationalMessages: z.boolean().default(true),
});

export const ProgressStateSchema = z.object({
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
const SYNC_TABLE = "learning_state";

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

function mergeProgressState(local: ProgressState, cloud: ProgressState): ProgressState {
  const localTime = local.lastActivity ? Date.parse(local.lastActivity) : 0;
  const cloudTime = cloud.lastActivity ? Date.parse(cloud.lastActivity) : 0;
  const newest = cloudTime >= localTime ? cloud : local;

  return {
    lessons: { ...local.lessons, ...cloud.lessons },
    exercises: { ...local.exercises, ...cloud.exercises },
    hints: { ...local.hints, ...cloud.hints },
    quizScores: { ...local.quizScores, ...cloud.quizScores },
    notes: { ...local.notes, ...cloud.notes },
    reviewQueue: Array.from(new Set([...local.reviewQueue, ...cloud.reviewQueue])),
    lastActivity: newest.lastActivity,
    settings: newest.settings,
  };
}

async function loadCloudState(local: ProgressState) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const currentSession = await supabase.auth.getSession();
  const user =
    currentSession.data.session?.user ??
    (await supabase.auth.signInAnonymously()).data.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from(SYNC_TABLE)
    .select("state")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("Supabase progress load failed", error);
    return null;
  }

  const cloud = data?.state ? ProgressStateSchema.safeParse(data.state) : null;
  const merged = cloud?.success ? mergeProgressState(local, cloud.data) : local;

  await supabase.from(SYNC_TABLE).upsert({
    user_id: user.id,
    state: merged,
    updated_at: new Date().toISOString(),
  });

  return merged;
}

async function saveCloudState(state: ProgressState) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) {
    return;
  }

  const { error } = await supabase.from(SYNC_TABLE).upsert({
    user_id: user.id,
    state,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.warn("Supabase progress save failed", error);
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const skipNextCloudSave = useRef(false);

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

      void loadCloudState(next)
        .then((cloudState) => {
          if (cancelled || !cloudState) {
            return;
          }

          skipNextCloudSave.current = true;
          setState(cloudState);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
          applySettings(cloudState.settings);
          setCloudReady(true);
        })
        .catch((error) => {
          console.warn("Supabase progress sync unavailable", error);
        });
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

  useEffect(() => {
    if (!loaded || !cloudReady) {
      return;
    }

    if (skipNextCloudSave.current) {
      skipNextCloudSave.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      void saveCloudState(state);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [cloudReady, loaded, state]);

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
    void saveCloudState(emptyState);
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
