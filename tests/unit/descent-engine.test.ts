import { describe, expect, it } from "vitest";

import {
  gradient,
  initialState,
  landscapes,
  simulate,
  starsForSteps,
  stepDescent,
} from "@/lib/lab/descent-engine";

describe("descent engine", () => {
  it("computes a near-zero gradient at a minimum of the bowl", () => {
    const bowl = landscapes[0]!;
    expect(Math.abs(gradient(bowl.f, 0))).toBeLessThan(1e-2);
  });

  it("converges to the global minimum on the bowl with a sane learning rate", () => {
    const bowl = landscapes[0]!;
    const result = simulate(bowl, { learningRate: 0.6, momentum: 0 });
    expect(result.status).toBe("reached");
    expect(Math.abs(result.x - bowl.globalMinX)).toBeLessThanOrEqual(bowl.tolerance);
  });

  it("diverges on the bowl when the learning rate is too high", () => {
    const bowl = landscapes[0]!;
    const result = simulate(bowl, { learningRate: 2.6, momentum: 0 });
    expect(result.status).toBe("diverged");
  });

  it("does not mutate a terminal state", () => {
    const bowl = landscapes[0]!;
    const reached = { ...initialState(bowl), status: "reached" as const };
    const next = stepDescent(bowl, reached, { learningRate: 0.5, momentum: 0 });
    expect(next).toBe(reached);
  });

  it("awards three stars for fast convergence and fewer for slow", () => {
    const bowl = landscapes[0]!;
    expect(starsForSteps(bowl, 1)).toBe(3);
    expect(starsForSteps(bowl, Math.ceil(bowl.budget * 0.6))).toBe(2);
    expect(starsForSteps(bowl, bowl.budget)).toBe(1);
  });

  it("exposes three landscapes with strictly increasing budgets", () => {
    expect(landscapes).toHaveLength(3);
    expect(landscapes[0]!.budget).toBeLessThan(landscapes[1]!.budget);
    expect(landscapes[1]!.budget).toBeLessThan(landscapes[2]!.budget);
  });
});
