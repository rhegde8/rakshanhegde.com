export type SystemNode = {
  id: string;
  label: string;
  caption: string;
  detail: string;
};

export type SystemDefinition = {
  shortName: string;
  question: string;
  annotation: string;
  nodes: readonly [SystemNode, SystemNode, SystemNode];
};

// Explanatory overviews of published project content, not live telemetry.
// Node order communicates the story; it does not assert an execution schedule.
export const systems: Record<string, SystemDefinition> = {
  sealcheck: {
    shortName: "SealCheck",
    question: "Before the model enters.",
    annotation: "CONCEPT / SANDBOX PREFLIGHT",
    nodes: [
      {
        id: "sandbox",
        label: "Sandbox",
        caption: "The environment",
        detail:
          "The sandbox is the environment intended for AI model testing. SealCheck starts with a question about that environment: how secure is it?",
      },
      {
        id: "preflight",
        label: "SealCheck",
        caption: "Preflight assessment",
        detail:
          "I’m building SealCheck to assess sandbox security before model testing begins. The specific checks and implementation are still in development.",
      },
      {
        id: "testing",
        label: "Model testing",
        caption: "What comes after",
        detail:
          "Preflight assessment comes before testing AI models inside the sandbox. The goal is to understand the environment’s security before the model enters.",
      },
    ],
  },
  "multi-agent-development-harness": {
    shortName: "Agent harness",
    question: "Give agents tools. Keep authority explicit.",
    annotation: "DESIGN / AGENT BOUNDARIES",
    nodes: [
      {
        id: "host",
        label: "Host & runner",
        caption: "Human approval",
        detail:
          "The agent loop runs on a hardened host. Builder and reviewer agents work in phases under human approval, and the runner sets checks from the reviewer’s structured verdict.",
      },
      {
        id: "agents",
        label: "Builder + reviewer",
        caption: "Separate responsibilities",
        detail:
          "Builder and reviewer agents have distinct roles. The reviewer holds no tokens. Deterministic gates, including mutation testing, run before any model call.",
      },
      {
        id: "execution",
        label: "Execution sandbox",
        caption: "Commands only",
        detail:
          "Containers only execute commands. API keys and Git credentials stay outside the execution containers. The setup uses Docker, Tailscale, and GitHub.",
      },
    ],
  },
  vultrack: {
    shortName: "VulTrack",
    question: "From scan results to something actionable.",
    annotation: "SYSTEM / VULNERABILITY MANAGEMENT",
    nodes: [
      {
        id: "findings",
        label: "Tenable findings",
        caption: "1,000 endpoints & servers",
        detail:
          "VulTrack ingests Tenable findings across 1,000 endpoints and servers, bringing vulnerability data into the bank’s own management platform.",
      },
      {
        id: "triage",
        label: "Automated triage",
        caption: "Weeks → minutes",
        detail:
          "Automated post-scan triage reduces work that took weeks to minutes. The platform is built with Python, Flask, and SQLAlchemy.",
      },
      {
        id: "remediation",
        label: "Remediation",
        caption: "Deadlines & reporting",
        detail:
          "Critical findings have 15-day deadlines; High findings have 30-day deadlines. Remediation tracking and Board reporting support examination readiness.",
      },
    ],
  },
  threatnet: {
    shortName: "ThreatNet",
    question: "Find the threats that matter here.",
    annotation: "SYSTEM / THREAT INTELLIGENCE",
    nodes: [
      {
        id: "feeds",
        label: "Eight threat feeds",
        caption: "CISA KEV · NVD · EPSS",
        detail:
          "ThreatNet brings together eight feeds, including CISA KEV, NVD, and FIRST EPSS. Approximately 700 records arrive each day.",
      },
      {
        id: "correlation",
        label: "Asset correlation",
        caption: "Context & risk scoring",
        detail:
          "The service correlates threat intelligence with asset inventory and applies a custom risk score on a 0–100 scale to make the findings relevant to the environment.",
      },
      {
        id: "priorities",
        label: "Actionable threats",
        caption: "1–5 items per day",
        detail:
          "Correlating and prioritizing the records narrows approximately 700 daily records to 1–5 actionable items. The service uses Python, FastAPI, and SQLAlchemy.",
      },
    ],
  },
};
