import { describe, expect, it } from "vitest";

import { getAllDemos, getAllProjects, getAllResearchEntries } from "@/lib/content/loaders";
import { demoFrontmatterSchema } from "@/lib/schema/demo";
import { projectFrontmatterSchema } from "@/lib/schema/project";
import { researchFrontmatterSchema } from "@/lib/schema/research";

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

  it("accepts research metadata with optional fields", () => {
    const result = researchFrontmatterSchema.safeParse({
      slug: "research-entry",
      title: "Research entry",
      summary: "A valid research frontmatter payload for schema checks.",
      updatedAt: "2025-10-01",
      tags: ["rag", "evals"],
      featured: true,
    });

    expect(result.success).toBe(true);
  });

  it("validates demo local video URLs", () => {
    const result = demoFrontmatterSchema.safeParse({
      slug: "demo-entry",
      title: "Demo entry",
      summary: "A valid summary with enough words for schema constraints.",
      updatedAt: "2025-12-01",
      videoType: "local",
      videoUrl: "relative/path/video.mp4",
      tags: ["demo"],
    });

    expect(result.success).toBe(false);
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

  it("loads research and demo entries", async () => {
    const [researchEntries, demos] = await Promise.all([getAllResearchEntries(), getAllDemos()]);

    expect(researchEntries.length).toBeGreaterThan(0);
    expect(demos.length).toBeGreaterThan(0);
  });
});
