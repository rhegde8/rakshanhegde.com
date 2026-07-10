"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

import { TagPill } from "@/components/TagPill";
import type { WritingEntry } from "@/lib/content/types";
import { motionDurations, motionEasing } from "@/lib/motion/prefs";
import { formatDate } from "@/lib/utils/date";

type WritingCardProps = {
  entry: WritingEntry;
};

export function WritingCard({ entry }: WritingCardProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      {...(!shouldReduceMotion ? { whileHover: { x: 2 } } : {})}
      transition={{ duration: motionDurations.fast, ease: motionEasing }}
      className="surface-panel border-l-accent flex h-full flex-col gap-4 border-l-2 p-5"
    >
      <header className="space-y-2">
        <h3 className="text-text font-mono text-base font-semibold">{entry.title}</h3>
        <p className="text-muted text-sm leading-relaxed">{entry.summary}</p>
      </header>

      {entry.hypothesis ? (
        <p className="text-muted text-xs">
          <span className="text-accent font-mono">hypothesis:</span> {entry.hypothesis}
        </p>
      ) : null}

      {entry.findings ? (
        <p className="text-muted text-xs">
          <span className="text-text font-mono">findings:</span> {entry.findings}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      <div className="text-muted mt-auto flex items-center justify-between pt-2 font-mono text-xs">
        <span>{formatDate(entry.updatedAt)}</span>
        <Link href={`/writing/${entry.slug}`} className="text-accent hover:underline">
          read →
        </Link>
      </div>
    </motion.article>
  );
}
