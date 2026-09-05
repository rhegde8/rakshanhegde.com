import { describe, expect, it } from "vitest";

import { getAllProjects, getAllWritingEntries } from "@/lib/content/loaders";
import { projectToMarkdown, writingToMarkdown, siteOverviewMarkdown } from "@/lib/content/markdown";

describe("agent-facing markdown surface", () => {
  it("builds a site overview linking every entry as markdown", async () => {
    const [overview, projects, writing] = await Promise.all([
      siteOverviewMarkdown(),
      getAllProjects(),
      getAllWritingEntries(),
    ]);

    for (const project of projects) {
      expect(overview).toContain(`/projects/${project.slug}.md`);
    }
    for (const entry of writing) {
      expect(overview).toContain(`/writing/${entry.slug}.md`);
    }
    expect(overview).toContain("Accept: text/markdown");
  });

  it("serializes a project with metadata and body", async () => {
    const [project] = await getAllProjects();
    expect(project).toBeDefined();

    const markdown = projectToMarkdown(project!);
    expect(markdown).toContain(`# ${project!.title}`);
    expect(markdown).toContain(`- Status: ${project!.status}`);
    expect(markdown).toContain(project!.content.slice(0, 40));
  });

  it("serializes a writing entry with metadata and body", async () => {
    const [entry] = await getAllWritingEntries();
    expect(entry).toBeDefined();

    const markdown = writingToMarkdown(entry!);
    expect(markdown).toContain(`# ${entry!.title}`);
    expect(markdown).toContain(`- Updated: ${entry!.updatedAt}`);
  });
});
