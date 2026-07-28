import Image from "next/image";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LeadWizard } from "@/components/wizard/LeadWizard";

/**
 * Hero-Sektion mit Vollbild-Hintergrund (Foto) + Lead-Wizard.
 *
 * Aufbau bleibt: LINKS Titel + Beschreibung, RECHTS der Wizard.
 *
 * Responsives Verhalten:
 *   - DESKTOP (lg+): Foto füllt die gesamte Hero-Fläche (fill/cover). Grüner
 *     Verlauf als Overlay – links stärker (Text lesbar), rechts heller (Foto
 *     bleibt erkennbar). Zweispaltig: Text links (weiß), Wizard rechts als
 *     solide weiße Karte, die klar auf dem Bild aufliegt.
 *   - MOBIL (<lg): gestapelt. Oben Bildband (Hochformat-Variante) mit Titel/
 *     Beschreibung darüber (weiß), darunter der Wizard als weiße Karte auf
 *     grüner Fläche. Kein wichtiger Bildinhalt verschwindet hinter der Karte.
 *
 * Feintuning zentral über Tokens in globals.css:
 *   --hero-min-h, --hero-overlay, --hero-pos-desktop, --hero-pos-mobile,
 *   --hero-img-h-mobile
 *
 * id="top" dient dem Logo-/"nach oben"-Anker in der Navigation.
 */

// Grüner Verlauf – Stärke skaliert über --hero-overlay (ein zentraler Regler).
const OVERLAY_DESKTOP =
  "linear-gradient(100deg," +
  " rgba(2,70,46,var(--hero-overlay)) 0%," +
  " rgba(2,70,46,calc(var(--hero-overlay) * 0.72)) 32%," +
  " rgba(2,70,46,calc(var(--hero-overlay) * 0.28)) 62%," +
  " rgba(2,70,46,calc(var(--hero-overlay) * 0.08)) 100%)";

const OVERLAY_MOBILE =
  "linear-gradient(180deg," +
  " rgba(2,70,46,calc(var(--hero-overlay) * 0.2)) 0%," +
  " rgba(2,70,46,calc(var(--hero-overlay) * 0.55)) 55%," +
  " rgba(2,70,46,calc(var(--hero-overlay) * 0.88)) 100%)";

/** Textblock (Headline + Beschreibung) – auf Desktop und Mobil wiederverwendet. */
function HeroCopy() {
  return (
    <>
      <p className="mb-4 font-mono text-eyebrow uppercase text-accent">
        Photovoltaik-Anfrage
      </p>
      {/* Platzhalter-Headline – später ersetzbar */}
      <h1 className="text-h1 text-white drop-shadow-sm">
        Ihre Solaranlage beginnt mit einer unverbindlichen Anfrage
      </h1>
      <p className="mt-5 max-w-prose text-lg text-white/90">
        In zwei kurzen Schritten zum passenden Angebot: Sie beantworten ein paar
        Fragen zu Ihrem Vorhaben, wir melden uns mit einer konkreten
        Einschätzung. Kostenlos und ohne Verpflichtung.
      </p>
    </>
  );
}

/** Trust-Hinweise (Platzhalter). */
function HeroTrust() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
      <li className="inline-flex items-center gap-2">
        <BadgeCheck className="h-5 w-5 text-accent" aria-hidden="true" />
        Kostenlos &amp; unverbindlich
      </li>
      <li className="inline-flex items-center gap-2">
        <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
        In 2 Minuten erledigt
      </li>
      <li className="inline-flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
        Daten DSGVO-konform
      </li>
    </ul>
  );
}

export function Hero() {
  return (
    <section id="top" aria-label="Einstieg" className="relative bg-forest">
      {/* ============ DESKTOP: Vollbild-Foto als Hintergrund ============ */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/hero/hero-desktop.jpg"
          alt="Familie vor ihrem Haus mit Photovoltaik-Anlage, mit Blick Richtung Anfrageformular"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "var(--hero-pos-desktop)" }}
        />
        {/* Grüner Verlauf – links stärker, rechts heller */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: OVERLAY_DESKTOP }}
        />
      </div>

      {/* ============ MOBIL: Bildband oben mit Titel ============ */}
      <div className="relative lg:hidden">
        <div
          className="relative w-full"
          style={{ height: "var(--hero-img-h-mobile)" }}
        >
          <Image
            src="/hero/hero-mobile.jpg"
            alt="Familie vor ihrem Haus mit Photovoltaik-Anlage"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "var(--hero-pos-mobile)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundImage: OVERLAY_MOBILE }}
          />
          {/* Titel/Beschreibung über dem Bild (unten ausgerichtet, gut lesbar) */}
          <Container className="absolute inset-0 flex flex-col justify-end pb-6 pt-[calc(var(--header-h)+1rem)]">
            <HeroCopy />
          </Container>
        </div>
      </div>

      {/* ============ Inhalt ============ */}
      <Container
        className="relative flex flex-col justify-center lg:min-h-[var(--hero-min-h)]"
      >
        {/* Desktop: Text links (viel freie Bildfläche für die Familie),
            schmale Formular-Karte rechts. Spaltenbreiten über --hero-form-w. */}
        <div
          className="hidden items-center gap-12 py-24 lg:grid"
          style={{ gridTemplateColumns: "1fr var(--hero-form-w)" }}
        >
          <div className="flex max-w-prose flex-col">
            <HeroCopy />
            <div className="mt-8">
              <HeroTrust />
            </div>
          </div>
          {/* Karte rechts, schmal – gibt links Bildfläche für das zeigende Kind frei */}
          <div className="justify-self-end">
            <LeadWizard />
          </div>
        </div>

        {/* Mobil: Wizard als weiße Karte auf grüner Fläche (Titel steht im Band) */}
        <div className="py-8 lg:hidden">
          <LeadWizard />
          <div className="mt-8">
            <HeroTrust />
          </div>
        </div>
      </Container>
    </section>
  );
}
