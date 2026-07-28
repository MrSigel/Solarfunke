import { supabase, isSupabaseConfigured } from "@/lib/crm/client";

/**
 * =============================================================
 *  CRM – Datenzugriff auf die Lead-Tabelle
 * =============================================================
 *  Liest/aktualisiert dieselbe Supabase-Tabelle `leads`, in die die Formulare
 *  schreiben (Schema: supabase/schema.sql). Ist Supabase nicht angebunden bzw.
 *  nicht erreichbar, greifen klar markierte Platzhalter-Dummydaten, damit das
 *  Dashboard sofort bedienbar ist. Das spätere Andocken bleibt trivial.
 * =============================================================
 */

export type LeadStatus = "neu" | "kontaktiert" | "verkauft" | "versendet";

export const LEAD_STATUSES: LeadStatus[] = [
  "neu",
  "kontaktiert",
  "verkauft",
  "versendet",
];

/** Anzeige-Label je Quelle (source) – konsistent zu den Formular-Quellen. */
export const SOURCE_LABELS: Record<string, string> = {
  "landingpage:hero-wizard": "Hero",
  "faq-mini-lead": "FAQ-Block",
  "ablauf-mini-lead": "Ablauf-Block",
  "vorteile-mini-lead": "Vorteile-Block",
  "bewertungen-mini-lead": "Bewertungen-Block",
};

export function sourceLabel(quelle: string | null): string {
  if (!quelle) return "–";
  return SOURCE_LABELS[quelle] ?? quelle;
}

/** Eine Zeile der Lead-Tabelle (Feldnamen identisch zum Supabase-Schema). */
export interface LeadRow {
  id: string;
  created_at: string;
  eingegangen_am: string | null;
  quelle: string | null;
  // Kontakt
  vorname: string | null;
  nachname: string | null;
  telefon: string | null;
  email: string | null;
  // Adresse
  strasse: string | null;
  hausnummer: string | null;
  plz: string | null;
  ort: string | null;
  // Objekt-Daten (Hero-Wizard)
  zeitplan: string | null;
  eigentum: string | null;
  gebaeude: string | null;
  // CRM
  status: LeadStatus;
  archiviert: boolean;
  versendet: boolean;
  versendet_am: string | null;
}

const LEAD_COLUMNS =
  "id, created_at, eingegangen_am, quelle, vorname, nachname, telefon, email, strasse, hausnummer, plz, ort, zeitplan, eigentum, gebaeude, status, archiviert, versendet, versendet_am";

/* ---------------------------------------------------------------
 *  Platzhalter-Dummydaten (nur wenn Supabase nicht verfügbar).
 *  TODO: entfällt automatisch, sobald die Supabase-Tabelle Daten liefert.
 * ------------------------------------------------------------- */
