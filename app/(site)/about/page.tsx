import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "A model card for the human behind this site — background, capabilities, and known limitations.",
  path: "/about",
});

const specSheet = [
  { key: "architecture", value: "human · security-pretrained · AI-fine-tuned" },
  { key: "base location", value: siteConfig.location },
  { key: "context window", value: "~7 years of production engineering" },
  { key: "primary objective", value: "ship AI systems that survive contact with reality" },
  { key: "status", value: "open to senior eng / AI platform roles" },
];

const capabilities = [
  {
    title: "AI systems & evals",
    detail:
      "Eval-driven development, retrieval quality, agent reliability, and the observability that turns 'the model did something weird' into an actual root cause.",
  },
  {
    title: "Security engineering",
    detail:
      "Threat modeling, prompt-injection and agent abuse, privilege separation, and designing systems on the assumption that the model will be compromised.",
  },
  {
    title: "Production software",
    detail:
      "TypeScript, Node, Next.js, data pipelines, and the unglamorous infrastructure that decides whether an AI feature is trustworthy at 3am.",
  },
];

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

const limitations = [
  "Allergic to AI products that confidently hallucinate. Will ask what your eval suite looks like.",
  "Skeptical of benchmarks that don't reflect real workloads. Will want to see the failure cases.",
  "Strong opinions about terminal setups. Non-negotiable.",
];

export default function AboutPage(): React.JSX.Element {
  const isContactFormEnabled = process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === "true";

  return (
    <div className="space-y-14">
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-accent font-mono text-xs tracking-[0.25em]">{"// model card"}</p>
          <h1 className="font-display text-text text-4xl font-semibold tracking-tight sm:text-5xl">
            RAKSHAN-1
          </h1>
          <p className="text-muted max-w-2xl text-sm sm:text-base">
            A senior software engineer fine-tuned from a security-engineering base model. Runs on
            curiosity, strong coffee, and a low tolerance for silent failures. This is the card.
          </p>
        </div>

        <dl className="surface-panel divide-border divide-y">
          {specSheet.map((row) => (
            <div key={row.key} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-6">
              <dt className="text-muted-2 w-48 shrink-0 font-mono text-xs">{row.key}</dt>
              <dd className="text-text font-mono text-xs sm:text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-6">
        <SectionHeading title="intended use" />
        <div className="text-muted max-w-2xl space-y-5 text-sm leading-7 sm:text-base">
          <p>
            I started out as a security engineer, which means I spent a lot of time thinking about
            how things break before thinking about how to build them. That instinct didn&apos;t
            leave when I moved into AI systems — it just found new problems. LLMs are remarkably
            good at behaving exactly how you didn&apos;t expect in production.
          </p>
          <p>
            Right now I&apos;m deep in eval-driven development: the idea that you shouldn&apos;t
            ship an AI feature you can&apos;t measure, and you shouldn&apos;t measure it with vibes.
            I care about retrieval quality, agent reliability, and the gap between &quot;impressive
            demo&quot; and &quot;system that holds up at 3am.&quot; Most of what I build — and most
            of what&apos;s in <span className="text-text">the lab</span> — lives in that gap.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading title="capabilities" />
        <div className="grid gap-4 sm:grid-cols-3">
          {capabilities.map((capability) => (
            <div key={capability.title} className="surface-panel border-l-accent border-l-2 p-4">
              <h3 className="text-text font-mono text-sm font-semibold">{capability.title}</h3>
              <p className="text-muted mt-2 text-xs leading-relaxed">{capability.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading title="training data" subtitle="Where the weights came from." />
        <ol className="space-y-0">
          {experienceTimeline.map((item, index) => (
            <li key={item.period} className="relative flex gap-6 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="bg-accent mt-1 h-2 w-2 shrink-0 rounded-full" />
                {index < experienceTimeline.length - 1 ? (
                  <div className="bg-border mt-2 w-px flex-1" />
                ) : null}
              </div>
              <div className="space-y-1 pb-1">
                <p className="text-accent font-mono text-xs tracking-widest">{item.period}</p>
                <h3 className="text-text font-mono text-sm font-semibold">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6">
        <SectionHeading title="known limitations" />
        <ul className="space-y-2">
          {limitations.map((item) => (
            <li key={item} className="text-muted flex gap-3 text-sm">
              <span className="text-amber font-mono">!</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="contact"
          subtitle="Best way to reach me for roles, consulting, or collaboration."
        />
        <div className="flex flex-wrap gap-3 font-mono text-sm">
          <a className="text-accent hover:underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          {siteConfig.socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-text transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>

        {isContactFormEnabled ? (
          <ContactForm />
        ) : (
          <p className="surface-panel text-muted p-4 font-mono text-sm">
            contact form disabled — reach out by email or social links above.
          </p>
        )}
      </section>
    </div>
  );
}
