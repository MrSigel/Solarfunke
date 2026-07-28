"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/sections";

/**
 * Scroll-Spy: liefert die id der Sektion, die gerade im Viewport-Zentrum liegt.
 * Nutzt IntersectionObserver mit einem "Fokusband" in der Bildschirmmitte
 * (rootMargin), sodass immer genau eine Sektion als aktiv gilt.
 */
export function useActiveSection(): string {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Sichtbarste Sektion innerhalb des Fokusbandes gewinnt.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // schmales Band um die Bildschirmmitte -> klare Aktiv-Erkennung
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return activeId;
}

/**
 * Liefert true, sobald über einen Schwellwert hinaus gescrollt wurde.
 * Wird fürs kompakte Schrumpfen der Navigation genutzt.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll(); // Initialzustand (z. B. bei Reload mitten auf der Seite)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
