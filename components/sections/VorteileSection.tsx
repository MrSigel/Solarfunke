import {
  PiggyBank,
  ShieldCheck,
  BadgeEuro,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MiniLeadBlock } from "@/components/lead/MiniLeadBlock";
import { type SectionDef } from "@/lib/sections";

/**
 * Abschnitt 3 – "Warum Solarfunke" (Vorteile) + Mini-Lead-Block.
 *  - Weiße Fläche (hebt sich vom grünen Abschnitt 2 ab), Akzent Gelb (#FEC700)
 *    für die Icon-Badges.
 *  - 4 Vorteil-Karten im sauberen Raster: Desktop nebeneinander (4 Spalten),
 *    Tablet 2 Spalten, Mobil gestapelt – alle auf gleicher Höhe/Gewicht.
 *  - Darunter der wiederverwendbare Mini-Lead-Block (Quelle: vorteile-mini-lead).
 *
 * Texte lassen sich hier zentral anpassen.
 */

interface Vorteil {
  title: string;
  description: string;
  icon: LucideIcon;
}

const VORTEILE: Vorteil[] = [
  {
    title: "Stromkosten senken",
    description:
      "Mit eigenem Solarstrom senken Sie Ihre laufenden Energiekosten spürbar – Monat für Monat.",
    icon: PiggyBank,
  },
  {
    title: "Unabhängig von Strompreisen",
    description:
      "Sie machen sich unabhängiger von steigenden Strompreisen und externen Anbietern.",
    icon: ShieldCheck,
  },
  {
    title: "Attraktive Förderungen",
    description:
      "Profitieren Sie von attraktiven Förderprogrammen – der vermittelte Fachbetrieb prüft die passenden für Sie.",
    icon: BadgeEuro,
  },
  {
    title: "Wertsteigerung der Immobilie",
    description:
      "Eine moderne PV-Anlage steigert nachhaltig den Wert Ihrer Immobilie.",
    icon: TrendingUp,
  },
];

/** Einzelne Vorteil-Karte (gleiche Höhe, gleiches Gewicht). */
function VorteilCard({ vorteil }: { vorteil: Vorteil }) {
  const Icon = vorteil.icon;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
      {/* Icon-Badge in Gelb (Akzent) */}
      <span className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-ink">
        <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={2} />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">
        {vorteil.title}
      </h3>
      <p className="mt-2 text-ink-soft">{vorteil.description}</p>
    </div>
  );
}

export function VorteileSection({ section }: { section: SectionDef }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="bg-paper py-24 text-ink md:py-32"
    >
      <Container>
        {/* --- Kopf: Überschrift + Einleitung --- */}
        <div className="max-w-prose">
          <p className="mb-4 font-mono text-eyebrow uppercase text-ink-soft">
            Warum Solarfunke
          </p>
          <h2 id={`${section.id}-title`} className="text-h1 text-ink">
            Gute Gründe für Ihre Solaranlage
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            Diese Vorteile sprechen für eine eigene Photovoltaik-Anlage – den
            passenden Fachbetrieb dafür vermittelt Solarfunke.
          </p>
        </div>

        {/* --- Teil 1: 4 Vorteile im Raster, gleiche Höhe --- */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VORTEILE.map((vorteil) => (
            <VorteilCard key={vorteil.title} vorteil={vorteil} />
          ))}
        </div>

        {/* --- Teil 2: Mini-Lead-Block (Quelle: Vorteile) --- */}
        <div className="mt-14">
          <MiniLeadBlock source="vorteile-mini-lead" />
        </div>
      </Container>
    </section>
  );
}
