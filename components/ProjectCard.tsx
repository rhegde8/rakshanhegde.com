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
      className="flex h-full flex-col gap-4 border border-[#1e1e1e] bg-[#111111] p-5"
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-mono text-base font-semibold text-[#e2e8f0]">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm leading-relaxed text-[#6b7280]">{project.summary}</p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((item) => (
          <TagPill key={item} label={item} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2 font-mono text-xs text-[#6b7280]">
        <span>{formatDate(project.updatedAt)}</span>
        <div className="flex items-center gap-3">
          <Link href={`/projects/${project.slug}`} className="text-[#00ff88] hover:underline">
            details →
          </Link>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#e2e8f0]"
            >
              live
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#e2e8f0]"
            >
              repo
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
