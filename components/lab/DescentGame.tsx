"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  initialState,
  landscapes,
  starsForSteps,
  stepDescent,
  type DescentState,
  type Landscape,
} from "@/lib/lab/descent-engine";

const AUTO_STEP_MS = 90;

type CurvePoint = { x: number; y: number };

function sampleCurve(landscape: Landscape, samples = 240): CurvePoint[] {
  const [min, max] = landscape.domain;
  const points: CurvePoint[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const x = min + ((max - min) * i) / samples;
    points.push({ x, y: landscape.f(x) });
  }
  return points;
}

export function DescentGame(): React.JSX.Element {
  const [stageIndex, setStageIndex] = useState(0);
  const landscape = landscapes[stageIndex] ?? landscapes[0]!;

  const [lr, setLr] = useState(landscape.defaultLr);
  const [momentum, setMomentum] = useState(landscape.defaultMomentum);
  const [state, setState] = useState<DescentState>(() => initialState(landscape));
  const [trail, setTrail] = useState<number[]>([landscape.start]);
  const [auto, setAuto] = useState(false);
  const [stars, setStars] = useState<Record<string, number>>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const curve = useMemo(() => sampleCurve(landscape), [landscape]);
  const yBounds = useMemo(() => {
    const ys = curve.map((point) => point.y);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    return { lo, hi: hi + (hi - lo) * 0.12 };
  }, [curve]);

  const resetStage = useCallback((index: number) => {
    const next = landscapes[index];
    if (!next) {
      return;
    }
    setStageIndex(index);
    setLr(next.defaultLr);
    setMomentum(next.defaultMomentum);
    setState(initialState(next));
    setTrail([next.start]);
    setAuto(false);
  }, []);

  const doStep = useCallback(() => {
    setState((current) => {
      if (current.status !== "running") {
        return current;
      }
      const next = stepDescent(landscape, current, { learningRate: lr, momentum });
      setTrail((points) => [...points.slice(-160), next.x]);
      if (next.status === "reached") {
        setStars((prev) => {
          const earned = starsForSteps(landscape, next.steps);
          return { ...prev, [landscape.id]: Math.max(prev[landscape.id] ?? 0, earned) };
        });
      }
      return next;
    });
  }, [landscape, lr, momentum]);

  // Auto-run loop. When the run reaches a terminal state we simply stop
  // scheduling (the loop halts); the auto toggle is disabled at that point and
  // reset() clears it, so there's no need to setState synchronously here.
  useEffect(() => {
    if (!auto || state.status !== "running") {
      return;
    }
    const timer = window.setTimeout(doStep, AUTO_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [auto, state, doStep]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const [xMin, xMax] = landscape.domain;
    const padX = 12;
    const padTop = 16;
    const padBottom = 14;
    const toPx = (x: number): number => padX + ((x - xMin) / (xMax - xMin)) * (width - padX * 2);
    const toPy = (y: number): number =>
      padTop + (1 - (y - yBounds.lo) / (yBounds.hi - yBounds.lo)) * (height - padTop - padBottom);

    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= 8; gx += 1) {
      const px = padX + (gx / 8) * (width - padX * 2);
      ctx.beginPath();
      ctx.moveTo(px, padTop);
      ctx.lineTo(px, height - padBottom);
      ctx.stroke();
    }

    // global minimum marker
    const gmx = toPx(landscape.globalMinX);
    ctx.strokeStyle = "rgba(0,255,136,0.25)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(gmx, padTop);
    ctx.lineTo(gmx, height - padBottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(0,255,136,0.7)";
    ctx.font = "10px monospace";
    ctx.fillText("global min", Math.min(gmx + 4, width - 60), padTop + 10);

    // loss curve
    ctx.strokeStyle = "#00c46a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    curve.forEach((point, i) => {
      const px = toPx(point.x);
      const py = toPy(point.y);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });
    ctx.stroke();

    // trail
    ctx.strokeStyle = "rgba(255,180,84,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trail.forEach((tx, i) => {
      const px = toPx(tx);
      const py = toPy(landscape.f(tx));
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });
    ctx.stroke();

    // ball
    const bx = toPx(state.x);
    const by = toPy(landscape.f(state.x));
    const ballColor =
      state.status === "reached" ? "#00ff88" : state.status === "diverged" ? "#ff2e88" : "#ffb454";
    ctx.shadowBlur = 14;
    ctx.shadowColor = ballColor;
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [landscape, curve, yBounds, trail, state]);

  const loss = landscape.f(state.x);
  const earnedStars = stars[landscape.id] ?? 0;
  const isTerminal = state.status !== "running";

  return (
    <div className="space-y-5">
      {/* stage selector */}
      <div className="flex flex-wrap items-center gap-2">
        {landscapes.map((stage, index) => (
          <button
            key={stage.id}
            onClick={() => resetStage(index)}
            className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
              index === stageIndex
                ? "border-accent text-accent glow-border"
                : "border-border text-muted hover:border-muted"
            }`}
          >
            {index + 1}. {stage.name}
            {stars[stage.id] ? (
              <span className="text-amber ml-1">{"★".repeat(stars[stage.id] ?? 0)}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="surface-panel border-l-accent border-l-2 p-4">
        <h2 className="text-text font-mono text-sm font-semibold">{landscape.name}</h2>
        <p className="text-muted mt-1 text-xs">{landscape.lesson}</p>
      </div>

      {/* canvas */}
      <div className="surface-panel relative overflow-hidden">
        <canvas ref={canvasRef} className="h-64 w-full sm:h-80" aria-label="loss landscape" />
        {isTerminal ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="surface-panel pointer-events-auto border-l-2 px-5 py-4 text-center"
              style={{
                borderLeftColor:
                  state.status === "reached"
                    ? "var(--accent)"
                    : state.status === "diverged"
                      ? "var(--magenta)"
                      : "var(--amber)",
              }}
            >
              {state.status === "reached" ? (
                <>
                  <p className="text-accent glow-text font-mono text-sm font-semibold">
                    GLOBAL MINIMUM REACHED
                  </p>
                  <p className="text-amber mt-1 font-mono text-lg">
                    {"★".repeat(starsForSteps(landscape, state.steps))}
                    <span className="text-muted-2">
                      {"★".repeat(3 - starsForSteps(landscape, state.steps))}
                    </span>
                  </p>
                  <p className="text-muted mt-1 font-mono text-[11px]">
                    converged in {state.steps} / {landscape.budget} steps
                  </p>
                </>
              ) : state.status === "diverged" ? (
                <p className="text-magenta font-mono text-sm font-semibold">
                  DIVERGED — learning rate too high
                </p>
              ) : (
                <p className="text-amber font-mono text-sm font-semibold">
                  OUT OF STEPS — stuck in a local minimum?
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* HUD */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="surface-panel p-3">
          <p className="text-muted-2">step</p>
          <p className="text-text">
            {state.steps}
            <span className="text-muted-2"> / {landscape.budget}</span>
          </p>
        </div>
        <div className="surface-panel p-3">
          <p className="text-muted-2">loss f(x)</p>
          <p className="text-text">{loss.toFixed(3)}</p>
        </div>
        <div className="surface-panel p-3">
          <p className="text-muted-2">position x</p>
          <p className="text-text">{state.x.toFixed(2)}</p>
        </div>
      </div>

      {/* controls */}
      <div className="space-y-4">
        <SliderRow
          label="learning rate"
          value={lr}
          min={landscape.lrRange[0]}
          max={landscape.lrRange[1]}
          step={0.01}
          onChange={setLr}
        />
        <SliderRow
          label="momentum"
          value={momentum}
          min={0}
          max={0.98}
          step={0.01}
          onChange={setMomentum}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={doStep}
          disabled={isTerminal}
          className="border-accent text-accent hover:bg-accent/10 border px-4 py-2 font-mono text-xs transition-colors disabled:opacity-40"
        >
          step ▸
        </button>
        <button
          onClick={() => setAuto((value) => !value)}
          disabled={isTerminal}
          className="border-border text-muted hover:border-accent hover:text-accent border px-4 py-2 font-mono text-xs transition-colors disabled:opacity-40"
        >
          {auto ? "pause ⏸" : "auto ▶▶"}
        </button>
        <button
          onClick={() => {
            setState(initialState(landscape));
            setTrail([landscape.start]);
            setAuto(false);
          }}
          className="border-border text-muted hover:text-text border px-4 py-2 font-mono text-xs transition-colors"
        >
          reset ↺
        </button>
        {state.status === "reached" && stageIndex < landscapes.length - 1 ? (
          <button
            onClick={() => resetStage(stageIndex + 1)}
            className="border-accent text-accent hover:bg-accent/10 glow-border border px-4 py-2 font-mono text-xs transition-colors"
          >
            next landscape →
          </button>
        ) : null}
      </div>

      <details className="surface-panel border-l-magenta border-l-2 p-3">
        <summary className="text-magenta cursor-pointer font-mono text-xs">hint</summary>
        <p className="text-muted mt-2 text-xs">{landscape.hint}</p>
      </details>

      {earnedStars > 0 ? (
        <p className="text-muted-2 font-mono text-[10px]">
          best on this landscape: {"★".repeat(earnedStars)} — try converging in fewer steps for 3.
        </p>
      ) : null}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-mono text-xs">
        <label className="text-muted">{label}</label>
        <span className="text-accent">{value.toFixed(2)}</span>
      </div>
      <input
        className="temp-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
      />
    </div>
  );
}
