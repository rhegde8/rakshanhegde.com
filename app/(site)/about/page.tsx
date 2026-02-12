import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { TagPill } from "@/components/TagPill";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description: "Professional profile, skills, experience highlights, and contact options.",
  path: "/about",
});

const skillsByCategory: Record<string, string[]> = {
  "Languages & Frameworks": ["typescript", "python", "next.js", "react", "node.js", "rust"],
  "AI & Data Systems": [
    "rag",
    "agent orchestration",
    "evaluation pipelines",
    "prompt governance",
    "vector search",
  ],
  "Platform & Delivery": ["aws", "postgres", "docker", "ci/cd", "observability", "security basics"],
};

const experienceHighlights = [
  {
    period: "2024 - Present",
    title: "Senior/Staff Engineer (AI Platforms)",
    detail:
      "Leading AI productization, reliability standards, and evaluation-driven release workflows.",
  },
  {
    period: "2022 - 2024",
    title: "Software Engineer (Full-Stack)",
    detail:
      "Built customer-facing systems with production APIs, telemetry, and delivery-focused iteration.",
  },
  {
    period: "2019 - 2022",
    title: "Engineer (Backend & Systems)",
    detail:
      "Developed scalable backend services and data workflows with a strong focus on maintainability.",
  },
];

export default function AboutPage(): React.JSX.Element {
  const isContactFormEnabled = process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === "true";

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <SectionHeading
          title="About"
          subtitle="Engineer focused on turning complex AI ideas into reliable products with measurable impact."
        />
        <p className="text-muted max-w-3xl text-sm leading-7 sm:text-base">
          I design and ship production software with a strong interest in AI-native systems. My work
          centers on trustworthy delivery: clear architecture, explicit quality gates, and practical
          iteration loops that help teams move fast without losing reliability.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Skills" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <article key={category} className="surface-panel space-y-3 p-4">
              <h3 className="text-accent-1 font-mono text-sm font-semibold">{category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <TagPill key={skill} label={skill} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Experience Highlights" />
        <ol className="space-y-3">
          {experienceHighlights.map((item) => (
            <li key={item.period} className="surface-panel p-4">
              <p className="text-accent-2 font-mono text-xs tracking-wide uppercase">
                {item.period}
              </p>
              <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Contact"
          subtitle="Best way to reach me for roles, consulting, or collaboration."
        />
        <div className="text-muted flex flex-wrap gap-3 text-sm">
          <a className="text-accent-1 hover:underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          {siteConfig.socialLinks.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {social.label}
            </a>
          ))}
        </div>

        {isContactFormEnabled ? (
          <ContactForm />
        ) : (
          <p className="surface-panel text-muted p-4 text-sm">
            Contact form is currently disabled. Reach out by email or social links above.
          </p>
        )}
      </section>
    </div>
  );
}
