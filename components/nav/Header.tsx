"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/nav/Logo";
import { DesktopNav } from "@/components/nav/DesktopNav";
import { MobileNav } from "@/components/nav/MobileNav";
import { SearchModal } from "@/components/search/SearchModal";
import { useActiveSection, useScrolled } from "@/lib/hooks";

/**
 * Sticky Header (oben fixiert, mitscrollend).
 *
 * Layout Desktop:
 *   Links:  Text-Logo "Solarfunke" (Platzhalter).
 *   Mitte:  Navigationspunkte (Icon oben, Text unten) + gleitender Blob.
 *   Rechts: Lupen-Icon (Suche). Kein CTA-Button.
 *
 * Verhalten:
 *   - Schrumpft beim Runterscrollen kompakter (flüssig animiert).
 *   - Aktiver Punkt folgt der Scroll-Position (Scroll-Spy).
 *   - Lupe öffnet das Such-Overlay.
 *   - Mobil: Burger öffnet eine vertikale Liste.
 */
export function Header() {
  const activeId = useActiveSection();
  const scrolled = useScrolled();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={[
          // Frosted Glass: immer weiß + halbtransparent + Backdrop-Blur, mit
          // dezenter unterer Trennkante/Schatten – hebt die Nav klar vom Foto ab.
          "fixed inset-x-0 top-0 z-50 border-b border-line transition-all duration-300 ease-smooth",
          scrolled ? "shadow-nav-scrolled" : "shadow-[0_1px_0_0_var(--line)]",
        ].join(" ")}
        style={{
          // Höhe animiert zwischen voll und kompakt.
          height: scrolled
            ? "var(--header-h-scrolled)"
            : "var(--header-h)",
          // Deckkraft/Blur zentral über Tokens steuerbar.
          backgroundColor: `rgba(var(--nav-bg), ${
            scrolled ? "var(--nav-bg-opacity-scrolled)" : "var(--nav-bg-opacity)"
          })`,
          backdropFilter: "blur(var(--nav-blur))",
          WebkitBackdropFilter: "blur(var(--nav-blur))",
        }}
      >
        <Container className="flex h-full items-center justify-between gap-6">
          {/* Links: Marken-Logo (Link zum Seitenanfang) */}
          <Logo scrolled={scrolled} />

          {/* Mitte: Desktop-Navigation mit Blob */}
          <div className="hidden lg:block">
            <DesktopNav activeId={activeId} scrolled={scrolled} />
          </div>

          {/* Rechts: Suche (Lupe) + Burger (mobil). Kein CTA-Button. */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Seite durchsuchen"
              className="flex h-11 w-11 items-center justify-center rounded-pill text-forest transition-colors hover:bg-paper-sunk"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-pill text-forest transition-colors hover:bg-paper-sunk lg:hidden"
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="h-6 w-6" />
              ) : (
                <Menu aria-hidden="true" className="h-6 w-6" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobiles Menü */}
      <MobileNav
        open={mobileOpen}
        activeId={activeId}
        onClose={() => setMobileOpen(false)}
      />

      {/* Such-Overlay */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
