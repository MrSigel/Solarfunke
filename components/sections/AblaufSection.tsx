import {
  ClipboardList,
  Handshake,
  Wrench,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MiniLeadBlock } from "@/components/lead/MiniLeadBlock";
import { type SectionDef } from "@/lib/sections";

/**
 * Abschnitt 2 – "So funktioniert's" (Ablauf in 3 Schritten) + Mini-Lead-Block.
 *  - Grüne Fläche (#02462E), weiße Schritt-Karten, Akzent Gelb (#FEC700) für
 *    Nummern/Icons.
 *  - 3 Karten nebeneinander (Desktop) bzw. gestapelt (Mobil), alle auf gleicher
 *    Höhe/Gewicht. Pfeile verbinden die Schritte als Reihenfolge (rechts auf
 *    Desktop, nach unten auf Mobil).
 *  - Darunter der wiederverwendbare Mini-Lead-Block (Quelle: ablauf-mini-lead).
 *
 * Texte lassen sich hier zentral anpassen.
 */

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    title: "Anfrage stellen",
    description:
      "Sie schildern uns Ihr Vorhaben – online in wenigen Minuten und völlig unverbindlich.",
    icon: ClipboardList,
  },
  {
    title: "Kostenlose Beratung & Angebot",
    description:
      "Ein passender Fachbetrieb aus Ihrer Region berät Sie individuell und erstellt ein transparentes, auf Sie zugeschnittenes Angebot.",
    icon: Handshake,
  },
  {
    title: "Installation",
    description:
      "Bei Beauftragung übernimmt der regionale Fachbetrieb Montage und Inbetriebnahme Ihrer Anlage.",
    icon: Wrench,
  },
];

/** Einzelne Schritt-Karte (weiße Karte auf grüner Fläche, gleiche Höhe). */
function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6 lg:p-7">
      <div className="mb-5 flex items-center gap-3">
        {/* Nummer im gelben Kreis */}
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-accent-ink">
          {index + 1}
        </span>
        <Icon className="h-6 w-6 text-forest" aria-hidden="true" strokeWidth={2} />
      </div>
      <h3 className="text-h3 font-semibold text-ink">{step.title}</h3>
      <p className="mt-2 text-ink-soft">{step.description}</p>
    </div>
  );
}

/** Verbindungspfeil zwischen zwei Schritten (rechts / auf Mobil nach unten). */
function StepConnector() {
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <ChevronRight className="h-7 w-7 rotate-90 text-accent lg:rotate-0" strokeWidth={2.5} />
    </div>
  );
}

export function AblaufSection({ section }: { section: SectionDef }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="bg-forest py-24 text-on-forest md:py-32"
    >
      <Container>
        {/* --- Kopf: Überschrift + Einleitung --- */}
        <div className="max-w-prose">
          <p className="mb-4 font-mono text-eyebrow uppercase text-accent">
            So funktioniert's
          </p>
          <h2 id={`${section.id}-title`} className="text-h1 text-on-forest">
            In drei Schritten zur eigenen Solaranlage
          </h2>
          <p className="mt-5 text-lg text-on-forest/80">
            So bringt Solarfunke Sie mit einem passenden Fachbetrieb zusammen –
            klar strukturiert und ohne Umwege.
          </p>
        </div>

        {/* --- Teil 1: 3 Schritte, verbunden, gleiche Höhe --- */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-4">
          <StepCard step={STEPS[0]} index={0} />
          <StepConnector />
          <StepCard step={STEPS[1]} index={1} />
          <StepConnector />
          <StepCard step={STEPS[2]} index={2} />
        </div>

        {/* --- Teil 2: Mini-Lead-Block (Quelle: Ablauf) --- */}
        <div className="mt-14">
          <MiniLeadBlock source="ablauf-mini-lead" />
        </div>
      </Container>
    </section>
  );
}
