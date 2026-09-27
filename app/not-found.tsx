import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found">
      <p className="eyebrow">404 / A missing page</p>
      <h1>
        This page
        <br />
        <em>got away.</em>
      </h1>
      <p>It may have moved, or it may never have made it to print.</p>
      <Link href="/" className="underlined-link">
        Back to the front page <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
