"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Rakshan Hegde — home">
        <span className="brand-mark" aria-hidden="true">
          r<span>h</span>
          <i />
        </span>
        <span>
          Rakshan Hegde<span className="wordmark-slash"> /</span>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        {siteConfig.navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname.startsWith(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <a href="https://github.com/rhegde8" className="header-github">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
