export const siteConfig = {
  name: "Rakshan Hegde",
  shortName: "Rakshan",
  role: "Security Engineer & AI Systems Builder",
  tagline: "security engineer × AI systems builder",
  description:
    "Security engineer turned AI systems builder. Interactive AI experiments you can play, essays on the future of AI and cybersecurity, and production-grade engineering with real opinions about reliability.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakshanhegde.com",
  location: "NYC, USA",
  email: "rakshan@rakshanhegde.com",
  navItems: [
    { label: "home", href: "/" },
    { label: "lab", href: "/lab" },
    { label: "projects", href: "/projects" },
    { label: "writing", href: "/writing" },
    { label: "about", href: "/about" },
  ],
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/rhegde8",
    },
    {
      label: "LinkedIn",
      // TODO: replace with real LinkedIn URL
      href: "https://linkedin.com/in/rakshanhegde",
    },
    {
      label: "X",
      // TODO: replace with real X/Twitter URL
      href: "https://x.com/rakshanhegde",
    },
  ],
  keywords: [
    "Rakshan Hegde",
    "Security Engineer",
    "AI Systems Builder",
    "prompt injection game",
    "AI security",
    "eval-driven development",
    "agent systems",
    "gradient descent game",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
