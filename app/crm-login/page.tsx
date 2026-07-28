"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { FloatingField } from "@/components/wizard/FloatingField";
import { signIn } from "@/lib/crm/auth";

/**
 * /crm-login – Login für das interne CRM.
 * Schlichtes, seriöses Backend-Layout (kein Marketing-Hero): ruhige grüne
 * Fläche, zentrierte weiße Login-Karte. Auth gegen Supabase (siehe lib/crm/auth).
 */
export default function CrmLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim() !== "" && password !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);

    const result = await signIn(email.trim(), password);
    if (result.ok) {
      router.replace("/crm");
    } else {
      setError(result.error ?? "Anmeldung fehlgeschlagen.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-forest px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-overlay sm:p-8">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/solarfunke-nav.png"
            alt="Solarfunke"
            width={473}
            height={149}
            priority
            className="h-9 w-auto object-contain"
          />
        </div>

        <h1 className="text-center text-h3 font-semibold text-ink">
          CRM-Anmeldung
        </h1>
        <p className="mt-1 text-center text-sm text-ink-soft">
          Bitte melden Sie sich mit Ihren Zugangsdaten an.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          <div className="space-y-3">
            <FloatingField
              label="E-Mail"
              value={email}
              onChange={setEmail}
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
            />
            <FloatingField
              label="Passwort"
              value={password}
              onChange={setPassword}
              icon={Lock}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-sunk hover:text-forest"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              }
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={[
              "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3",
              "font-body text-[0.95rem] font-semibold transition-all duration-200 ease-smooth",
              canSubmit && !submitting
                ? "bg-accent text-accent-ink hover:-translate-y-0.5 hover:bg-accent-hover"
                : "cursor-not-allowed bg-paper-sunk text-ink-soft",
            ].join(" ")}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Anmelden …
              </>
            ) : (
              "Anmelden"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
