import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-border bg-bg border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <p className="text-muted-2 font-mono text-xs">
          {"// end of context window — "}
          <span className="text-accent">&lt;eos&gt;</span>
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-accent font-mono text-xs transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-muted hover:text-accent font-mono text-xs transition-colors"
          >
            {siteConfig.email}
          </a>
          <a
            href="/writing/rss.xml"
            className="text-muted hover:text-accent font-mono text-xs transition-colors"
          >
            rss
          </a>
        </div>

        <div className="text-muted-2 flex flex-wrap items-center gap-3 font-mono text-xs">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <Link href="/privacy" className="hover:text-text transition-colors">
            privacy
          </Link>
          <Link href="/terms" className="hover:text-text transition-colors">
            terms
          </Link>
          <span className="text-muted-2">·</span>
          <span>built in next.js · deployed on vercel</span>
        </div>
      </div>
    </footer>
  );
}
