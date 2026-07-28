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
 * AKTUELL: Platzhalter – protokolliert den Datensatz nur (console.log).
 *
 * TODO (CRM/Supabase-Anbindung, separat via Claude Code gebaut):
 *   - Supabase-Client initialisieren (Env-Vars: NEXT_PUBLIC_SUPABASE_URL,
 *     SUPABASE-Key serverseitig).
 *   - Insert in die Tabelle `leads` mit exakt den Feldern dieses Objekts.
 *   - Idealerweise über eine Route Handler / Server Action, damit der
 *     Service-Key nicht im Client landet:
 *         await fetch("/api/leads", { method: "POST", body: JSON.stringify(lead) })
 *   - Fehlerbehandlung + ggf. Double-Opt-In/E-Mail-Benachrichtigung.
 *
 * Die Signatur (Lead rein, SubmitResult raus) bleibt dabei gleich – das
 * Andocken ist damit trivial.
 */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  // Vorläufiger Aufruf, bis die CRM/Supabase-Anbindung steht (siehe TODO oben).
  console.log("[Solarfunke] Neuer Lead (noch keine CRM-Anbindung):", lead);

  // Simuliert einen kurzen Netzwerk-Roundtrip, damit die UI den
  // Lade-/Erfolgszustand realistisch behandeln kann.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { ok: true };
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
