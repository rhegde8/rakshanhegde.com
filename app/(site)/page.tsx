import Link from "next/link";

import { GenerativeHero } from "@/components/hero/GenerativeHero";
import { TemperatureBio } from "@/components/hero/TemperatureBio";
import { ExperimentCard } from "@/components/lab/ExperimentCard";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/config/site";
import { getAllWritingEntries, getFeaturedProjects } from "@/lib/content/loaders";
import { experiments } from "@/lib/lab/experiments";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/date";

export const metadata = buildPageMetadata({
  title: "Home",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage(): Promise<React.JSX.Element> {
  const [featuredProjects, writingEntries] = await Promise.all([
    getFeaturedProjects(),
    getAllWritingEntries(),
  ]);
  const featuredExperiments = experiments.slice(0, 2);
  const latestWriting = writingEntries.slice(0, 3);

  return (
    <div className="space-y-20 sm:space-y-28">
      <div className="space-y-14">
        <GenerativeHero />

        <MotionReveal delay={0.05}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lab"
              className="border-accent text-accent hover:bg-accent/10 glow-border border px-4 py-2 font-mono text-sm transition-colors"
            >
              enter the lab →
            </Link>
            <Link
              href="/writing"
              className="border-border text-text hover:border-accent hover:text-accent border px-4 py-2 font-mono text-sm transition-colors"
            >
              read the writing
            </Link>
            <Link
              href="/projects"
              className="border-border text-muted hover:text-text border px-4 py-2 font-mono text-sm transition-colors"
            >
              see projects
            </Link>
          </div>
        </MotionReveal>
      </div>

      <MotionReveal delay={0.05}>
        <div id="temperature" className="scroll-mt-24">
          <TemperatureBio />
        </div>
      </MotionReveal>

      <MotionReveal delay={0.05}>
        <section>
          <SectionHeading
            title="the lab"
            subtitle="Two AI experiments you can play right now — a prompt-injection jailbreak game and a gradient-descent arcade. Both run entirely in your browser."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredExperiments.map((experiment) => (
              <ExperimentCard key={experiment.slug} experiment={experiment} />
            ))}
          </div>
          <div className="mt-6">
            <Link href="/lab" className="text-accent font-mono text-xs hover:underline">
              all experiments →
            </Link>
          </div>
        </section>
      </MotionReveal>

      {featuredProjects.length > 0 ? (
        <MotionReveal delay={0.05}>
          <section>
            <SectionHeading
              title="selected projects"
              subtitle="Production-facing work spanning agent systems, retrieval, and AI reliability."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
            <div className="mt-6">
              <Link href="/projects" className="text-accent font-mono text-xs hover:underline">
                all projects →
              </Link>
            </div>
          </section>
        </MotionReveal>
      ) : null}

      {latestWriting.length > 0 ? (
        <MotionReveal delay={0.05}>
          <section>
            <SectionHeading
              title="recent writing"
              subtitle="Essays on the future of AI and cybersecurity — and notes from real system work."
            />
            <ul className="divide-border border-border divide-y border-y">
              {latestWriting.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/writing/${entry.slug}`}
                    className="group hover:bg-panel-2 flex flex-col gap-1 py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <div className="space-y-1">
                      <h3 className="text-text group-hover:text-accent font-mono text-sm font-semibold">
                        {entry.title}
                      </h3>
                      <p className="text-muted max-w-2xl text-xs">{entry.summary}</p>
                    </div>
                    <span className="text-muted-2 shrink-0 font-mono text-[10px]">
                      {formatDate(entry.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/writing" className="text-accent font-mono text-xs hover:underline">
                all writing →
              </Link>
            </div>
          </section>
        </MotionReveal>
      ) : null}

      <MotionReveal delay={0.05}>
        <section className="surface-panel border-l-accent border-l-2 p-6 sm:p-8">
          <h2 className="font-display text-text text-2xl font-semibold sm:text-3xl">
            Building something at the edge of AI and security?
          </h2>
          <p className="text-muted mt-3 max-w-2xl text-sm sm:text-base">
            I&apos;m open to senior engineering and AI platform roles, and I like talking to people
            who care about shipping AI that holds up under real attackers and real load.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="border-accent text-accent hover:bg-accent/10 border px-4 py-2 font-mono text-sm transition-colors"
            >
              {siteConfig.email}
            </a>
            <Link
              href="/about"
              className="border-border text-muted hover:border-accent hover:text-accent border px-4 py-2 font-mono text-sm transition-colors"
            >
              more about me →
            </Link>
          </div>
        </section>
      </MotionReveal>
    </div>
  );
}
