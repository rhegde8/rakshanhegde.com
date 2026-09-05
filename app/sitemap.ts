import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";
import { getAllProjects, getAllWritingEntries } from "@/lib/content/loaders";
import { experiments } from "@/lib/lab/experiments";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, writingEntries] = await Promise.all([getAllProjects(), getAllWritingEntries()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/lab`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/writing`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const labRoutes: MetadataRoute.Sitemap = experiments
    .filter((experiment) => experiment.href.startsWith("/lab/"))
    .map((experiment) => ({
      url: `${siteConfig.url}${experiment.href}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const writingRoutes: MetadataRoute.Sitemap = writingEntries.map((entry) => ({
    url: `${siteConfig.url}/writing/${entry.slug}`,
    lastModified: entry.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...labRoutes, ...projectRoutes, ...writingRoutes];
}
