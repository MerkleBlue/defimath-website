"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Fires a Google Analytics `page_view` event on every client-side route change.
 *
 * The initial pageview is already emitted by `gtag('config', GA_ID)` in the
 * root layout's <head>, so the first mount is skipped to avoid double counting.
 */
export const AnalyticsPageviews = () => {
  const pathname = usePathname();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
};
