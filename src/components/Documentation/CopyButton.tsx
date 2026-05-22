"use client";
import { useState } from "react";

type Props = {
  value: string;
  /** When true, the button renders in the coral/orange palette used for prominent code blocks. */
  orange?: boolean;
};

export const CopyButton = ({ value, orange = false }: Props) => {
  const [copied, setCopied] = useState(false);

  const palette = orange
    ? "bg-[#FF7A66] text-darkmode font-semibold hover:bg-[#FF6B57]"
    : "text-muted text-opacity-60 hover:text-primary hover:bg-primary/10";

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard API unavailable (insecure context) — silently ignore.
        }
      }}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={`absolute top-2 right-2 rounded font-medium ${
        orange ? "px-3 py-1.5 text-sm" : "px-2 py-1 text-xs"
      } ${palette}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};
