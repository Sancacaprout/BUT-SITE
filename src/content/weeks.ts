import { week1 } from "@/content/week-1";
import { week2, week3 } from "@/content/weeks-extra";

export const weeks = [week1, week2, week3];

export function getWeekById(weekId: string) {
  return weeks.find((week) => week.id === weekId);
}

export function getWeekByNumber(weekNumber: number) {
  return weeks.find((week) => week.weekNumber === weekNumber);
}

export function getAllDays() {
  return weeks.flatMap((week) => week.days);
}

export function getAllCorrections() {
  return weeks.flatMap((week) => week.corrections);
}

export function getAllSheets() {
  return weeks.flatMap((week) => week.sheets);
}

export function getAllRevisionCards() {
  return weeks.flatMap((week) => week.revisionCards);
}

export function getAllExercises() {
  return weeks.flatMap((week) => week.days.flatMap((day) => day.afternoonExercises));
}
