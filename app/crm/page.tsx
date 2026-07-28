"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  Search,
  Download,
  Archive,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { getAuthState, signOut } from "@/lib/crm/auth";
import {
  fetchLeads,
  updateLeadStatus,
  archiveLead,
  sourceLabel,
  SOURCE_LABELS,
  LEAD_STATUSES,
  type LeadRow,
  type LeadStatus,
} from "@/lib/crm/leads";
import { leadsToCsv, downloadCsv } from "@/lib/crm/csv";

/* --- Hilfen --- */
function fmtDate(iso: string | null): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Farbklassen je Status (dezent). */
const STATUS_STYLE: Record<LeadStatus, string> = {
  neu: "bg-accent/20 text-accent-ink border-accent/40",
  kontaktiert: "bg-forest/10 text-forest border-forest/30",
  verkauft: "bg-forest text-on-forest border-forest",
  versendet: "bg-paper-sunk text-ink-soft border-line",
};

type SortKey = "eingegangen_am" | "quelle" | "nachname" | "status";

export default function CrmDashboardPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter / Suche / Sortierung
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("eingegangen_am");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  /* --- Route-Guard: nur mit Login erreichbar (sonst Redirect) --- */
  useEffect(() => {
    let active = true;
    getAuthState().then((state) => {
      if (!active) return;
      if (state === "anon") {
        router.replace("/crm-login");
        return;
      }
      // "authed" oder "not-configured" (Demo-Modus) -> Zugriff erlaubt
      setReady(true);
      fetchLeads().then(({ rows, demo }) => {
        if (!active) return;
        setLeads(rows);
        setDemo(demo);
        setLoading(false);
      });
    });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await signOut();
    router.replace("/crm-login");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "eingegangen_am" ? "desc" : "asc");
    }
  }

  async function changeStatus(id: string, status: LeadStatus) {
    // Optimistisch: lokal sofort setzen, dann persistieren.
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              versendet: status === "versendet" ? true : l.versendet,
              versendet_am:
                status === "versendet"
                  ? new Date().toISOString()
                  : l.versendet_am,
            }
          : l,
      ),
    );
    await updateLeadStatus(id, status);
  }

  async function handleArchive(id: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, archiviert: true } : l)),
    );
    await archiveLead(id);
  }

  /* --- Kennzahlen (aus nicht-archivierten Leads) --- */
  const kpis = useMemo(() => {
    const active = leads.filter((l) => !l.archiviert);
    const byStatus = (s: LeadStatus) =>
      active.filter((l) => l.status === s).length;
    return {
      total: active.length,
      neu: byStatus("neu"),
      kontaktiert: byStatus("kontaktiert"),
      verkauft: byStatus("verkauft"),
      versendet: byStatus("versendet"),
    };
  }, [leads]);

  /* --- Gefilterte, durchsuchte, sortierte Zeilen --- */
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = leads.filter((l) => {
      if (!showArchived && l.archiviert) return false;
      if (sourceFilter !== "all" && l.quelle !== sourceFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (q) {
        const hay = [l.vorname, l.nachname, l.telefon, l.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    rows = [...rows].sort((a, b) => {
      let av: string;
      let bv: string;
      if (sortKey === "eingegangen_am") {
        av = a.eingegangen_am ?? a.created_at;
        bv = b.eingegangen_am ?? b.created_at;
      } else if (sortKey === "quelle") {
        av = sourceLabel(a.quelle);
        bv = sourceLabel(b.quelle);
      } else if (sortKey === "nachname") {
        av = (a.nachname ?? "") + (a.vorname ?? "");
        bv = (b.nachname ?? "") + (b.vorname ?? "");
      } else {
        av = a.status;
        bv = b.status;
      }
      const cmp = av.localeCompare(bv, "de");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [leads, search, sourceFilter, statusFilter, showArchived, sortKey, sortDir]);

  function handleExport() {
    downloadCsv("solarfunke-leads.csv", leadsToCsv(visible));
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper-sunk">
        <Loader2 className="h-6 w-6 animate-spin text-forest" aria-hidden="true" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper-sunk">
      {/* ---- Kopf ---- */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Image
            src="/logo/solarfunke-nav.png"
            alt="Solarfunke"
            width={473}
            height={149}
            priority
            className="h-8 w-auto object-contain"
          />
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper-sunk"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Abmelden
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-h2 font-semibold text-ink">Leads</h1>

        {demo && (
          <p className="mt-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink-soft">
            Demo-Modus: Es werden Beispieldaten angezeigt. Sobald Supabase
            angebunden und die Tabelle befüllt ist, erscheinen hier die echten
            Leads.
          </p>
        )}

        {/* ---- Kennzahlen ---- */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Kpi label="Leads gesamt" value={kpis.total} />
          <Kpi label="Neu" value={kpis.neu} />
          <Kpi label="Kontaktiert" value={kpis.kontaktiert} />
          <Kpi label="Verkauft" value={kpis.verkauft} />
          <Kpi label="Versendet" value={kpis.versendet} />
        </div>

        {/* ---- Steuerung ---- */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative flex-1 lg:min-w-[16rem] lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche: Name, Telefon, E-Mail"
              className="h-11 w-full rounded-xl border border-line bg-paper pl-9 pr-3 text-sm text-ink outline-none focus:border-forest"
            />
          </div>

          <FilterSelect
            label="Quelle"
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { value: "all", label: "Alle Quellen" },
              ...Object.entries(SOURCE_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Alle Status" },
              ...LEAD_STATUSES.map((s) => ({ value: s, label: cap(s) })),
            ]}
          />

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="h-4 w-4 accent-forest"
            />
            Archivierte anzeigen
          </label>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-on-forest transition-colors hover:bg-forest-hover lg:ml-auto"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            CSV exportieren
          </button>
        </div>

        {/* ---- Tabelle ---- */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[64rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-sunk/60 text-xs uppercase tracking-wide text-ink-soft">
                  <Th onSort={() => toggleSort("eingegangen_am")} active={sortKey === "eingegangen_am"} dir={sortDir}>
                    Eingang
                  </Th>
                  <Th onSort={() => toggleSort("quelle")} active={sortKey === "quelle"} dir={sortDir}>
                    Quelle
                  </Th>
                  <Th onSort={() => toggleSort("nachname")} active={sortKey === "nachname"} dir={sortDir}>
                    Name
                  </Th>
                  <th className="px-3 py-3 font-semibold">Telefon</th>
                  <th className="px-3 py-3 font-semibold">E-Mail</th>
                  <th className="px-3 py-3 font-semibold">Adresse</th>
                  <th className="px-3 py-3 font-semibold">Zeitplan</th>
                  <th className="px-3 py-3 font-semibold">Eigentum</th>
                  <th className="px-3 py-3 font-semibold">Gebäude</th>
                  <Th onSort={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir}>
                    Status
                  </Th>
                  <th className="px-3 py-3 font-semibold">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={11} className="px-3 py-12 text-center text-ink-soft">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden="true" />
                    </td>
                  </tr>
                )}
                {!loading && visible.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-3 py-12 text-center text-ink-soft">
                      Keine Leads gefunden.
                    </td>
                  </tr>
                )}
                {!loading &&
                  visible.map((l) => (
                    <tr
                      key={l.id}
                      className={[
                        "border-b border-line last:border-0 align-top",
                        l.archiviert ? "opacity-60" : "",
                      ].join(" ")}
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                        {fmtDate(l.eingegangen_am ?? l.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className="rounded-full bg-paper-sunk px-2.5 py-1 text-xs font-medium text-forest">
                          {sourceLabel(l.quelle)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-ink">
                        {[l.vorname, l.nachname].filter(Boolean).join(" ") || "–"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink">
                        {l.telefon || "–"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink">
                        {l.email || "–"}
                      </td>
                      <td className="px-3 py-3 text-ink-soft">
                        {formatAddress(l)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                        {l.zeitplan || "–"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                        {l.eigentum || "–"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                        {l.gebaeude || "–"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <select
                          value={l.status}
                          onChange={(e) =>
                            changeStatus(l.id, e.target.value as LeadStatus)
                          }
                          aria-label="Status ändern"
                          className={[
                            "rounded-full border px-2.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-accent",
                            STATUS_STYLE[l.status],
                          ].join(" ")}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {cap(s)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {!l.archiviert ? (
                          <button
                            type="button"
                            onClick={() => handleArchive(l.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest"
                          >
                            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                            Archivieren
                          </button>
                        ) : (
                          <span className="text-xs text-ink-soft">Archiviert</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-soft">
          {visible.length} {visible.length === 1 ? "Lead" : "Leads"} angezeigt
        </p>
      </div>
    </main>
  );
}

/* ---------------- kleine Bausteine ---------------- */

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatAddress(l: LeadRow): string {
  const line1 = [l.strasse, l.hausnummer].filter(Boolean).join(" ");
  const line2 = [l.plz, l.ort].filter(Boolean).join(" ");
  const full = [line1, line2].filter(Boolean).join(", ");
  return full || "–";
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className="text-2xl font-bold text-forest">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">{label}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-line bg-paper px-3 text-sm text-ink outline-none focus:border-forest"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Th({
  children,
  onSort,
  active,
  dir,
}: {
  children: React.ReactNode;
  onSort: () => void;
  active: boolean;
  dir: "asc" | "desc";
}) {
  return (
    <th className="px-3 py-3 font-semibold">
      <button
        type="button"
        onClick={onSort}
        className={[
          "inline-flex items-center gap-1 transition-colors hover:text-forest",
          active ? "text-forest" : "",
        ].join(" ")}
      >
        {children}
        <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
        {active && <span className="sr-only">{dir === "asc" ? "aufsteigend" : "absteigend"}</span>}
      </button>
    </th>
  );
}
