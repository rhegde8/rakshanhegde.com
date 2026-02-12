"use client";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFilter = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

type SearchAndFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: SelectFilter[];
};

export function SearchAndFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
}: SearchAndFilterBarProps): React.JSX.Element {
  return (
    <div className="surface-panel mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="sm:col-span-2 lg:col-span-1">
        <span className="text-muted mb-1 block font-mono text-xs">Search</span>
        <input
          value={searchValue}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          type="search"
          placeholder={searchPlaceholder}
          className="border-border bg-bg ring-accent-1/40 w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2"
        />
      </label>

      {filters.map((filter) => (
        <label key={filter.id}>
          <span className="text-muted mb-1 block font-mono text-xs">{filter.label}</span>
          <select
            value={filter.value}
            onChange={(event) => {
              filter.onChange(event.target.value);
            }}
            className="border-border bg-bg ring-accent-1/40 w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
