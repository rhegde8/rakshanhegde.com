import { ProjectsClientView } from "@/components/ProjectsClientView";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllProjects } from "@/lib/content/loaders";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Projects",
  description: "Software and AI project portfolio, filtered by status, tags, and AI focus.",
  path: "/projects",
});

export default async function ProjectsPage(): Promise<React.JSX.Element> {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Projects"
        subtitle="A mix of product delivery, platform engineering, and applied AI systems."
      />
      <ProjectsClientView projects={projects} />
    </div>
  );
}
