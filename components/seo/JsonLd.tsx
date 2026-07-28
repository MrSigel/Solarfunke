/**
 * Rendert ein JSON-LD-Script (structured data) für SEO/GEO/AEO.
 * Server-Komponente – die Daten werden zur Build-Zeit statisch eingebettet.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify erzeugt sicheres JSON; kein User-Input enthalten.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
