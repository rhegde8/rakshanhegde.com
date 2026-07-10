/**
 * The words the site "samples" — hero token stream and temperature-dependent
 * bio variants. Pure data + helpers so components stay thin and tests stay easy.
 */

export type HeroToken = {
  /** The token that gets committed to the headline. */
  text: string;
  /** Rejected candidates flashed before the commit. Empty = instant commit. */
  candidates: string[];
};

export const heroTokens: HeroToken[] = [
  { text: "builds", candidates: ["ships", "breaks", "debugs"] },
  { text: "AI", candidates: ["LLM", "agent"] },
  { text: "systems", candidates: ["demos", "pipelines"] },
  { text: "that", candidates: [] },
  { text: "survive", candidates: ["explode", "vibe", "apologize"] },
  { text: "contact", candidates: [] },
  { text: "with", candidates: [] },
  { text: "production.", candidates: ["reality.", "attackers.", "users."] },
];

export const heroHeadline = heroTokens.map((token) => token.text).join(" ");

export type TemperatureBand = "cold" | "warm" | "hot";

export type BioVariant = {
  /** Inclusive lower bound of the temperature range this variant covers. */
  minTemp: number;
  label: string;
  text: string;
};

const deterministicBio: BioVariant = {
  minTemp: 0,
  label: "deterministic",
  text: "I'm a senior software engineer in NYC. I started in security engineering, moved into AI systems, and now I build agents and evals that hold up in production. I measure before I ship. I don't trust demos — including my own.",
};

/** Ordered by minTemp ascending; pickBioVariant relies on this. */
export const bioVariants: BioVariant[] = [
  deterministicBio,
  {
    minTemp: 0.4,
    label: "nucleus",
    text: "I'm a security engineer who fell for AI systems — professionally, and a little bit emotionally. These days I build agents you can actually trust: evals first, observability everywhere, and a healthy paranoia about what happens when real users show up.",
  },
  {
    minTemp: 0.9,
    label: "creative",
    text: "Recovering security engineer. Current AI systems builder. I spend my days teaching language models to behave in production and my nights wondering what they do when I'm not looking. Every great AI product is 10% magic and 90% plumbing — and I genuinely love the plumbing.",
  },
  {
    minTemp: 1.3,
    label: "spicy",
    text: "I herd stochastic parrots for a living. I used to guard firewalls; now I whisper to gradient fields and ask them nicely not to hallucinate in front of the customers. My love language is a well-instrumented eval harness. My enemies: silent failures, vibes-based launches, and the phrase “it worked locally.”",
  },
  {
    minTemp: 1.7,
    label: "unhinged",
    text: "ATTENTION: latent space cowboy detected. I am four thousand security audits in a trench coat, dreaming in embeddings. I have seen the loss landscape and it is beautiful and it is screaming. I ship agents, evals, vibes (measured), and exactly zero unhandled exceptions in prod (mostly) (measured). Hire me before my temperature resets.",
  },
];

export function pickBioVariant(temperature: number): BioVariant {
  let chosen: BioVariant = deterministicBio;
  for (const variant of bioVariants) {
    if (temperature >= variant.minTemp) {
      chosen = variant;
    }
  }
  return chosen;
}

export function temperatureBand(temperature: number): TemperatureBand {
  if (temperature >= 1.7) {
    return "hot";
  }
  if (temperature >= 0.9) {
    return "warm";
  }
  return "cold";
}
