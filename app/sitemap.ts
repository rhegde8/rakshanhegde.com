import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getAllProjects, getAllWritingEntries } from "@/lib/content/loaders";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, writing] = await Promise.all([getAllProjects(), getAllWritingEntries()]);
  return [
    ...["", "/projects", "/writing", "/about"].map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...writing.map((entry) => ({
      url: `${siteConfig.url}/writing/${entry.slug}`,
      lastModified: entry.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
