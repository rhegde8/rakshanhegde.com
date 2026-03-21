import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import HomePage from "@/app/(site)/page";
import ProjectsPage from "@/app/(site)/projects/page";
import ResearchPage from "@/app/(site)/research/page";

afterEach(() => {
  cleanup();
});

describe("route render smoke", () => {
  it("renders home page hero content", async () => {
    const page = await HomePage();
    render(page);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders projects page with search controls", async () => {
    const page = await ProjectsPage();
    render(page);

    expect(screen.getByRole("searchbox", { name: "search" })).toBeInTheDocument();
  });

  it("renders research entries page", async () => {
    const page = await ResearchPage();
    render(page);

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });
});
