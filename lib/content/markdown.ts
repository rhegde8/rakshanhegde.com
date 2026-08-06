import { siteConfig } from "@/lib/config/site";
import { getAllProjects, getAllResearchEntries } from "@/lib/content/loaders";
import type { ProjectEntry, ResearchEntry } from "@/lib/content/types";

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function projectToMarkdown(project: ProjectEntry): string {
  const meta = [
    `- Status: ${project.status}`,
    `- Started: ${project.startedAt} · Updated: ${project.updatedAt}`,
    `- Stack: ${project.stack.join(", ")}`,
    `- Tags: ${project.tags.join(", ")}`,
    `- AI focus: ${project.aiFocus.join(", ")}`,
    ...(project.repoUrl ? [`- Repository: ${project.repoUrl}`] : []),
    ...(project.impact ? [`- Impact: ${project.impact}`] : []),
    `- Canonical: ${absoluteUrl(`/projects/${project.slug}`)}`,
  ].join("\n");

  return `# ${project.title}\n\n> ${project.summary}\n\n${meta}\n\n${project.content}\n`;
}

export function researchToMarkdown(entry: ResearchEntry): string {
  const meta = [
    `- Updated: ${entry.updatedAt}`,
    `- Tags: ${entry.tags.join(", ")}`,
    ...(entry.hypothesis ? [`- Hypothesis: ${entry.hypothesis}`] : []),
    ...(entry.findings ? [`- Findings: ${entry.findings}`] : []),
    `- Canonical: ${absoluteUrl(`/research/${entry.slug}`)}`,
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

export async function researchIndexMarkdown(): Promise<string> {
  const entries = await getAllResearchEntries();
  const items = entries
    .map(
      (entry) =>
        `## [${entry.title}](${absoluteUrl(`/research/${entry.slug}.md`)})\n\n${entry.summary}`,
    )
    .join("\n\n");
  return `# Research — ${siteConfig.name}\n\n${items}\n`;
}

export async function siteOverviewMarkdown(): Promise<string> {
  const [projects, research] = await Promise.all([getAllProjects(), getAllResearchEntries()]);

  const projectLines = projects
    .map(
      (project) =>
        `- [${project.title}](${absoluteUrl(`/projects/${project.slug}.md`)}): ${project.summary}`,
    )
    .join("\n");
  const researchLines = research
    .map(
      (entry) =>
        `- [${entry.title}](${absoluteUrl(`/research/${entry.slug}.md`)}): ${entry.summary}`,
    )
    .join("\n");

  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `- Role: ${siteConfig.role}`,
    `- Location: ${siteConfig.location}`,
    `- Email: ${siteConfig.email}`,
    ...siteConfig.socialLinks.map((social) => `- ${social.label}: ${social.href}`),
    "",
    "Any page on this site can be fetched as markdown by appending `.md` to its path,",
    "or by sending an `Accept: text/markdown` header.",
    "",
    "## Projects",
    "",
    projectLines,
    "",
    "## Research",
    "",
    researchLines,
    "",
    `RSS feed for research: ${absoluteUrl("/research/rss.xml")}`,
    "",
  ].join("\n");
}
