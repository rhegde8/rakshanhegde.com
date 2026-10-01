import { describe, expect, it } from "vitest";

import {
  getAllProjects,
  getAllWritingEntries,
  getProjectBySlug,
  getWritingBySlug,
} from "@/lib/content/loaders";
import { projectFrontmatterSchema } from "@/lib/schema/project";
import { writingFrontmatterSchema } from "@/lib/schema/writing";

const project = {
  slug: "security-workbench",
  title: "Security workbench",
  summary: "A local fixture for validating project metadata.",
  category: "Security engineering",
  context: "Personal project",
  status: "ongoing",
  updatedAt: "2026-09-26",
  stack: ["Python", "python", "TypeScript"],
  tags: ["security"],
  impact: "Makes repeatable security checks possible.",
  featured: true,
  order: 1,
};

describe("content frontmatter schemas", () => {
  it("accepts the project contract and normalizes duplicate stack names", () => {
    const parsed = projectFrontmatterSchema.parse(project);
    expect(parsed.stack).toEqual(["python", "typescript"]);
    expect(parsed.status).toBe("ongoing");
  });

  it.each([
    { slug: "../outside" },
    { status: "invented-status" },
    { updatedAt: "not-a-date" },
    { stack: [""] },
    { tags: [] },
    { order: -1 },
    { repoUrl: "https://example.com/unsupplied-link" },
  ])("rejects invalid or unsupported metadata: %j", (invalid) => {
    expect(projectFrontmatterSchema.safeParse({ ...project, ...invalid }).success).toBe(false);
  });

  it("allows an undisclosed stack without inventing technologies", () => {
    expect(projectFrontmatterSchema.parse({ ...project, stack: undefined }).stack).toEqual([]);
    expect(projectFrontmatterSchema.parse({ ...project, stack: [] }).stack).toEqual([]);
  });

  it("accepts writing metadata without publishing a placeholder article", () => {
    const result = writingFrontmatterSchema.safeParse({
      slug: "writing-fixture",
      title: "Writing fixture",
      summary: "A valid writing frontmatter payload used only by tests.",
      updatedAt: "2026-09-26",
      tags: ["security", "systems"],
      featured: true,
    });

    expect(result.success).toBe(true);
  });
});

describe("published content", () => {
  it("loads current work followed by production projects", async () => {
    const projects = await getAllProjects();

    expect(projects.map(({ slug }) => slug)).toEqual([
      "sealcheck",
      "multi-agent-development-harness",
      "vultrack",
      "threatnet",
    ]);
    expect(projects.map(({ order }) => order)).toEqual(
      projects.map(({ order }) => order).toSorted((left, right) => left - right),
    );
    expect(projects.every(({ content }) => content.length > 0)).toBe(true);
  });

  it("leaves writing empty until a real article is added", async () => {
    expect(await getAllWritingEntries()).toEqual([]);
  });

  it("returns null for missing and previously published placeholder slugs", async () => {
    expect(await getProjectBySlug("rag-knowledge-orchestrator")).toBeNull();
    expect(await getProjectBySlug("does-not-exist")).toBeNull();
    expect(await getWritingBySlug("does-not-exist")).toBeNull();
  });
});
