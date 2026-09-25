import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { themeInitScript } from "@/lib/theme";
import { revealArrivalScript, revealInitScript } from "@/lib/motion";
import { textH3 } from "@/lib/type";

// Self-hosted: the local device shell's egress allowlist doesn't reach
// fonts.googleapis.com, and self-hosting is the more production-correct
// choice anyway (no runtime fetch, no third-party request at all). One
// variable file (wght 200–800, from google/fonts' ofl/plusjakartasans)
// covers every weight the type scale uses.
const jakarta = localFont({
  variable: "--font-jakarta",
  display: "swap",
  src: "../fonts/PlusJakartaSans-Variable.ttf",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://christiancrawford.dev"),
  title: {
    default: "Christian Crawford — Frontend Architecture & Complex Product Systems",
    template: "%s — Christian Crawford",
  },
  description:
    "Christian Crawford is a senior software engineer focused on frontend architecture, React, Next.js, accessibility, and complex product systems.",
  openGraph: {
    title: "Christian Crawford — Frontend Architecture & Complex Product Systems",
    description:
      "Frontend architecture and complex product systems, shaped around the people who build and use them.",
    url: "https://christiancrawford.dev",
    siteName: "Christian Crawford",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Crawford — Frontend Architecture & Complex Product Systems",
    description:
      "Frontend architecture and complex product systems, shaped around the people who build and use them.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning`: the <head> script below sets the saved
    // color's custom properties on <html> before hydration, so its `style`
    // intentionally differs from the server render.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: revealInitScript }} />
      </head>
      <body className={`${jakarta.variable} min-h-dvh flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-10001 focus:top-4 focus:left-4 focus:rounded-sm focus:bg-surface focus:px-space-2 focus:py-2 focus:text-accent focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/*
          Entrance preloader — the real page-transition treatment from the
          Design System (motion.md): the header gradient at a steeper,
          full-opacity angle (174deg) with the name set at h3 size, lifting
          with the same fade and duration as PageTransition's reveal, so the
          first page arrives the same way every later one does. Like
          PageTransition, it marks the page covered while it's up and
          fires the reveal event as it lifts, so the entrances underneath
          wait and play into view instead of finishing behind it. The source shows
          this on route change; this app is a single scrolling page for
          its first paint, so it's replayed once per browser session as
          the opening moment instead, then PageTransition takes over for
          real navigations. Plain inline script, not a client component —
          it never touches the hydrated JS bundle, and motion-reduce:hidden
          keeps it from ever rendering for reduced-motion users.

          It lifts once the document is parsed and the font is ready, not on
          `load`: `load` also waits for every eager image, which on a slow
          connection held the whole first screen hidden for seconds (LCP
          5.2s on mobile Lighthouse, ~90% of it this wait). Artwork that's
          still downloading appears when it arrives. The 1s timer caps the
          wait on a font that stalls.

          `suppressHydrationWarning`: on every page load after the first
          in a session, the script below runs synchronously (it's parsed
          right after this div) and sets `el.style.display = 'none'`
          directly via the DOM API, before React hydrates this node. That
          makes the live DOM's `style` genuinely differ from what React's
          client render produces (no `style` prop at all) — not a bug to
          fix, but exactly the "a DOM node is deliberately mutated outside
          React between server render and hydration" case this prop
          exists for. It only suppresses the mismatch warning for this
          element's own attributes, not its children.
        */}
        <div
          id="cc-preloader"
          aria-hidden="true"
          suppressHydrationWarning
          className="fixed inset-0 z-10000 flex items-center justify-center bg-page-transition-gradient motion-reduce:hidden"
        >
          <p className={`px-space-2 text-center text-on-header-fade ${textH3.replace("font-medium", "font-light")}`}>Christian Crawford</p>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var k='cc-entered',d=document.documentElement,el=document.getElementById('cc-preloader');if(!el)return;if(sessionStorage.getItem(k)||matchMedia('(prefers-reduced-motion: reduce)').matches){el.style.display='none';return;}sessionStorage.setItem(k,'1');d.setAttribute('data-page-covered','');var lifted=false;function lift(){if(lifted)return;lifted=true;d.removeAttribute('data-page-covered');window.dispatchEvent(new Event('cc:page-reveal'));el.style.animation='page-transition-out var(--duration-page-reveal) ease forwards';setTimeout(function(){el.style.display='none';},500);}function ready(){(document.fonts?document.fonts.ready:Promise.resolve()).then(lift);setTimeout(lift,1000);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();}catch(e){}})();",
          }}
        />

        <PageTransition />

        <SmoothScrollProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
        {/* Last in <body>, so every section is parsed when it runs. */}
        <script dangerouslySetInnerHTML={{ __html: revealArrivalScript }} />
      </body>
    </html>
  );
}
