export const siteConfig = {
  name: "Rakshan Hegde",
  role: "Senior Security Engineer",
  tagline: "Software, AI & security",
  description:
    "The personal systems lab of Rakshan Hegde. Building software, exploring AI, and investigating how systems break. Projects and field notes on AI and cybersecurity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakshanhegde.com",
  navItems: [
    { label: "Projects", href: "/projects" },
    { label: "Writing", href: "/writing" },
    { label: "About", href: "/about" },
  ],
  contactLinks: [
    { label: "Email", href: "mailto:rakshan.hegde7@gmail.com" },
    { label: "GitHub", href: "https://github.com/rhegde8" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rakshan-hegde" },
  ],
  keywords: ["Rakshan Hegde", "Software Engineer", "AI", "Cybersecurity", "Agent orchestration"],
} as const;
