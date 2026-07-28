import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/banners/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";

/**
 * Typografie über next/font, als CSS-Variablen bereitgestellt.
 * (siehe tailwind.config.ts -> fontFamily.display / body / mono)
 *   - Display/Headings: Space Grotesk (charakterstarke Groteske)
 *   - Body:             Hanken Grotesk (ruhig, gut lesbar – NICHT Inter)
 *   - Utility/Mono:     JetBrains Mono (Eyebrows, Daten – sparsam)
 */
const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solarfunke.de"),
  title: {
    default: "Solarfunke – Photovoltaik-Anlagen einfach anfragen",
    template: "%s | Solarfunke",
  },
  description:
    "Ihre Photovoltaik-Anlage einfach anfragen: In zwei Minuten zur unverbindlichen Anfrage – kostenlose Beratung, transparentes Angebot und Förder-Check. 4,8 von 5 Sternen bei über 300 Google-Bewertungen.",
  keywords: [
    "Photovoltaik",
    "Solaranlage",
    "PV-Anlage",
    "Solarstrom",
    "Photovoltaik Anfrage",
    "Solaranlage Angebot",
    "Photovoltaik Förderung",
    "Solarfunke",
  ],
  applicationName: "Solarfunke",
  authors: [{ name: "Solarfunke" }],
  creator: "Solarfunke",
  publisher: "Solarfunke",
  alternates: { canonical: "/" },
  category: "Photovoltaik",
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Solarfunke",
    title: "Solarfunke – Photovoltaik-Anlagen einfach anfragen",
    description:
      "In zwei Minuten zur unverbindlichen Photovoltaik-Anfrage – kostenlose Beratung, transparentes Angebot, Förder-Check. 4,8 von 5 Sternen bei über 300 Google-Bewertungen.",
    images: [
      {
        url: "/hero/hero-desktop.jpg",
        width: 1672,
        height: 941,
        alt: "Familie vor ihrem Haus mit Photovoltaik-Anlage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solarfunke – Photovoltaik-Anlagen einfach anfragen",
    description:
      "In zwei Minuten zur unverbindlichen Photovoltaik-Anfrage. 4,8 von 5 Sternen bei über 300 Google-Bewertungen.",
    images: ["/hero/hero-desktop.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body>
        {/* Structured Data (Organization + WebSite) site-weit */}
        <JsonLd data={organizationJsonLd} />
        {children}
        {/* Cookie-Consent site-weit */}
        <CookieBanner />
      </body>
    </html>
  );
}
