"use client";

import { useMemo, useState } from "react";

import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { WritingCard } from "@/components/WritingCard";
import type { WritingEntry } from "@/lib/content/types";
import { filterByFuzzySearch } from "@/lib/search/fuzzy";

type WritingClientViewProps = {
  entries: WritingEntry[];
};

export function WritingClientView({ entries }: WritingClientViewProps): React.JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  const tagOptions = useMemo(() => {
    return ["all", ...new Set(entries.flatMap((entry) => entry.tags))];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const fuzzyMatched = filterByFuzzySearch(entries, searchValue, (entry) => [
      entry.title,
      entry.summary,
      ...(entry.hypothesis ? [entry.hypothesis] : []),
      ...(entry.findings ? [entry.findings] : []),
      ...entry.tags,
    ]);

    return fuzzyMatched
      .filter((entry) => (tagFilter === "all" ? true : entry.tags.includes(tagFilter)))
      .sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      );
  }, [entries, searchValue, tagFilter]);

  return (
    <section>
      <SearchAndFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search essays by title, tags, or summary"
        filters={[
          {
            id: "tag",
            label: "Tag",
            value: tagFilter,
            onChange: setTagFilter,
            options: tagOptions.map((option) => ({ label: option, value: option })),
          },
        ]}
      />

      <p className="text-muted mb-4 font-mono text-xs">
        showing {filteredEntries.length} of {entries.length} entries.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredEntries.map((entry) => (
          <WritingCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  );
}
