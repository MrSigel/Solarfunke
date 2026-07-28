"use client";

import { useEffect, useState } from "react";
import { X, ArrowUp } from "lucide-react";

/**
 * Exit-Intent-Banner (zentriertes Overlay).
 *
 * Erscheint EINMAL pro Session, wenn der Mauszeiger den oberen Rand verlässt
 * (typisches Exit-Intent-Signal auf Desktop). Kein eigenes Formular – der
 * Button führt zurück zum Hero-Formular (#top).
 *
 * Schließbar per X, ESC und Klick auf den Hintergrund. Nach Anzeige gemerkt
 * (sessionStorage), damit er nicht erneut stört.
 */
const SHOWN_KEY = "solarfunke-exit-shown";

export function ExitIntentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Bereits in dieser Session gezeigt? Dann nichts tun.
    try {
      if (window.sessionStorage.getItem(SHOWN_KEY)) return;
    } catch {
      /* ignore */
    }

    const onMouseOut = (e: MouseEvent) => {
      // Zeiger verlässt das Fenster nach oben (kein relatedTarget, y <= 0).
      if (!e.relatedTarget && e.clientY <= 0) {
        try {
          window.sessionStorage.setItem(SHOWN_KEY, "1");
        } catch {
          /* ignore */
        }
        setOpen(true);
        document.removeEventListener("mouseout", onMouseOut);
      }
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  // ESC schließt; Body-Scroll sperren solange offen.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function goToForm() {
    setOpen(false);
    const hero = document.getElementById("top");
    hero?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
    >
      {/* Abgedunkelter Hintergrund – Klick schließt. */}
      <button
        type="button"
        aria-label="Schließen"
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-forest/50 backdrop-blur-sm"
      />

      {/* Dialog-Karte */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-paper p-8 text-center shadow-overlay sm:p-10">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Schließen"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-sunk hover:text-forest"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <p className="mb-3 font-mono text-eyebrow uppercase text-ink-soft">
          Schon zurück?
        </p>
        {/* Platzhalter-Texte, später leicht austauschbar. */}
        <h2 id="exit-title" className="text-h2 font-semibold text-ink">
          Sichern Sie sich Ihr kostenloses Angebot
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-ink-soft">
          In nur zwei Minuten zur unverbindlichen Anfrage – wir melden uns mit
          einer konkreten Einschätzung.
        </p>

        <button
          type="button"
          onClick={goToForm}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 font-body text-base font-semibold text-accent-ink transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:bg-accent-hover"
        >
          Zur Anfrage
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
