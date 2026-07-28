import { faqItems } from "@/lib/faq";

/**
 * =============================================================
 *  Structured Data (JSON-LD) für SEO / GEO / AEO
 * =============================================================
 *  - Organization + WebSite: Marken- und Vertrauenssignale (inkl. der echten
 *    Google-Bewertung 4,8 / 300+).
 *  - FAQPage: macht die FAQ für Answer-/Generative-Engines maschinenlesbar.
 *  Werte zentral hier anpassbar.
 * =============================================================
 */

export const SITE_URL = "https://solarfunke.de";

/** Echte Bewertungs-Kennzahlen (konsistent zur Bewertungen-Sektion). */
const RATING_VALUE = "4.8";
const REVIEW_COUNT = "300";

export const organizationJsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Solarfunke",
      url: SITE_URL,
      logo: `${SITE_URL}/logo/solarfunke-nav.png`,
      image: `${SITE_URL}/hero/hero-desktop.jpg`,
      description:
        "Solarfunke vermittelt Photovoltaik-Anlagen: unverbindliche Anfrage, kostenlose Beratung, transparentes Angebot und Förder-Check.",
      email: "kontakt@klickhafen.com",
      telephone: "+4915563535989",
      areaServed: "DE",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Gerther Straße 76",
        postalCode: "44577",
        addressLocality: "Castrop-Rauxel",
        addressCountry: "DE",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+4915563535989",
        email: "kontakt@klickhafen.com",
        availableLanguage: ["de"],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: RATING_VALUE,
        reviewCount: REVIEW_COUNT,
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Solarfunke",
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

/** FAQPage-Schema aus der zentralen FAQ-Registry (DRY). */
export const faqJsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};
