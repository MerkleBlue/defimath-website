"use client";
import Link from "next/link";
import { useEffect } from "react";

/// Client-side redirect stub for pages whose URL moved. The site is a static
/// export (`output: "export"`), so Next.js `redirects()` don't apply — we
/// bounce the browser on mount and expose a visible fallback link for the
/// no-JS / crawler case. Pair this with `robots: { index: false }` and a
/// `canonical` pointing at `to` in the stub page's metadata so search engines
/// consolidate on the new URL.
export const DocsRedirect = ({ to, label }: { to: string; label: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <div className="py-20 text-center">
      <p className="text-base font-medium text-muted text-opacity-95">
        This page has moved.
      </p>
      <p className="mt-3">
        <Link href={to} className="text-primary underline text-base font-medium">
          Continue to {label} →
        </Link>
      </p>
    </div>
  );
};
