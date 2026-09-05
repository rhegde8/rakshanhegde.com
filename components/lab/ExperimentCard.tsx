import Link from "next/link";

import { TagPill } from "@/components/TagPill";
import type { Experiment } from "@/lib/lab/experiments";

export function ExperimentCard({ experiment }: { experiment: Experiment }): React.JSX.Element {
  return (
    <Link
      href={experiment.href}
      className="surface-panel group border-l-accent hover:bg-panel-2 flex h-full flex-col gap-3 border-l-2 p-5 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-accent glow-text font-mono text-[11px] tracking-widest">
          {experiment.codename}
        </span>
        <span
          className={`font-mono text-[10px] ${
            experiment.status === "live" ? "text-success" : "text-amber"
          }`}
        >
          ● {experiment.status}
        </span>
      </div>

      <h3 className="font-display text-text text-xl font-semibold">{experiment.title}</h3>
      <p className="text-muted text-sm leading-relaxed">{experiment.blurb}</p>

      <div className="flex flex-wrap gap-1.5">
        {experiment.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      <span className="text-accent mt-auto pt-2 font-mono text-xs group-hover:underline">
        {experiment.action} →
      </span>
    </Link>
  );
}
