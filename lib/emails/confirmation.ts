/**
 * Bestätigungs-E-Mail an den Kunden nach erfolgreicher Anfrage.
 *
 * Positionierung: Solarfunke ist VERMITTLER – die Anfrage wird an einen
 * passenden Fachbetrieb weitergeleitet. Solarfunke berät/installiert NICHT selbst.
 *
 * Liefert Betreff + HTML- und Plaintext-Variante (beides senden → bessere
 * Zustellbarkeit und Anzeige in Clients ohne HTML). Texte sind leicht anpassbar.
 */

const SITE_URL = "https://www.solarfunke.de";
const LOGO_URL = "https://www.solarfunke.de/logo/solarfunke-nav.png";
const IMPRESSUM_URL = "https://www.solarfunke.de/impressum";
const DATENSCHUTZ_URL = "https://www.solarfunke.de/datenschutz";

// Markenfarben
const GREEN = "#02462E";
const YELLOW = "#FEC700";
const INK = "#12211A";
const INK_SOFT = "#47584F";
const PAPER = "#FFFFFF";
const PAPER_SUNK = "#F5F7F4";

export interface ConfirmationInput {
  /** Vorname des Kunden (optional – Mini-Block-Leads haben keinen Namen). */
  vorname?: string | null;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

/** HTML-Escape für dynamische Werte (z. B. Vorname) in der Mail. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildConfirmationEmail(input: ConfirmationInput): BuiltEmail {
  const subject = "Ihre Anfrage bei Solarfunke ist eingegangen";

  const vorname = (input.vorname ?? "").trim();
  const anredeText = vorname ? `Hallo ${vorname},` : "Hallo,";
  const anredeHtml = vorname ? `Hallo ${esc(vorname)},` : "Hallo,";

  // ---- Plaintext-Variante ----
  const text = [
    anredeText,
    "",
    "vielen Dank für Ihre Anfrage bei Solarfunke. Wir haben Ihre Angaben erhalten und leiten sie an einen passenden Fachbetrieb in Ihrer Region weiter. Dieser meldet sich in Kürze mit einer unverbindlichen Einschätzung bei Ihnen.",
    "",
    "Ihre Anfrage ist für Sie kostenlos und unverbindlich.",
    "",
    "Zur Website: " + SITE_URL,
    "",
    "Ihr Team von Solarfunke",
    "",
    "—",
    "Diese Nachricht wurde automatisch erzeugt; bitte antworten Sie nicht direkt darauf.",
    "Impressum: " + IMPRESSUM_URL,
    "Datenschutz: " + DATENSCHUTZ_URL,
  ].join("\n");

  // ---- HTML-Variante (Tabellen-Layout, inline CSS) ----
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:${PAPER_SUNK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAPER_SUNK};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:${PAPER}; border-radius:16px; overflow:hidden; font-family:Arial, Helvetica, sans-serif;">

          <!-- Header (gelb), Logo zentriert -->
          <tr>
            <td align="center" style="background-color:${YELLOW}; padding:28px 32px;">
              <img src="${LOGO_URL}" alt="Solarfunke" width="180" style="display:block; margin:0 auto; height:auto; border:0; outline:none; text-decoration:none;">
            </td>
          </tr>
          <!-- Grüne Akzentlinie -->
          <tr><td style="height:4px; background-color:${GREEN}; font-size:0; line-height:0;">&nbsp;</td></tr>

          <!-- Inhalt -->
          <tr>
            <td style="padding:36px 32px 8px 32px;">
              <h1 style="margin:0 0 16px 0; font-size:22px; line-height:1.3; color:${INK};">
                Ihre Anfrage ist eingegangen
              </h1>
              <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:${INK_SOFT};">
                ${anredeHtml}
              </p>
              <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:${INK_SOFT};">
                vielen Dank für Ihre Anfrage bei Solarfunke. Wir haben Ihre Angaben
                erhalten und leiten sie an einen passenden Fachbetrieb in Ihrer Region
                weiter. Dieser meldet sich in Kürze mit einer unverbindlichen
                Einschätzung bei Ihnen.
              </p>
              <p style="margin:0 0 24px 0; font-size:16px; line-height:1.6; color:${INK_SOFT};">
                Ihre Anfrage ist für Sie <strong style="color:${INK};">kostenlos und unverbindlich</strong>.
              </p>

              <!-- CTA-Button (gelb) -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                <tr>
                  <td align="center" bgcolor="${YELLOW}" style="border-radius:10px;">
                    <a href="${SITE_URL}" target="_blank"
                       style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:bold; color:${GREEN}; text-decoration:none; border-radius:10px;">
                      Zur Website
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0; font-size:16px; line-height:1.6; color:${INK_SOFT};">
                Ihr Team von Solarfunke
              </p>
            </td>
          </tr>

          <!-- Fußzeile -->
          <tr>
            <td style="padding:24px 32px 32px 32px;">
              <hr style="border:0; border-top:1px solid #E3E8E3; margin:0 0 16px 0;">
              <p style="margin:0 0 8px 0; font-size:12px; line-height:1.6; color:#8A968E;">
                Diese Nachricht wurde automatisch erzeugt und kann nicht direkt
                beantwortet werden.
              </p>
              <p style="margin:0; font-size:12px; line-height:1.6; color:#8A968E;">
                <a href="${IMPRESSUM_URL}" target="_blank" style="color:${GREEN}; text-decoration:underline;">Impressum</a>
                &nbsp;&middot;&nbsp;
                <a href="${DATENSCHUTZ_URL}" target="_blank" style="color:${GREEN}; text-decoration:underline;">Datenschutz</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
