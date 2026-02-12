import { SectionHeading } from "@/components/SectionHeading";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Terms",
  description: "Terms of use for the personal website of Rakshan Hegde.",
  path: "/terms",
});

export default function TermsPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <SectionHeading title="Terms of Use" subtitle="Last updated: Feb 12, 2026" />
      <article className="surface-panel mdx-content text-muted max-w-3xl space-y-4 p-5 text-sm">
        <p>
          By using this website, you agree to use its content for lawful purposes. All project
          descriptions and research notes are provided for informational purposes and may evolve
          over time.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Unless otherwise stated, site content is owned by Rakshan Hegde. Do not republish
          substantial portions without permission.
        </p>
        <h2>No warranty</h2>
        <p>
          This site is provided on an as-is basis. No warranty is provided regarding completeness,
          correctness, or uninterrupted availability.
        </p>
        <h2>External links</h2>
        <p>
          External resources are provided for convenience. This website is not responsible for
          third-party content or policies.
        </p>
      </article>
    </div>
  );
}
