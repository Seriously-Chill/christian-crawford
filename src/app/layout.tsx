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

// Self-hosted rather than loaded from Google Fonts: no runtime fetch and no
// third-party request. One variable file (wght 200–800) covers every weight
// the type scale uses.
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
    "Christian Crawford is a senior frontend engineer focused on frontend architecture, React, Next.js, accessibility, and complex product systems.",
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
    // `suppressHydrationWarning`: the first script in <body> sets the saved
    // color's custom properties on <html> before hydration, so its `style`
    // intentionally differs from the server render.
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} min-h-dvh flex flex-col`}>
        {/*
          First in <body>, not in <head>: they still run before anything
          below them paints, and <head> keeps nothing of ours for React to
          hydrate. Netlify injects a comment into <head> after <meta
          charset>; with these scripts there, that mismatch made React throw
          away the server HTML and re-render the page, which left the
          first-visit preloader covering it for good.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: revealInitScript }} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-10001 focus:top-4 focus:left-4 focus:rounded-sm focus:bg-surface focus:px-space-2 focus:py-2 focus:text-accent focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/*
          First-visit preloader: the same treatment as PageTransition, so the
          first page arrives the way every later one does. It marks the page
          covered while it's up and fires the reveal event as it lifts, so the
          entrances underneath wait and play into view. It plays once per
          browser session. Plain inline script, not a client component, so it
          never touches the hydrated bundle; motion-reduce:hidden keeps it
          from rendering for reduced-motion users.

          It lifts once the document is parsed and the font is ready, not on
          `load`: `load` also waits for every eager image, which on a slow
          connection held the whole first screen hidden for seconds (LCP 5.2s
          on mobile Lighthouse). The 1s timer caps the wait on a font that
          stalls.

          `suppressHydrationWarning`: after the first visit in a session, the
          script below hides this div through the DOM before React hydrates
          it, so its `style` deliberately differs from the client render. The
          prop only covers this element's own attributes, not its children.

          If hydration still fails somewhere, React replaces this div with a
          fresh one the script never touched. So the script looks the element
          up again each time it acts, and sets `window.__ccPreloaderDone` once
          it's gone; PageTransition hides any replacement after that.
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
              "(function(){try{var k='cc-entered',d=document.documentElement;function $(){return document.getElementById('cc-preloader')||{style:{}};}if(!document.getElementById('cc-preloader'))return;if(sessionStorage.getItem(k)||matchMedia('(prefers-reduced-motion: reduce)').matches){window.__ccPreloaderDone=true;$().style.display='none';return;}sessionStorage.setItem(k,'1');d.setAttribute('data-page-covered','');var lifted=false;function lift(){if(lifted)return;lifted=true;d.removeAttribute('data-page-covered');window.dispatchEvent(new Event('cc:page-reveal'));$().style.animation='page-transition-out var(--duration-page-reveal) ease forwards';setTimeout(function(){window.__ccPreloaderDone=true;$().style.display='none';},500);}function ready(){(document.fonts?document.fonts.ready:Promise.resolve()).then(lift);setTimeout(lift,1000);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();}catch(e){}})();",
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
