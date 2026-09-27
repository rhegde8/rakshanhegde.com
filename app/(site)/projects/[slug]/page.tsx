import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { ProjectFigure } from "@/components/ProjectFigure";
import { getAllProjects, getProjectBySlug } from "@/lib/content/loaders";
import { buildProjectJsonLd } from "@/lib/seo/jsonld";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getAllProjects()).map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  return project
    ? {
        title: project.title,
        description: project.summary,
        alternates: { canonical: `/projects/${project.slug}` },
      }
    : { title: "Project not found" };
}
export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();
  return (
    <article>
      <header className="article-header">
        <Link href="/projects" className="text-link">
          ← All projects
        </Link>
        <p className="eyebrow">
          {project.category} / {project.context}
        </p>
        <h1>{project.title}</h1>
        <p className="article-summary">{project.summary}</p>
        <div className="article-meta">
          <span>By Rakshan Hegde</span>
          <span>{project.status === "in-use" ? "In production" : "Ongoing"}</span>
        </div>
      </header>
      <JsonLdScript data={buildProjectJsonLd(project)} />
      <div className="article-body">
        <MdxContent source={project.content} />
        <aside className="article-aside">
          <ProjectFigure kind={project.slug} />
          <p className="eyebrow">The outcome</p>
          <p>{project.impact}</p>
          <p className="eyebrow">Built with</p>
          <ul className="stack-list">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="contact-note">Project links coming soon.</span>
        </aside>
      </div>
      <div className="article-end">
        <Link href="/projects" className="underlined-link">
          Back to the collection <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
