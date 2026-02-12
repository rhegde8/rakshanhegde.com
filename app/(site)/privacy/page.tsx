import { SectionHeading } from "@/components/SectionHeading";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy",
  description: "Privacy policy for the personal website of Rakshan Hegde.",
  path: "/privacy",
});

export default function PrivacyPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <SectionHeading title="Privacy Policy" subtitle="Last updated: Feb 12, 2026" />
      <article className="surface-panel mdx-content text-muted max-w-3xl space-y-4 p-5 text-sm">
        <p>
          This website collects minimal operational data to improve reliability and user experience.
          No sensitive personal information is sold or shared for advertising.
        </p>
        <h2>Data we may collect</h2>
        <ul>
          <li>Basic analytics events (page views, device class, performance signals)</li>
          <li>Information you provide through the contact form, if enabled</li>
        </ul>
        <h2>How data is used</h2>
        <ul>
          <li>Operate and improve this website</li>
          <li>Respond to direct inquiries</li>
          <li>Monitor service health and abuse</li>
        </ul>
        <h2>Retention and rights</h2>
        <p>
          Data is retained only as long as required for legitimate operational purposes. You can
          request deletion of contact-form messages by emailing the address listed on the About
          page.
        </p>
      </article>
    </div>
  );
}
