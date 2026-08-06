import type { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { getAllResearchEntries, getResearchBySlug } from "@/lib/content/loaders";
import { OG_SIZE, renderOgImage } from "@/lib/og/template";

export const alt = "Research note details";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllResearchEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await params;
  const entry = await getResearchBySlug(slug);

  if (!entry) {
    notFound();
  }

  return renderOgImage({
    label: "research",
    title: entry.title,
    subtitle: entry.summary,
    command: `open research/${entry.slug}`,
  });
}
