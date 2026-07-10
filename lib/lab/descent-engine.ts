/**
 * DESCENT — a gradient-descent arcade.
 *
 * The player IS the optimizer. Each stage is a 1-D loss landscape; the player
 * picks a learning rate and momentum and rolls a single parameter downhill,
 * trying to land in the GLOBAL minimum within a step budget. Too much learning
 * rate and the update diverges; too little momentum and you get trapped in a
 * local minimum. Pure math so it's deterministic and testable.
 */

export type Landscape = {
  id: string;
  name: string;
  lesson: string;
  hint: string;
  f: (x: number) => number;
  domain: [number, number];
  start: number;
  globalMinX: number;
  tolerance: number;
  budget: number;
  lrRange: [number, number];
  defaultLr: number;
  defaultMomentum: number;
};

export type DescentState = {
  x: number;
  velocity: number;
  steps: number;
  status: "running" | "reached" | "diverged" | "exhausted";
};

export const landscapes: Landscape[] = [
  {
    id: "bowl",
    name: "THE BOWL",
    lesson: "Convex. The only way to lose is a learning rate so big the update explodes.",
    hint: "A learning rate near 1.0 walks straight in. Push past 2.0 and each step overshoots harder than the last — that's divergence.",
    f: (x) => 0.5 * x * x,
    domain: [-6, 6],
    start: -4.8,
    globalMinX: 0,
    tolerance: 0.3,
    budget: 30,
    lrRange: [0, 3],
    defaultLr: 0.6,
    defaultMomentum: 0,
  },
  {
    id: "twin-valleys",
    name: "TWIN VALLEYS",
    lesson: "Two minima. Plain descent traps you in the nearer, shallower one.",
    hint: "You'll fall into the right-hand valley first. Add momentum (~0.8) so the ball carries over the ridge into the deeper valley on the left.",
    f: (x) => 0.05 * x ** 4 - 0.5 * x * x + 0.15 * x + 2,
    domain: [-5, 5],
    start: 3.2,
    globalMinX: -2.33,
    tolerance: 0.4,
    budget: 70,
    lrRange: [0, 1],
    defaultLr: 0.15,
    defaultMomentum: 0.7,
  },
  {
    id: "the-comb",
    name: "THE COMB",
    lesson: "A field of local minima around one true basin. Balance is everything.",
    hint: "Too little momentum and you stick in the first notch; too much and you rattle past the center forever. Aim for a small learning rate and momentum around 0.85.",
    f: (x) => 0.08 * x * x - Math.cos(2.5 * x),
    domain: [-7, 7],
    start: 5.6,
    globalMinX: 0,
    tolerance: 0.3,
    budget: 110,
    lrRange: [0, 0.6],
    defaultLr: 0.08,
    defaultMomentum: 0.8,
  },
];

const GRAD_H = 1e-3;

export function gradient(f: (x: number) => number, x: number): number {
  return (f(x + GRAD_H) - f(x - GRAD_H)) / (2 * GRAD_H);
}

export function initialState(landscape: Landscape): DescentState {
  return { x: landscape.start, velocity: 0, steps: 0, status: "running" };
}

export type StepParams = { learningRate: number; momentum: number };

export function stepDescent(
  landscape: Landscape,
  state: DescentState,
  params: StepParams,
): DescentState {
  if (state.status !== "running") {
    return state;
  }

  const grad = gradient(landscape.f, state.x);
  const velocity = params.momentum * state.velocity - params.learningRate * grad;
  const x = state.x + velocity;
  const steps = state.steps + 1;

  const [min, max] = landscape.domain;
  if (!Number.isFinite(x) || x < min - 0.5 || x > max + 0.5) {
    return { x: state.x, velocity, steps, status: "diverged" };
  }

  if (Math.abs(x - landscape.globalMinX) <= landscape.tolerance) {
    return { x, velocity, steps, status: "reached" };
  }

  if (steps >= landscape.budget) {
    return { x, velocity, steps, status: "exhausted" };
  }

  return { x, velocity, steps, status: "running" };
}

/** Star rating for a solved stage: fewer steps = more stars. */
export function starsForSteps(landscape: Landscape, steps: number): number {
  const fraction = steps / landscape.budget;
  if (fraction <= 0.4) {
    return 3;
  }
  if (fraction <= 0.7) {
    return 2;
  }
  return 1;
}

/** Run a whole stage headlessly — used by tests and the "auto-run" button. */
export function simulate(
  landscape: Landscape,
  params: StepParams,
  maxSteps = landscape.budget,
): DescentState {
  let state = initialState(landscape);
  for (let i = 0; i < maxSteps && state.status === "running"; i += 1) {
    state = stepDescent(landscape, state, params);
  }
  return state;
}
