import { type ReactNode } from "react";

/**
 * Zweispalten-Konvention (Text links / Medium rechts) für spätere Sektionen.
 *
 * Grundregel aus dem Briefing, hier als wiederverwendbare Konvention verankert:
 *   - Beide Spalten auf GLEICHER HÖHE (items-stretch) und optisch gleichem
 *     Gewicht (Standard: gleich breite Spalten).
 *   - Auf Mobil sauber untereinander.
 *
 * Verwendung später z. B.:
 *   <TwoCol
 *     left={<Textblock … />}
 *     right={<Bild/Video … className="h-full w-full object-cover" />}
 *   />
 *
 * `ratio` erlaubt bei Bedarf ungleiche, aber bewusst gesetzte Gewichtungen.
 */
export function TwoCol({
  left,
  right,
  ratio = "1-1",
  reverseOnMobile = false,
  className = "",
}: {
  left: ReactNode;
  right: ReactNode;
  ratio?: "1-1" | "3-2" | "2-3";
  reverseOnMobile?: boolean;
  className?: string;
}) {
  const cols =
    ratio === "3-2"
      ? "lg:grid-cols-[3fr_2fr]"
      : ratio === "2-3"
        ? "lg:grid-cols-[2fr_3fr]"
        : "lg:grid-cols-2";

  return (
    <div
      className={`grid grid-cols-1 items-stretch gap-10 lg:gap-16 ${cols} ${className}`}
    >
      <div className={`flex flex-col justify-center ${reverseOnMobile ? "order-2 lg:order-1" : ""}`}>
        {left}
      </div>
      <div className={`flex flex-col justify-center ${reverseOnMobile ? "order-1 lg:order-2" : ""}`}>
        {right}
      </div>
    </div>
  );
}
