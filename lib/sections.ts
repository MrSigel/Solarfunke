import {
  HelpCircle,
  Route,
  Sparkles,
  Star,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { faqItems } from "@/lib/faq";

/**
 * =============================================================
 *  Zentrale Section-Registry
 * =============================================================
 *  EINZIGE Quelle der Wahrheit für:
 *    - die Navigationspunkte (Icon + Label, Blob-Reihenfolge)
 *    - den Scroll-Spy (aktive Sektion per id)
 *    - die Suche (Titel + Keywords)
 *    - das Rendern der Sektionen auf der Seite (inkl. Hintergrundfarbe)
 *
 *  SPÄTER ERWEITERN:
 *    Neue Sektion? Einfach einen Eintrag hier ergänzen – Nav, Scroll-Spy
 *    und Suche übernehmen ihn automatisch. Icon aus lucide-react tauschen,
 *    `navLabel`/`title`/`keywords` anpassen, fertig.
 * =============================================================
 */

export type SectionBackground = "white" | "green";

export interface SectionDef {
  /** Anker-id für Scroll-Navigation (muss eindeutig sein). */
  id: string;
  /** Kurzer Text im Nav-Punkt (unter dem Icon). */
  navLabel: string;
  /** Überschrift der Sektion + Titel in Suchergebnissen. */
  title: string;
  /** Suchbegriffe – erweitert die Trefferbasis der Suche. */
  keywords: string[];
  /** Icon über dem Nav-Punkt (Platzhalter – später austauschbar). */
  icon: LucideIcon;
  /** Hintergrund der Sektion – setzt die Farbregel sichtbar um. */
  background: SectionBackground;
}

/**
 * Inhaltsabschnitte der Landingpage.
 * Hintergründe wechseln bewusst Weiß / Grün (durchgehender Farbwechsel).
 * `keywords` speisen die Suche – großzügig gefüllt, damit alle relevanten
 * Begriffe gefunden werden.
 */
export const sections: SectionDef[] = [
  {
    id: "abschnitt-1",
    navLabel: "FAQ",
    title: "Häufige Fragen",
    // Die FAQ-Fragen + deren Keywords fließen zentral in die Suche ein, damit
    // die Landingpage-Suche jeden FAQ-Eintrag findet (DRY: aus lib/faq.ts).
    keywords: [
      "faq",
      "fragen",
      "häufige fragen",
      "antworten",
      "hilfe",
      "kosten",
      "preis",
      "förderung",
      "dauer",
      "dach",
      "ablauf",
      "wirtschaftlichkeit",
      ...faqItems.flatMap((f) => [f.question, ...(f.keywords ?? [])]),
    ],
    icon: HelpCircle,
    background: "white",
  },
  {
    id: "abschnitt-2",
    navLabel: "Ablauf",
    title: "So funktioniert's",
    keywords: [
      "ablauf",
      "so funktioniert's",
      "so funktionierts",
      "schritte",
      "in drei schritten",
      "anfrage",
      "anfrage stellen",
      "beratung",
      "kostenlose beratung",
      "angebot",
      "installation",
      "montage",
      "inbetriebnahme",
      "prozess",
    ],
    icon: Route,
    background: "green",
  },
  {
    id: "abschnitt-3",
    navLabel: "Vorteile",
    title: "Warum Solarfunke",
    keywords: [
      "vorteile",
      "warum solarfunke",
      "gründe",
      "argumente",
      "stromkosten",
      "stromkosten senken",
      "sparen",
      "unabhängigkeit",
      "strompreise",
      "förderung",
      "förderungen",
      "wertsteigerung",
      "immobilie",
      "eigenverbrauch",
    ],
    icon: Sparkles,
    background: "white",
  },
  {
    id: "abschnitt-4",
    navLabel: "Bewertungen",
    title: "Google-Bewertungen",
    keywords: [
      "bewertungen",
      "google",
      "google bewertungen",
      "sterne",
      "rezensionen",
      "erfahrungen",
      "kundenstimmen",
      "referenzen",
      "trust",
      "vertrauen",
      "4,8",
    ],
    icon: Star,
    background: "green",
  },
  {
    // Abschluss-CTA (nach Entfernen des alten Abschnitt 5 auf 5 umnummeriert –
    // die Nav bleibt so lückenlos 1–5).
    id: "abschnitt-5",
    navLabel: "Anfrage",
    title: "Jetzt Anfrage starten",
    keywords: [
      "anfrage",
      "anfrage starten",
      "jetzt starten",
      "loslegen",
      "angebot",
      "angebot anfordern",
      "kontakt",
      "beratung",
      "kostenlos",
    ],
    icon: Rocket,
    // Sektion selbst WEISS (für den durchgehenden Weiß/Grün-Wechsel); der
    // kräftige grüne CTA sitzt als Panel darin.
    background: "white",
  },
];

/**
 * Einfache Volltextsuche über die Registry.
 * Durchsucht Titel, Nav-Label und Keywords (case-insensitive, alle Wörter).
 * Leerer Query -> alle Sektionen (damit das Overlay direkt eine Liste zeigt).
 */
export function searchSections(query: string): SectionDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return sections;

  const terms = q.split(/\s+/);
  return sections.filter((section) => {
    const haystack = [
      section.title,
      section.navLabel,
      ...section.keywords,
    ]
      .join(" ")
      .toLowerCase();
    // Jeder Suchbegriff muss vorkommen (UND-Verknüpfung).
    return terms.every((term) => haystack.includes(term));
  });
}
