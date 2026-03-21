import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-border/70 bg-panel/50 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div className="text-muted flex flex-wrap items-center gap-3 text-sm">
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-1 rounded-md px-2 py-1 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-accent-2 rounded-md px-2 py-1"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="text-muted flex flex-wrap items-center gap-3 text-xs">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <Link href="/privacy" className="hover:text-text">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-text">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
