import { ContactLinks } from "@/components/ContactLinks";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="eyebrow">Always a work in progress</p>
          <p className="footer-signature">
            Good things start with a question<span>.</span>
          </p>
        </div>
        <ContactLinks />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rakshan Hegde</span>
        <span>Built with curiosity. New York, NY.</span>
        <a href="/writing/rss.xml">
          RSS <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
