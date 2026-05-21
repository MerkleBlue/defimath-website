"use client";
import { useEffect, useRef } from "react";

type Props = {
  html: string;
  className?: string;
};

/**
 * Renders pre-converted markdown HTML and post-processes every <pre> block to
 * receive a "Copy" button. Used by news and blog detail pages.
 */
export const MarkdownContent = ({ html, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];
    const pres = root.querySelectorAll("pre");

    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;

      const text = pre.textContent ?? "";
      (pre as HTMLElement).style.position = "relative";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-copy-btn", "");
      btn.setAttribute("aria-label", "Copy to clipboard");
      btn.className =
        "absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded text-muted text-opacity-60 hover:text-primary hover:bg-primary/10";
      btn.textContent = "Copy";

      const handleClick = async () => {
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Copied";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 1500);
        } catch {
          // Clipboard API unavailable — silently ignore.
        }
      };

      btn.addEventListener("click", handleClick);
      pre.appendChild(btn);

      cleanups.push(() => {
        btn.removeEventListener("click", handleClick);
        btn.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
