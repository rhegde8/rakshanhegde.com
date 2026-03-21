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
    <div className="mb-6 grid gap-3 border border-[#1e1e1e] bg-[#111111] p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="sm:col-span-2 lg:col-span-1">
        <span className="mb-1 block font-mono text-xs text-[#6b7280]">search</span>
        <input
          value={searchValue}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          type="search"
          placeholder={searchPlaceholder}
          className="w-full border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-sm text-[#e2e8f0] transition-colors outline-none focus:border-[#00ff88]"
        />
      </label>

      {filters.map((filter) => (
        <label key={filter.id}>
          <span className="mb-1 block font-mono text-xs text-[#6b7280]">{filter.label}</span>
          <select
            value={filter.value}
            onChange={(event) => {
              filter.onChange(event.target.value);
            }}
            className="w-full border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-sm text-[#e2e8f0] transition-colors outline-none focus:border-[#00ff88]"
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
