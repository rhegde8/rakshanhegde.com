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
      {...(!shouldReduceMotion ? { whileHover: { y: -2 } } : {})}
      transition={{ duration: motionDurations.fast, ease: motionEasing }}
      className="surface-panel hover:bg-panel-2 flex h-full flex-col gap-4 p-5 transition-colors"
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-text font-mono text-base font-semibold">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-muted text-sm leading-relaxed">{project.summary}</p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((item) => (
          <TagPill key={item} label={item} />
        ))}
      </div>

      <div className="text-muted mt-auto flex items-center justify-between gap-3 pt-2 font-mono text-xs">
        <span>{formatDate(project.updatedAt)}</span>
        <div className="flex items-center gap-3">
          <Link href={`/projects/${project.slug}`} className="text-accent hover:underline">
            details →
          </Link>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-text transition-colors"
            >
              live
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-text transition-colors"
            >
              repo
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
