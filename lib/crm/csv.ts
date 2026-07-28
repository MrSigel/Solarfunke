import { type LeadRow, sourceLabel } from "@/lib/crm/leads";

/**
 * Wandelt Leads in eine CSV-Zeichenkette (Semikolon-getrennt, Excel-freundlich).
 * Enthält alle relevanten Spalten. Der Aufrufer exportiert genau die aktuell
 * gefilterte/sichtbare Auswahl.
 */
const HEADERS = [
  "Eingang",
  "Quelle",
  "Vorname",
  "Nachname",
  "Telefon",
  "E-Mail",
  "Straße",
  "Hausnummer",
  "PLZ",
  "Ort",
  "Zeitplan",
  "Eigentum",
  "Gebäude",
  "Status",
  "Archiviert",
  "Versendet",
  "Versendet am",
];

function esc(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function leadsToCsv(rows: LeadRow[]): string {
  const lines = [HEADERS.join(";")];
  for (const r of rows) {
    lines.push(
      [
        r.eingegangen_am ?? r.created_at,
        sourceLabel(r.quelle),
        r.vorname,
        r.nachname,
        r.telefon,
        r.email,
        r.strasse,
        r.hausnummer,
        r.plz,
        r.ort,
        r.zeitplan,
        r.eigentum,
        r.gebaeude,
        r.status,
        r.archiviert ? "ja" : "nein",
        r.versendet ? "ja" : "nein",
        r.versendet_am,
      ]
        .map(esc)
        .join(";"),
    );
  }
  return lines.join("\r\n");
}

/** Löst den CSV-Download im Browser aus (UTF-8 mit BOM für Excel). */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
