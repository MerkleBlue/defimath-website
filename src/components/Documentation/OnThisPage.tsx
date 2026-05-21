"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Heading = { id: string; text: string; level: number };

/**
 * Right-rail table of contents — auto-discovers <h2 id> and <h3 id> elements
 * inside [data-docs-content], lists them, and highlights the active one as you scroll.
 */
export const OnThisPage = () => {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const container = document.querySelector("[data-docs-content]");
    if (!container) return;

    const found: Heading[] = Array.from(
      container.querySelectorAll("h2[id], h3[id]")
    ).map((el) => ({
      id: el.id,
      text: el.textContent?.trim() ?? "",
      level: Number(el.tagName[1]),
    }));

    setHeadings(found);
    visibleRef.current = new Set();
    if (found.length === 0) return;

    setActiveId(found[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target.id);
          } else {
            visibleRef.current.delete(entry.target.id);
          }
        }
        const topmost = found.find((h) => visibleRef.current.has(h.id));
        if (topmost) setActiveId(topmost.id);
      },
      { rootMargin: "-150px 0px -60% 0px", threshold: 0 }
    );

    found.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <div className="sticky top-32 ps-2 max-h-[calc(100vh-9rem)] overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted text-opacity-60 mb-3">
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-s border-dark_border border-opacity-40">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1.5 ps-3 -ms-px border-s text-sm ${
                activeId === h.id
                  ? "text-primary border-primary"
                  : "text-muted text-opacity-60 border-transparent hover:text-primary"
              } ${h.level === 3 ? "ps-6" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
