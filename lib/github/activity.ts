import { siteConfig } from "@/lib/config/site";

export type GitHubActivityItem = {
  id: string;
  summary: string;
  repo: string;
  repoUrl: string;
  occurredAt: string;
};

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: Array<{ sha: string }>;
    action?: string;
    pull_request?: { merged?: boolean };
    ref_type?: string;
    ref?: string | null;
  };
};

export function githubUsername(): string | null {
  const github = siteConfig.socialLinks.find((social) => social.label === "GitHub");
  if (!github) {
    return null;
  }
  const segments = new URL(github.href).pathname.split("/").filter(Boolean);
  return segments[0] ?? null;
}

function describeEvent(event: GitHubEvent): string | null {
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload.commits?.length ?? 0;
      if (count === 0) {
        return null;
      }
      return `pushed ${count} commit${count === 1 ? "" : "s"}`;
    }
    case "PullRequestEvent": {
      if (event.payload.action === "closed" && event.payload.pull_request?.merged) {
        return "merged a pull request";
      }
      if (event.payload.action === "opened") {
        return "opened a pull request";
      }
      return null;
    }
    case "IssuesEvent":
      return event.payload.action === "opened" ? "opened an issue" : null;
    case "CreateEvent":
      return event.payload.ref_type === "repository" ? "created a repository" : null;
    case "ReleaseEvent":
      return event.payload.action === "published" ? "published a release" : null;
    default:
      return null;
  }
}

/**
 * Recent public GitHub activity, deduplicated to one line per repo+action.
 * Returns [] on any failure so the section can silently disappear.
 */
export async function getRecentGitHubActivity(limit = 5): Promise<GitHubActivityItem[]> {
  const username = githubUsername();
  if (!username) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=50`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      return [];
    }

    const events = (await response.json()) as GitHubEvent[];
    const items: GitHubActivityItem[] = [];
    const seen = new Set<string>();

    for (const event of events) {
      const summary = describeEvent(event);
      if (!summary) {
        continue;
      }
      const dedupeKey = `${event.repo.name}:${summary.split(" ")[0]}`;
      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);
      items.push({
        id: event.id,
        summary,
        repo: event.repo.name,
        repoUrl: `https://github.com/${event.repo.name}`,
        occurredAt: event.created_at,
      });
      if (items.length >= limit) {
        break;
      }
    }

    return items;
  } catch {
    return [];
  }
}
