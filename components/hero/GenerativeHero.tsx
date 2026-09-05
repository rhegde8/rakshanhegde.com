"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "framer-motion";

import { heroHeadline, heroTokens } from "@/lib/config/voice";

const GHOST_MS = 85;
const COMMIT_MS = 120;

type SamplerStep =
  { kind: "ghost"; tokenIndex: number; text: string } | { kind: "commit"; tokenIndex: number };

const samplerSteps: SamplerStep[] = heroTokens.flatMap((token, tokenIndex) => [
  ...token.candidates.map((candidate) => ({ kind: "ghost" as const, tokenIndex, text: candidate })),
  { kind: "commit" as const, tokenIndex },
]);

/** Deterministic fake token probability so the readout is stable across renders. */
function pseudoProbability(tokenIndex: number): string {
  return (0.74 + ((tokenIndex * 7 + 3) % 23) / 100).toFixed(2);
}

export function GenerativeHero(): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  // SSR and no-JS render the finished headline; the effect rewinds and replays it.
  const [committedCount, setCommittedCount] = useState(heroTokens.length);
  const [ghost, setGhost] = useState<string | null>(null);
  const [done, setDone] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let cancelled = false;
    let stepIndex = 0;

    const advance = (): void => {
      if (cancelled) {
        return;
      }
      if (stepIndex >= samplerSteps.length) {
        setGhost(null);
        setDone(true);
        return;
      }
      const step = samplerSteps[stepIndex];
      stepIndex += 1;
      if (!step) {
        setGhost(null);
        setDone(true);
        return;
      }
      if (step.kind === "ghost") {
        setGhost(step.text);
        timeoutRef.current = setTimeout(advance, GHOST_MS);
      } else {
        setGhost(null);
        setCommittedCount(step.tokenIndex + 1);
        timeoutRef.current = setTimeout(advance, COMMIT_MS);
      }
    };

    // Rewind to the start inside the callback so the reset isn't a synchronous
    // setState in the effect body, then replay the token stream.
    const start = (): void => {
      if (cancelled) {
        return;
      }
      setCommittedCount(0);
      setGhost(null);
      setDone(false);
      advance();
    };

    timeoutRef.current = setTimeout(start, 300);

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldReduceMotion]);

  const committedText = heroTokens
    .slice(0, committedCount)
    .map((token) => token.text)
    .join(" ");
  const lastToken = committedCount > 0 ? (heroTokens[committedCount - 1] ?? null) : null;

  return (
    <section className="space-y-6 pt-6 sm:pt-10">
      <p className="text-accent glow-text font-mono text-xs tracking-[0.25em]">
        {"// rakshan hegde — sampling identity"}
      </p>

      <h1
        aria-label={`Rakshan Hegde ${heroHeadline}`}
        className="font-display text-text min-h-[3.5em] text-4xl leading-tight font-semibold tracking-tight sm:min-h-[2.5em] sm:text-6xl"
      >
        <span aria-hidden="true">
          {committedText}
          {ghost ? <span className="text-muted-2 italic"> {ghost}</span> : null}
          <span className="cursor-blink text-accent">▊</span>
        </span>
      </h1>

      <p className="text-muted-2 font-mono text-xs" aria-hidden="true">
        {lastToken
          ? `p(${lastToken.text}) = ${pseudoProbability(committedCount - 1)}${
              lastToken.candidates.length > 0
                ? ` · rejected: ${lastToken.candidates.join(", ")}`
                : ""
            }`
          : "warming up the sampler…"}
        {done ? " · <eos>" : ""}
      </p>
    </section>
  );
}
