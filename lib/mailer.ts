import nodemailer, { type Transporter } from "nodemailer";

/**
 * Wiederverwendbarer Mail-Helfer (Strato SMTP via Nodemailer).
 *
 * Alle Zugangsdaten kommen AUSSCHLIESSLICH aus ENV-Variablen – niemals im Code:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, MAIL_FROM
 *
 * Nur serverseitig verwenden (Route Handler / Server). Der Transport wird
 * modulweit zwischengespeichert (Wiederverwendung über warme Invocations).
 */
let cached: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;

  if (!cached) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    // SMTP_SECURE: "true" -> SSL (Port 465). "false" -> STARTTLS (Port 587).
    const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false";
    cached = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      // Zustellung nicht ewig blockieren lassen.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return cached;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface MailResult {
  ok: boolean;
  error?: string;
}

/**
 * Versendet eine Mail. Wirft NICHT – Fehler werden geloggt und als Ergebnis
 * zurückgegeben, damit ein Mailfehler nie den umgebenden Ablauf (z. B. das
 * Speichern eines Leads) gefährdet.
 */
export async function sendMail(input: MailInput): Promise<MailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP nicht konfiguriert – Mail wird übersprungen.");
    return { ok: false, error: "smtp-not-configured" };
  }

  const from = process.env.MAIL_FROM ?? "Solarfunke <noreply@solarfunke.de>";

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { ok: true };
  } catch (error) {
    console.error("[mailer] Versand fehlgeschlagen:", error);
    return { ok: false, error: String(error) };
  }
}
