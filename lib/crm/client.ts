import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase-Browser-Client für das CRM (Auth + Lead-Zugriff).
 *
 * Nutzt den öffentlichen anon-Key (per Design öffentlich; die Daten sind über
 * RLS geschützt). Ist die Konfiguration nicht gesetzt, bleibt der Client `null`
 * und das CRM läuft im klar markierten Platzhalter-/Demo-Modus (Dummydaten).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
