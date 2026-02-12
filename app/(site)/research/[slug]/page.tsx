import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { TagPill } from "@/components/TagPill";
import { getAllResearchEntries, getResearchBySlug } from "@/lib/content/loaders";
import { buildResearchArticleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/date";

type ResearchDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllResearchEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ResearchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getResearchBySlug(slug);

  if (!entry) {
    return {
      title: "Research not found",
    };
  }

  return {
    title: entry.title,
    description: entry.summary,
    alternates: {
      canonical: `/research/${entry.slug}`,
    },
  };
}

export default async function ResearchDetailPage({
  params,
}: ResearchDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const entry = await getResearchBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <Link href="/research" className="text-accent-1 text-sm hover:underline">
        ← Back to research
      </Link>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{entry.title}</h1>
        <p className="text-muted max-w-3xl text-sm sm:text-base">{entry.summary}</p>
        <p className="text-muted text-xs">Updated {formatDate(entry.updatedAt)}</p>
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
      </header>

      <JsonLdScript data={buildResearchArticleJsonLd(entry)} />
      <MdxContent source={entry.content} />
    </article>
  );
}
