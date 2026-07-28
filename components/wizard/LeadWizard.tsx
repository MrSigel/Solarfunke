"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Home,
  Mailbox,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { OptionButton } from "@/components/wizard/OptionButton";
import { FloatingField } from "@/components/wizard/FloatingField";
import {
  buildLead,
  emptyLead,
  submitLead,
  type LeadStep1,
  type LeadStep2,
} from "@/lib/lead";
import { trackKontaktConversion } from "@/lib/consent";

/* -------------------------------------------------------------------------
 *  Konfiguration – Fragen & Felder (Texte später leicht ersetzbar)
 * ---------------------------------------------------------------------- */

/** Schritt 1: reine Auswahlfragen (Buttons, kein Tippen). */
const STEP1_QUESTIONS: {
  key: keyof LeadStep1;
  question: string;
  options: string[];
}[] = [
  { key: "vorhaben", question: "Was möchten Sie umsetzen?", options: ["Photovoltaik"] },
  {
    key: "zeitplan",
    question: "Wann soll es losgehen?",
    options: ["Sofort", "1–3 Monate", "3–6 Monate", "Keine Angabe"],
  },
  { key: "eigentum", question: "Gehört Ihnen die Immobilie?", options: ["Ja", "Nein"] },
  {
    key: "gebaeude",
    question: "Um welches Gebäude geht es?",
    options: [
      "Einfamilienhaus",
      "Zweifamilienhaus",
      "Mehrfamilienhaus",
      "Firmengebäude",
      "Freilandfläche",
      "Sonstiges",
    ],
  },
];

/** Schritt 2: Kontaktfelder inkl. passendem Icon + Rasterbreite. */
const STEP2_FIELDS: {
  key: keyof Omit<LeadStep2, "datenschutz">;
  label: string;
  icon: LucideIcon;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  span: string; // Tailwind col-span für das sm-Raster (6 Spalten)
}[] = [
  { key: "vorname", label: "Vorname", icon: User, autoComplete: "given-name", span: "sm:col-span-3" },
  { key: "nachname", label: "Nachname", icon: User, autoComplete: "family-name", span: "sm:col-span-3" },
  { key: "strasse", label: "Straße", icon: MapPin, autoComplete: "address-line1", span: "sm:col-span-4" },
  { key: "hausnummer", label: "Hausnummer", icon: Home, autoComplete: "address-line2", span: "sm:col-span-2" },
  { key: "plz", label: "PLZ", icon: Mailbox, autoComplete: "postal-code", inputMode: "numeric", span: "sm:col-span-2" },
  { key: "ort", label: "Ort", icon: Building2, autoComplete: "address-level2", span: "sm:col-span-4" },
  { key: "telefon", label: "Telefonnummer", icon: Phone, type: "tel", autoComplete: "tel", inputMode: "tel", span: "sm:col-span-3" },
  { key: "email", label: "E-Mail", icon: Mail, type: "email", autoComplete: "email", inputMode: "email", span: "sm:col-span-3" },
];

const REQUIRED_STEP2 = STEP2_FIELDS.map((f) => f.key);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = LeadStep1 & LeadStep2;
type Errors = Partial<Record<keyof Values, string>>;

/** Reine Validierung von Schritt 2 (Pflichtfelder + E-Mail-Format + Datenschutz). */
function validateStep2(values: Values): Errors {
  const errors: Errors = {};
  REQUIRED_STEP2.forEach((key) => {
    if (!String(values[key]).trim()) errors[key] = "Bitte ausfüllen.";
  });
  if (values.email.trim() && !EMAIL_RE.test(values.email)) {
    errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  }
  if (!values.datenschutz) {
    errors.datenschutz = "Bitte der Datenschutzerklärung zustimmen.";
  }
  return errors;
}

/* -------------------------------------------------------------------------
 *  Wizard
 * ---------------------------------------------------------------------- */

