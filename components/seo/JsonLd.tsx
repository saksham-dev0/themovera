/**
 * Renders a schema.org JSON-LD block. Server-rendered, so Google sees it in
 * the raw HTML without executing any JavaScript.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Values are authored in this repo, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
