import { Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MiniLeadBlock } from "@/components/lead/MiniLeadBlock";
import { type SectionDef } from "@/lib/sections";

/**
 * Abschnitt 4 – Google-Bewertungen (Trust) + Mini-Lead-Block.
 *  - Grüne Fläche (#02462E), Sterne in Gelb (#FEC700).
 *  - Zeigt AUSSCHLIESSLICH die echten Werte: Schnitt 4,8 / 5, "300+ Bewertungen",
 *    Google-Bezug. KEINE erfundenen Zitate/Zahlen.
 *  - Darunter der wiederverwendbare Mini-Lead-Block (Quelle: bewertungen-mini-lead).
 *
 * Werte sind über die Konstanten unten leicht austauschbar.
 */

/* --- Echte Kennzahlen (leicht anpassbar) --- */
const RATING = 4.8; // Bewertungsschnitt (für Sterne-Füllung)
const RATING_MAX = 5;
const RATING_DISPLAY = RATING.toString().replace(".", ","); // "4,8"
const REVIEW_COUNT = "300+"; // Anzahl Bewertungen

/**
 * Sterne-Darstellung mit sauberer Teilfüllung (z. B. 4,8 von 5).
 * Untere Ebene: leere Sterne. Obere Ebene: gefüllte Sterne, auf den Prozentwert
 * beschnitten (identisches Layout -> die Teilfüllung sitzt exakt).
 */
function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const stars = Array.from({ length: max });
  return (
    <div
      className="relative inline-flex"
      role="img"
      aria-label={`${value.toString().replace(".", ",")} von ${max} Sternen`}
    >
      {/* leere Sterne */}
      <div className="flex gap-1 text-line">
        {stars.map((_, i) => (
          <Star key={i} className="h-9 w-9" strokeWidth={1.5} aria-hidden="true" />
        ))}
      </div>
      {/* gefüllte Sterne, beschnitten auf pct% */}
      <div
        className="absolute inset-0 flex gap-1 overflow-hidden text-accent"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        {stars.map((_, i) => (
          <Star key={i} className="h-9 w-9 shrink-0 fill-current" strokeWidth={1.5} />
        ))}
      </div>
    </div>
  );
}

export function BewertungenSection({ section }: { section: SectionDef }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="bg-forest py-24 text-on-forest md:py-32"
    >
      <Container>
        {/* --- Kopf: Überschrift + Einleitung (Platzhalter) --- */}
        <div className="max-w-prose">
          <p className="mb-4 font-mono text-eyebrow uppercase text-accent">
            Bewertungen
          </p>
          <h2 id={`${section.id}-title`} className="text-h1 text-on-forest">
            Das sagen unsere Kundinnen und Kunden
          </h2>
          <p className="mt-5 text-lg text-on-forest/80">
            Zahlreiche Kundinnen und Kunden vertrauen auf Solarfunke – das
            spiegelt sich in unseren Google-Bewertungen.
          </p>
        </div>

        {/* --- Teil 1: Trust-Element (weiße Karte auf grüner Fläche) --- */}
        <div className="mt-12 rounded-2xl border border-line bg-paper p-8 md:p-10">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-center md:gap-12 md:text-left">
            {/* Schnitt */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold leading-none text-forest">
                {RATING_DISPLAY}
              </span>
              <span className="text-lg text-ink-soft">/ {RATING_MAX}</span>
            </div>

            <div className="hidden h-16 w-px bg-line md:block" aria-hidden="true" />

            {/* Sterne + Anzahl */}
            <div className="flex flex-col items-center gap-2 md:items-start">
              <StarRating value={RATING} max={RATING_MAX} />
              <p className="text-ink-soft">
                <strong className="font-semibold text-ink">{REVIEW_COUNT}</strong>{" "}
                Bewertungen
              </p>
            </div>

            <div className="hidden h-16 w-px bg-line md:block" aria-hidden="true" />

            {/* Google-Bezug – Text-Label als Platzhalter (kein fremdes Logo-Asset). */}
            <div className="flex flex-col items-center gap-1 md:items-start">
              <span className="font-display text-lg font-semibold text-ink">
                Google Bewertungen
              </span>
              <span className="text-sm text-ink-soft">
                {/* TODO: offizielles Google-Bewertungen-Badge/Logo später ergänzen. */}
                Verifizierte Bewertungen bei Google
              </span>
            </div>
          </div>
        </div>

        {/* --- Teil 2: Mini-Lead-Block (Quelle: Bewertungen) --- */}
        <div className="mt-14">
          <MiniLeadBlock source="bewertungen-mini-lead" />
        </div>
      </Container>
    </section>
  );
}
