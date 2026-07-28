"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/faq";

/**
 * FAQ-Akkordeon.
 *  - Klick auf eine Frage klappt die Antwort animiert auf/zu.
 *  - Mehrere Einträge dürfen gleichzeitig offen sein (unabhängiges Toggle).
 *  - Höhen-Animation über die grid-rows-Technik (0fr -> 1fr) – sauber, ohne
 *    manuelles Messen; prefers-reduced-motion wird global respektiert.
 *  - Akzent Gelb (#FEC700) für den offenen/aktiven Zustand + Chevron.
 */
export function FaqAccordion() {
  // Set der offenen Einträge (per id).
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <ul className="divide-y divide-line border-y border-line">
      {faqItems.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-answer`}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
              >
                <span
                  className={[
                    "font-display text-lg font-semibold transition-colors",
                    isOpen ? "text-forest" : "text-ink",
                  ].join(" ")}
                >
                  {item.question}
                </span>
                {/* Chevron im gelben Kreis, wenn offen */}
                <span
                  aria-hidden="true"
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    isOpen ? "bg-accent text-accent-ink" : "bg-paper-sunk text-forest",
                  ].join(" ")}
                >
                  <ChevronDown
                    className={[
                      "h-5 w-5 transition-transform duration-300",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                    strokeWidth={2.5}
                  />
                </span>
              </button>
            </h3>

            {/* Animierte Höhe: grid 0fr -> 1fr */}
            <div
              id={`${item.id}-answer`}
              role="region"
              className={[
                "grid transition-[grid-template-rows] duration-300 ease-smooth",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose pb-6 pr-12 text-ink-soft">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
