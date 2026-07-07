import { notFound } from "next/navigation";
import { ProjectClient } from "@/components/learning/project-client";
import { getWeekById, weeks } from "@/content/weeks";

export function generateStaticParams() {
  return weeks.map((week) => ({ weekId: week.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const week = getWeekById(weekId);

  if (!week) {
    notFound();
  }

  return <ProjectClient week={week} />;
}
