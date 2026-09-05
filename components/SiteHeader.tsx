"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/config/site";

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <header className="border-border bg-bg/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-accent glow-text flex items-center gap-2 font-mono text-sm font-semibold tracking-wide"
        >
          <span aria-hidden="true" className="cursor-blink">
            ▊
          </span>
          rakshan.hegde
        </Link>

        <div className="flex items-center gap-4">
          <span
            className="text-muted-2 hidden items-center gap-1.5 font-mono text-[10px] sm:flex"
            aria-hidden="true"
          >
            <span className="bg-success h-1.5 w-1.5 rounded-full" />
            session: live
          </span>

          <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-1.5">
            {siteConfig.navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-2 py-1 font-mono text-xs lowercase transition-colors sm:text-sm ${
                    isActive ? "text-accent" : "text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
