import { describe, expect, it } from "vitest";

import type { TerminalData } from "@/lib/terminal/commands";
import { completeInput, runCommand } from "@/lib/terminal/commands";

const data: TerminalData = {
  projects: [
    {
      slug: "evalops-control-plane",
      title: "EvalOps Control Plane",
      summary: "A control plane for prompt versions and release gates.",
      status: "ongoing",
    },
  ],
  writing: [
    {
      slug: "rag-eval-metrics",
      title: "Practical RAG Evaluation Metrics",
      summary: "Metrics that correlate with user trust.",
    },
  ],
};

describe("runCommand", () => {
  it("returns help lines", () => {
    const result = runCommand("help", data);
    expect(result.lines.length).toBeGreaterThan(3);
    expect(result.lines[0]?.kind).toBe("accent");
  });

  it("lists both collections for bare ls", () => {
    const texts = runCommand("ls", data).lines.map((line) => line.text);
    expect(texts.some((text) => text.includes("evalops-control-plane"))).toBe(true);
    expect(texts.some((text) => text.includes("rag-eval-metrics"))).toBe(true);
  });

  it("cats an entry summary by slug", () => {
    const result = runCommand("cat rag-eval-metrics", data);
    expect(result.lines[0]?.text).toBe("Practical RAG Evaluation Metrics");
  });

  it("navigates for open with a page name", () => {
    expect(runCommand("open about", data).navigateTo).toBe("/about");
  });

  it("navigates for open with an entry slug", () => {
    expect(runCommand("open evalops-control-plane", data).navigateTo).toBe(
      "/projects/evalops-control-plane",
    );
  });

  it("errors on unknown commands", () => {
    const result = runCommand("frobnicate", data);
    expect(result.lines[0]?.kind).toBe("error");
  });

  it("clears the screen", () => {
    expect(runCommand("clear", data).clear).toBe(true);
  });

  it("returns nothing for empty input", () => {
    expect(runCommand("   ", data).lines).toEqual([]);
  });
});

describe("completeInput", () => {
  it("completes command prefixes", () => {
    expect(completeInput("he", data)).toEqual(["help"]);
  });

  it("completes slugs as arguments", () => {
    expect(completeInput("open eval", data)).toEqual(["evalops-control-plane"]);
  });

  it("returns multiple candidates when ambiguous", () => {
    const candidates = completeInput("c", data);
    expect(candidates).toContain("cat");
    expect(candidates).toContain("clear");
    expect(candidates).toContain("contact");
  });

  it("returns nothing for empty input", () => {
    expect(completeInput("", data)).toEqual([]);
  });
});
