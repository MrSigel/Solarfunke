import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

/**
 * Schlichtes, gut lesbares Layout für Rechtstexte (/impressum, /datenschutz).
 * Bewusst KEIN Vollbild-Hero-Stil: schmaler Lesebereich, ruhige Typografie.
 *  - Minimaler Kopf: Logo (Link zur Startseite).
 *  - Inhalt in Lesebreite.
 *  - Gemeinsamer Footer (mit den Rechts-Links).
 */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      {/* Minimaler Kopf */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="Solarfunke – zur Startseite" className="flex items-center">
            <Image
              src="/logo/solarfunke-nav.png"
              alt="Solarfunke"
              width={473}
              height={149}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zur Startseite
          </Link>
        </div>
      </header>

      {/* Inhalt in Lesebreite */}
      <main className="bg-paper">
        <article className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
          <h1 className="text-h1 hyphens-auto break-words text-ink">{title}</h1>
          <div className="mt-8 space-y-5 hyphens-auto break-words text-ink-soft [&_a]:font-medium [&_a]:text-forest [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-h2 [&_h2]:font-semibold [&_h2]:text-ink [&_li]:leading-relaxed [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
