import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { z } from "zod";

import type {
  ContentCollection,
  DemoEntry,
  ProjectEntry,
  ResearchEntry,
} from "@/lib/content/types";
import { demoFrontmatterSchema } from "@/lib/schema/demo";
import { projectFrontmatterSchema } from "@/lib/schema/project";
import { researchFrontmatterSchema } from "@/lib/schema/research";

type SortableEntry = {
  slug: string;
  updatedAt: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function readCollectionEntries<T extends SortableEntry>(
  collection: ContentCollection,
  schema: z.ZodType<T>,
): Promise<Array<T & { content: string; filePath: string }>> {
  const directoryPath = path.join(CONTENT_ROOT, collection);
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });

  const files = directoryEntries.filter(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mdx"),
  );

  const entries = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directoryPath, file.name);
      const source = await fs.readFile(filePath, "utf8");
      const parsed = matter(source);
      const frontmatter = schema.parse(parsed.data);

      return {
        ...frontmatter,
        content: parsed.content.trim(),
        filePath: path.posix.join(collection, file.name),
      };
    }),
  );

  return entries.sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  return readCollectionEntries("projects", projectFrontmatterSchema);
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string): Promise<ProjectEntry | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getAllResearchEntries(): Promise<ResearchEntry[]> {
  return readCollectionEntries("research", researchFrontmatterSchema);
}

export async function getResearchBySlug(slug: string): Promise<ResearchEntry | null> {
  const researchEntries = await getAllResearchEntries();
  return researchEntries.find((entry) => entry.slug === slug) ?? null;
}

export async function getAllDemos(): Promise<DemoEntry[]> {
  return readCollectionEntries("demos", demoFrontmatterSchema);
}

export async function getDemoBySlug(slug: string): Promise<DemoEntry | null> {
  const demos = await getAllDemos();
  return demos.find((demo) => demo.slug === slug) ?? null;
}
