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

      // Promote any canonical install command to the InstallCommand styling
      // (coral-orange copy button + GA event), matching the docs pages.
      // Matches: `npm install defimath-lib`, version-pinned `npm install defimath-lib@X.Y.Z`,
      // and the Foundry path `forge install defimath-lib=MerkleBlue/defimath`.
      const INSTALL_SNIPPET = /^(npm install defimath-lib(@\S+)?|forge install defimath-lib=MerkleBlue\/defimath)$/;
      if (INSTALL_SNIPPET.test(text.trim())) {
        const cmd = text.trim();
        const wrapper = document.createElement("div");
        wrapper.className = "my-6 py-5 px-5 rounded-md bg-dark_grey relative";

        const line = document.createElement("div");
        line.className = "text-base font-mono text-gray-400 pe-20";
        line.textContent = cmd;
        wrapper.appendChild(line);

        const installBtn = document.createElement("button");
        installBtn.type = "button";
        installBtn.setAttribute("data-copy-btn", "");
        installBtn.setAttribute("aria-label", "Copy to clipboard");
        installBtn.className =
          "absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm rounded bg-[#FF7A66] text-darkmode font-semibold hover:bg-[#FF6B57]";
        installBtn.textContent = "Copy";

        const handleInstallClick = async () => {
          if (typeof window.gtag === "function") {
            window.gtag("event", "install_copy", { value: 1, currency: "USD" });
          }
          try {
            await navigator.clipboard.writeText(cmd);
            installBtn.textContent = "Copied";
            setTimeout(() => { installBtn.textContent = "Copy"; }, 1500);
          } catch {
            // Clipboard API unavailable — silently ignore.
          }
        };

        installBtn.addEventListener("click", handleInstallClick);
        wrapper.appendChild(installBtn);
        pre.parentNode?.replaceChild(wrapper, pre);

        // No cleanup pushed. Under React's strict-mode double-invoke (Next.js
        // dev default), the cleanup runs between the two mount invocations:
        //   • `wrapper.remove()` would tear the wrapper out of the DOM, and
        //     invocation 2's `querySelectorAll("pre")` finds nothing (the
        //     original <pre> was already replaced) — empty slot.
        //   • `removeEventListener` would leave the wrapper in place but
        //     leave the click handler dead (re-attach in invocation 2 can't
        //     happen — the original <pre> is gone, so the loop skips it).
        // Letting React's commit phase tear down the parent <div> on unmount
        // takes the wrapper and its listener with it via GC. No leak.
        return;
      }

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

      // Same rule as the install-snippet branch: no cleanup pushed. The
      // early-return guard (`pre.querySelector("[data-copy-btn]")`) above
      // makes invocation 2 idempotent; the unmount sweep on the parent
      // takes the button with it via GC.
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
