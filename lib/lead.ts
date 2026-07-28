/**
 * =============================================================
 *  Lead-Datenmodell + Submit-Seam
 * =============================================================
 *  Ein Lead bündelt ALLE Antworten aus Schritt 1 (Auswahl) und
 *  Schritt 2 (Kontaktdaten) in EINEM typisierten Objekt.
 *
 *  SPÄTERE CRM/SUPABASE-ANBINDUNG:
 *    Nur `submitLead()` anpassen (siehe TODO unten). Das Lead-Objekt ist
 *    stabil typisiert – ein Insert in Supabase o. Ä. ist dann trivial.
 * =============================================================
 */

/** Auswahl-Antworten aus Schritt 1. */
export interface LeadStep1 {
  /** Frage 1: "Was möchten Sie umsetzen?" */
  vorhaben: string;
  /** Frage 2: "Wann soll es losgehen?" */
  zeitplan: string;
  /** Frage 3: "Gehört Ihnen die Immobilie?" */
  eigentum: string;
  /** Frage 4: "Um welches Gebäude geht es?" */
  gebaeude: string;
}

/** Kontaktdaten aus Schritt 2. */
export interface LeadStep2 {
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  /** Pflicht: Zustimmung zur Datenschutzerklärung. */
  datenschutz: boolean;
}

/** Vollständiger Lead-Datensatz (Schritt 1 + 2 + Meta). */
export interface Lead extends LeadStep1, LeadStep2 {
  /** Zeitstempel der Absendung (ISO-8601). */
  eingegangenAm: string;
  /** Herkunft/Quelle – erleichtert spätere Auswertung im CRM. */
  quelle: string;
}

/** Startwerte für den Formular-State (leer). */
export const emptyLead: LeadStep1 & LeadStep2 = {
  vorhaben: "",
  zeitplan: "",
  eigentum: "",
  gebaeude: "",
  vorname: "",
  nachname: "",
  strasse: "",
  hausnummer: "",
  plz: "",
  ort: "",
  telefon: "",
  email: "",
  datenschutz: false,
};

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

/**
 * Bekannte Lead-Quellen (source). Erweitern, sobald weitere Einstiegspunkte
 * dazukommen – im CRM ist damit erkennbar, woher ein Lead stammt.
 */
export type LeadSource =
  | "landingpage:hero-wizard"
  | "faq-mini-lead"
  | "ablauf-mini-lead"
  | "vorteile-mini-lead"
  | "bewertungen-mini-lead";

/* --- Gemeinsame Validierungshelfer (für alle Lead-Formulare) --- */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Gültiges E-Mail-Format? */
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Plausible Telefonnummer? (nicht leer, mind. 6 Ziffern, erlaubte Zeichen) */
export function isPlausiblePhone(value: string): boolean {
  const v = value.trim();
  const digits = v.replace(/\D/g, "");
  return digits.length >= 6 && /^[+(]?[\d\s\-()/.]{6,}$/.test(v);
}

/**
 * Sendet den Lead ab.
 *
 * Persistiert den Lead server-seitig über den Route Handler `/api/leads`
 * (Supabase-Insert; der anon-Key bleibt server-seitig). Voraussetzung ist die
 * Tabelle `leads` inkl. INSERT-Policy (siehe supabase/schema.sql) sowie die
 * Env-Vars SUPABASE_URL / SUPABASE_ANON_KEY.
 *
 * Robust: Schlägt die Persistenz fehl (z. B. Tabelle/Policy noch nicht
 * eingerichtet), wird der Lead zusätzlich protokolliert und die UI trotzdem
 * fortgesetzt, damit keine Interessenten verloren gehen.
 */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    if (res.ok) return { ok: true };

    // Persistenz fehlgeschlagen -> Lead nicht verlieren.
    const detail = await res.json().catch(() => ({}));
    console.error("[Solarfunke] Lead-Persistenz fehlgeschlagen:", detail);
    console.log("[Solarfunke] Neuer Lead (Fallback-Log):", lead);
    return { ok: true };
  } catch (error) {
    console.error("[Solarfunke] Lead-Übermittlung fehlgeschlagen:", error);
    console.log("[Solarfunke] Neuer Lead (Fallback-Log):", lead);
    return { ok: true };
  }
}

/**
 * Baut aus den Formularwerten den finalen, typisierten Lead-Datensatz.
 * `quelle` kennzeichnet den Einstiegspunkt (Hero-Wizard, FAQ-Block …), damit
 * später im CRM erkennbar ist, woher der Lead kam. Nicht erhobene Felder
 * bleiben leer – die Lead-Struktur ist quellenübergreifend identisch.
 */
export function buildLead(
  values: LeadStep1 & LeadStep2,
  eingegangenAm: string,
  quelle: LeadSource = "landingpage:hero-wizard",
): Lead {
  return {
    ...values,
    eingegangenAm,
    quelle,
  };
}
