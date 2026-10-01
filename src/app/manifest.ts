import type { MetadataRoute } from "next";

// For "Add to Home Screen" on Android. The icons are full-bleed squares with
// the monogram inside the maskable safe zone, so one pair serves both purposes.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Christian Crawford",
    short_name: "C. Crawford",
    description: "Frontend architecture and complex product systems.",
    start_url: "/",
    display: "browser",
    background_color: "#525252",
    theme_color: "#525252",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
