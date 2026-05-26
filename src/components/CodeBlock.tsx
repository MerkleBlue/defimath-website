import { codeToHtml } from "shiki";
import { CopyButton } from "./Documentation/CopyButton";

type Props = {
  code: string;
  language?: string;
  /** Visual variant. "panel" = filled bg-dark_grey (default). "accent" = dark bg with orange left border (used in FunctionDetail). */
  variant?: "panel" | "accent";
};

/**
 * Server Component that renders a syntax-highlighted code block using Shiki
 * (the same TextMate engine VS Code uses). Highlighting happens at build time,
 * so no JS is shipped to the browser for this.
 */
export const CodeBlock = async ({
  code,
  language = "solidity",
  variant = "panel",
}: Props) => {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  });

  const wrapperClass =
    variant === "accent"
      ? "relative rounded-md bg-darkmode border-l-4 border-[#FF7A66] overflow-x-auto"
      : "relative rounded-md bg-dark_grey overflow-x-auto";

  return (
    <div className={wrapperClass}>
      <div
        className="text-sm font-mono [&>pre]:!bg-transparent [&>pre]:py-4 [&>pre]:px-4 [&>pre]:pe-16"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton value={code} />
    </div>
  );
};
