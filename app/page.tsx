import { Header } from "@/components/nav/Header";
import { Hero } from "@/components/sections/Hero";
import { FaqSection } from "@/components/sections/FaqSection";
import { AblaufSection } from "@/components/sections/AblaufSection";
import { VorteileSection } from "@/components/sections/VorteileSection";
import { BewertungenSection } from "@/components/sections/BewertungenSection";
import { AbschlussCtaSection } from "@/components/sections/AbschlussCtaSection";
import { Footer } from "@/components/layout/Footer";
import { ExitIntentBanner } from "@/components/banners/ExitIntentBanner";
import { sections } from "@/lib/sections";

/**
 * Landingpage.
 *  - Sticky Header (Navigation, Blob, Suche, Scroll-Spy).
 *  - Inhaltsabschnitte aus der zentralen Registry (abwechselnd Weiß / Grün),
 *    jeder mit eigener id für Scroll-Navigation & Suche.
 */
export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero mit Lead-Wizard (enthält den Anker id="top" für "nach oben") */}
        <Hero />

        {/* Abschnitt 1 = FAQ, 2 = Ablauf, 3 = Vorteile, 4 = Bewertungen,
            5 = Abschluss-CTA. id/Hintergrund aus der zentralen Registry. */}
        {sections.map((section) => {
          if (section.id === "abschnitt-1")
            return <FaqSection key={section.id} section={section} />;
          if (section.id === "abschnitt-2")
            return <AblaufSection key={section.id} section={section} />;
          if (section.id === "abschnitt-3")
            return <VorteileSection key={section.id} section={section} />;
          if (section.id === "abschnitt-4")
            return <BewertungenSection key={section.id} section={section} />;
          if (section.id === "abschnitt-5")
            return <AbschlussCtaSection key={section.id} section={section} />;
          return null;
        })}
      </main>

      <Footer />

      {/* Exit-Intent-Overlay (nur Landingpage) */}
      <ExitIntentBanner />
    </>
  );
}
