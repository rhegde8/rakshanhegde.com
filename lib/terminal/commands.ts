import { siteConfig } from "@/lib/config/site";

export type TerminalLineKind = "input" | "output" | "accent" | "error";

export type TerminalLine = {
  text: string;
  kind: TerminalLineKind;
};

export type TerminalEntrySummary = {
  slug: string;
  title: string;
  summary: string;
  status?: "ongoing" | "completed";
};

export type TerminalData = {
  projects: readonly TerminalEntrySummary[];
  writing: readonly TerminalEntrySummary[];
};

export type CommandResult = {
  lines: TerminalLine[];
  clear?: boolean;
  navigateTo?: string;
};

const out = (text: string): TerminalLine => ({ text, kind: "output" });
const accent = (text: string): TerminalLine => ({ text, kind: "accent" });
const error = (text: string): TerminalLine => ({ text, kind: "error" });

const PAGES: Record<string, string> = {
  home: "/",
  projects: "/projects",
  writing: "/writing",
  about: "/about",
};

const HELP_LINES: TerminalLine[] = [
  accent("available commands:"),
  out("  help              show this list"),
  out("  whoami            who runs this place"),
  out("  focus             what I'm working on now"),
  out("  ls [collection]   list projects or writing"),
  out("  cat <slug>        summary of a project or writing entry"),
  out("  open <target>     go to a page or entry (e.g. open about)"),
  out("  contact           email and links"),
  out("  clear             clear the screen"),
  out(""),
  out("tab completes commands and slugs · up/down for history"),
];

function listEntries(label: string, entries: readonly TerminalEntrySummary[]): TerminalLine[] {
  if (entries.length === 0) {
    return [out(`no ${label} yet.`)];
  }
  const width = Math.max(...entries.map((entry) => entry.slug.length));
  return [
    accent(`${label}/`),
    ...entries.map((entry) =>
      out(
        `  ${entry.slug.padEnd(width)}  ${entry.status ? `[${entry.status}] ` : ""}${entry.title}`,
      ),
    ),
  ];
}

function findEntry(
  data: TerminalData,
  slug: string,
): { entry: TerminalEntrySummary; path: string } | null {
  const project = data.projects.find((candidate) => candidate.slug === slug);
  if (project) {
    return { entry: project, path: `/projects/${project.slug}` };
  }
  const writing = data.writing.find((candidate) => candidate.slug === slug);
  if (writing) {
    return { entry: writing, path: `/writing/${writing.slug}` };
  }
  return null;
}

export function allCompletionTargets(data: TerminalData): string[] {
  return [
    "help",
    "whoami",
    "focus",
    "ls",
    "cat",
    "open",
    "contact",
    "clear",
    ...Object.keys(PAGES),
    ...data.projects.map((entry) => entry.slug),
    ...data.writing.map((entry) => entry.slug),
  ];
}

export function completeInput(input: string, data: TerminalData): string[] {
  const trimmed = input.replace(/^\s+/, "");
  const parts = trimmed.split(/\s+/);
  const isFirstWord = parts.length <= 1;
  const fragment = parts[parts.length - 1] ?? "";

  if (fragment === "") {
    return [];
  }

  const commands = ["help", "whoami", "focus", "ls", "cat", "open", "contact", "clear"];
  const slugs = [
    ...data.projects.map((entry) => entry.slug),
    ...data.writing.map((entry) => entry.slug),
  ];
  const pool = isFirstWord ? commands : [...Object.keys(PAGES), ...slugs];

  return pool.filter((candidate) => candidate.startsWith(fragment)).sort();
}

export function runCommand(rawInput: string, data: TerminalData): CommandResult {
  const input = rawInput.trim();
  if (input === "") {
    return { lines: [] };
  }

  const [command, ...args] = input.split(/\s+/);
  const argument = args.join(" ");

  switch (command) {
    case "help":
      return { lines: HELP_LINES };

    case "whoami":
      return {
        lines: [out(`${siteConfig.name.toLowerCase()} — ${siteConfig.role.toLowerCase()}`)],
      };

    case "focus":
      return {
        lines: [
          out("eval-driven AI · production reliability · agent systems that actually hold up"),
        ],
      };

    case "ls": {
      if (argument === "") {
        return {
          lines: [
            ...listEntries("projects", data.projects),
            out(""),
            ...listEntries("writing", data.writing),
          ],
        };
      }
      const target = argument.replace(/\/$/, "");
      if (target === "projects") {
        return { lines: listEntries("projects", data.projects) };
      }
      if (target === "writing") {
        return { lines: listEntries("writing", data.writing) };
      }
      return { lines: [error(`ls: no such collection: ${argument}`)] };
    }

    case "cat": {
      if (argument === "") {
        return { lines: [error("usage: cat <slug> — try `ls` first")] };
      }
      const match = findEntry(data, argument);
      if (!match) {
        return { lines: [error(`cat: no such entry: ${argument}`)] };
      }
      const statusLine = match.entry.status ? [out(`status: ${match.entry.status}`)] : [];
      return {
        lines: [
          accent(match.entry.title),
          ...statusLine,
          out(match.entry.summary),
          out(`→ open ${match.entry.slug}`),
        ],
      };
    }

    case "open": {
      if (argument === "") {
        return { lines: [error("usage: open <target> — a page (about) or a slug from `ls`")] };
      }
      const normalized = argument.replace(/^\//, "").replace(/\/$/, "");
      const page = PAGES[normalized];
      if (page) {
        return { lines: [out(`opening ${page} …`)], navigateTo: page };
      }
      const match = findEntry(data, normalized);
      if (match) {
        return { lines: [out(`opening ${match.path} …`)], navigateTo: match.path };
      }
      return { lines: [error(`open: no such target: ${argument}`)] };
    }

    case "contact":
      return {
        lines: [
          out(`email   ${siteConfig.email}`),
          ...siteConfig.socialLinks.map((social) =>
            out(`${social.label.toLowerCase().padEnd(7)} ${social.href}`),
          ),
        ],
      };

    case "clear":
      return { lines: [], clear: true };

    case "pwd":
      return { lines: [out("/home/rakshan/site")] };

    case "date":
      return { lines: [out(new Date().toUTCString())] };

    case "echo":
      return { lines: [out(argument)] };

    case "sudo":
      return { lines: [error("nice try. this incident will be reported (to no one).")] };

    case "vim":
    case "emacs":
    case "nano":
      return {
        lines: [
          out(`no need — the whole site is already in ${command} keybindings. (not really.)`),
        ],
      };

    case "exit":
    case "logout":
      return { lines: [out("there is no escape. try `open projects` instead.")] };

    case "rm":
      return { lines: [error("rm: refusing to delete the portfolio you are currently judging")] };

    default:
      return {
        lines: [error(`command not found: ${command} — try \`help\``)],
      };
  }
}
