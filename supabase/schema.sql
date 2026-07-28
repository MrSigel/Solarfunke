-- =============================================================
--  Solarfunke – Supabase-Schema (Leads + CRM)
-- =============================================================
--  Einmalig im Supabase SQL-Editor ausführen. Danach:
--    - schreiben die Formulare (Hero-Wizard + Mini-Lead-Blöcke) über
--      /api/leads in diese Tabelle (Rolle anon, nur INSERT),
--    - liest/aktualisiert das interne CRM die Leads (eingeloggte Nutzer,
--      Rolle authenticated).
--
--  Die Spalten entsprechen dem Lead-Objekt aus lib/lead.ts + CRM-Feldern.
-- =============================================================

create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- Schritt 1 (Objekt-Fragen aus dem Hero-Wizard)
  vorhaben       text,
  zeitplan       text,          -- "Wann soll es losgehen?"
  eigentum       text,          -- "Immobilie im Eigentum?" (Ja/Nein)
  gebaeude       text,          -- Gebäudeart

  -- Schritt 2 / Mini-Lead (Kontaktdaten)
  vorname        text,
  nachname       text,
  strasse        text,
  hausnummer     text,
  plz            text,
  ort            text,
  telefon        text,
  email          text,
  datenschutz    boolean,

  -- Herkunft / Zeit
  quelle         text,          -- landingpage:hero-wizard, faq-mini-lead, …
  eingegangen_am timestamptz,

  -- CRM-Felder
  status         text not null default 'neu'
                   check (status in ('neu','kontaktiert','verkauft','versendet')),
  archiviert     boolean not null default false,
  -- "versendet"-Automatik kommt später; Felder jetzt schon anlegen, manuell setzbar.
  versendet      boolean not null default false,
  versendet_am   timestamptz,
  batch_id       uuid
);

-- Neueste zuerst
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------
--  Row Level Security
-- ---------------------------------------------------------------
alter table public.leads enable row level security;

-- Anonyme Formulare dürfen NUR einfügen (kein Lesen/Ändern).
drop policy if exists "anon insert leads" on public.leads;
create policy "anon insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Eingeloggte CRM-Nutzer dürfen alle Leads lesen …
drop policy if exists "authenticated read leads" on public.leads;
create policy "authenticated read leads"
  on public.leads for select
  to authenticated
  using (true);

-- … und aktualisieren (Status, Archivierung, versendet-Flag).
drop policy if exists "authenticated update leads" on public.leads;
create policy "authenticated update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------
--  CRM-Zugang
-- ---------------------------------------------------------------
--  Die beiden CRM-Nutzer im Supabase-Dashboard unter
--  Authentication > Users manuell anlegen (E-Mail + Passwort).
--  Es werden KEINE Zugangsdaten im Code/Repo hinterlegt.
-- ---------------------------------------------------------------
