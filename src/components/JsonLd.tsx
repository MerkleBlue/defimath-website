type SchemaObject = Record<string, unknown>;

type Props = {
  data: SchemaObject | SchemaObject[];
};

/**
 * Renders a JSON-LD structured-data script tag (Schema.org).
 *
 * `data` may be a single schema object or an array of them. The output is
 * escaped to prevent breakout (any `<` becomes `<`), which keeps the
 * tag safe even if the schema ever incorporates user-supplied strings.
 *
 * Validate any new schema against https://search.google.com/test/rich-results
 * before deploying.
 */
export const JsonLd = ({ data }: Props) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};
