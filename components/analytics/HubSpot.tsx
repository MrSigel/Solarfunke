"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_KEY, CONSENT_CHANGED_EVENT } from "@/lib/consent";

/**
 * HubSpot Tracking-/Embed-Code (EU-Region, Portal 149003885).
 *
 * Einwilligungsbasiert: HubSpot setzt Tracking-Cookies und wird daher ERST
 * geladen, wenn im Cookie-Banner „Alle akzeptieren" gewählt wurde (konsistent
 * zur Datenschutzerklärung). Sonst wird der Code nicht eingebunden.
 */
const HUBSPOT_ID = "149003885";

export function HubSpot() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        if (window.localStorage.getItem(CONSENT_KEY) === "accepted") {
          setEnabled(true);
        }
      } catch {
        /* ignore */
      }
    };
    check(); // bereits erteilte Einwilligung berücksichtigen
    window.addEventListener(CONSENT_CHANGED_EVENT, check);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, check);
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="hs-script-loader"
      src={`https://js-eu1.hs-scripts.com/${HUBSPOT_ID}.js`}
      strategy="afterInteractive"
    />
  );
}
