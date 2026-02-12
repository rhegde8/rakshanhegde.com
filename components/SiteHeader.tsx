import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="border-border/70 bg-bg/85 sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-accent-1 font-mono text-sm font-semibold tracking-wide">
          {siteConfig.shortName}.dev
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted hover:text-text rounded-md px-2 py-1 text-xs transition-colors sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
