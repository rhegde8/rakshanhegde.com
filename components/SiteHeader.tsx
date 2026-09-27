"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { InkStar } from "@/components/InkStar";
import { siteConfig } from "@/lib/config/site";
export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="masthead">
      <div className="edition-line">
        <span>An independent personal journal</span>
        <span className="edition-motto">Perpetually curious. Always building.</span>
      </div>
      <div className="masthead-title">
        <span className="masthead-aside">
          Software &amp; security
          <br />
          <em>With a side of science.</em>
        </span>
        <Link href="/" className="nameplate">
          Rakshan Hegde<span className="nameplate-period">.</span>
        </Link>
        <span className="masthead-seal" aria-hidden="true">
          R
          <span>
            <InkStar />
          </span>
          H
        </span>
      </div>
      <div className="navigation-line">
        <Link
          href="/"
          className="front-page-link"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span aria-hidden="true">↖</span> Front page
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
        <span className="navigation-note">Made of questions &amp; coffee</span>
      </div>
    </header>
  );
}
