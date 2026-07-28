import Image from "next/image";

/**
 * Marken-Logo im Header (Link zum Seitenanfang #top).
 *
 * - Echtes horizontales Solarfunke-Logo (Icon + Schriftzug) aus
 *   /public/logo/solarfunke.png via next/image, `priority` (above-the-fold).
 * - Seitenverhältnis ZWINGEND erhalten: feste Höhe, Breite automatisch,
 *   object-contain – nichts wird gestaucht, verzerrt oder abgeschnitten.
 * - Höhe zentral über Tokens steuerbar: --logo-h (voll) / --logo-h-scrolled
 *   (geschrumpft) / --logo-h-mobile (mobil). Beim Schrumpfen der Nav skaliert
 *   das Logo proportional mit (gleiche Transition wie die Nav).
 * - Kein Layout-Shift: width/height geben das Seitenverhältnis vor.
 *
 * Intrinsische Maße der (randbereinigten) Datei: 473 × 149 (~3,17:1).
 * Transparenter Hintergrund – sitzt sauber auf dem hellen (frosted) Header.
 */
export function Logo({ scrolled }: { scrolled: boolean }) {
  return (
    <a
      href="#top"
      aria-label="Solarfunke – zum Seitenanfang"
      className="flex items-center"
    >
      <Image
        src="/logo/solarfunke-nav.png"
        alt="Solarfunke"
        width={473}
        height={149}
        priority
        className={[
          "w-auto object-contain transition-all duration-300 ease-smooth",
          // Höhe je nach Zustand – Breite folgt automatisch (kein Verzerren).
          scrolled
            ? "h-[var(--logo-h-scrolled)]"
            : "h-[var(--logo-h-mobile)] lg:h-[var(--logo-h)]",
        ].join(" ")}
      />
    </a>
  );
}
