import { describe, expect, it } from "vitest";

import { getAllProjects, getAllWritingEntries } from "@/lib/content/loaders";
import { projectFrontmatterSchema } from "@/lib/schema/project";
import { writingFrontmatterSchema } from "@/lib/schema/writing";

describe("content frontmatter schemas", () => {
  it("validates project status and completion rules", () => {
    const result = projectFrontmatterSchema.safeParse({
      slug: "invalid-project",
      title: "Invalid project",
      summary: "This project is missing completedAt despite completed status.",
      status: "completed",
      startedAt: "2025-01-01",
      updatedAt: "2025-01-02",
      stack: ["typescript"],
      tags: ["test"],
      aiFocus: ["agents"],
    });

    expect(result.success).toBe(false);
  });

  it("accepts writing metadata with optional fields", () => {
    const result = writingFrontmatterSchema.safeParse({
      slug: "writing-entry",
      title: "Writing entry",
      summary: "A valid writing frontmatter payload for schema checks.",
      updatedAt: "2025-10-01",
      tags: ["rag", "evals"],
      featured: true,
    });

    expect(result.success).toBe(true);
  });
});

describe("content loaders", () => {
  it("loads and sorts project content by updatedAt descending", async () => {
    const projects = await getAllProjects();
    const first = projects[0];
    const second = projects[1];

    expect(projects.length).toBeGreaterThan(0);

    if (first && second) {
      expect(new Date(first.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(second.updatedAt).getTime(),
      );
    }
  });

  it("loads writing entries", async () => {
    const writingEntries = await getAllWritingEntries();
    expect(writingEntries.length).toBeGreaterThan(0);
  });
});
