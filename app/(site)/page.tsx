import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SystemsExplorer } from "@/components/SystemsExplorer";
import { WritingCard } from "@/components/WritingCard";
import { getAllWritingEntries, getFeaturedProjects } from "@/lib/content/loaders";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Personal systems lab",
  description: siteConfig.description,
  path: "/",
});
export default async function HomePage() {
  const [projects, writing] = await Promise.all([getFeaturedProjects(), getAllWritingEntries()]);
  return (
    <>
      <div className="lab-intro">
        <p className="eyebrow">
          <span className="status-dot" /> A personal systems lab
        </p>
        <span className="lab-location">
          New York, NY <span aria-hidden="true">↗</span>
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            I build software,
            <br />
            experiment with <span className="accent-text">AI,</span>
            <br />
            and figure out how <span className="hero-outline">systems break.</span>
          </h1>
          <p className="hero-description">
            I’m Rakshan. A security engineer with a builder’s itch. This is where I share the
            systems I’m building, the decisions behind them, and what I’m learning along the way.
          </p>
          <div className="hero-actions">
            <Link href="#selected-work" className="button-primary">
              Explore the work <span aria-hidden="true">↘</span>
            </Link>
            <Link href="/about" className="text-link">
              A little about me <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-note">
            <span aria-hidden="true">↳</span>
            <p>
              Currently building <Link href="/projects/sealcheck">SealCheck</Link>
              <br />
              <span>Sandbox security, before the model enters.</span>
            </p>
          </div>
        </div>
        <SystemsExplorer
          projects={projects.map(({ slug, title, status }) => ({ slug, title, status }))}
        />
      </section>
      <div className="interest-line">
        <span>The common threads</span>
        <p>
          <span>01 / Software</span>
          <span>02 / Artificial intelligence</span>
          <span>03 / Cybersecurity</span>
        </p>
        <span aria-hidden="true">[ + ]</span>
      </div>
      <section className="projects-section" id="selected-work">
        <SectionHeading
          title="Ideas, put to work."
          number="01"
          href="/projects"
          linkLabel="All projects"
        />
        <p className="section-intro">
          From production security platforms to experiments on my own machine.
        </p>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <section className="explorations-section">
        <SectionHeading title="Still following the questions." number="02" />
        <div className="explorations-grid">
          <div>
            <p className="eyebrow">Currently exploring</p>
            <h3>
              Where autonomy
              <br />
              meets boundaries.
            </h3>
            <p>
              Agent orchestration. Sandbox isolation. The interesting space between giving a model
              useful tools and deciding what it should be able to do.
            </p>
            <Link href="/projects/multi-agent-development-harness" className="text-link">
              Inside my agent harness <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div>
            <p className="eyebrow">Away from the day job</p>
            <h3>
              A homelab.
              <br />
              An open-ended question.
            </h3>
            <p>
              Custom gaming rigs, a homelab that is never quite finished, and rabbit holes in
              physics and quantum mechanics. I like understanding how the pieces fit.
            </p>
            <Link href="/about#beyond-work" className="text-link">
              The person behind the projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      {writing.length > 0 && (
        <section className="writing-section">
          <SectionHeading
            title="Notes from the lab."
            number="03"
            href="/writing"
            linkLabel="All writing"
          />
          {writing.slice(0, 2).map((entry) => (
            <WritingCard key={entry.slug} entry={entry} />
          ))}
        </section>
      )}
    </>
  );
}
