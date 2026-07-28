import Script from "next/script";
import { GADS_ID, CONSENT_KEY } from "@/lib/consent";

/**
 * Google Ads (gtag.js) – Tag AW-18143565684.
 *
 * Eingebunden über next/script. Mit Google Consent Mode v2:
 *  - Standardmäßig sind Ad-/Analytics-Cookies VERWEIGERT (DSGVO-konform und
 *    passend zur Datenschutzerklärung – Tracking nur mit Einwilligung).
 *  - Hat der Besucher im Cookie-Banner „Alle akzeptieren" gewählt (Wert im
 *    localStorage), wird die Einwilligung sofort erteilt.
 *  - Der Cookie-Banner aktualisiert die Einwilligung live (siehe lib/consent.ts).
 */
export function GoogleAds() {
  return (
    <>
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Consent Mode v2 – Standard: verweigert, bis Einwilligung vorliegt.
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });

          // Bereits erteilte Einwilligung ("Alle akzeptieren") berücksichtigen.
          try {
            if (window.localStorage.getItem('${CONSENT_KEY}') === 'accepted') {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
            }
          } catch (e) {}

          gtag('config', '${GADS_ID}');

          // Google-Ads Conversion-Helfer (verzögerte Navigation): feuert die
          // "Kontakt"-Conversion und öffnet danach die übergebene URL.
          window.gtagSendEvent = function(url) {
            var callback = function () {
              if (typeof url === 'string') { window.location = url; }
            };
            gtag('event', 'ads_conversion_Kontakt_1', {
              'event_callback': callback,
              'event_timeout': 2000
            });
            return false;
          };
        `}
      </Script>
    </>
  );
}
