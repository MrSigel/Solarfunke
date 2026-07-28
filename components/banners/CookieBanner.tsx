"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

/**
 * Cookie-Consent-Banner (dezenter Balken unten, nicht blockierend).
 *
 * Datenschutzfreundlich: Standardmäßig sind nur notwendige Cookies aktiv.
 * Die Auswahl wird in localStorage gespeichert und der Banner erscheint danach
 * nicht erneut.
 *
 * TODO: Sobald echtes Tracking/Analytics eingebunden wird, dieses erst nach
 * "Alle akzeptieren" laden (die Entscheidung liegt unter dem Key CONSENT_KEY).
 */
const CONSENT_KEY = "solarfunke-cookie-consent"; // "accepted" | "necessary"

export function CookieBanner() {
  // Erst nach dem Mount rendern (kein SSR/Hydration-Mismatch durch localStorage).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(choice: "accepted" | "necessary") {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* Speicherung nicht möglich – Banner trotzdem schließen. */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-shell flex-col gap-4 rounded-2xl border border-line bg-paper p-5 shadow-overlay sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div className="flex items-start gap-3">
          <Cookie
            className="mt-0.5 h-6 w-6 shrink-0 text-forest"
            aria-hidden="true"
            strokeWidth={2}
          />
          <p className="text-sm text-ink-soft">
            Wir verwenden Cookies. Notwendige Cookies sind für den Betrieb der
            Seite erforderlich; optionale nur mit Ihrer Zustimmung. Mehr dazu in
            der{" "}
            <Link
              href="/datenschutz"
              className="font-medium text-forest underline underline-offset-2 hover:text-accent-hover"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("necessary")}
            className="rounded-xl border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-sunk"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
