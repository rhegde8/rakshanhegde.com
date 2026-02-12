import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MdxContentProps = {
  source: string;
};

export function MdxContent({ source }: MdxContentProps): React.JSX.Element {
  return (
    <article className="mdx-content max-w-3xl">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          },
        }}
        components={{
          a: ({ href, children }) => {
            if (!href) {
              return <>{children}</>;
            }

            const isInternal = href.startsWith("/");
            if (isInternal) {
              return <Link href={href}>{children}</Link>;
            }

            return (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          },
        }}
      />
    </article>
  );
}
