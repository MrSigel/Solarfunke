import { Container } from "@/components/layout/Container";
import { ScrollToHeroButton } from "@/components/cta/ScrollToHeroButton";
import { type SectionDef } from "@/lib/sections";

/**
 * Abschnitt 5 – finaler Abschluss-CTA.
 *  - Sektionsfläche WEISS (hält den durchgehenden Weiß/Grün-Wechsel intakt),
 *    der kräftige CTA sitzt als GRÜNES Panel (#02462E) darin – so poppt der
 *    gelbe Button weiterhin auf grünem Grund.
 *  - EIN gelber Button als Blickfang. Button scrollt animiert nach oben zum
 *    Hero-Formular (#top). KEIN eigenes Formular, KEIN Mini-Lead-Block.
 *  - Bewusst KEINE Angaben über den Betreiber.
 *
 * Texte sind Platzhalter und später leicht austauschbar.
 */
export function AbschlussCtaSection({ section }: { section: SectionDef }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="bg-paper py-24 text-ink md:py-32"
    >
      <Container>
        {/* Kräftiges grünes CTA-Panel auf weißer Sektionsfläche. */}
        <div className="rounded-3xl bg-forest px-6 py-16 text-on-forest md:px-16 md:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="mb-4 font-mono text-eyebrow uppercase text-accent">
              Jetzt starten
            </p>
            <h2 id={`${section.id}-title`} className="text-h1 text-on-forest">
              Bereit für Ihre eigene Solaranlage?
            </h2>
            <p className="mt-5 text-lg text-on-forest/80">
              Starten Sie jetzt Ihre unverbindliche Anfrage – in nur zwei Minuten.
            </p>
            <div className="mt-9">
              <ScrollToHeroButton label="Anfrage starten" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
