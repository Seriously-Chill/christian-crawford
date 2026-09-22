import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The share card shown when a link to the site is pasted into LinkedIn,
 * Slack, or a message. Generated at build time from the site's own type and
 * default colours (the picker's first-paint hue, see globals.css), so it
 * stays in step with the design rather than being a separate asset: the
 * default gray, with white text.
 */
export const alt = "Christian Crawford — I make complicated software simple.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A static regular instance, cut from the site's variable font with
// fontTools: the image renderer crashes on variable fonts.
const jakarta = await readFile(join(process.cwd(), "src/fonts/PlusJakartaSans-Regular.ttf"));

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(90deg, #525252 0%, #777777 100%)",
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: "-0.01em" }}>Christian Crawford</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 900 }}>
          I make complicated software simple.
        </div>
        <div style={{ fontSize: 27 }}>
          Senior Software Engineer  ·  Frontend architecture  ·  React, Next.js, GraphQL
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Plus Jakarta Sans", data: jakarta, style: "normal", weight: 400 }] },
  );
}
