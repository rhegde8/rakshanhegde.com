import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { TagPill } from "@/components/TagPill";
import { getAllWritingEntries, getWritingBySlug } from "@/lib/content/loaders";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/date";

type WritingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllWritingEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: WritingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getWritingBySlug(slug);

  if (!entry) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: entry.title,
    description: entry.summary,
    alternates: {
      canonical: `/writing/${entry.slug}`,
    },
  };
}

export default async function WritingDetailPage({
  params,
}: WritingDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const entry = await getWritingBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <Link href="/writing" className="text-accent font-mono text-xs hover:underline">
        ← back to writing
      </Link>

      <header className="border-l-accent space-y-3 border-l-2 pl-4">
        <h1 className="font-display text-text text-3xl font-semibold tracking-tight sm:text-4xl">
          {entry.title}
        </h1>
        <p className="text-muted max-w-3xl text-sm sm:text-base">{entry.summary}</p>
        <p className="text-muted font-mono text-xs">updated {formatDate(entry.updatedAt)}</p>
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
      </header>

      <JsonLdScript data={buildArticleJsonLd(entry)} />
      <MdxContent source={entry.content} />
    </article>
  );
}
