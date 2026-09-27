import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { getAllWritingEntries, getWritingBySlug } from "@/lib/content/loaders";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/date";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getAllWritingEntries()).map((entry) => ({ slug: entry.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await getWritingBySlug((await params).slug);
  return entry
    ? {
        title: entry.title,
        description: entry.summary,
        alternates: { canonical: `/writing/${entry.slug}` },
      }
    : { title: "Article not found" };
}
export default async function WritingDetailPage({ params }: Props) {
  const entry = await getWritingBySlug((await params).slug);
  if (!entry) notFound();
  return (
    <article className="writing-article">
      <header className="article-header">
        <Link href="/writing" className="text-link">
          ← All writing
        </Link>
        <p className="eyebrow">{entry.tags.join(" / ")}</p>
        <h1>{entry.title}</h1>
        <p className="article-summary">{entry.summary}</p>
        <div className="article-meta">
          <span>By Rakshan Hegde</span>
          <time dateTime={entry.updatedAt}>{formatDate(entry.updatedAt)}</time>
        </div>
      </header>
      <JsonLdScript data={buildArticleJsonLd(entry)} />
      <MdxContent source={entry.content} />
    </article>
  );
}
