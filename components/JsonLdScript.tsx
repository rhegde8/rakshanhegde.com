type JsonLdScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLdScript({ data }: JsonLdScriptProps): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      // JSON-LD scripts are intentionally static data objects rendered server-side.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
