"use client";
import { useState } from "react";

export const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

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
      className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded text-muted text-opacity-60 hover:text-primary hover:bg-primary/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};
