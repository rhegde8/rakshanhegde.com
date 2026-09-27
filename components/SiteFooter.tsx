import { ContactLinks } from "@/components/ContactLinks";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="footer-signature">
          Stay curious<span>.</span>
        </p>
        <ContactLinks />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rakshan Hegde</span>
        <span>Built with care. Best read with curiosity.</span>
        <a href="/writing/rss.xml">
          RSS <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
