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
      {...(!shouldReduceMotion ? { whileHover: { x: 2 } } : {})}
      transition={{ duration: motionDurations.fast, ease: motionEasing }}
      className="flex h-full flex-col gap-4 border border-l-[2px] border-[#1e1e1e] border-l-[#00ff88] bg-[#111111] p-5"
    >
      <header className="space-y-2">
        <h3 className="font-mono text-base font-semibold text-[#e2e8f0]">{entry.title}</h3>
        <p className="text-sm leading-relaxed text-[#6b7280]">{entry.summary}</p>
      </header>

      {entry.hypothesis ? (
        <p className="text-xs text-[#6b7280]">
          <span className="font-mono text-[#00ff88]">hypothesis:</span> {entry.hypothesis}
        </p>
      ) : null}

      {entry.findings ? (
        <p className="text-xs text-[#6b7280]">
          <span className="font-mono text-[#e2e8f0]">findings:</span> {entry.findings}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 font-mono text-xs text-[#6b7280]">
        <span>{formatDate(entry.updatedAt)}</span>
        <Link href={`/research/${entry.slug}`} className="text-[#00ff88] hover:underline">
          read entry →
        </Link>
      </div>
    </motion.article>
  );
}
