import { JsonLdScript } from "@/components/JsonLdScript";
import { SectionHeading } from "@/components/SectionHeading";
import { WritingClientView } from "@/components/WritingClientView";
import { getAllWritingEntries } from "@/lib/content/loaders";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Writing",
  description:
    "Essays and research notes on the future of AI, cybersecurity, and what it takes to ship systems that hold up.",
  path: "/writing",
});

export default async function WritingPage(): Promise<React.JSX.Element> {
  const entries = await getAllWritingEntries();

  return (
    <div className="space-y-6">
      <SectionHeading
        title="writing"
        subtitle="Essays on where AI and security are heading, plus research notes from real system work."
      />
      <JsonLdScript data={entries.map((entry) => buildArticleJsonLd(entry))} />
      <WritingClientView entries={entries} />
    </div>
  );
}
