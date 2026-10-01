import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { GET as getRss } from "@/app/writing/rss.xml/route";
import { getAllProjects } from "@/lib/content/loaders";
import {
  projectToMarkdown,
  projectsIndexMarkdown,
  siteOverviewMarkdown,
  writingIndexMarkdown,
  writingToMarkdown,
} from "@/lib/content/markdown";
import type { WritingEntry } from "@/lib/content/types";

describe("content discovery", () => {
  it("includes every project in the sitemap and markdown indexes", async () => {
    const [overview, index, projects, urls] = await Promise.all([
      siteOverviewMarkdown(),
      projectsIndexMarkdown(),
      getAllProjects(),
      sitemap(),
    ]);
    const paths = urls.map(({ url }) => new URL(url).pathname);

    for (const project of projects) {
      expect(overview).toContain(`/projects/${project.slug}.md`);
      expect(index).toContain(`/projects/${project.slug}.md`);
      expect(paths).toContain(`/projects/${project.slug}`);
    }

    expect(paths).toEqual(expect.arrayContaining(["/", "/projects", "/writing", "/about"]));
    expect(paths.some((path) => path.startsWith("/lab"))).toBe(false);
    expect(paths.some((path) => path.startsWith("/writing/"))).toBe(false);
    expect(overview).toContain("Accept: text/markdown");
    expect(overview).not.toMatch(/mailto:|github\.com|linkedin\.com|x\.com/);
  });

  it("serializes real project content without placeholder repository links", async () => {
    for (const project of await getAllProjects()) {
      const markdown = projectToMarkdown(project);
      expect(markdown).toContain(`# ${project.title}`);
      expect(markdown).toContain(`- Status: ${project.status}`);
      expect(markdown).toContain(project.content);
      expect(markdown).not.toContain("- Repository:");
      if (!project.stack.length) expect(markdown).not.toContain("- Stack:");
    }
  });

  it("keeps an empty, valid RSS feed and writing index", async () => {
    const response = await getRss();
    const document = new DOMParser().parseFromString(await response.text(), "application/xml");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(document.querySelector("parsererror")).toBeNull();
    expect(document.querySelector("channel > title")?.textContent).toContain("Rakshan Hegde");
    expect(document.querySelectorAll("item")).toHaveLength(0);
    expect(await writingIndexMarkdown()).not.toContain("## [");
  });

  it("preserves future writing serialization using a test fixture", () => {
    const entry: WritingEntry = {
      slug: "writing-fixture",
      title: "Writing fixture",
      summary: "This entry exists only in the test suite.",
      updatedAt: "2026-09-26",
      tags: ["systems"],
      featured: false,
      content: "## Observation\n\nA reproducible result belongs here.",
      filePath: "writing/writing-fixture.mdx",
    };

    const markdown = writingToMarkdown(entry);
    expect(markdown).toContain(`# ${entry.title}`);
    expect(markdown).toContain(`- Updated: ${entry.updatedAt}`);
    expect(markdown).toContain(`/writing/${entry.slug}`);
    expect(markdown).toContain(entry.content);
  });
});
