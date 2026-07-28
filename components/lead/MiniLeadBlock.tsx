"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { FloatingField } from "@/components/wizard/FloatingField";
import {
  buildLead,
  emptyLead,
  isPlausiblePhone,
  isValidEmail,
  submitLead,
  type LeadSource,
} from "@/lib/lead";

/**
 * Wiederverwendbarer, kompakter Mini-Lead-Block (Telefon + E-Mail).
 *
 * Einsatz: unter FAQ, unter dem Ablauf und in weiteren Abschnitten. Die
 * einzige Pflicht-Unterscheidung ist die `source` (Quellen-Kennzeichnung fürs
 * CRM). Überschrift/Anreiz-Texte sind optional überschreibbare Platzhalter.
 *
 *  - Genau zwei Felder: Telefonnummer + E-Mail (Floating-Label + Icon,
 *    identisch zum Hero-Wizard über <FloatingField>).
 *  - Pflicht-Checkbox Datenschutz.
 *  - "Weiter" ist DEAKTIVIERT, bis Telefon plausibel, E-Mail gültig UND die
 *    Checkbox aktiv ist. Dezente Inline-Hinweise bei ungültiger Eingabe.
 *  - Beim Absenden: Lead mit der übergebenen `source` bündeln (gleiche
 *    Lead-Struktur wie alle anderen Leads) und zur /danke-Seite weiterleiten.
 */
export function MiniLeadBlock({
  source,
  eyebrow = "Kurz & unverbindlich",
  heading = "Mehr Informationen erhalten",
  description = "Telefon und E-Mail genügen – ein passender Fachbetrieb meldet sich mit den Details.",
}: {
  source: LeadSource;
  eyebrow?: string;
  heading?: string;
  description?: string;
}) {
  const router = useRouter();

  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [datenschutz, setDatenschutz] = useState(false);
  const [attempted, setAttempted] = useState(false); // schon einmal abgesendet?
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Einzelvalidierung
  const phoneOk = isPlausiblePhone(telefon);
  const emailOk = isValidEmail(email);
  const canSubmit = phoneOk && emailOk && datenschutz;

  // Fehlerhinweise erst NACH einem Absende-Versuch (bzw. Verlassen) zeigen.
  const [touched, setTouched] = useState({ telefon: false, email: false });
  const showPhoneError = (touched.telefon || attempted) && telefon !== "" && !phoneOk;
  const showEmailError = (touched.email || attempted) && email !== "" && !emailOk;

  useEffect(() => {
    if (attempted) setFormError(null);
  }, [telefon, email, datenschutz, attempted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) return;

    setSubmitting(true);
    // Lead bündeln – nicht erhobene Felder bleiben leer, Quelle je nach Abschnitt.
    const lead = buildLead(
      { ...emptyLead, telefon, email, datenschutz },
      new Date().toISOString(),
      source,
    );
    const result = await submitLead(lead);

    if (result.ok) {
      router.push("/danke");
    } else {
      setSubmitting(false);
      setFormError(result.error ?? "Beim Senden ist ein Fehler aufgetreten.");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper-sunk p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Anreiz-Text (Platzhalter, per Props überschreibbar) */}
        <div className="max-w-prose">
          <p className="mb-1 font-mono text-eyebrow uppercase text-ink-soft">
            {eyebrow}
          </p>
          <h3 className="text-h3 font-semibold text-ink">{heading}</h3>
          <p className="mt-2 text-ink-soft">{description}</p>
        </div>

        {/* Formular */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full lg:max-w-md lg:shrink-0"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FloatingField
              label="Telefonnummer"
              value={telefon}
              onChange={setTelefon}
              onBlur={() => setTouched((t) => ({ ...t, telefon: true }))}
              icon={Phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              error={showPhoneError ? "Bitte gültige Telefonnummer angeben." : undefined}
            />
            <FloatingField
              label="E-Mail"
              value={email}
              onChange={setEmail}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              error={showEmailError ? "Bitte gültige E-Mail-Adresse angeben." : undefined}
            />
          </div>

          {/* Pflicht-Checkbox Datenschutz */}
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={datenschutz}
              onChange={(e) => setDatenschutz(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={[
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1",
                datenschutz
                  ? "border-accent bg-accent text-accent-ink"
                  : attempted
                    ? "border-danger bg-paper"
                    : "border-line bg-paper",
              ].join(" ")}
            >
              {datenschutz && <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />}
            </span>
            <span className="text-sm text-ink-soft">
              Ich stimme der{" "}
              <a
                href="/datenschutz"
                className="font-medium text-forest underline underline-offset-2 hover:text-accent-hover"
                onClick={(e) => e.stopPropagation()}
              >
                Datenschutzerklärung
              </a>{" "}
              zu. *
            </span>
          </label>
          {attempted && !datenschutz && (
            <p className="mt-1.5 px-1 text-xs text-danger">
              Bitte der Datenschutzerklärung zustimmen.
            </p>
          )}

          {formError && (
            <p className="mt-3 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={[
              "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3",
              "font-body text-[0.95rem] font-semibold transition-all duration-200 ease-smooth",
              canSubmit && !submitting
                ? "bg-accent text-accent-ink hover:-translate-y-0.5 hover:bg-accent-hover"
                : "cursor-not-allowed bg-paper text-ink-soft",
            ].join(" ")}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird gesendet …
              </>
            ) : (
              <>
                Weiter
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
