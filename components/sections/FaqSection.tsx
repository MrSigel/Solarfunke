import { Container } from "@/components/layout/Container";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { MiniLeadBlock } from "@/components/lead/MiniLeadBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { type SectionDef } from "@/lib/sections";

/**
 * Erster Inhaltsabschnitt unter dem Hero (Abschnitt 1).
 * Zwei Teile untereinander:
 *   1. FAQ (Akkordeon)
 *   2. Kompakter Mini-Lead-Block (Telefon + E-Mail)
 *
 * Nutzt id/Hintergrund aus der zentralen Section-Registry (Scroll-Spy/Suche).
 */
export function FaqSection({ section }: { section: SectionDef }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="bg-paper py-24 text-ink md:py-32"
    >
      {/* FAQPage-Structured-Data (AEO/GEO): macht die Q&A maschinenlesbar. */}
      <JsonLd data={faqJsonLd} />
      <Container>
        {/* --- Kopf: Überschrift + Einleitung --- */}
        <div className="max-w-prose">
          <p className="mb-4 font-mono text-eyebrow uppercase text-ink-soft">
            Häufige Fragen
          </p>
          <h2 id={`${section.id}-title`} className="text-h1 text-ink">
            Antworten auf die wichtigsten Fragen
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            Hier beantworten wir die häufigsten Fragen rund um Photovoltaik –
            von den Kosten über die Förderung bis zum Ablauf.
          </p>
        </div>

        {/* --- Teil 1: FAQ-Akkordeon --- */}
        <div className="mt-10">
          <FaqAccordion />
        </div>

        {/* --- Teil 2: Mini-Lead-Block (Quelle: FAQ) --- */}
        <div className="mt-14">
          <MiniLeadBlock source="faq-mini-lead" />
        </div>
      </Container>
    </section>
  );
}