const DUMMY_LEADS: LeadRow[] = [
  {
    id: "demo-1",
    created_at: "2026-07-28T09:12:00.000Z",
    eingegangen_am: "2026-07-28T09:12:00.000Z",
    quelle: "landingpage:hero-wizard",
    vorname: "Anna",
    nachname: "Berger",
    telefon: "+49 170 1234567",
    email: "anna.berger@example.de",
    strasse: "Sonnenweg",
    hausnummer: "12",
    plz: "44577",
    ort: "Castrop-Rauxel",
    zeitplan: "Sofort",
    eigentum: "Ja",
    gebaeude: "Einfamilienhaus",
    status: "neu",
    archiviert: false,
    versendet: false,
    versendet_am: null,
  },
  {
    id: "demo-2",
    created_at: "2026-07-28T08:40:00.000Z",
    eingegangen_am: "2026-07-28T08:40:00.000Z",
    quelle: "faq-mini-lead",
    vorname: null,
    nachname: null,
    telefon: "+49 151 9876543",
    email: "kontakt@example.com",
    strasse: null,
    hausnummer: null,
    plz: null,
    ort: null,
    zeitplan: null,
    eigentum: null,
    gebaeude: null,
    status: "kontaktiert",
    archiviert: false,
    versendet: false,
    versendet_am: null,
  },
  {
    id: "demo-3",
    created_at: "2026-07-27T16:05:00.000Z",
    eingegangen_am: "2026-07-27T16:05:00.000Z",
    quelle: "ablauf-mini-lead",
    vorname: null,
    nachname: null,
    telefon: "+49 160 5551234",
    email: "info@example.org",
    strasse: null,
    hausnummer: null,
    plz: null,
    ort: null,
    zeitplan: null,
    eigentum: null,
    gebaeude: null,
    status: "verkauft",
    archiviert: false,
    versendet: false,
    versendet_am: null,
  },
  {
    id: "demo-4",
    created_at: "2026-07-27T11:20:00.000Z",
    eingegangen_am: "2026-07-27T11:20:00.000Z",
    quelle: "vorteile-mini-lead",
    vorname: null,
    nachname: null,
    telefon: "+49 152 4443322",
    email: "max@example.net",
    strasse: null,
    hausnummer: null,
    plz: null,
    ort: null,
    zeitplan: null,
    eigentum: null,
    gebaeude: null,
    status: "versendet",
    archiviert: false,
    versendet: true,
    versendet_am: "2026-07-27T12:00:00.000Z",
  },
  {
    id: "demo-5",
    created_at: "2026-07-26T14:33:00.000Z",
    eingegangen_am: "2026-07-26T14:33:00.000Z",
    quelle: "bewertungen-mini-lead",
    vorname: null,
    nachname: null,
    telefon: "+49 171 2223344",
    email: "familie.k@example.de",
    strasse: null,
    hausnummer: null,
    plz: null,
    ort: null,
    zeitplan: null,
    eigentum: null,
    gebaeude: null,
    status: "neu",
    archiviert: false,
    versendet: false,
    versendet_am: null,
  },
  {
    id: "demo-6",
    created_at: "2026-07-25T10:00:00.000Z",
    eingegangen_am: "2026-07-25T10:00:00.000Z",
    quelle: "landingpage:hero-wizard",
    vorname: "Thomas",
    nachname: "Wagner",
    telefon: "+49 173 8887766",
    email: "t.wagner@example.de",
    strasse: "Feldstraße",
    hausnummer: "7a",
    plz: "45894",
    ort: "Gelsenkirchen",
    zeitplan: "3–6 Monate",
    eigentum: "Nein",
    gebaeude: "Mehrfamilienhaus",
    status: "kontaktiert",
    archiviert: true,
    versendet: false,
    versendet_am: null,
  },
];

/** Ob gerade Dummydaten verwendet werden (für Hinweisbanner im Dashboard). */
export function usingDummyData(): boolean {
  return !isSupabaseConfigured;
}

/** Alle Leads laden (neueste zuerst). Fällt bei Fehlern auf Dummydaten zurück. */
export async function fetchLeads(): Promise<{ rows: LeadRow[]; demo: boolean }> {
  if (!supabase) return { rows: DUMMY_LEADS, demo: true };

  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_COLUMNS)
    .order("eingegangen_am", { ascending: false });

  if (error) {
    // z. B. Tabelle/Policy noch nicht eingerichtet -> Demo-Daten, klar geloggt.
    console.error("[CRM] Leads laden fehlgeschlagen:", error.message);
    return { rows: DUMMY_LEADS, demo: true };
  }
  return { rows: (data as LeadRow[]) ?? [], demo: false };
}

/** Status eines Leads setzen. Persistiert in Supabase (falls verfügbar). */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<boolean> {
  if (!supabase) return true; // Demo-Modus: nur lokale State-Änderung
  const patch: Record<string, unknown> = { status };
  // "versendet" hält zusätzlich das Flag/Zeitstempel konsistent.
  if (status === "versendet") {
    patch.versendet = true;
    patch.versendet_am = new Date().toISOString();
  }
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) console.error("[CRM] Status-Update fehlgeschlagen:", error.message);
  return !error;
}

/** Lead archivieren (kein echtes Löschen). */
export async function archiveLead(id: string): Promise<boolean> {
  if (!supabase) return true; // Demo-Modus
  const { error } = await supabase
    .from("leads")
    .update({ archiviert: true })
    .eq("id", id);
  if (error) console.error("[CRM] Archivieren fehlgeschlagen:", error.message);
  return !error;
}
