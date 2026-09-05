import type { PaletteItem } from "@/components/CommandPalette";
import { siteConfig } from "@/lib/config/site";
import { getAllProjects, getAllWritingEntries } from "@/lib/content/loaders";

export async function buildPaletteItems(): Promise<PaletteItem[]> {
  const [projects, writing] = await Promise.all([getAllProjects(), getAllWritingEntries()]);

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

  const writingItems: PaletteItem[] = writing.map((entry) => ({
    id: `writing:${entry.slug}`,
    label: entry.title,
    hint: "writing",
    href: `/writing/${entry.slug}`,
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
      hint: "writing",
      href: "/writing/rss.xml",
      keywords: ["feed", "subscribe"],
    },
  ];

  return [...pages, ...projectItems, ...writingItems, ...actions];
}
