"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { filterByFuzzySearch } from "@/lib/search/fuzzy";
import { cn } from "@/lib/utils/cn";

export type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  href: string;
  keywords: readonly string[];
};

type CommandPaletteProps = {
  items: readonly PaletteItem[];
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

export function CommandPalette({ items }: CommandPaletteProps): React.JSX.Element | null {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const matches = filterByFuzzySearch(items, query, (item) => [
      item.label,
      item.hint,
      ...item.keywords,
    ]);
    return matches.slice(0, 8);
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
        return;
      }
      if (event.key === "/" && !open && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const activeElement = listRef.current?.children[activeIndex];
    activeElement?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const select = useCallback(
    (item: PaletteItem | undefined) => {
      if (!item) {
        return;
      }
      close();
      if (item.href.startsWith("http") || item.href.startsWith("mailto:")) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    },
    [close, router],
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((previous) => Math.min(results.length - 1, previous + 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((previous) => Math.max(0, previous - 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        select(results[activeIndex]);
      }
    },
    [activeIndex, results, select],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[18vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg border border-[#1e1e1e] bg-[#0f0f0f] shadow-none"
      >
        <div className="flex items-center gap-2 border-b border-[#1e1e1e] px-4 py-3">
          <span className="font-mono text-sm text-[#00ff88]">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="jump to…"
            className="w-full bg-transparent font-mono text-sm text-[#e2e8f0] placeholder-[#6b7280] caret-[#00ff88] outline-none"
            aria-label="Search pages and content"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="border border-[#1e1e1e] px-1.5 py-0.5 font-mono text-[10px] text-[#6b7280]">
            esc
          </kbd>
        </div>
        <ul ref={listRef} role="listbox" className="max-h-72 overflow-y-auto py-1">
          {results.length === 0 ? (
            <li className="px-4 py-3 font-mono text-xs text-[#6b7280]">no matches — try `help`</li>
          ) : (
            results.map((item, index) => (
              <li
                key={item.id}
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  "flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2 font-mono text-sm",
                  index === activeIndex
                    ? "bg-[#00ff8810] text-[#00ff88]"
                    : "text-[#e2e8f0] hover:bg-[#111111]",
                )}
                onMouseEnter={() => {
                  setActiveIndex(index);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  select(item);
                }}
              >
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 text-xs text-[#6b7280]">{item.hint}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
