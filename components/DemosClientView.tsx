"use client";

import { useMemo, useState } from "react";

import { DemoCard } from "@/components/DemoCard";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import type { DemoEntry } from "@/lib/content/types";
import { filterByFuzzySearch } from "@/lib/search/fuzzy";

type DemosClientViewProps = {
  demos: DemoEntry[];
};

export function DemosClientView({ demos }: DemosClientViewProps): React.JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const tagOptions = useMemo(() => {
    return ["all", ...new Set(demos.flatMap((demo) => demo.tags))];
  }, [demos]);

  const filteredDemos = useMemo(() => {
    const fuzzyMatched = filterByFuzzySearch(demos, searchValue, (demo) => [
      demo.title,
      demo.summary,
      ...demo.tags,
      ...(demo.stack ?? []),
      ...(demo.aiFocus ?? []),
    ]);

    return fuzzyMatched
      .filter((demo) => (tagFilter === "all" ? true : demo.tags.includes(tagFilter)))
      .filter((demo) => (statusFilter === "all" ? true : demo.status === statusFilter))
      .sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      );
  }, [demos, searchValue, statusFilter, tagFilter]);

  return (
    <section>
      <SearchAndFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search demos by title, tags, stack, or AI focus"
        filters={[
          {
            id: "tag",
            label: "Tag",
            value: tagFilter,
            onChange: setTagFilter,
            options: tagOptions.map((option) => ({ label: option, value: option })),
          },
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
        ]}
      />

      <p className="text-muted mb-4 text-sm">
        Showing {filteredDemos.length} of {demos.length} demos.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredDemos.map((demo) => (
          <DemoCard key={demo.slug} demo={demo} />
        ))}
      </div>
    </section>
  );
}
