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
      <p>This address doesn’t point to a project or a page in the lab.</p>
      <Link href="/" className="underlined-link">
        Back to the lab <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
