"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

import { TagPill } from "@/components/TagPill";
import type { ResearchEntry } from "@/lib/content/types";
import { motionDurations, motionEasing } from "@/lib/motion/prefs";
import { formatDate } from "@/lib/utils/date";

type ResearchCardProps = {
  entry: ResearchEntry;
};

export function ResearchCard({ entry }: ResearchCardProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      {...(!shouldReduceMotion ? { whileHover: { y: -4 } } : {})}
      transition={{ duration: motionDurations.fast, ease: motionEasing }}
      className="surface-panel flex h-full flex-col gap-4 p-4"
    >
      <header className="space-y-2">
        <h3 className="text-text text-lg font-semibold">{entry.title}</h3>
        <p className="text-muted text-sm">{entry.summary}</p>
      </header>

      {entry.hypothesis ? (
        <p className="text-muted text-xs">
          <span className="text-accent-2 font-mono">hypothesis:</span> {entry.hypothesis}
        </p>
      ) : null}

      {entry.findings ? (
        <p className="text-muted text-xs">
          <span className="text-success font-mono">findings:</span> {entry.findings}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      <div className="text-muted mt-auto flex items-center justify-between pt-2 text-xs">
        <span>Updated {formatDate(entry.updatedAt)}</span>
        <Link href={`/research/${entry.slug}`} className="text-accent-1 hover:underline">
          Read entry
        </Link>
      </div>
    </motion.article>
  );
}
