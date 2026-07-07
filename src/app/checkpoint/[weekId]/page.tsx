import { notFound } from "next/navigation";
import { CheckpointClient } from "@/components/learning/checkpoint-client";
import { getWeekById, weeks } from "@/content/weeks";

export function generateStaticParams() {
  return weeks.map((week) => ({ weekId: week.id }));
}

export default async function CheckpointPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const week = getWeekById(weekId);

  if (!week) {
    notFound();
  }

  return <CheckpointClient week={week} />;
}
