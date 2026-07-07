import { notFound } from "next/navigation";
import { DayLearningPage } from "@/components/learning/day-learning-page";
import { getDayById } from "@/lib/content";
import { week1 } from "@/content/week-1";

export function generateStaticParams() {
  return week1.days.map((day) => ({
    weekId: week1.id,
    dayId: day.id,
  }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ weekId: string; dayId: string }>;
}) {
  const { weekId, dayId } = await params;
  if (weekId !== week1.id) {
    notFound();
  }

  const day = getDayById(dayId);
  if (!day) {
    notFound();
  }

  return <DayLearningPage day={day} />;
}
