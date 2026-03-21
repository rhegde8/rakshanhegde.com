import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { StatusBadge } from "@/components/StatusBadge";
import { TagPill } from "@/components/TagPill";
import { getAllProjects, getProjectBySlug } from "@/lib/content/loaders";
import { buildProjectJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/date";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <Link href="/projects" className="font-mono text-xs text-[#00ff88] hover:underline">
        ← back to projects
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-3xl font-semibold tracking-tight text-[#e2e8f0]">
            {project.title}
          </h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="max-w-3xl text-sm text-[#6b7280] sm:text-base">{project.summary}</p>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#6b7280]">
          <span>started {formatDate(project.startedAt)}</span>
          <span>·</span>
          <span>updated {formatDate(project.updatedAt)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((skill) => (
            <TagPill key={skill} label={skill} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 font-mono text-sm text-[#6b7280]">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#00ff88]"
            >
              repository
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#00ff88]"
            >
              live
            </a>
          ) : null}
          {project.caseStudyUrl ? (
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#00ff88]"
            >
              case study
            </a>
          ) : null}
        </div>
      </header>

      <JsonLdScript data={buildProjectJsonLd(project)} />
      <MdxContent source={project.content} />
    </article>
  );
}
