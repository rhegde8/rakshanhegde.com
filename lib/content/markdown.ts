import { siteConfig } from "@/lib/config/site";
import { getAllProjects, getAllWritingEntries } from "@/lib/content/loaders";
import type { ProjectEntry, WritingEntry } from "@/lib/content/types";

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function projectToMarkdown(project: ProjectEntry): string {
  const meta = [
    `- Status: ${project.status}`,
    `- Category: ${project.category}`,
    `- Context: ${project.context}`,
    `- Article updated: ${project.updatedAt}`,
    ...(project.stack.length ? [`- Stack: ${project.stack.join(", ")}`] : []),
    `- Tags: ${project.tags.join(", ")}`,
    `- Impact: ${project.impact}`,
    `- Canonical: ${absoluteUrl(`/projects/${project.slug}`)}`,
  ].join("\n");

  return `# ${project.title}\n\n> ${project.summary}\n\n${meta}\n\n${project.content}\n`;
}

export function writingToMarkdown(entry: WritingEntry): string {
  const meta = [
    `- Updated: ${entry.updatedAt}`,
    `- Tags: ${entry.tags.join(", ")}`,
    ...(entry.hypothesis ? [`- Hypothesis: ${entry.hypothesis}`] : []),
    ...(entry.findings ? [`- Findings: ${entry.findings}`] : []),
    `- Canonical: ${absoluteUrl(`/writing/${entry.slug}`)}`,
  ].join("\n");

  return `# ${entry.title}\n\n> ${entry.summary}\n\n${meta}\n\n${entry.content}\n`;
}

export async function projectsIndexMarkdown(): Promise<string> {
  const projects = await getAllProjects();
  const items = projects
    .map(
      (project) =>
        `## [${project.title}](${absoluteUrl(`/projects/${project.slug}.md`)})\n\n${project.summary} _(${project.status})_`,
    )
    .join("\n\n");
  return `# Projects — ${siteConfig.name}\n\n${items}\n`;
}

export async function writingIndexMarkdown(): Promise<string> {
  const entries = await getAllWritingEntries();
  const items = entries
    .map(
      (entry) =>
        `## [${entry.title}](${absoluteUrl(`/writing/${entry.slug}.md`)})\n\n${entry.summary}`,
    )
    .join("\n\n");
  return `# Writing — ${siteConfig.name}\n\n${items || "The first entry is still in the making."}\n`;
}

export async function siteOverviewMarkdown(): Promise<string> {
  const [projects, writing] = await Promise.all([getAllProjects(), getAllWritingEntries()]);

  const projectLines = projects
    .map(
      (project) =>
        `- [${project.title}](${absoluteUrl(`/projects/${project.slug}.md`)}): ${project.summary}`,
    )
    .join("\n");
  const writingLines = writing
    .map(
      (entry) =>
        `- [${entry.title}](${absoluteUrl(`/writing/${entry.slug}.md`)}): ${entry.summary}`,
    )
    .join("\n");

  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `- Role: ${siteConfig.role}`,
    "",
    "The home page, Projects, Writing, and their entries can be fetched as markdown by appending `.md` to their paths,",
    "or by sending an `Accept: text/markdown` header.",
    "",
    "## Projects",
    "",
    projectLines,
    "",
    "## Writing",
    "",
    writingLines || "The first entry is still in the making.",
    "",
    `RSS feed for writing: ${absoluteUrl("/writing/rss.xml")}`,
    "",
  ].join("\n");
}
