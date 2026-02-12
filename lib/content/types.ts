import type { DemoFrontmatter } from "@/lib/schema/demo";
import type { ProjectFrontmatter } from "@/lib/schema/project";
import type { ResearchFrontmatter } from "@/lib/schema/research";

export type ContentCollection = "projects" | "research" | "demos";

type BaseEntry = {
  content: string;
  filePath: string;
};

export type ProjectEntry = ProjectFrontmatter & BaseEntry;
export type ResearchEntry = ResearchFrontmatter & BaseEntry;
export type DemoEntry = DemoFrontmatter & BaseEntry;
