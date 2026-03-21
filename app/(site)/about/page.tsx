import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description: "Who I am, what I think, what I'm building, and what I care about.",
  path: "/about",
});

const experienceTimeline = [
  {
    period: "2024 — present",
    title: "Senior/Staff Engineer — AI Platforms",
    detail:
      "Leading AI productization: reliability standards, evaluation-driven release workflows, and the boring infrastructure work that makes AI systems actually trustworthy in production.",
  },
  {
    period: "2022 — 2024",
    title: "Software Engineer — Full-Stack",
    detail:
      'Built customer-facing systems with production APIs, observability, and delivery-focused iteration. Learned that "it works on my machine" is not a deployment strategy.',
  },
  {
    period: "2019 — 2022",
    title: "Engineer — Backend & Security",
    detail:
      "Started in backend and systems work, developed a bias toward maintainability over cleverness, and picked up security thinking that still shapes how I design anything that touches data or access control.",
  },
];

export default function AboutPage(): React.JSX.Element {
  const isContactFormEnabled = process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === "true";

  return (
    <div className="space-y-14">
      <section className="space-y-6">
        <SectionHeading title="about" />
        <div className="max-w-2xl space-y-5 text-sm leading-7 text-[#6b7280] sm:text-base">
          <p>
            I started out as a security engineer, which means I spent a lot of time thinking about
            how things break before thinking about how to build them. That instinct didn&apos;t
            leave when I moved into AI systems — it just found new problems. LLMs are remarkably
            good at behaving exactly how you didn&apos;t expect in production.
          </p>
          <p>
            Right now I&apos;m deep in eval-driven development: the idea that you shouldn&apos;t
            ship an AI feature you can&apos;t measure, and you shouldn&apos;t measure it with vibes.
            I care a lot about retrieval quality, agent reliability, and the gap between
            &quot;impressive demo&quot; and &quot;system that holds up at 3am.&quot; Most of what I
            build lives in that gap.
          </p>
          <p>
            I&apos;m opinionated about tooling, skeptical of benchmarks that don&apos;t reflect real
            workloads, and allergic to AI products that confidently hallucinate. I think good
            software engineering and good AI engineering are the same thing — you just need to be
            more explicit about your failure modes.
          </p>
          <p>
            Outside of work: I read a lot, run occasionally, and have strong opinions about terminal
            setups. Open to engineering, AI platform, and research collaboration roles.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading title="experience" />
        <ol className="space-y-0">
          {experienceTimeline.map((item, index) => (
            <li key={item.period} className="relative flex gap-6 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#00ff88]" />
                {index < experienceTimeline.length - 1 ? (
                  <div className="mt-2 w-px flex-1 bg-[#1e1e1e]" />
                ) : null}
              </div>
              <div className="space-y-1 pb-1">
                <p className="font-mono text-xs tracking-widest text-[#00ff88]">{item.period}</p>
                <h3 className="font-mono text-sm font-semibold text-[#e2e8f0]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="contact"
          subtitle="Best way to reach me for roles, consulting, or collaboration."
        />
        <div className="flex flex-wrap gap-3 font-mono text-sm">
          <a className="text-[#00ff88] hover:underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          {siteConfig.socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-[#6b7280] transition-colors hover:text-[#e2e8f0]"
            >
              {social.label}
            </a>
          ))}
        </div>

        {isContactFormEnabled ? (
          <ContactForm />
        ) : (
          <p className="border border-[#1e1e1e] bg-[#111111] p-4 font-mono text-sm text-[#6b7280]">
            contact form disabled — reach out by email or social links above.
          </p>
        )}
      </section>
    </div>
  );
}
