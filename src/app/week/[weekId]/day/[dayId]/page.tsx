import { notFound } from "next/navigation";
import { DayLearningPage } from "@/components/learning/day-learning-page";
import { getDayById } from "@/lib/content";
import { getWeekById, weeks } from "@/content/weeks";

export function generateStaticParams() {
  return weeks.flatMap((week) =>
    week.days.map((day) => ({
      weekId: week.id,
      dayId: day.id,
    })),
  );
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ weekId: string; dayId: string }>;
}) {
  const { weekId, dayId } = await params;
  if (!getWeekById(weekId)) {
    notFound();
  }

  const day = getDayById(weekId, dayId);
  if (!day) {
    notFound();
  }

  return <DayLearningPage day={day} />;
}
