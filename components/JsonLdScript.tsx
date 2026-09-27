type JsonLdScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLdScript({ data }: JsonLdScriptProps): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      // Prevent content strings from closing the script element during HTML parsing.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
