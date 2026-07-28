import type { Config } from "tailwindcss";

/**
 * Solarfunke Design-System (Tailwind-Theme)
 * -----------------------------------------
 * Farbregel (siehe auch globals.css):
 *   - Große Flächen: WEISS (paper) oder GRÜN (forest).
 *   - GELB (accent) ist NUR Akzent: aktive Zustände, Buttons, Highlights, Blob.
 *
 * Alle Farben stammen aus CSS-Variablen in globals.css, damit sie an einer
 * zentralen Stelle angepasst werden können. Hier werden sie nur als
 * Tailwind-Utilities registriert (bg-forest, text-accent, border-line …).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Basis / helle Flächen
        paper: "var(--paper)", // #FFFFFF – Haupt-Hintergrund
        "paper-sunk": "var(--paper-sunk)", // leicht abgesetzte helle Fläche

        // Dunkle / große Flächen
        forest: {
          DEFAULT: "var(--forest)", // #02462E
          hover: "var(--forest-hover)",
          soft: "var(--forest-soft)", // leicht aufgehellt für Flächen-Nuancen
        },

        // Akzent (NUR punktuell einsetzen)
        accent: {
          DEFAULT: "var(--accent)", // #FEC700
          hover: "var(--accent-hover)",
          ink: "var(--accent-ink)", // Textfarbe auf gelber Fläche
        },

        // Nav-Blob/Pill (zentral steuerbar)
        "nav-blob": "var(--nav-blob)", // #02462E (Grün)

        // Text
        ink: {
          DEFAULT: "var(--ink)", // Haupttext auf hellem Grund
          soft: "var(--ink-soft)", // Sekundärtext
        },
        "on-forest": "var(--on-forest)", // Text auf grüner Fläche

        // Linien / Rahmen
        line: "var(--line)", // Hairline auf hellem Grund
        "line-forest": "var(--line-forest)", // Hairline auf grünem Grund

        // Funktionsfarbe (nur Validierungs-Hinweise)
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Type-Scale mit klaren Stufen (siehe globals.css für Zeilenhöhen)
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.12em" }],
        "display-xl": [
          "clamp(3rem, 6vw, 5.5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em" },
        ],
        h1: [
          "clamp(2.25rem, 4vw, 3.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.015em" },
        ],
        h2: ["1.875rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h3: ["1.25rem", { lineHeight: "1.2" }],
      },
      maxWidth: {
        // Fließtext-Maß und Seiten-Container
        prose: "68ch",
        shell: "1600px",
      },
      borderRadius: {
        pill: "9999px",
      },
      transitionTimingFunction: {
        // weiche, "organische" Kurve für Blob & Nav-Schrumpfen
        blob: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        // Elevation nur bei echten Overlays (Modal, Dropdown)
        overlay: "0 24px 60px -20px rgba(2, 70, 46, 0.35)",
        "nav-scrolled": "0 8px 30px -12px rgba(2, 70, 46, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
