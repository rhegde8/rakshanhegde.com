export const siteConfig = {
  name: "Rakshan Hegde",
  shortName: "Rakshan",
  role: "Security Engineer & AI Systems Builder",
  description:
    "Security engineer turned AI systems builder. Production-grade software with real opinions on reliability, eval-driven development, and what it takes to ship AI that doesn't embarrass you in prod.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakshanhegde.com",
  location: "NYC, USA",
  email: "rakshan@rakshanhegde.com",
  terminalIntro: [
    "$ whoami",
    "rakshan hegde — security engineer turned AI systems builder",
    "",
    "$ focus --now",
    "eval-driven AI · production reliability · agent systems that actually hold up",
    "",
    "$ git log --oneline -5",
    "a3f9c12 evalops-control-plane: add drift detection + alert routing",
    "b7e2d04 agent-observability-platform: trace correlation across tool calls",
    "c1a8f3e rag-knowledge-orchestrator: hybrid retrieval with reranking",
    "d4b5e91 local-inference-workbench: quantization benchmark harness",
    "e9c7a2f security-audit-pipeline: automated vuln triage with LLM assist",
  ],
  navItems: [
    { label: "home", href: "/" },
    { label: "projects", href: "/projects" },
    { label: "research", href: "/research" },
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
    "Next.js portfolio",
    "Eval-driven development",
    "RAG systems",
    "Agent workflows",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
