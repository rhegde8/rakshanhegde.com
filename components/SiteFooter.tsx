import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-[#1e1e1e] bg-[#0c0c0c]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-[#6b7280] transition-colors hover:text-[#00ff88]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-mono text-xs text-[#6b7280] transition-colors hover:text-[#00ff88]"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#6b7280]">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <Link href="/privacy" className="transition-colors hover:text-[#e2e8f0]">
            privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-[#e2e8f0]">
            terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
