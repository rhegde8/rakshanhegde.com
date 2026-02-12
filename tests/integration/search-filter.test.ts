import { describe, expect, it } from "vitest";

import { filterByFuzzySearch, fuzzyScore } from "@/lib/search/fuzzy";

type SearchItem = {
  title: string;
  tags: string[];
  status: "ongoing" | "completed";
};

const items: SearchItem[] = [
  { title: "RAG Knowledge Orchestrator", tags: ["rag", "retrieval"], status: "completed" },
  { title: "Agent Observability Platform", tags: ["agents", "observability"], status: "ongoing" },
  { title: "Local Inference Workbench", tags: ["local-llm", "benchmarks"], status: "completed" },
];

describe("fuzzy search scoring", () => {
  it("scores stronger for closer matches", () => {
    const exact = fuzzyScore("rag", "rag knowledge orchestrator");
    const loose = fuzzyScore("rag", "agent observability platform");

    expect(exact).toBeGreaterThan(loose);
  });
});

describe("search and filter logic", () => {
  it("returns fuzzy matches against title and tags", () => {
    const results = filterByFuzzySearch(items, "obsrv", (item) => [item.title, ...item.tags]);
    expect(results.map((item) => item.title)).toContain("Agent Observability Platform");
  });

  it("can be composed with status filters", () => {
    const searchResults = filterByFuzzySearch(items, "work", (item) => [item.title, ...item.tags]);
    const completedOnly = searchResults.filter((item) => item.status === "completed");
    const firstResult = completedOnly[0];

    expect(completedOnly).toHaveLength(1);
    expect(firstResult?.title).toBe("Local Inference Workbench");
  });
});
