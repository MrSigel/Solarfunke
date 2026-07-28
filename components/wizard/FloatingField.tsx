"use client";

import { useId, useState } from "react";
import { type LucideIcon } from "lucide-react";

/**
 * Eingabefeld mit Floating-Label und Feld-Icon (Schritt 2).
 *
 * Verhalten (genau wie gefordert):
 *   - Leeres Feld: der Feldname steht als Platzhalter IM Feld.
 *   - Bei Fokus/Befüllung wandert der Feldname animiert nach oben (verkleinert),
 *     UND dort erscheint neben dem Label ein passendes Icon.
 *   - Kein separates Label über dem Feld.
 */
export function FloatingField({
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  error,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  onBlur?: () => void;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  // Label schwebt oben, sobald das Feld fokussiert ODER befüllt ist.
  const floated = focused || value.length > 0;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          // Leerer Platzhalter: das schwebende Label übernimmt die Platzhalter-Rolle.
          placeholder=" "
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            "peer h-12 w-full rounded-xl border bg-paper px-3.5 pb-1.5 pt-5",
            "font-body text-[0.95rem] text-ink outline-none transition-colors duration-200",
            error
              ? "border-danger focus:border-danger"
              : "border-line focus:border-forest",
          ].join(" ")}
        />

        {/* Floating-Label inkl. Icon (Icon erscheint erst im schwebenden Zustand). */}
        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute left-3.5 flex items-center transition-all duration-200 ease-smooth",
            floated
              ? "top-1.5 gap-1.5 text-xs font-medium"
              : "top-1/2 -translate-y-1/2 gap-0 text-[0.95rem]",
            error ? "text-danger" : floated ? "text-forest" : "text-ink-soft",
          ].join(" ")}
        >
          <Icon
            aria-hidden="true"
            className={[
              "shrink-0 transition-all duration-200",
              floated ? "h-3.5 w-3.5 opacity-100" : "h-0 w-0 opacity-0",
            ].join(" ")}
            strokeWidth={2}
          />
          <span>
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </span>
        </label>
      </div>

      {/* Validierungs-Hinweis */}
      {error && (
        <p id={errorId} className="mt-1.5 px-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
