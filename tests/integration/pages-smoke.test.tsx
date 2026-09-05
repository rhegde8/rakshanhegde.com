import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HomePage from "@/app/(site)/page";
import LabPage from "@/app/(site)/lab/page";
import ProjectsPage from "@/app/(site)/projects/page";
import WritingPage from "@/app/(site)/writing/page";

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

  it("renders writing entries page", async () => {
    const page = await WritingPage();
    render(page);

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it("renders the lab index with experiments", () => {
    render(LabPage());

    expect(screen.getByRole("heading", { name: /jailbreak the model/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /gradient descent, by hand/i })).toBeInTheDocument();
  });
});
