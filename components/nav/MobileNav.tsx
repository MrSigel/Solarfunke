"use client";

import { useEffect } from "react";
import { sections } from "@/lib/sections";

/**
 * Mobile Navigation: klassische vertikale Liste (Icon + Text pro Zeile).
 * Kein Blob nötig. Öffnet/schließt über das Burger-Icon im Header.
 * Der aktive Punkt (Scroll-Spy) wird dezent mit gelbem Akzent markiert.
 */
export function MobileNav({
  open,
  activeId,
  onClose,
}: {
  open: boolean;
  activeId: string;
  onClose: () => void;
}) {
  // ESC schließt, Body-Scroll sperren solange offen.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden">
      {/* Abgedunkelter Hintergrund */}
      <button
        type="button"
        aria-label="Menü schließen"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-forest/40 backdrop-blur-sm"
      />

      {/* Menü-Panel unter dem Header */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed inset-x-0 top-[var(--header-h-scrolled)] z-40 border-t border-line bg-paper px-4 pb-6 pt-2 shadow-nav-scrolled"
      >
        <ul className="flex flex-col">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={onClose}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "flex items-center gap-4 rounded-lg px-4 py-3.5 transition-colors",
                    isActive
                      ? "bg-accent/20 text-forest"
                      : "text-ink hover:bg-paper-sunk",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-accent text-accent-ink"
                        : "bg-paper-sunk text-forest",
                    ].join(" ")}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-lg font-medium">
                    {section.navLabel}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
