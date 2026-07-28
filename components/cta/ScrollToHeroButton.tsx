"use client";

import { ArrowUp } from "lucide-react";

/**
 * Einziger Button des Abschluss-CTA.
 * Scrollt animiert nach oben zum Hero-Formular (#top) und fokussiert dort das
 * erste bedienbare Element des sichtbaren Wizards (kein eigenes Formular hier).
 */
export function ScrollToHeroButton({ label }: { label: string }) {
  function handleClick() {
    const hero = document.getElementById("top");
    if (!hero) return;

    hero.scrollIntoView({ behavior: "smooth", block: "start" });

    // Nach dem Scroll den Fokus sinnvoll ins Formular setzen (sichtbaren
    // Wizard bevorzugen; preventScroll, damit der smooth-Scroll nicht springt).
    window.setTimeout(() => {
      const candidates = Array.from(
        hero.querySelectorAll<HTMLElement>("[aria-pressed], input, button"),
      );
      const target =
        candidates.find((el) => el.offsetParent !== null) ?? candidates[0];
      target?.focus({ preventScroll: true });
    }, 600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 font-body text-base font-semibold text-accent-ink transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:bg-accent-hover"
    >
      {label}
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
