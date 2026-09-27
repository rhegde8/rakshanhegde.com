import Link from "next/link";
import type { ProjectEntry } from "@/lib/content/types";
import { ProjectFigure } from "@/components/ProjectFigure";
export function ProjectCard({ project }: { project: ProjectEntry }) {
  // Keep the arrow on the same line as the final word when the title wraps.
  const lastSpace = project.title.lastIndexOf(" ");
  const leadingWords = project.title.slice(0, lastSpace + 1);
  const finalWord = project.title.slice(lastSpace + 1);
  return (
    <article className="project-card">
      <Link
        href={`/projects/${project.slug}`}
        className="project-illustration"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProjectFigure kind={project.slug} />
      </Link>
      <p className="eyebrow project-category">{project.category}</p>
      <h3>
        <Link href={`/projects/${project.slug}`}>
          {leadingWords}
          <span className="project-title-end">
            {finalWord}
            <span className="project-arrow" aria-hidden="true">
              ↗
            </span>
          </span>
        </Link>
      </h3>
      <p className="project-summary">{project.summary}</p>
      <p className="project-impact">{project.impact}</p>
      <div className="project-meta">
        <span>{project.context}</span>
        <span>{project.status === "in-use" ? "In production" : "Ongoing"}</span>
      </div>
    </article>
  );
}
