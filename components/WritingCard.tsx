import Link from "next/link";
import type { WritingEntry } from "@/lib/content/types";
import { formatDate } from "@/lib/utils/date";
export function WritingCard({ entry }: { entry: WritingEntry }) {
  return (
    <article className="writing-card">
      <p className="eyebrow">
        <time dateTime={entry.updatedAt}>{formatDate(entry.updatedAt)}</time> ·{" "}
        {entry.tags.join(" / ")}
      </p>
      <h3>
        <Link href={`/writing/${entry.slug}`}>
          {entry.title} <span aria-hidden="true">↗</span>
        </Link>
      </h3>
      <p>{entry.summary}</p>
    </article>
  );
}
