/**
 * Google Ads / Consent-Mode-Helfer.
 * Zentral, damit Tag-ID und Consent-Logik an einer Stelle liegen.
 */
export const GADS_ID = "AW-18143565684";

/** localStorage-Key des Cookie-Banners ("accepted" | "necessary"). */
export const CONSENT_KEY = "solarfunke-cookie-consent";

/** Google-Ads Conversion für abgeschickte Kontakt-/Lead-Anfragen. */
export const CONVERSION_KONTAKT = "ads_conversion_Kontakt_1";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    gtagSendEvent?: (url?: string) => boolean;
  }
}

/**
 * Feuert die Google-Ads-"Kontakt"-Conversion und ruft danach `onDone`
 * (z. B. Weiterleitung auf /danke). Verzögert die Navigation kurz, damit das
 * Event noch gesendet wird – mit Sicherheitsnetz, falls der Callback ausbleibt
 * (kein gtag, geblockt o. Ä.).
 */
export function trackKontaktConversion(onDone: () => void): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    onDone();
    return;
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onDone();
  };
  window.gtag("event", CONVERSION_KONTAKT, {
    event_callback: finish,
    event_timeout: 2000,
  });
  window.setTimeout(finish, 2000);
}

/**
 * Aktualisiert Google Consent Mode (v2) entsprechend der Cookie-Einwilligung.
 * granted = "Alle akzeptieren", sonst verweigert (nur notwendige Cookies).
 */
export function updateAdsConsent(granted: boolean): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const value = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}
