import { JsonLdScript } from "@/components/JsonLdScript";
import { ResearchClientView } from "@/components/ResearchClientView";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllResearchEntries } from "@/lib/content/loaders";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildResearchArticleJsonLd } from "@/lib/seo/jsonld";

export const metadata = buildPageMetadata({
  title: "Research",
  description: "Research notes, hypotheses, findings, and experiments around AI systems.",
  path: "/research",
});

export default async function ResearchPage(): Promise<React.JSX.Element> {
  const entries = await getAllResearchEntries();

  return (
    <div className="space-y-6">
      <SectionHeading
        title="research log"
        subtitle="Irregular notes with hypotheses, experiment logs, and findings from real AI system work."
      />
      <JsonLdScript data={entries.map((entry) => buildResearchArticleJsonLd(entry))} />
      <ResearchClientView entries={entries} />
    </div>
  );
}
