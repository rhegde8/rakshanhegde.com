import { describe, expect, it } from "vitest";

import { bioVariants, heroHeadline, pickBioVariant, temperatureBand } from "@/lib/config/voice";

describe("temperature bio sampling", () => {
  it("picks the deterministic variant at T=0", () => {
    expect(pickBioVariant(0).label).toBe("deterministic");
  });

  it("picks the hottest variant at T=2", () => {
    expect(pickBioVariant(2)).toBe(bioVariants[bioVariants.length - 1]);
  });

  it("moves through variants monotonically as temperature rises", () => {
    const seen = [0, 0.5, 1.0, 1.4, 1.8].map((temp) => pickBioVariant(temp).minTemp);
    const sorted = [...seen].sort((a, b) => a - b);
    expect(seen).toEqual(sorted);
  });

  it("classifies temperature bands at the boundaries", () => {
    expect(temperatureBand(0)).toBe("cold");
    expect(temperatureBand(0.9)).toBe("warm");
    expect(temperatureBand(1.7)).toBe("hot");
  });

  it("builds a headline from the hero tokens", () => {
    expect(heroHeadline).toContain("survive");
    expect(heroHeadline.split(" ").length).toBeGreaterThan(4);
  });
});
