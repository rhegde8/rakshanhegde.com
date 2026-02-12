import { DemosClientView } from "@/components/DemosClientView";
import { JsonLdScript } from "@/components/JsonLdScript";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllDemos } from "@/lib/content/loaders";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildDemoJsonLd } from "@/lib/seo/jsonld";

export const metadata = buildPageMetadata({
  title: "Demos",
  description: "Video-backed demos covering projects, prototypes, and research experiments.",
  path: "/demos",
});

export default async function DemosPage(): Promise<React.JSX.Element> {
  const demos = await getAllDemos();

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Demos"
        subtitle="Short walkthroughs of production concepts, experimental builds, and applied AI workflows."
      />
      <JsonLdScript data={demos.map((demo) => buildDemoJsonLd(demo))} />
      <DemosClientView demos={demos} />
    </div>
  );
}
