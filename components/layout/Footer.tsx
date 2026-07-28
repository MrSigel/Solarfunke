import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

/**
 * Footer – minimal, aber sauber. WEISSE Fläche (hält den durchgehenden
 * Weiß/Grün-Wechsel der Abschnitte intakt) mit feiner oberer Trennkante.
 *
 * WICHTIG: Der Footer gibt bewusst NICHTS über den Betreiber preis – keine
 * Adresse, Telefonnummer oder Kontaktdaten. Nur Marke, Pflicht-Links und
 * Copyright. Die gesetzlichen Angaben stehen auf /impressum.
 *
 * Auf weißem Grund kommt das echte (grüne) Logo sauber zur Geltung.
 */
export function Footer() {
  // Copyright-Jahr dynamisch (Build-/Renderzeit).
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper text-ink">
      <Container>
        <div className="flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          {/* Marke (echtes Logo) + Claim (Platzhalter) */}
          <div>
            <Link
              href="/"
              aria-label="Solarfunke – zur Startseite"
              className="flex items-center"
            >
              <Image
                src="/logo/solarfunke-nav.png"
                alt="Solarfunke"
                width={473}
                height={149}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 text-sm text-ink-soft">
              Photovoltaik einfach gemacht. {/* Platzhalter-Claim */}
            </p>
          </div>

          {/* Pflicht-Links (verlinken auf eigene Unterseiten) */}
          <nav aria-label="Rechtliches">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-sm text-ink-soft transition-colors hover:text-forest"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm text-ink-soft transition-colors hover:text-forest"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="border-t border-line py-6">
          <p className="text-sm text-ink-soft">© {year} Solarfunke</p>
        </div>
      </Container>
    </footer>
  );
}
