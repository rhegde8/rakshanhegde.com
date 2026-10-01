import { ProjectCard } from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/content/loaders";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Projects",
  description:
    "SealCheck, agent orchestration, security platforms, and threat intelligence. Engineering work by Rakshan Hegde.",
  path: "/projects",
});
export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">The work / Built &amp; being built</p>
        <h1>
          Built to solve
          <br />
          <em>something real.</em>
        </h1>
        <p>
          Production security platforms, sandbox preflight checks, and experiments in agent
          orchestration. The questions, the systems, and the decisions behind them.
        </p>
      </header>
      <div className="collection-label">
        <span>{String(projects.length).padStart(2, "0")} projects</span>
        <span>Professional work &amp; personal explorations</span>
      </div>
      <div className="project-grid projects-index">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <p className="collection-end">More projects will join these pages as they take shape.</p>
    </>
  );
}
