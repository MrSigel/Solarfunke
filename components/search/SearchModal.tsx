"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { searchSections } from "@/lib/sections";

/**
 * Such-Overlay (Modal).
 *  - Zentriert, abgedunkelter Hintergrund.
 *  - Durchsucht die gesamte Landingpage über die zentrale Section-Registry
 *    (Titel + Keywords). Spätere Sektionen sind dadurch automatisch dabei.
 *  - Auswahl -> sanftes Scrollen zur Sektion (scroll to section).
 *  - Schließen per ESC und Klick auf den Hintergrund.
 *  - Tastatur: Pfeil hoch/runter navigiert, Enter wählt.
 */
export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const results = useMemo(() => searchSections(query), [query]);

  // Beim Öffnen: Fokus ins Feld, Body-Scroll sperren, alten Fokus merken.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setHighlight(0);
    // Fokus nach dem Paint setzen.
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // Highlight zurücksetzen, wenn sich die Trefferliste ändert.
  useEffect(() => {
    setHighlight(0);
  }, [query]);

  function goToSection(id: string) {
    onClose();
    // Nach dem Schließen zur Sektion scrollen.
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = results[highlight];
      if (chosen) goToSection(chosen.id);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Seite durchsuchen"
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onKeyDown={onKeyDown}
    >
      {/* Abgedunkelter Hintergrund – Klick schließt. */}
      <button
        type="button"
        aria-label="Suche schließen"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-forest/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      />

      {/* Dialog-Karte */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-paper shadow-overlay">
        {/* Suchfeld */}
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-ink-soft" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Seite durchsuchen …"
            className="w-full bg-transparent py-4 text-[1.05rem] text-ink placeholder:text-ink-soft/70 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[0.7rem] text-ink-soft sm:inline">
            ESC
          </kbd>
        </div>

        {/* Ergebnisse */}
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-ink-soft">
              Keine Treffer für „{query}“.
            </li>
          )}
          {results.map((section, i) => {
            const Icon = section.icon;
            const active = i === highlight;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => goToSection(section.id)}
                  onMouseEnter={() => setHighlight(i)}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                    active ? "bg-accent/20 text-forest" : "text-ink hover:bg-paper-sunk",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-accent text-accent-ink" : "bg-paper-sunk text-forest",
                    ].join(" ")}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-medium leading-tight">
                      {section.title}
                    </span>
                    <span className="block font-mono text-[0.7rem] uppercase tracking-wider text-ink-soft">
                      {section.keywords.slice(0, 3).join(" · ")}
                    </span>
                  </span>
                  {active && (
                    <CornerDownLeft
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-ink-soft"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
