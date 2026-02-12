import Link from "next/link";

import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TerminalPanel } from "@/components/TerminalPanel";
import { getFeaturedProjects } from "@/lib/content/loaders";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Home",
  description:
    "Rakshan Hegde - software engineer building AI-native systems, reliable products, and applied research.",
  path: "/",
});

export default async function HomePage(): Promise<React.JSX.Element> {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="space-y-14 sm:space-y-16">
      <MotionReveal>
        <section className="surface-panel relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,207,255,0.17),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(187,154,247,0.14),transparent_50%)]" />
          <div className="relative space-y-4">
            <p className="text-accent-2 font-mono text-xs tracking-[0.2em]">RAKSHAN HEGDE</p>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              {siteConfig.role}
            </h1>
            <p className="text-muted max-w-2xl text-sm sm:text-lg">{siteConfig.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/projects"
                className="bg-accent-1 text-bg rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                View Projects
              </Link>
              <Link
                href="/research"
                className="border-accent-2/50 text-accent-2 hover:bg-accent-2/10 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
              >
                Read Research
              </Link>
              <Link
                href="/demos"
                className="border-border text-text hover:bg-panel rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
              >
                Explore Demos
              </Link>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <TerminalPanel lines={siteConfig.terminalIntro} />
      </MotionReveal>

      <MotionReveal delay={0.12}>
        <section>
          <SectionHeading
            title="Featured Projects"
            subtitle="Production-facing work spanning agent systems, retrieval, and AI reliability."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.16}>
        <section>
          <SectionHeading
            title="AI Signals"
            subtitle="Hands-on capabilities I use to build resilient AI products."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {siteConfig.aiSignals.map((signal) => (
              <li key={signal} className="surface-panel border-accent-1/20 text-muted p-4 text-sm">
                <span className="text-accent-1 mr-2">#</span>
                {signal}
              </li>
            ))}
          </ul>
        </section>
      </MotionReveal>
    </div>
  );
}
