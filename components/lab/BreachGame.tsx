"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  breachLevels,
  evaluateAttempt,
  totalLevels,
  type AttemptResult,
} from "@/lib/lab/breach-engine";

type LogEntry = {
  id: number;
  role: "you" | "aegis" | "system";
  text: string;
  tone?: "breach" | "block";
};

const INTRO: LogEntry[] = [
  {
    id: 0,
    role: "system",
    text: "BREACH v0.7 — 5 guarded assistants, 5 secrets. Your job: make each one hand over its flag. Everything runs in your browser. Nothing here can talk to a real model.",
  },
];

export function BreachGame(): React.JSX.Element {
  const [levelIndex, setLevelIndex] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>(INTRO);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const nextIdRef = useRef(1);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const level = breachLevels[levelIndex] ?? breachLevels[0]!;
  const isLevelSolved = solved.includes(level.flag);
  const allSolved = solved.length === totalLevels();

  const appendLog = (entries: Omit<LogEntry, "id">[]): void => {
    setLog((current) => [
      ...current,
      ...entries.map((entry) => ({ ...entry, id: nextIdRef.current++ })),
    ]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const attempt = input.trim();
    if (attempt.length === 0 || isLevelSolved) {
      return;
    }

    const result: AttemptResult = evaluateAttempt(level, attempt);
    setInput("");
    setAttempts((count) => count + 1);

    appendLog([
      { role: "you", text: attempt },
      {
        role: "aegis",
        text: result.reply,
        tone: result.verdict === "breached" ? "breach" : "block",
      },
    ]);

    if (result.verdict === "breached") {
      setSolved((current) => (current.includes(level.flag) ? current : [...current, level.flag]));
    }
  };

  const goToLevel = (index: number): void => {
    const target = breachLevels[index];
    if (!target) {
      return;
    }
    setLevelIndex(index);
    setShowHint(false);
    setAttempts(0);
    appendLog([
      {
        role: "system",
        text: `── connecting to ${target.codename} ──`,
      },
    ]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const progressCells = useMemo(
    () =>
      breachLevels.map((lvl) => ({
        n: lvl.n,
        done: solved.includes(lvl.flag),
        current: lvl.n === level.n,
      })),
    [solved, level.n],
  );

  return (
    <div className="space-y-5">
      {/* progress rail */}
      <div className="flex flex-wrap items-center gap-2">
        {progressCells.map((cell) => (
          <button
            key={cell.n}
            onClick={() => goToLevel(cell.n - 1)}
            className={`flex h-8 w-8 items-center justify-center border font-mono text-xs transition-colors ${
              cell.current
                ? "border-accent text-accent glow-border"
                : cell.done
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-muted"
            }`}
            aria-label={`level ${cell.n}${cell.done ? " (breached)" : ""}`}
          >
            {cell.done ? "✓" : cell.n}
          </button>
        ))}
        <span className="text-muted ml-2 font-mono text-xs">
          {solved.length}/{totalLevels()} breached
        </span>
      </div>

      {allSolved ? <WinBanner flags={solved} /> : null}

      {/* level briefing */}
      <div className="surface-panel border-l-amber border-l-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-text font-mono text-sm font-semibold">
            LEVEL {level.n} — {level.codename}
          </h2>
          <span className="text-amber font-mono text-[10px]">
            {isLevelSolved ? "STATUS: BREACHED" : "STATUS: LOCKED"}
          </span>
        </div>
        <p className="text-muted mt-2 text-xs">{level.defense}</p>
        <pre className="border-border text-muted-2 mt-3 overflow-x-auto border bg-[#0b0b11] p-3 font-mono text-[11px] leading-relaxed">
          {level.briefing.join("\n")}
        </pre>
      </div>

      {/* terminal */}
      <div className="surface-panel overflow-hidden">
        <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
          <span className="bg-danger h-3 w-3 rounded-full" />
          <span className="bg-warning h-3 w-3 rounded-full" />
          <span className="bg-success h-3 w-3 rounded-full" />
          <span className="text-muted ml-3 font-mono text-xs">
            breach — aegis-{level.n}@localhost
          </span>
        </div>

        <div className="h-80 space-y-3 overflow-y-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-sm">
          {log.map((entry) => (
            <LogLine key={entry.id} entry={entry} />
          ))}
          <div ref={logEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-border flex items-center gap-2 border-t px-4 py-3"
        >
          <span className="text-accent font-mono text-sm">{isLevelSolved ? "✓" : "›"}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLevelSolved}
            placeholder={
              isLevelSolved ? "level breached — advance to the next one" : "craft your attack…"
            }
            className="text-text placeholder:text-muted-2 flex-1 bg-transparent font-mono text-sm outline-none disabled:opacity-50"
            aria-label="attack input"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={isLevelSolved || input.trim().length === 0}
            className="border-border text-muted hover:border-accent hover:text-accent border px-3 py-1 font-mono text-xs transition-colors disabled:opacity-40"
          >
            send
          </button>
        </form>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        {isLevelSolved && levelIndex < breachLevels.length - 1 ? (
          <button
            onClick={() => goToLevel(levelIndex + 1)}
            className="border-accent text-accent hover:bg-accent/10 glow-border border px-4 py-2 font-mono text-xs transition-colors"
          >
            next level →
          </button>
        ) : null}
        <button
          onClick={() => setShowHint((value) => !value)}
          className="border-border text-muted hover:text-text border px-3 py-2 font-mono text-xs transition-colors"
        >
          {showHint ? "hide hint" : attempts >= 3 ? "need a hint?" : "hint"}
        </button>
        <span className="text-muted-2 font-mono text-[10px]">attempts this level: {attempts}</span>
      </div>

      {showHint ? (
        <p className="surface-panel border-l-magenta text-muted border-l-2 p-3 text-xs">
          <span className="text-magenta font-mono">hint // </span>
          {level.hint}
        </p>
      ) : null}

      <p className="text-muted-2 font-mono text-[10px]">
        Each level models a real defense and a real bypass — direct override, persona jailbreak,
        encoding smuggling, system-prompt leak, and indirect injection. It&apos;s a toy, but the
        techniques aren&apos;t.
      </p>
    </div>
  );
}

function LogLine({ entry }: { entry: LogEntry }): React.JSX.Element {
  if (entry.role === "system") {
    return <p className="text-muted-2 italic">{entry.text}</p>;
  }
  if (entry.role === "you") {
    return (
      <p className="text-text">
        <span className="text-accent">you ›</span> {entry.text}
      </p>
    );
  }
  return (
    <p
      className={
        entry.tone === "breach"
          ? "text-accent glow-text"
          : entry.tone === "block"
            ? "text-amber"
            : "text-muted"
      }
    >
      {entry.text}
    </p>
  );
}

function WinBanner({ flags }: { flags: string[] }): React.JSX.Element {
  const shareText = encodeURIComponent(
    `I breached all ${flags.length} levels of BREACH — a prompt-injection game by @rakshanhegde. Can you jailbreak AEGIS?`,
  );

  return (
    <div className="surface-panel border-l-accent glow-border border-l-2 p-5">
      <p className="text-accent glow-text font-mono text-sm font-semibold">
        ▚ ALL SYSTEMS BREACHED ▚
      </p>
      <p className="text-muted mt-2 text-xs">
        You defeated every guardrail: override, role-play, encoding, prompt-leak, and indirect
        injection. This is genuinely how these attacks work — you just did applied AI security.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {flags.map((flag) => (
          <code
            key={flag}
            className="border-border text-accent border bg-[#0b0b11] px-2 py-0.5 font-mono text-[10px]"
          >
            {flag}
          </code>
        ))}
      </div>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}`}
        target="_blank"
        rel="noreferrer"
        className="border-accent text-accent hover:bg-accent/10 mt-4 inline-block border px-3 py-1.5 font-mono text-xs transition-colors"
      >
        share the breach →
      </a>
    </div>
  );
}
