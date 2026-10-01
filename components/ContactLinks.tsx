import { siteConfig } from "@/lib/config/site";
export function ContactLinks() {
  return (
    <div className="contact-links">
      {siteConfig.contactLinks
        .filter((link) => link.href)
        .map((link) => (
          <a key={link.label} href={link.href}>
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
    </div>
  );
}
