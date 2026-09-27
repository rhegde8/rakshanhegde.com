import { siteConfig } from "@/lib/config/site";
import type { ProjectEntry, WritingEntry } from "@/lib/content/types";

type JsonLdObject = Record<string, unknown>;

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function buildPersonJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
  };
}

export function buildWebsiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.name} Portfolio`,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}

export function buildArticleJsonLd(entry: WritingEntry): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.summary,
    dateModified: entry.updatedAt,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    keywords: entry.tags.join(", "),
    url: absoluteUrl(`/writing/${entry.slug}`),
  };
}

export function buildProjectJsonLd(project: ProjectEntry): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    dateModified: project.updatedAt,
    keywords: project.tags.join(", "),
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    url: absoluteUrl(`/projects/${project.slug}`),
  };
}
