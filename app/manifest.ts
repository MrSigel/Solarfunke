import type { MetadataRoute } from "next";

/**
 * Web App Manifest – für Android/„Zum Startbildschirm hinzufügen" und PWA.
 * Icons stammen aus /public (aus der Solarfunke-Bildmarke erzeugt).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solarfunke",
    short_name: "Solarfunke",
    description:
      "Solarfunke vermittelt geprüfte Photovoltaik-Fachbetriebe aus Ihrer Region.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#02462e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
