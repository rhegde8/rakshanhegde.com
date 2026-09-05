export type Experiment = {
  slug: string;
  href: string;
  codename: string;
  title: string;
  blurb: string;
  tags: string[];
  /** Short call-to-action verb shown on the card. */
  action: string;
  status: "live" | "beta";
};

export const experiments: Experiment[] = [
  {
    slug: "breach",
    href: "/lab/breach",
    codename: "BREACH // 07",
    title: "Jailbreak the model",
    blurb:
      "A hardened AI assistant is guarding a secret. Five escalating layers of guardrails. Talk your way past every one using real prompt-injection tradecraft. No accounts, no API — the whole adversary runs in your browser.",
    tags: ["prompt-injection", "security", "terminal"],
    action: "start breach",
    status: "live",
  },
  {
    slug: "descent",
    href: "/lab/descent",
    codename: "DESCENT // ∇",
    title: "Gradient descent, by hand",
    blurb:
      "You are the optimizer. Tune the learning rate and momentum to roll a parameter down a loss landscape into the global minimum before you run out of steps. Overshoot and you diverge. Three landscapes, increasingly cruel.",
    tags: ["optimization", "canvas", "arcade"],
    action: "start descent",
    status: "live",
  },
  {
    slug: "temperature",
    href: "/#temperature",
    codename: "SAMPLER // T",
    title: "Re-sample the author",
    blurb:
      "The bio on the home page is a live sampling demo. Drag the temperature from 0 to 2 and watch coherence decay into beautiful nonsense — a hands-on feel for what that one hyperparameter actually does.",
    tags: ["sampling", "interactive", "meta"],
    action: "on the home page",
    status: "live",
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.slug === slug);
}
