import Link from "next/link";
import { InkStar } from "@/components/InkStar";
import { ScientificFigure } from "@/components/ScientificFigure";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { WritingCard } from "@/components/WritingCard";
import { WritingEmptyState } from "@/components/WritingEmptyState";
import { getAllWritingEntries, getFeaturedProjects } from "@/lib/content/loaders";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Front page",
  description: siteConfig.description,
  path: "/",
});
export default async function HomePage() {
  const [projects, writing] = await Promise.all([getFeaturedProjects(), getAllWritingEntries()]);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="ink-star" aria-hidden="true">
              <InkStar />
            </span>{" "}
            Software engineer. Inquisitive by nature.
          </p>
          <h1>
            Building systems.
            <br />
            <em>
              Finding their
              <br className="desktop-break" /> breaking points.
            </em>
          </h1>
          <p className="hero-description">
            I’m Rakshan. I build software, explore AI, and investigate the cracks in complex
            systems. Curiosity is the common thread.
          </p>
          <Link href="/about" className="underlined-link">
            A little more about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ScientificFigure />
      </section>
      <div className="interest-line">
        <span>The recurring themes</span>
        <p>
          Software <i>·</i> Artificial intelligence <i>·</i> Cybersecurity <i>·</i> The universe
        </p>
        <span aria-hidden="true">
          <InkStar />
        </span>
      </div>
      <section className="projects-section">
        <SectionHeading
          title="Selected work"
          number="01"
          href="/projects"
          linkLabel="All projects"
        />
        <div className="project-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <div className="front-page-bottom">
        <section className="writing-section">
          <SectionHeading
            title="From the notebook"
            number="02"
            href="/writing"
            linkLabel="All writing"
          />
          {writing.length ? (
            writing.slice(0, 2).map((entry) => <WritingCard key={entry.slug} entry={entry} />)
          ) : (
            <WritingEmptyState />
          )}
        </section>
        <aside className="marginalia">
          <p className="eyebrow">In the margins</p>
          <h2>
            A little beyond
            <br />
            <em>the keyboard.</em>
          </h2>
          <p>
            Custom gaming rigs. A homelab that is never quite finished. Physics, quantum mechanics,
            and the occasional rabbit hole about the universe.
          </p>
          <Link href="/about#beyond-work" className="text-link">
            The person behind the projects <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </>
  );
}
