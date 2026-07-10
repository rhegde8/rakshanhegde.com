import type { ProjectFrontmatter } from "@/lib/schema/project";
import type { WritingFrontmatter } from "@/lib/schema/writing";

export type ContentCollection = "projects" | "writing";

type BaseEntry = {
  content: string;
  filePath: string;
};

export type ProjectEntry = ProjectFrontmatter & BaseEntry;
export type WritingEntry = WritingFrontmatter & BaseEntry;
