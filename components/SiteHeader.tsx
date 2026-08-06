import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1e1e1e] bg-[#0c0c0c]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-wide text-[#00ff88]">
          rh ~
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-1 font-mono text-xs text-[#6b7280] lowercase transition-colors hover:text-[#e2e8f0] sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
          <kbd
            aria-hidden="true"
            title="Open command palette"
            className="ml-1 hidden border border-[#1e1e1e] px-1.5 py-0.5 font-mono text-[10px] text-[#6b7280] sm:inline-block"
          >
            ⌘K
          </kbd>
        </nav>
      </div>
    </header>
  );
}
