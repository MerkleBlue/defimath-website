"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DocsNav = [
  { id: 1, navItem: "Overview", hash: "overview" },
  { id: 2, navItem: "Installation", hash: "installation" },
  { id: 3, navItem: "Math", hash: "math" },
  { id: 4, navItem: "Options", hash: "options" },
  { id: 5, navItem: "Binary options", hash: "binary" },
  { id: 6, navItem: "Futures", hash: "futures" },
  { id: 7, navItem: "Rates", hash: "rates" },
  { id: 8, navItem: "Statistics", hash: "statistics" },
];

export const DocNavigation = () => {
  const [active, setActive] = useState("overview");
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const sections = DocsNav
      .map((item) => document.getElementById(item.hash))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target.id);
          } else {
            visibleRef.current.delete(entry.target.id);
          }
        }
        // Pick the topmost section currently in the "active zone"
        const topmost = DocsNav.find((item) => visibleRef.current.has(item.hash));
        if (topmost) setActive(topmost.hash);
      },
      {
        // Top: account for fixed header + padding. Bottom: keep active zone in upper half.
        rootMargin: "-200px 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-0.5 mt-4 items-start fixed pe-4">
      {DocsNav.map((item) => (
        <Link
          key={item.id}
          href={`#${item.hash}`}
          onClick={() => setActive(item.hash)}
          className={`py-2.5 hover:bg-primary/20 hover:text-primary dark:hover:text-primary xl:min-w-60 lg:min-w-52 min-w-full px-4 rounded-md text-base font-medium ${
            item.hash === active
              ? "bg-primary text-darkmode"
              : "text-muted text-opacity-60"
          }`}
        >
          {item.navItem}
        </Link>
      ))}
    </div>
  );
};
