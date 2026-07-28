import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Solarfunke gemäß DSGVO.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/datenschutz" },
};

/**
 * /datenschutz – Datenschutzerklärung (DSGVO).
 * Verantwortlicher: Enrico Gross (Klickhafen). Ziel der Datenschutz-Links aus
 * den Formularen/Checkboxen (Hero-Wizard, Mini-Lead-Blöcke) und dem Footer.
 */
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>1. Datenschutz auf einen Blick</h2>
      <p>
        Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Wir behandeln
        Ihre Daten vertraulich und entsprechend den gesetzlichen
        Datenschutzvorschriften (DSGVO, BDSG) sowie dieser
        Datenschutzerklärung. Personenbezogene Daten sind alle Daten, mit denen
        Sie persönlich identifiziert werden können.
      </p>

      <h2>2. Verantwortliche Stelle</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
      </p>
      <p>
        <strong>Enrico Gross</strong>
        <br />
        Klickhafen
        <br />
        Gerther Straße 76
        <br />
        44577 Castrop-Rauxel
        <br />
        Deutschland
        <br />
        E-Mail: kontakt@solarfunke.de
        <br />
        Telefon: +49 1556 3535989
      </p>

      <h2>3. Hosting</h2>
      <p>
        Diese Website wird bei einem externen Dienstleister gehostet (Vercel).
        Die dabei erfassten Daten werden auf den Servern des Hosters
        gespeichert. Der Einsatz des Hosters erfolgt zum Zwecke der
        Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden
        sowie im Interesse einer sicheren, schnellen und effizienten
        Bereitstellung unseres Online-Angebots (Art. 6 Abs. 1 lit. f DSGVO). Mit
        dem Hoster besteht ein Vertrag über Auftragsverarbeitung (AVV).
      </p>

      <h2>4. Server-Log-Dateien</h2>
      <p>
        Der Provider der Seiten erhebt und speichert automatisch Informationen
        in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns
        übermittelt. Dies sind insbesondere: Browsertyp und -version,
        verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden
        Rechners, Uhrzeit der Serveranfrage und die IP-Adresse. Eine
        Zusammenführung dieser Daten mit anderen Datenquellen wird nicht
        vorgenommen. Grundlage der Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Unsere Website verwendet Cookies. Notwendige Cookies sind für den
        technischen Betrieb der Seite erforderlich (Art. 6 Abs. 1 lit. f DSGVO).
        Optionale Cookies – etwa für Reichweitenmessung – werden nur mit Ihrer
        ausdrücklichen Einwilligung gesetzt (Art. 6 Abs. 1 lit. a DSGVO). Ihre
        Einwilligung können Sie jederzeit mit Wirkung für die Zukunft
        widerrufen. Sie können Ihren Browser zudem so einstellen, dass Sie über
        das Setzen von Cookies informiert werden und Cookies nur im Einzelfall
        erlauben oder generell ausschließen.
      </p>

      <h2>6. Anfrage- und Kontaktformulare</h2>
      <p>
        Wenn Sie uns über die Formulare auf dieser Website eine Anfrage
        zukommen lassen, verarbeiten wir die von Ihnen angegebenen Daten (z. B.
        Vorname, Nachname, Anschrift, Telefonnummer, E-Mail-Adresse sowie Ihre
        Angaben zum Vorhaben) zum Zweck der Bearbeitung Ihrer Anfrage und für
        etwaige Anschlussfragen.
      </p>
      <p>
        Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1
        lit. b DSGVO, sofern Ihre Anfrage mit der Anbahnung oder Erfüllung eines
        Vertrags zusammenhängt. In allen übrigen Fällen beruht die Verarbeitung
        auf unserem berechtigten Interesse an der effektiven Bearbeitung von
        Anfragen (Art. 6 Abs. 1 lit. f DSGVO) bzw. auf Ihrer Einwilligung
        (Art. 6 Abs. 1 lit. a DSGVO), soweit diese abgefragt wurde. Die Daten
        verbleiben bei uns, bis der Zweck für die Speicherung entfällt oder Sie
        uns zur Löschung auffordern und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>7. Weitergabe an Fachbetriebe und Auftragsverarbeiter</h2>
      <p>
        Solarfunke ist ein Vermittler: Wir bringen Sie mit einem passenden
        Fachbetrieb aus Ihrer Region zusammen. Zur Bearbeitung Ihrer Anfrage
        übermitteln wir die von Ihnen angegebenen Daten daher an einen
        geeigneten Fachbetrieb, der Sie anschließend berät und Ihnen ein Angebot
        erstellt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. a DSGVO.
      </p>
      <p>
        Zur Verwaltung von Anfragen setzen wir zudem einen externen Dienstleister
        (CRM/Datenbank) ein; mit diesem sowie mit unserem Hoster bestehen –
        soweit erforderlich – Verträge zur Auftragsverarbeitung nach Art. 28
        DSGVO. Eine darüber hinausgehende Weitergabe an Dritte erfolgt nicht.
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre gespeicherten personenbezogenen Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO),</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft.</li>
      </ul>
      <p>
        Zudem steht Ihnen ein Beschwerderecht bei einer zuständigen
        Datenschutz-Aufsichtsbehörde zu.
      </p>

      <h2>9. SSL-/TLS-Verschlüsselung</h2>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw.
        TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an der
        Zeichenfolge „https://" in der Adresszeile Ihres Browsers.
      </p>

      <h2>10. Aktualität</h2>
      <p>
        Diese Datenschutzerklärung ist aktuell gültig. Durch die
        Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher
        Vorgaben kann es notwendig werden, diese Erklärung anzupassen.
      </p>
    </LegalPage>
  );
}
