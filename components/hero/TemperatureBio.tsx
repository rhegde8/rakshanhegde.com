"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "framer-motion";

import { pickBioVariant, temperatureBand } from "@/lib/config/voice";

const SCRAMBLE_GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
const SCRAMBLE_MS = 420;
const SCRAMBLE_FPS = 30;

const bandStyles = {
  cold: "border-accent/40",
  warm: "border-amber/50",
  hot: "border-magenta/60",
} as const;

const bandLabelStyles = {
  cold: "text-accent",
  warm: "text-amber",
  hot: "text-magenta",
} as const;

export function TemperatureBio(): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const [temperature, setTemperature] = useState(0.7);
  const variant = pickBioVariant(temperature);
  const band = temperatureBand(temperature);

  // `scramble` holds the transient decode animation; null means "settled", in
  // which case we render the variant text directly. Keeping setState inside the
  // interval callback (never synchronously in the effect body) avoids cascading
  // renders and reduced-motion needs no state change at all.
  const [scramble, setScramble] = useState<string | null>(null);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousTextRef = useRef(variant.text);

  useEffect(() => {
    const target = variant.text;
    if (target === previousTextRef.current) {
      return;
    }
    previousTextRef.current = target;

    if (shouldReduceMotion) {
      return;
    }

    if (frameRef.current) {
      clearInterval(frameRef.current);
    }
    const totalFrames = Math.max(1, Math.round((SCRAMBLE_MS / 1000) * SCRAMBLE_FPS));
    let frame = 0;
    frameRef.current = setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      const resolvedChars = Math.floor(target.length * progress);
      if (frame >= totalFrames) {
        if (frameRef.current) {
          clearInterval(frameRef.current);
        }
        setScramble(null);
        return;
      }
      const next = target
        .split("")
        .map((char, index) => {
          if (index < resolvedChars || char === " ") {
            return char;
          }
          return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        })
        .join("");
      setScramble(next);
    }, 1000 / SCRAMBLE_FPS);

    return () => {
      if (frameRef.current) {
        clearInterval(frameRef.current);
      }
    };
  }, [variant.text, shouldReduceMotion]);

  const displayText = scramble ?? variant.text;

  return (
    <section data-temp-band={band} className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-muted font-mono text-xs tracking-[0.25em]">
          {"// bio — sampled at "}
          <span className={bandLabelStyles[band]}>T = {temperature.toFixed(1)}</span>
        </h2>
        <span className={`font-mono text-xs ${bandLabelStyles[band]}`}>[{variant.label}]</span>
      </div>

      <div className={`surface-panel border-l-2 p-5 transition-colors sm:p-6 ${bandStyles[band]}`}>
        <p
          className="temp-reactive text-text min-h-[7.5em] text-sm leading-relaxed sm:min-h-[5.5em] sm:text-base"
          aria-live="polite"
        >
          {displayText}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="temperature-slider" className="text-muted block font-mono text-xs">
          temperature — drag to re-sample me
        </label>
        <input
          id="temperature-slider"
          className="temp-slider"
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={temperature}
          onChange={(event) => setTemperature(Number(event.target.value))}
          aria-valuetext={`temperature ${temperature.toFixed(1)}, ${variant.label}`}
        />
        <div className="text-muted-2 flex justify-between font-mono text-[10px]">
          <span>0.0 deterministic</span>
          <span>1.0 creative</span>
          <span>2.0 unhinged</span>
        </div>
      </div>

      <p className="text-muted-2 font-mono text-[10px]">
        pre-computed samples · runs 100% client-side · no LLM was consulted in the rendering of this
        bio
      </p>
    </section>
  );
}
