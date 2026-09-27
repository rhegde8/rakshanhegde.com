export const experience = [
  {
    organization: "Sumitomo Mitsui Trust Bank (U.S.A.) Limited",
    period: "2023–present",
    roles: [
      { title: "Senior Security Engineer", period: "December 2024–present" },
      { title: "Security Engineer", period: "August 2023–December 2024" },
    ],
    summary: "Building security platforms and the controls AI systems operate under.",
    highlights: [
      "Authored the bank's AI Security Standard, including agent tool permissions, autonomy limits, and human approval requirements.",
      "Established the AI Core Committee, lead AI tool security reviews, and manage two engineers.",
      "Built VulTrack and ThreatNet; took Microsoft 365 Copilot from a 25-user pilot to a rollout for 400 employees.",
    ],
  },
  {
    organization: "11:11 Systems",
    period: "2021–2022",
    roles: [{ title: "Software Engineer", period: "November 2021–December 2022" }],
    summary: "Production data pipelines for cloud infrastructure, disaster recovery, and backup.",
    highlights: [
      "Built ETL and reporting pipelines with Python, PySpark, Cassandra, and REST APIs for internal analysts and a customer-facing cloud console.",
      "Refactored legacy jobs and automated manual data cleaning.",
    ],
  },
  {
    organization: "Family hospitality group",
    period: "2014–2020",
    roles: [{ title: "Operations and Expansion Lead", period: "2014–2020" }],
    summary: "An earlier chapter in building and running businesses, before software engineering.",
    highlights: [
      "Grew the business from two hotels and three restaurants to three hotels and six restaurants, with 434 employees.",
      "Led a 30-room hotel build from land acquisition through opening, alongside finance, HR, vendors, and technology.",
    ],
  },
] as const;

export const education = [
  { qualification: "CompTIA Security+", institution: "CompTIA", year: "2025" },
  { qualification: "Software Engineering", institution: "Flatiron School", year: "2021" },
  { qualification: "B.A. Economics", institution: "Queens College, CUNY", year: "2014" },
] as const;
