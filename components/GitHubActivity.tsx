import { SectionHeading } from "@/components/SectionHeading";
import type { GitHubActivityItem } from "@/lib/github/activity";
import { formatDate } from "@/lib/utils/date";

type GitHubActivityProps = {
  items: readonly GitHubActivityItem[];
  username: string | null;
};

export function GitHubActivity({ items, username }: GitHubActivityProps): React.JSX.Element | null {
  if (items.length === 0 || !username) {
    return null;
  }

  return (
    <section>
      <SectionHeading title="recent activity" subtitle="Live from GitHub — updated hourly." />
      <ul className="border border-[#1e1e1e] bg-[#111111]">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#1e1e1e] px-4 py-3 last:border-b-0"
          >
            <span className="font-mono text-xs text-[#e2e8f0] sm:text-sm">
              {item.summary}{" "}
              <a
                href={item.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#00ff88] hover:underline"
              >
                {item.repo}
              </a>
            </span>
            <span className="font-mono text-xs text-[#6b7280]">{formatDate(item.occurredAt)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-[#00ff88] hover:underline"
        >
          github.com/{username} →
        </a>
      </div>
    </section>
  );
}
