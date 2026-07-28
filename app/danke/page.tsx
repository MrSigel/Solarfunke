import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vielen Dank",
  description: "Ihre Anfrage ist bei uns eingegangen.",
  robots: { index: false, follow: false },
};

/**
 * Danke-Seite (/danke).
 * Ziel der Weiterleitung nach erfolgreichem Absenden des Lead-Wizards.
 */
export default function DankePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest px-6 py-24 text-on-forest">
      <div className="w-full max-w-xl text-center">
        <span className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink">
          <CheckCircle2 className="h-9 w-9" strokeWidth={2} aria-hidden="true" />
        </span>

        <p className="mb-4 font-mono text-eyebrow uppercase text-accent">
          Anfrage eingegangen
        </p>

        <h1 className="text-h1 text-on-forest">Vielen Dank!</h1>

        <p className="mx-auto mt-6 max-w-prose text-lg text-on-forest/80">
          Ihre Anfrage ist bei uns eingegangen – wir melden uns in Kürze bei
          Ihnen. Vielen Dank für Ihr Interesse an Solarfunke.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-body font-semibold text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
