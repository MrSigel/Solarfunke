import { type ReactNode } from "react";

/**
 * Seiten-Container: nutzt die Breite großzügig aus.
 * - Breites Maximum (max-w-shell = 1600px), damit Inhalte NICHT in eine
 *   schmale zentrierte Spalte gequetscht werden.
 * - Großzügiger, aber nicht übertriebener Seitenrand (px). KEINE riesigen
 *   leeren Flächen links/rechts.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-shell px-6 sm:px-8 lg:px-12 xl:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
