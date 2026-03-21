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
    "Rakshan Hegde — security engineer turned AI systems builder. Production-grade software with real opinions on reliability and eval-driven development.",
  path: "/",
});

export default async function HomePage(): Promise<React.JSX.Element> {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="space-y-16 sm:space-y-20">
      <MotionReveal>
        <section className="space-y-6 pt-6 sm:pt-10">
          <p className="font-mono text-xs tracking-[0.25em] text-[#00ff88]">{"// rakshan hegde"}</p>
          <h1 className="font-mono text-3xl leading-tight font-semibold text-[#e2e8f0] sm:text-5xl">
            builds things that
            <br className="hidden sm:block" /> actually work.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#6b7280] sm:text-base">
            {siteConfig.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/projects"
              className="px-4 py-2 font-mono text-sm font-normal text-[#00ff88] transition-colors hover:bg-[#00ff8810]"
              style={{ border: "0.5px solid #00ff88" }}
            >
              view projects
            </Link>
            <Link
              href="/research"
              className="border border-[#2a2a2a] px-4 py-2 font-mono text-sm text-[#e2e8f0] transition-colors hover:border-[#00ff88] hover:text-[#00ff88]"
            >
              read research
            </Link>
            <Link
              href="/about"
              className="border border-[#2a2a2a] px-4 py-2 font-mono text-sm text-[#6b7280] transition-colors hover:border-[#1e1e1e] hover:text-[#e2e8f0]"
            >
              about
            </Link>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <TerminalPanel lines={siteConfig.terminalIntro} />
      </MotionReveal>

      {featuredProjects.length > 0 ? (
        <MotionReveal delay={0.12}>
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
              <Link href="/projects" className="font-mono text-xs text-[#00ff88] hover:underline">
                all projects →
              </Link>
            </div>
          </section>
        </MotionReveal>
      ) : null}
    </div>
  );
}
