export const siteConfig = {
  name: "Rakshan Hegde",
  role: "Software Engineer",
  tagline: "Software, security & a curious mind",
  description:
    "The personal journal of Rakshan Hegde. Software engineering, AI, cybersecurity, and a curiosity for how the universe works. Projects, writing, and field notes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakshanhegde.com",
  navItems: [
    { label: "Projects", href: "/projects" },
    { label: "Writing", href: "/writing" },
    { label: "About", href: "/about" },
  ],
  contactLinks: [
    { label: "Email", href: null },
    { label: "GitHub", href: null },
    { label: "LinkedIn", href: null },
  ],
  keywords: ["Rakshan Hegde", "Software Engineer", "AI", "Cybersecurity", "Agent orchestration"],
} as const;
