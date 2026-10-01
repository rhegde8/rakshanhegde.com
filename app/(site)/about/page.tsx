import Link from "next/link";
import { ContactLinks } from "@/components/ContactLinks";
import { SectionHeading } from "@/components/SectionHeading";
import { experience, education } from "@/lib/config/profile";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Rakshan Hegde: a security engineer who builds software, explores AI, and wants to understand how things work.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">The person behind the systems</p>
        <h1>
          A builder’s itch.
          <br />
          <em>A curious mind.</em>
        </h1>
      </header>
      <div className="about-intro">
        <div className="prose">
          <p>
            I’m Rakshan. I like building useful things, taking systems apart, and finding the
            assumptions that don’t survive a closer look. Software, AI, and cybersecurity are the
            threads that keep coming together.
          </p>
          <p>
            My work lives where software meets security: turning noisy vulnerability scans into
            clear priorities, building threat-intelligence tools, and setting the boundaries AI
            agents operate within.
          </p>
          <p>
            I’m a Senior Security Engineer at Sumitomo Mitsui Trust Bank (U.S.A.) Limited. I build
            production security software, lead AI security reviews, and turn policy into controls
            people can actually use.
          </p>
          <p>
            On my own time, I’m building <Link href="/projects/sealcheck">SealCheck</Link> and a{" "}
            <Link href="/projects/multi-agent-development-harness">
              multi-agent development harness
            </Link>
            . Both start with the same curiosity: what does it take to give AI useful capabilities
            while understanding its boundaries?
          </p>
          <Link href="/projects" className="underlined-link">
            See what I’ve been building <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <aside className="about-aside">
          <p className="eyebrow">A few coordinates</p>
          <dl>
            <div>
              <dt>Based in</dt>
              <dd>New York, NY</dd>
            </div>
            <div>
              <dt>Working on</dt>
              <dd>AI &amp; agent security</dd>
            </div>
            <div>
              <dt>Usually building with</dt>
              <dd>Python, Linux, and a lot of questions</dd>
            </div>
            <div>
              <dt>Off the clock</dt>
              <dd>Homelabs, custom PCs, physics</dd>
            </div>
          </dl>
        </aside>
      </div>
      <section className="experience-section">
        <SectionHeading title="The path so far." number="01" />
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
        <SectionHeading title="Outside the day job." number="02" />
        <div className="interests-grid">
          <article>
            <span className="interest-symbol" aria-hidden="true">
              [ + ]
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
        <SectionHeading title="Foundations." number="03" />
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
        <p className="eyebrow">Let’s compare notes</p>
        <h2>
          Building something interesting?
          <br />
          <em>I’d love to hear about it.</em>
        </h2>
        <ContactLinks />
      </section>
    </>
  );
}
