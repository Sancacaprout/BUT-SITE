import { week1 } from "@/content/week-1";

export function getDayByNumber(dayNumber: number) {
  return week1.days.find((day) => day.dayNumber === dayNumber);
}

export function getDayById(dayId: string) {
  return week1.days.find((day) => day.id === dayId);
}

export function getCorrectionById(correctionId: string) {
  return week1.corrections.find((correction) => correction.id === correctionId);
}

export function getExerciseCorrection(exerciseId: string) {
  return week1.corrections.find((correction) => correction.exerciseId === exerciseId);
}

export function getAllExercises() {
  return week1.days.flatMap((day) => day.afternoonExercises);
}

export function getSearchIndex() {
  return [
    ...week1.days.map((day) => ({
      id: day.id,
      title: `Jour ${day.dayNumber} - ${day.title}`,
      description: day.theme,
      href: `/week/week-1/day/${day.id}`,
      tags: ["jour", day.title, day.theme],
    })),
    ...getAllExercises().map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      description: exercise.statement,
      href: `/week/week-1/day/day-${exercise.day}#${exercise.id}`,
      tags: ["exercice", ...exercise.skills, exercise.difficulty],
    })),
    ...week1.sheets.map((sheet) => ({
      id: sheet.id,
      title: sheet.title,
      description: sheet.items.slice(0, 2).join(" · "),
      href: `/library#${sheet.id}`,
      tags: ["fiche", ...sheet.items],
    })),
  ];
}
