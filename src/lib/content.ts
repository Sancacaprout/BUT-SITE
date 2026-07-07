import {
  getAllCorrections,
  getAllExercises,
  getAllSheets,
  getWeekById,
  weeks,
} from "@/content/weeks";

export { getAllExercises };

export function getDayByNumber(weekId: string, dayNumber: number) {
  return getWeekById(weekId)?.days.find((day) => day.dayNumber === dayNumber);
}

export function getDayById(weekId: string, dayId: string) {
  return getWeekById(weekId)?.days.find((day) => day.id === dayId);
}

export function getCorrectionById(correctionId: string) {
  return getAllCorrections().find((correction) => correction.id === correctionId);
}

export function getExerciseCorrection(exerciseId: string) {
  return getAllCorrections().find((correction) => correction.exerciseId === exerciseId);
}

export function getSearchIndex() {
  return [
    ...weeks.flatMap((week) =>
      week.days.map((day) => ({
        id: `${week.id}-${day.id}`,
        title: `Semaine ${week.weekNumber} - Jour ${day.dayNumber} - ${day.title}`,
        description: day.theme,
        href: `/week/${week.id}/day/${day.id}`,
        tags: ["jour", `semaine ${week.weekNumber}`, day.title, day.theme],
      })),
    ),
    ...weeks.flatMap((week) =>
      week.days.flatMap((day) =>
        day.afternoonExercises.map((exercise) => ({
          id: exercise.id,
          title: exercise.title,
          description: exercise.statement,
          href: `/week/${week.id}/day/${day.id}#${exercise.id}`,
          tags: ["exercice", `semaine ${week.weekNumber}`, ...exercise.skills, exercise.difficulty],
        })),
      ),
    ),
    ...getAllSheets().map((sheet) => ({
      id: sheet.id,
      title: sheet.title,
      description: sheet.items.slice(0, 2).join(" · "),
      href: `/library#${sheet.id}`,
      tags: ["fiche", ...sheet.items],
    })),
  ];
}
