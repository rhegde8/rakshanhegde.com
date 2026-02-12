"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

import { StatusBadge } from "@/components/StatusBadge";
import { TagPill } from "@/components/TagPill";
import { VideoEmbed } from "@/components/VideoEmbed";
import type { DemoEntry } from "@/lib/content/types";
import { motionDurations, motionEasing } from "@/lib/motion/prefs";
import { formatDate } from "@/lib/utils/date";

type DemoCardProps = {
  demo: DemoEntry;
};

export function DemoCard({ demo }: DemoCardProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      {...(!shouldReduceMotion ? { whileHover: { y: -4 } } : {})}
      transition={{ duration: motionDurations.fast, ease: motionEasing }}
      className="surface-panel flex h-full flex-col gap-4 p-4"
    >
      <VideoEmbed
        videoType={demo.videoType}
        videoUrl={demo.videoUrl}
        title={`${demo.title} demo`}
      />

      <header className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-text text-lg font-semibold">{demo.title}</h3>
          {demo.status ? <StatusBadge status={demo.status} /> : null}
        </div>
        <p className="text-muted text-sm">{demo.summary}</p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {demo.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      <div className="text-muted mt-auto flex items-center justify-between pt-2 text-xs">
        <span>Updated {formatDate(demo.updatedAt)}</span>
        <div className="flex items-center gap-3">
          <Link href={`/demos/${demo.slug}`} className="text-accent-1 hover:underline">
            Details
          </Link>
          {demo.repoUrl ? (
            <a href={demo.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
              Repo
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
