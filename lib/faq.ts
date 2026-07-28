/**
 * =============================================================
 *  Zentrale FAQ-Registry
 * =============================================================
 *  Fragen & Antworten für den FAQ-Abschnitt. EINZIGE Quelle für:
 *    - das FAQ-Akkordeon (Rendering)
 *    - die Landingpage-Suche (die Keywords/Fragen fließen in die
 *      Section-Registry ein -> lib/sections.ts)
 *
 *  SPÄTER: Einträge einfach hier anpassen/ergänzen – Akkordeon und Suche
 *  übernehmen sie automatisch.
 * =============================================================
 */

export interface FaqItem {
  /** stabile id (Anker/aria) */
  id: string;
  question: string;
  answer: string;
  /** zusätzliche Suchbegriffe (optional) */
  keywords?: string[];
}

export const faqItems: FaqItem[] = [
  {
    id: "faq-kosten",
    question: "Was kostet eine Photovoltaik-Anlage?",
    answer:
      "Die Kosten hängen von der Größe der Anlage, den gewählten Komponenten und einem optionalen Stromspeicher ab. Nach Ihrer Anfrage erstellt ein passender Fachbetrieb ein transparentes, auf Ihr Dach zugeschnittenes Angebot – ganz ohne versteckte Kosten.",
    keywords: ["preis", "kosten", "investition", "speicher"],
  },
  {
    id: "faq-foerderung",
    question: "Welche Förderungen gibt es?",
    answer:
      "Photovoltaik wird auf Bundes-, Landes- und teils kommunaler Ebene gefördert – etwa durch zinsgünstige Kredite oder Zuschüsse. Der vermittelte Fachbetrieb prüft im Rahmen der Beratung, welche Programme aktuell zu Ihrem Vorhaben passen.",
    keywords: ["förderung", "zuschuss", "kfw", "kredit", "subvention"],
  },
  {
    id: "faq-dauer",
    question: "Wie lange dauert die Installation?",
    answer:
      "Die eigentliche Montage einer typischen Anlage dauert in der Regel nur ein bis zwei Tage. Hinzu kommen Planung, Anmeldung und der Netzanschluss – den zeitlichen Rahmen stimmt der ausführende Fachbetrieb vorab mit Ihnen ab.",
    keywords: ["dauer", "zeit", "montage", "installation", "termin"],
  },
  {
    id: "faq-dacheignung",
    question: "Ist mein Dach für PV geeignet?",
    answer:
      "Die meisten Dächer eignen sich für Photovoltaik. Entscheidend sind Ausrichtung, Neigung und mögliche Verschattung. Diese Faktoren prüft der vermittelte Fachbetrieb individuell für Ihr Gebäude.",
    keywords: ["dach", "eignung", "ausrichtung", "neigung", "verschattung"],
  },
  {
    id: "faq-ablauf",
    question: "Wie läuft das Projekt ab?",
    answer:
      "Nach Ihrer Anfrage vermittelt Solarfunke Ihnen einen passenden Fachbetrieb aus Ihrer Region. Dieser übernimmt die Beratung, erstellt das Angebot und – bei Beauftragung – Planung, Montage und Inbetriebnahme.",
    keywords: ["ablauf", "prozess", "planung", "inbetriebnahme"],
  },
  {
    id: "faq-wirtschaftlichkeit",
    question: "Wann rechnet sich die Anlage?",
    answer:
      "Durch den eigenen Solarstrom und die Einspeisevergütung amortisiert sich eine Anlage meist innerhalb weniger Jahre. Ihre konkrete Wirtschaftlichkeitsrechnung erhalten Sie vom vermittelten Fachbetrieb zusammen mit dem Angebot.",
    keywords: ["wirtschaftlichkeit", "rendite", "amortisation", "eigenverbrauch", "einspeisung"],
  },
];
