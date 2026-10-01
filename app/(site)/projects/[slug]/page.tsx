import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/JsonLdScript";
import { MdxContent } from "@/components/MdxContent";
import { SystemDiagram } from "@/components/SystemDiagram";
import { systems } from "@/lib/config/systems";
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
  const system = systems[project.slug];
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
          <span>{project.status === "in-use" ? "In production" : "In development"}</span>
        </div>
      </header>
      <JsonLdScript data={buildProjectJsonLd(project)} />
      {system && (
        <section className="project-system" aria-label={`${project.title} overview`}>
          <div className="project-system-intro">
            <p className="eyebrow">Inside the system</p>
            <h2>{system.question}</h2>
            <p>
              {project.slug === "sealcheck"
                ? "A concept in development: assessing the sandbox before testing AI models inside it."
                : "An overview of the pieces and the thinking behind them."}{" "}
              Select a component to explore.
            </p>
          </div>
          <SystemDiagram system={system} />
        </section>
      )}
      <div className="article-body">
        <MdxContent source={project.content} />
        <aside className="article-aside">
          <p className="eyebrow">{project.status === "ongoing" ? "The focus" : "The outcome"}</p>
          <p>{project.impact}</p>
          {project.stack.length > 0 && (
            <>
              <p className="eyebrow">Built with</p>
              <ul className="stack-list">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          <p className="eyebrow">Context</p>
          <p>{project.context}</p>
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
