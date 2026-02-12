"use client";

import { useEffect, useMemo, useState } from "react";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils/cn";

type TerminalPanelProps = {
  lines: readonly string[];
  className?: string;
};

export function TerminalPanel({ lines, className }: TerminalPanelProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const fullText = useMemo(() => lines.join("\n"), [lines]);
  const [typedText, setTypedText] = useState<string>("");

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let currentIndex = 0;
    const interval = window.setInterval(() => {
      currentIndex = Math.min(fullText.length, currentIndex + 2);
      setTypedText(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => {
      window.clearInterval(interval);
    };
  }, [fullText, shouldReduceMotion]);

  const displayText = shouldReduceMotion ? fullText : typedText;
  const typedLines = displayText.split("\n");
  const isComplete = displayText.length >= fullText.length;

  return (
    <section
      aria-label="Terminal introduction"
      className={cn(
        "surface-panel terminal-grid-bg border-border/90 overflow-hidden rounded-xl border",
        className,
      )}
    >
      <div className="border-border/70 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="bg-danger h-2.5 w-2.5 rounded-full" />
        <span className="bg-warning h-2.5 w-2.5 rounded-full" />
        <span className="bg-success h-2.5 w-2.5 rounded-full" />
        <span className="text-muted ml-2 font-mono text-xs">terminal://rakshan-intro</span>
      </div>
      <pre className="text-muted overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-sm">
        {typedLines.map((line, index) => (
          <div key={`${line}-${index}`}>{line || "\u00A0"}</div>
        ))}
        {!isComplete ? (
          <span className="text-accent-1 ml-1 inline-block animate-pulse">█</span>
        ) : null}
      </pre>
    </section>
  );
}
