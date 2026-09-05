import type { PaletteItem } from "@/components/CommandPalette";
import { siteConfig } from "@/lib/config/site";
import { getAllProjects, getAllResearchEntries } from "@/lib/content/loaders";

export async function buildPaletteItems(): Promise<PaletteItem[]> {
  const [projects, research] = await Promise.all([getAllProjects(), getAllResearchEntries()]);

  const pages: PaletteItem[] = siteConfig.navItems.map((item) => ({
    id: `page:${item.href}`,
    label: item.label,
    hint: "page",
    href: item.href,
    keywords: ["page", "go"],
  }));

  const projectItems: PaletteItem[] = projects.map((project) => ({
    id: `project:${project.slug}`,
    label: project.title,
    hint: "project",
    href: `/projects/${project.slug}`,
    keywords: [...project.tags, ...project.stack, project.slug],
  }));

  const researchItems: PaletteItem[] = research.map((entry) => ({
    id: `research:${entry.slug}`,
    label: entry.title,
    hint: "research",
    href: `/research/${entry.slug}`,
    keywords: [...entry.tags, entry.slug],
  }));

  const actions: PaletteItem[] = [
    {
      id: "action:email",
      label: `email ${siteConfig.shortName.toLowerCase()}`,
      hint: "action",
      href: `mailto:${siteConfig.email}`,
      keywords: ["contact", "mail"],
    },
    ...siteConfig.socialLinks.map((social) => ({
      id: `action:${social.label.toLowerCase()}`,
      label: social.label.toLowerCase(),
      hint: "link",
      href: social.href,
      keywords: ["social", "profile"],
    })),
    {
      id: "action:llms",
      label: "llms.txt",
      hint: "for agents",
      href: "/llms.txt",
      keywords: ["markdown", "ai", "agent"],
    },
    {
      id: "action:rss",
      label: "rss feed",
      hint: "research",
      href: "/research/rss.xml",
      keywords: ["feed", "subscribe"],
    },
  ];

  return [...pages, ...projectItems, ...researchItems, ...actions];
}
