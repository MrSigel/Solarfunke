import { NextResponse } from "next/server";
import type { Lead } from "@/lib/lead";

/**
 * POST /api/leads
 * Nimmt einen Lead entgegen und schreibt ihn server-seitig in die Supabase-
 * Tabelle `leads` (via PostgREST). Der anon-Key bleibt server-seitig und wird
 * NICHT ins Client-Bundle gebündelt.
 *
 * Voraussetzung: Tabelle `leads` + INSERT-Policy für `anon` (siehe
 * supabase/schema.sql). Env-Vars: SUPABASE_URL, SUPABASE_ANON_KEY.
 */
export const runtime = "nodejs";

/** Nur bekannte Felder übernehmen (keine Fremdfelder in die DB schreiben). */
function toRow(lead: Partial<Lead>) {
  return {
    vorhaben: lead.vorhaben ?? null,
    zeitplan: lead.zeitplan ?? null,
    eigentum: lead.eigentum ?? null,
    gebaeude: lead.gebaeude ?? null,
    vorname: lead.vorname ?? null,
    nachname: lead.nachname ?? null,
    strasse: lead.strasse ?? null,
    hausnummer: lead.hausnummer ?? null,
    plz: lead.plz ?? null,
    ort: lead.ort ?? null,
    telefon: lead.telefon ?? null,
    email: lead.email ?? null,
    datenschutz: Boolean(lead.datenschutz),
    quelle: lead.quelle ?? null,
    eingegangen_am: lead.eingegangenAm ?? new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Nicht konfiguriert – der Aufrufer behandelt das als „nicht persistiert".
    return NextResponse.json(
      { ok: false, error: "supabase-not-configured" },
      { status: 501 },
    );
  }

  let lead: Partial<Lead>;
  try {
    lead = (await request.json()) as Partial<Lead>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  // Mindestprüfung: ohne E-Mail oder Telefon kein sinnvoller Lead.
  if (!lead.email && !lead.telefon) {
    return NextResponse.json({ ok: false, error: "missing-contact" }, { status: 400 });
  }

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRow(lead)),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[Solarfunke] Supabase-Insert fehlgeschlagen:", res.status, detail);
    return NextResponse.json(
      { ok: false, error: "insert-failed", status: res.status },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
