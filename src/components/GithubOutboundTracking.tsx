"use client";
import { useEffect } from "react";

/**
 * Fires a Google Ads conversion event (`AW-1058581148/bZxnCP3W6sYcEJzV4vgD`)
 * whenever the user clicks a link to github.com.
 *
 * Uses a single delegated click listener on `document` rather than wiring an
 * onClick into every <a> — survives future GitHub links without code churn.
 * All existing GitHub anchors use `target="_blank"`, so we just fire-and-forget
 * (the new tab opens regardless of the gtag call timing).
 */
export const GithubOutboundTracking = () => {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.includes("github.com")) return;
      if (typeof window.gtag !== "function") return;
      window.gtag("event", "conversion", {
        send_to: "AW-1058581148/bZxnCP3W6sYcEJzV4vgD",
      });
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
};
