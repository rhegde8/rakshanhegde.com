import { siteConfig } from "@/lib/config/site";
export function ContactLinks() {
  return (
    <div className="contact-links">
      {siteConfig.contactLinks.map((link) => (
        <span key={link.label} aria-disabled="true" title="Link coming soon">
          {link.label} <span aria-hidden="true">↗</span>
        </span>
      ))}
      <span className="contact-note">Links coming soon</span>
    </div>
  );
}
