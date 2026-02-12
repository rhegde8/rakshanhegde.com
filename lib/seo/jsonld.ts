import { siteConfig } from "@/lib/config/site";
import type { DemoEntry, ProjectEntry, ResearchEntry } from "@/lib/content/types";

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
    email: `mailto:${siteConfig.email}`,
    sameAs: siteConfig.socialLinks.map((link) => link.href),
    knowsAbout: [...siteConfig.aiSignals],
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

export function buildResearchArticleJsonLd(entry: ResearchEntry): JsonLdObject {
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
    url: absoluteUrl(`/research/${entry.slug}`),
  };
}

export function buildProjectJsonLd(project: ProjectEntry): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    dateModified: project.updatedAt,
    programmingLanguage: project.stack.join(", "),
    codeRepository: project.repoUrl ?? absoluteUrl(`/projects/${project.slug}`),
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    url: absoluteUrl(`/projects/${project.slug}`),
  };
}

export function buildDemoJsonLd(demo: DemoEntry): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: demo.title,
    description: demo.summary,
    dateModified: demo.updatedAt,
    url: absoluteUrl(`/demos/${demo.slug}`),
    creator: {
      "@type": "Person",
      name: siteConfig.name,
    },
    keywords: demo.tags.join(", "),
  };
}
