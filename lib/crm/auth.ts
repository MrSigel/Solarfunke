import { supabase, isSupabaseConfigured } from "@/lib/crm/client";

/**
 * =============================================================
 *  CRM – Authentifizierung (Supabase Auth, E-Mail/Passwort)
 * =============================================================
 *  Kapselt die Auth-Aufrufe, damit das Andocken trivial bleibt. Es werden
 *  KEINE Zugangsdaten im Code hinterlegt – die beiden CRM-Nutzer werden im
 *  Supabase-Dashboard angelegt (Authentication > Users).
 *
 *  Ist Supabase (noch) nicht konfiguriert, ist Auth im Platzhalter-/Demo-Modus:
 *  Login ist dann nicht möglich (klarer Hinweis), das Dashboard läuft mit
 *  Dummydaten. Sobald die Env-Vars gesetzt sind, greift echte Supabase-Auth.
 * =============================================================
 */

export interface AuthResult {
  ok: boolean;
  error?: string;
}

/** Login per E-Mail/Passwort gegen Supabase Auth. */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!supabase) {
    // TODO: entfällt, sobald NEXT_PUBLIC_SUPABASE_* gesetzt sind.
    return {
      ok: false,
      error:
        "Anmeldung noch nicht möglich: Supabase ist nicht konfiguriert (Env-Variablen fehlen).",
    };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: "E-Mail oder Passwort ist nicht korrekt." };
  }
  return { ok: true };
}

/** Logout. */
export async function signOut(): Promise<void> {
  await supabase?.auth.signOut();
}

/**
 * Aktuellen Auth-Status prüfen.
 * Rückgabe:
 *   - "authed"        eingeloggt
 *   - "anon"          nicht eingeloggt (Redirect auf /crm-login)
 *   - "not-configured" Demo-Modus (Supabase fehlt) – Zugriff erlaubt
 */
export async function getAuthState(): Promise<"authed" | "anon" | "not-configured"> {
  if (!isSupabaseConfigured || !supabase) return "not-configured";
  const { data } = await supabase.auth.getSession();
  return data.session ? "authed" : "anon";
}
