export const siteConfig = {
  name: "Rakshan Hegde",
  shortName: "Rakshan",
  role: "Software Engineer | AI Builder",
  description:
    "Production-grade software engineer building AI-native products, agent workflows, and reliable systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  location: "India",
  email: "hello@example.com",
  terminalIntro: [
    "rakshan@portfolio:~$ whoami",
    "Rakshan Hegde - software engineer",
    "rakshan@portfolio:~$ focus --now",
    "Building agent systems, RAG pipelines, eval frameworks, and product-grade platforms.",
    "rakshan@portfolio:~$ status",
    "Open to engineering, AI, and product opportunities.",
  ],
  navItems: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "Demos", href: "/demos" },
    { label: "About", href: "/about" },
  ],
  socialLinks: [
    {
      label: "GitHub",
      href: "https://example.com",
    },
    {
      label: "LinkedIn",
      href: "https://example.com",
    },
    {
      label: "X",
      href: "https://x.com/example.com",
    },
  ],
  aiSignals: [
    "LLM agents with tool orchestration",
    "Retrieval-augmented generation (RAG) systems",
    "Prompt/version control and evaluation pipelines",
    "On-device and local inference experiments",
    "Latency/cost-aware AI productionization",
  ],
  keywords: [
    "Rakshan Hegde",
    "Software Engineer",
    "AI Engineer",
    "Next.js portfolio",
    "Machine learning systems",
    "RAG",
    "Agentic workflows",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
