import type { MetadataRoute } from "next";

import { getAllDemos, getAllProjects, getAllResearchEntries } from "@/lib/content/loaders";
import { siteConfig } from "@/lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, researchEntries, demos] = await Promise.all([
    getAllProjects(),
    getAllResearchEntries(),
    getAllDemos(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/research`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteConfig.url}/demos`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const researchRoutes: MetadataRoute.Sitemap = researchEntries.map((entry) => ({
    url: `${siteConfig.url}/research/${entry.slug}`,
    lastModified: entry.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const demoRoutes: MetadataRoute.Sitemap = demos.map((demo) => ({
    url: `${siteConfig.url}/demos/${demo.slug}`,
    lastModified: demo.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...researchRoutes, ...demoRoutes];
}
