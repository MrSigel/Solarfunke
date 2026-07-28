/**
 * Google Ads / Consent-Mode-Helfer.
 * Zentral, damit Tag-ID und Consent-Logik an einer Stelle liegen.
 */
export const GADS_ID = "AW-18143565684";

/** localStorage-Key des Cookie-Banners ("accepted" | "necessary"). */
export const CONSENT_KEY = "solarfunke-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
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