export function LeadWizard() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  // "Photovoltaik" (einzige Option der ersten Frage) ist von Anfang an vorausgewählt.
  const [values, setValues] = useState<Values>({
    ...emptyLead,
    vorhaben: "Photovoltaik",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false); // Absenden schon versucht?
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Wenn schon einmal abgesendet wurde, Fehler live nachführen.
  useEffect(() => {
    if (attempted) setErrors(validateStep2(values));
  }, [values, attempted]);

  /* --- Fortschritt: zwei feste Stufen (Schritt 1 = 50 %, Schritt 2 = 100 %) --- */
  const progress = step === 1 ? 50 : 100;

  /* --- Schritt 1: Auswahl (kein Auto-Advance, alle Fragen auf einer Seite) --- */
  function selectOption(key: keyof LeadStep1, option: string) {
    setValues((v) => ({ ...v, [key]: option }));
  }

  /* --- Ein "Weiter"-Klick von Schritt 1 zu Schritt 2 --- */
  function goNext() {
    setStep(2);
  }

  /* --- Zurück von Schritt 2 zu Schritt 1 --- */
  function goBack() {
    setStep(1);
  }

  function setField(key: keyof Values, val: string | boolean) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  /* --- Absenden --- */
  const canSubmit =
    REQUIRED_STEP2.every((k) => String(values[k]).trim()) &&
    EMAIL_RE.test(values.email) &&
    values.datenschutz;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setFormError(null);

    const validation = validateStep2(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    // Alle Antworten aus Schritt 1 + 2 als EIN Lead-Datensatz bündeln.
    const lead = buildLead(values, new Date().toISOString());
    const result = await submitLead(lead);

    if (result.ok) {
      // Google-Ads "Kontakt"-Conversion feuern, dann zur Danke-Seite.
      trackKontaktConversion(() => router.push("/danke"));
    } else {
      setSubmitting(false);
      setFormError(result.error ?? "Beim Senden ist ein Fehler aufgetreten.");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-overlay sm:p-6">
      {/* ---- Kopf: Fortschrittsbalken (nur "Schritt X/2") ---- */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="font-mono text-eyebrow uppercase text-ink-soft">
            Schritt {step}/2
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-paper-sunk"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={`Fortschritt: Schritt ${step} von 2`}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ---- Schritt 1: alle vier Objekt-Fragen auf EINER Seite ---- */}
      {step === 1 && (
        <div key="step-1" className="animate-[slideInRight_0.35s_ease-out]">
          <div className="space-y-4">
            {STEP1_QUESTIONS.map((q) => (
              <fieldset key={q.key}>
                <legend className="mb-2 text-sm font-semibold text-ink">
                  {q.question}
                </legend>
                <div
                  className={[
                    "grid gap-2",
                    q.options.length > 1 ? "sm:grid-cols-2" : "grid-cols-1",
                  ].join(" ")}
                >
                  {q.options.map((option) => (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={values[q.key] === option}
                      onClick={() => selectOption(q.key, option)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          {/* Ein "Weiter"-Button -> Schritt 2 */}
          <button
            type="button"
            onClick={goNext}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-body text-[0.95rem] font-semibold text-accent-ink transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Weiter
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ---- Schritt 2: Kontaktdaten (Floating-Label-Felder) ---- */}
      {step === 2 && (
        <form
          key="step-2"
          onSubmit={handleSubmit}
          noValidate
          className="animate-[slideInRight_0.35s_ease-out]"
        >
          <h3 className="mb-4 text-base font-semibold text-ink">
            Fast geschafft – Ihre Kontaktdaten
          </h3>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
            {STEP2_FIELDS.map((field) => (
              <div key={field.key} className={field.span}>
                <FloatingField
                  label={field.label}
                  value={values[field.key]}
                  onChange={(val) => setField(field.key, val)}
                  icon={field.icon}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  inputMode={field.inputMode}
                  required
                  error={errors[field.key]}
                />
              </div>
            ))}
          </div>

          {/* Pflicht-Checkbox: Datenschutz-Zustimmung */}
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.datenschutz}
              onChange={(e) => setField("datenschutz", e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={[
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1",
                values.datenschutz
                  ? "border-accent bg-accent text-accent-ink"
                  : errors.datenschutz
                    ? "border-danger bg-paper"
                    : "border-line bg-paper",
              ].join(" ")}
            >
              {values.datenschutz && <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />}
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
          {errors.datenschutz && (
            <p className="mt-1.5 px-1 text-xs text-danger">{errors.datenschutz}</p>
          )}

          {formError && (
            <p className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {formError}
            </p>
          )}

          {/* Aktionen */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={[
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3",
                "font-body text-[0.95rem] font-semibold transition-all duration-200 ease-smooth",
                canSubmit && !submitting
                  ? "bg-accent text-accent-ink hover:bg-accent-hover hover:-translate-y-0.5"
                  : "cursor-not-allowed bg-paper-sunk text-ink-soft",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird gesendet …
                </>
              ) : (
                "Absenden"
              )}
            </button>
          </div>
        </form>
      )}

      {/* ---- Fuß: Zurück-Navigation (nur in Schritt 2) ---- */}
      {step === 2 && (
        <button
          type="button"
          onClick={goBack}
          disabled={submitting}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-forest disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </button>
      )}
    </div>
  );
}
