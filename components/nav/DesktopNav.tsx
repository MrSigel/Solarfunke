"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { sections } from "@/lib/sections";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Desktop-Navigation mit gleitendem Blob/Pill-Indikator.
 *
 * Verhalten:
 *   - Jeder Nav-Punkt = Icon oben, Text darunter (Text bleibt IMMER sichtbar).
 *   - Hinter dem AKTIVEN bzw. GEHOVERTEN Punkt liegt eine gelbe Pill (Blob).
 *   - Der Blob gleitet flüssig animiert zum Punkt unter der Maus.
 *   - Maus weg -> Blob kehrt zum aktiven (Scroll-Spy-)Punkt zurück.
 *   - `scrolled` schaltet die kompakte (kleinere) Darstellung.
 */
export function DesktopNav({
  activeId,
  scrolled,
}: {
  activeId: string;
  scrolled: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [rects, setRects] = useState<Rect[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );

  // Ziel des Blobs: gehoverter Punkt, sonst aktiver Punkt.
  const targetIndex = hoveredIndex ?? activeIndex;
  const blob = rects[targetIndex];

  /** Position/Größe jedes Nav-Punkts relativ zur Liste vermessen. */
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const base = list.getBoundingClientRect();
    const next: Rect[] = itemRefs.current.map((el) => {
      if (!el) return { left: 0, top: 0, width: 0, height: 0 };
      const r = el.getBoundingClientRect();
      return {
        left: r.left - base.left,
        top: r.top - base.top,
        width: r.width,
        height: r.height,
      };
    });
    setRects(next);
  }, []);

  // Nach Mount messen.
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Bei Größenänderungen neu messen: Fenster-Resize + das Schrumpfen der Nav
  // (die Item-Größen animieren, ResizeObserver auf der Liste fängt das ab).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(list);
    itemRefs.current.forEach((el) => el && ro.observe(el));

    window.addEventListener("resize", measure);
    // Während der Schrumpf-Transition mehrfach nachmessen.
    const timers = [0, 120, 260, 400].map((ms) =>
      window.setTimeout(measure, ms),
    );

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [measure, scrolled]);

  return (
    <nav aria-label="Hauptnavigation" className="relative">
      <ul
        ref={listRef}
        className="relative flex items-stretch gap-1"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Gleitender Blob (grüne Pill) – liegt HINTER den Punkten. */}
        {blob && blob.width > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-0 rounded-pill bg-nav-blob transition-[left,top,width,height] duration-[420ms] ease-blob motion-reduce:transition-none"
            style={{
              left: blob.left,
              top: blob.top,
              width: blob.width,
              height: blob.height,
            }}
          />
        )}

        {sections.map((section, i) => {
          const Icon = section.icon;
          const isActive = i === activeIndex;
          const isOnBlob = i === targetIndex;
          return (
            <li key={section.id} className="relative z-10">
              <a
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                onMouseEnter={() => setHoveredIndex(i)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                className={[
                  "group flex flex-col items-center justify-center rounded-pill text-center transition-all duration-300 ease-smooth",
                  // Kompakt vs. voll: Padding & Icon-Abstand schrumpfen mit.
                  scrolled ? "gap-0.5 px-4 py-1.5" : "gap-1.5 px-5 py-2.5",
                  // Textfarbe: auf dem grünen Blob Weiß (guter Kontrast),
                  // sonst gedämpft in Grün auf hellem Header, Hover hebt an.
                  isOnBlob ? "text-on-forest" : "text-ink-soft hover:text-forest",
                ].join(" ")}
              >
                <Icon
                  aria-hidden="true"
                  className={[
                    "shrink-0 transition-all duration-300 ease-smooth",
                    scrolled ? "h-4 w-4" : "h-5 w-5",
                  ].join(" ")}
                  strokeWidth={2}
                />
                <span
                  className={[
                    "font-body font-medium leading-none transition-all duration-300 ease-smooth",
                    scrolled ? "text-[0.72rem]" : "text-[0.8rem]",
                  ].join(" ")}
                >
                  {section.navLabel}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
