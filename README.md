# Solarfunke – Landingpage (Grundgerüst)

Grundgerüst der Landingpage für **Solarfunke** (solarfunke.de).
Dieser Stand liefert **nur**: Projekt-Setup, Design-System, Layout-Rahmen und die
komplette Navigation. Die Inhaltssektionen sind leere Platzhalter (Abschnitt 1–6).

## Tech-Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **lucide-react** (Icons)
- Vorbereitet für späteres Andocken von Supabase, eigenem CMS und Vercel-Hosting
  (noch nicht eingebaut).

## Starten

```bash
npm install
npm run dev
```

Dann [http://localhost:3000](http://localhost:3000) öffnen.

Produktions-Build prüfen:

```bash
npm run build
```

## Projektstruktur

```
app/
  layout.tsx        # Fonts (next/font) + Root-Layout
  page.tsx          # Seite: Header + 6 Platzhalter-Sektionen
  globals.css       # Design-Tokens (CSS-Variablen) + Basis-Styles
components/
  nav/
    Header.tsx       # Sticky Header (orchestriert alles)
    DesktopNav.tsx   # Nav mit gleitendem Blob/Pill-Indikator
    MobileNav.tsx    # Mobiles Burger-Menü (vertikale Liste)
  search/
    SearchModal.tsx  # Such-Overlay (Modal)
  sections/
    PlaceholderSection.tsx  # Platzhalter-Sektion (Weiß/Grün)
  layout/
    Container.tsx    # Voll ausgenutzte Breite, großzügige Ränder
    TwoCol.tsx       # Zweispalten-Konvention (Text/Medium, gleiche Höhe)
lib/
  sections.ts       # ZENTRALE Section-Registry (+ Suchlogik)
  hooks.ts          # Scroll-Spy + Schrumpf-Verhalten
tailwind.config.ts  # Theme: Farben, Typo, Tokens
```

## Design-System

Farben als CSS-Variablen in [`app/globals.css`](app/globals.css), als Tailwind-
Utilities registriert in [`tailwind.config.ts`](tailwind.config.ts):

| Token         | Wert      | Rolle                                   |
| ------------- | --------- | --------------------------------------- |
| `paper`       | `#FFFFFF` | Weiß – Basis-Hintergrund / helle Flächen |
| `forest`      | `#02462E` | Grün – große / dunkle Flächen           |
| `accent`      | `#FEC700` | Gelb – **nur** Akzent (aktiv, Buttons, Blob) |

**Farbregel:** Große Flächen sind Weiß **oder** Grün. Gelb ist Akzentfarbe –
niemals flächendeckend.

Typografie (via `next/font`): Space Grotesk (Display), Hanken Grotesk (Body),
JetBrains Mono (Eyebrows/Utility).

## Sektionen später ergänzen

Alles hängt an der zentralen Registry [`lib/sections.ts`](lib/sections.ts).
Eine Sektion ändern/hinzufügen:

1. Eintrag in `sections` anpassen/ergänzen: `id`, `navLabel`, `title`,
   `keywords`, `icon` (aus `lucide-react`), `background` (`"white"` | `"green"`).
2. **Fertig** – Navigation (inkl. Icon), Scroll-Spy, Blob und Suche übernehmen
   den Eintrag automatisch.

Für echten Inhalt: `<PlaceholderSection>` mit `children` befüllen oder durch eine
eigene Sektions-Komponente ersetzen (die `id` beibehalten). Für zweispaltige
Layouts steht [`TwoCol`](components/layout/TwoCol.tsx) bereit (beide Spalten auf
gleicher Höhe).
