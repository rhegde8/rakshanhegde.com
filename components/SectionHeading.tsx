import Link from "next/link";
type SectionHeadingProps = { title: string; number?: string; href?: string; linkLabel?: string };
export function SectionHeading({ title, number, href, linkLabel }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <h2>
        {number ? <span className="section-number">{number} / </span> : null}
        {title}
      </h2>
      {href ? (
        <Link href={href} className="text-link">
          {linkLabel ?? "View all"} <span aria-hidden="true">↗</span>
        </Link>
      ) : null}
    </div>
  );
}
