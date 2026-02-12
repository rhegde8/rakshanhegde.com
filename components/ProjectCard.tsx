"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

import { StatusBadge } from "@/components/StatusBadge";
import { TagPill } from "@/components/TagPill";
import type { ProjectEntry } from "@/lib/content/types";
import { motionDurations, motionEasing } from "@/lib/motion/prefs";
import { formatDate } from "@/lib/utils/date";

type ProjectCardProps = {
  project: ProjectEntry;
};

export function ProjectCard({ project }: ProjectCardProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      {...(!shouldReduceMotion ? { whileHover: { y: -4 } } : {})}
      transition={{ duration: motionDurations.fast, ease: motionEasing }}
      className="surface-panel flex h-full flex-col gap-4 p-4"
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-text text-lg font-semibold">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-muted text-sm">{project.summary}</p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((item) => (
          <TagPill key={item} label={item} />
        ))}
      </div>

      <div className="text-muted mt-auto flex items-center justify-between gap-3 pt-2 text-xs">
        <span>Updated {formatDate(project.updatedAt)}</span>
        <div className="flex items-center gap-3">
          <Link href={`/projects/${project.slug}`} className="text-accent-1 hover:underline">
            Details
          </Link>
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">
              Live
            </a>
          ) : null}
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
              Repo
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
