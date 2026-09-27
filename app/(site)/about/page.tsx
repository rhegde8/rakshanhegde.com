import Link from "next/link";
import { ContactLinks } from "@/components/ContactLinks";
import { ScientificFigure } from "@/components/ScientificFigure";
import { SectionHeading } from "@/components/SectionHeading";
import { experience, education } from "@/lib/config/profile";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Meet Rakshan Hegde: a software engineer working in AI and cybersecurity, with a love of building, science, and understanding how things work.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <>
      <header className="page-heading about-heading">
        <p className="eyebrow">The person behind the pages</p>
        <h1>
          An engineer.
          <br />
          <em>A curious mind.</em>
        </h1>
      </header>
      <div className="about-intro">
        <div className="prose">
          <p className="drop-cap">
            <span className="drop-cap-initial">I</span>’m Rakshan, a software engineer with a
            particular affection for AI and cybersecurity. I like building useful things, taking
            systems apart, and finding the assumptions that don’t survive a closer look.
          </p>
          <p>
            My work lives where software meets security: turning noisy vulnerability scans into
            clear priorities, building threat-intelligence tools, and setting the boundaries that AI
            agents operate within.
          </p>
          <p>
            Currently, I’m a Senior Security Engineer at Sumitomo Mitsui Trust Bank (U.S.A.)
            Limited. I build production security software, lead AI security reviews, and help turn
            policy into controls that people can actually use.
          </p>
          <Link href="/projects" className="underlined-link">
            See what I’ve been building <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="about-figure">
          <ScientificFigure />
        </div>
      </div>
      <section className="experience-section">
        <SectionHeading title="The path so far" number="01" />
        <div className="experience-list">
          {experience.map((item) => (
            <article key={item.organization} className="experience-item">
              <p className="eyebrow experience-period">{item.period}</p>
              <div>
                <h3>{item.organization}</h3>
                <div className="roles">
                  {item.roles.map((role) => (
                    <p key={role.title}>
                      <strong>{role.title}</strong>
                      <span>{role.period}</span>
                    </p>
                  ))}
                </div>
                <p>{item.summary}</p>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="beyond-work" className="beyond-work">
        <SectionHeading title="Outside the day job" number="02" />
        <div className="interests-grid">
          <article>
            <span className="interest-symbol" aria-hidden="true">
              ⌘
            </span>
            <h3>Building, just because.</h3>
            <p>
              Custom gaming rigs, homelabs, and agent orchestration systems. I enjoy choosing the
              parts, wiring them together, and figuring out why they don’t behave quite as expected.
            </p>
          </article>
          <article>
            <span className="interest-symbol" aria-hidden="true">
              ∞
            </span>
            <h3>The bigger questions.</h3>
            <p>
              Physics, quantum mechanics, mathematics, and the universe. I love the feeling of an
              explanation clicking into place—and the questions that appear right after it.
            </p>
          </article>
        </div>
      </section>
      <section className="education-section">
        <SectionHeading title="Foundations" number="03" />
        <div className="education-grid">
          {education.map((item) => (
            <div key={item.qualification}>
              <span className="eyebrow">{item.year}</span>
              <h3>{item.qualification}</h3>
              <p>{item.institution}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="correspondence">
        <p className="eyebrow">Correspondence</p>
        <h2>
          Good conversations start
          <br />
          <em>with a little curiosity.</em>
        </h2>
        <ContactLinks />
      </section>
    </>
  );
}
