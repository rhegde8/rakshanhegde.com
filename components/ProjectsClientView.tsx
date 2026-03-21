"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/ProjectCard";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import type { ProjectEntry } from "@/lib/content/types";
import { filterByFuzzySearch } from "@/lib/search/fuzzy";

type ProjectsClientViewProps = {
  projects: ProjectEntry[];
};

export function ProjectsClientView({ projects }: ProjectsClientViewProps): React.JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [aiFocusFilter, setAiFocusFilter] = useState("all");

  const tagOptions = useMemo(() => {
    return ["all", ...new Set(projects.flatMap((project) => project.tags))];
  }, [projects]);

  const aiFocusOptions = useMemo(() => {
    return ["all", ...new Set(projects.flatMap((project) => project.aiFocus))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const fuzzyMatched = filterByFuzzySearch(projects, searchValue, (project) => [
      project.title,
      project.summary,
      ...project.tags,
      ...project.stack,
      ...project.aiFocus,
    ]);

    return fuzzyMatched
      .filter((project) => (statusFilter === "all" ? true : project.status === statusFilter))
      .filter((project) => (tagFilter === "all" ? true : project.tags.includes(tagFilter)))
      .filter((project) =>
        aiFocusFilter === "all" ? true : project.aiFocus.includes(aiFocusFilter),
      )
      .sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      );
  }, [aiFocusFilter, projects, searchValue, statusFilter, tagFilter]);

  return (
    <section>
      <SearchAndFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search projects by title, stack, tags, or AI focus"
        filters={[
          {
            id: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All", value: "all" },
              { label: "Ongoing", value: "ongoing" },
              { label: "Completed", value: "completed" },
            ],
          },
          {
            id: "tag",
            label: "Tag",
            value: tagFilter,
            onChange: setTagFilter,
            options: tagOptions.map((option) => ({ label: option, value: option })),
          },
          {
            id: "ai-focus",
            label: "AI Focus",
            value: aiFocusFilter,
            onChange: setAiFocusFilter,
            options: aiFocusOptions.map((option) => ({ label: option, value: option })),
          },
        ]}
      />

      <p className="mb-4 font-mono text-xs text-[#6b7280]">
        showing {filteredProjects.length} of {projects.length} projects.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
