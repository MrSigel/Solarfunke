"use client";

import { Check } from "lucide-react";

/**
 * Auswahl-Kachel für Schritt 1 (nur klicken, kein Tippen).
 * - Hover hebt die Kachel leicht an.
 * - Ausgewählt: gelber Akzent (#FEC700), dunkelgrüner Text, Häkchen.
 */
export function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "group flex min-h-[2.875rem] items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left",
        "font-body text-[0.95rem] transition-all duration-200 ease-smooth",
        "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
        selected
          ? "border-accent bg-accent text-accent-ink shadow-[0_10px_24px_-12px_rgba(254,199,0,0.8)]"
          : "border-line bg-paper text-ink hover:border-forest hover:bg-paper-sunk",
      ].join(" ")}
    >
      <span className="min-w-0 truncate font-medium">{label}</span>
      <span
        aria-hidden="true"
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
          selected
            ? "border-forest bg-forest text-accent"
            : "border-line text-transparent group-hover:border-forest/40",
        ].join(" ")}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </button>
  );
}
