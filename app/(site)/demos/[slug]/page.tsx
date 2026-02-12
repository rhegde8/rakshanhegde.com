import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { StatusBadge } from "@/components/StatusBadge";
import { TagPill } from "@/components/TagPill";
import { VideoEmbed } from "@/components/VideoEmbed";
import { getAllDemos, getDemoBySlug } from "@/lib/content/loaders";
import { buildDemoJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/date";

type DemoDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const demos = await getAllDemos();
  return demos.map((demo) => ({ slug: demo.slug }));
}

export async function generateMetadata({ params }: DemoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = await getDemoBySlug(slug);

  if (!demo) {
    return {
      title: "Demo not found",
    };
  }

  return {
    title: demo.title,
    description: demo.summary,
    alternates: {
      canonical: `/demos/${demo.slug}`,
    },
  };
}

export default async function DemoDetailPage({
  params,
}: DemoDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const demo = await getDemoBySlug(slug);

  if (!demo) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <Link href="/demos" className="text-accent-1 text-sm hover:underline">
        ← Back to demos
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{demo.title}</h1>
          {demo.status ? <StatusBadge status={demo.status} /> : null}
        </div>
        <p className="text-muted max-w-3xl text-sm sm:text-base">{demo.summary}</p>
        <p className="text-muted text-xs">Updated {formatDate(demo.updatedAt)}</p>
        <div className="flex flex-wrap gap-1.5">
          {demo.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
      </header>

      <VideoEmbed videoType={demo.videoType} videoUrl={demo.videoUrl} title={demo.title} />

      <div className="text-muted flex flex-wrap gap-3 text-sm">
        {demo.repoUrl ? (
          <a href={demo.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
            Repository
          </a>
        ) : null}
        {demo.liveUrl ? (
          <a href={demo.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">
            Live
          </a>
        ) : null}
      </div>

      <JsonLdScript data={buildDemoJsonLd(demo)} />
      <MdxContent source={demo.content} />
    </article>
  );
}
