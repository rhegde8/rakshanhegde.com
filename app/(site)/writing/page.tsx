import { WritingCard } from "@/components/WritingCard";
import { WritingEmptyState } from "@/components/WritingEmptyState";
import { getAllWritingEntries } from "@/lib/content/loaders";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Writing",
  description:
    "Essays and field notes on software, AI, cybersecurity, and scientific curiosity by Rakshan Hegde.",
  path: "/writing",
});
export default async function WritingPage() {
  const entries = await getAllWritingEntries();
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">Essays &amp; field notes</p>
        <h1>
          Thinking out loud.
          <br />
          <em>One page at a time.</em>
        </h1>
        <p>A place for things learned, questions still open, and ideas worth following.</p>
      </header>
      <section className="writing-index" aria-label="Writing">
        {entries.length ? (
          entries.map((entry) => <WritingCard key={entry.slug} entry={entry} />)
        ) : (
          <WritingEmptyState />
        )}
      </section>
      <div className="notebook-topics">
        <span className="eyebrow">On my mind</span>
        <p>
          Intelligent systems <span> / </span> Security <span> / </span> First principles{" "}
          <span> / </span> The natural world
        </p>
      </div>
    </>
  );
}
