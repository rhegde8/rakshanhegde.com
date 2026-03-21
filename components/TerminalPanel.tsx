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
      currentIndex = Math.min(fullText.length, currentIndex + 3);
      setTypedText(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        window.clearInterval(interval);
      }
    }, 18);

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
      className={cn("w-full overflow-hidden border border-[#1e1e1e] bg-[#0f0f0f]", className)}
    >
      <div className="flex items-center gap-2 border-b border-[#1e1e1e] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[#6b7280]">rakshan@dev — zsh</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-xs leading-relaxed text-[#6b7280] sm:text-sm">
        {typedLines.map((line, index) => {
          const isCommand = line.startsWith("$");
          return (
            <div key={`${line}-${index}`} className={isCommand ? "text-[#e2e8f0]" : ""}>
              {line || "\u00A0"}
            </div>
          );
        })}
        {!isComplete ? (
          <span className="cursor-blink inline-block text-[#00ff88]">█</span>
        ) : (
          <span className="cursor-blink inline-block text-[#00ff88]">█</span>
        )}
      </pre>
    </section>
  );
}
