import type { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { getAllProjects, getProjectBySlug } from "@/lib/content/loaders";
import { OG_SIZE, renderOgImage } from "@/lib/og/template";

export const alt = "Project details";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return renderOgImage({
    label: "project",
    title: project.title,
    subtitle: project.summary,
    command: `open projects/${project.slug}`,
  });
}
