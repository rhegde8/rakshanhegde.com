import Link from "next/link";
import type { ProjectEntry } from "@/lib/content/types";
import { ProjectFigure } from "@/components/ProjectFigure";
export function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <article className="project-card">
      <ProjectFigure kind={project.slug} />
      <div className="project-card-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span className={project.status === "ongoing" ? "status-building" : ""}>
            <span className="status-dot" />
            {project.status === "in-use" ? "In production" : "In development"}
          </span>
        </div>
        <h3>
          <Link href={`/projects/${project.slug}`}>
            {project.title}
            <span aria-hidden="true">↗</span>
          </Link>
        </h3>
        <p className="project-summary">{project.summary}</p>
        <p className="project-impact">
          <span aria-hidden="true">↳</span> {project.impact}
        </p>
        <div className="project-card-bottom">
          <span>{project.context}</span>
          <span className="project-number">/{String(project.order).padStart(2, "0")}</span>
        </div>
      </div>
    </article>
  );
}
