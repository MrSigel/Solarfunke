import Script from "next/script";

/**
 * HubSpot Tracking-/Embed-Code (EU-Region, Portal 149003885).
 *
 * Wird site-weit UNBEDINGT geladen (bewusst vorgesetzt), damit HubSpot von
 * Anfang an trackt und Besucher/Leads erfasst.
 *
 * Hinweis: HubSpot setzt Cookies. Für die DSGVO-Konformität sollte HubSpot in
 * der Datenschutzerklärung als eingesetzter Dienst genannt werden; die
 * Consent-Steuerung erfolgt hier bewusst NICHT über den Seiten-Cookie-Banner.
 */
const HUBSPOT_ID = "149003885";

export function HubSpot() {
  return (
    <Script
      id="hs-script-loader"
      src={`https://js-eu1.hs-scripts.com/${HUBSPOT_ID}.js`}
      strategy="afterInteractive"
    />
  );
}
