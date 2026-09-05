"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";

import type { TerminalData, TerminalLine } from "@/lib/terminal/commands";
import { completeInput, runCommand } from "@/lib/terminal/commands";
import { cn } from "@/lib/utils/cn";

type InteractiveTerminalProps = {
  bootLines: readonly string[];
  data: TerminalData;
  className?: string;
};

const LINE_COLOR: Record<TerminalLine["kind"], string> = {
  input: "text-[#e2e8f0]",
  output: "text-[#6b7280]",
  accent: "text-[#00ff88]",
  error: "text-[#ff5f57]",
};

export function InteractiveTerminal({
  bootLines,
  data,
  className,
}: InteractiveTerminalProps): React.JSX.Element {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const bootText = useMemo(() => bootLines.join("\n"), [bootLines]);
  const [typedCount, setTypedCount] = useState<number>(0);
  const [scrollback, setScrollback] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const effectiveTypedCount = shouldReduceMotion ? bootText.length : typedCount;
  const bootDone = effectiveTypedCount >= bootText.length;

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    let current = 0;
    const interval = window.setInterval(() => {
      current = Math.min(bootText.length, current + 3);
      setTypedCount(current);
      if (current >= bootText.length) {
        window.clearInterval(interval);
      }
    }, 18);
    return () => {
      window.clearInterval(interval);
    };
  }, [bootText, shouldReduceMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [scrollback, bootDone]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(() => {
    const command = input;
    setInput("");
    setHistoryIndex(null);

    const echoed: TerminalLine = { text: `$ ${command}`, kind: "input" };
    const result = runCommand(command, data);

    if (result.clear) {
      setScrollback([]);
    } else {
      setScrollback((previous) => [...previous, echoed, ...result.lines]);
    }

    if (command.trim() !== "") {
      setHistory((previous) =>
        previous[previous.length - 1] === command ? previous : [...previous, command],
      );
    }

    if (result.navigateTo) {
      router.push(result.navigateTo);
    }
  }, [data, input, router]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (history.length === 0) {
          return;
        }
        const nextIndex =
          historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex] ?? "");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyIndex === null) {
          return;
        }
        const nextIndex = historyIndex + 1;
        if (nextIndex >= history.length) {
          setHistoryIndex(null);
          setInput("");
        } else {
          setHistoryIndex(nextIndex);
          setInput(history[nextIndex] ?? "");
        }
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const candidates = completeInput(input, data);
        if (candidates.length === 1) {
          const parts = input.replace(/^\s+/, "").split(/\s+/);
          parts[parts.length - 1] = candidates[0]!;
          setInput(parts.join(" ") + (parts.length === 1 ? " " : ""));
        } else if (candidates.length > 1) {
          setScrollback((previous) => [
            ...previous,
            { text: candidates.join("  "), kind: "output" },
          ]);
        }
        return;
      }

      if (event.key === "c" && event.ctrlKey) {
        event.preventDefault();
        setScrollback((previous) => [...previous, { text: `$ ${input}^C`, kind: "input" }]);
        setInput("");
        setHistoryIndex(null);
      }
    },
    [data, history, historyIndex, input, submit],
  );

  const visibleBootLines = bootText.slice(0, effectiveTypedCount).split("\n");

  return (
    <section
      aria-label="Interactive terminal"
      className={cn("w-full overflow-hidden border border-[#1e1e1e] bg-[#0f0f0f]", className)}
      onClick={focusInput}
    >
      <div className="flex items-center gap-2 border-b border-[#1e1e1e] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[#6b7280]">rakshan@dev — zsh</span>
      </div>
      <div
        ref={viewportRef}
        className="max-h-80 overflow-x-auto overflow-y-auto px-5 py-5 font-mono text-xs leading-relaxed sm:text-sm"
      >
        <div role="log" aria-live="polite">
          {visibleBootLines.map((line, index) => (
            <div
              key={`boot-${index}`}
              className={line.startsWith("$") ? "text-[#e2e8f0]" : "text-[#6b7280]"}
            >
              {line || " "}
            </div>
          ))}
          {bootDone
            ? scrollback.map((line, index) => (
                <div key={`line-${index}`} className={LINE_COLOR[line.kind]}>
                  {line.text || " "}
                </div>
              ))
            : null}
        </div>
        {bootDone ? (
          <div className="flex items-center gap-2 text-[#e2e8f0]">
            <span className="text-[#00ff88]">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setHistoryIndex(null);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent font-mono text-xs text-[#e2e8f0] caret-[#00ff88] outline-none sm:text-sm"
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        ) : (
          <span className="cursor-blink inline-block text-[#00ff88]">█</span>
        )}
      </div>
    </section>
  );
}
