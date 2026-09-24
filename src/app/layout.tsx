import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { PageTransition } from "@/components/motion/PageTransition";

// Self-hosted: the local device shell's egress allowlist doesn't reach
// fonts.googleapis.com, and self-hosting is the more production-correct
// choice anyway (no runtime fetch, no third-party request at all). Files
// pulled from the real @fontsource/poppins package (weights 400/500 —
// the only two the Design System's type scale ever uses).
//
// The two files were previously mapped backwards here (Medium tagged as
// 400, Regular tagged as 500) — confirmed via each file's own `OS/2
// usWeightClass` — which meant every "font-weight: 400" headline (display,
// h2) rendered in the heavier Medium face and everything declared 500 (h3,
// body, labels, buttons) rendered in the lighter Regular face: exactly
// inverted from the reference site's real weight relationship (light
// headlines, slightly heavier supporting text).
const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
  ],
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
    <html lang="en" className="h-full">
      <body className={`${poppins.variable} min-h-full flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-10001 focus:top-4 focus:left-4 focus:rounded-sm focus:bg-surface focus:px-space-2 focus:py-2 focus:text-accent focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/*
          Entrance preloader — the real page-transition treatment from the
          Design System (motion.md): the header gradient at a steeper,
          full-opacity angle (174deg), a 700ms fade (corrected from an
          earlier 500ms), and the 70px logo mark (corrected from 51x60) —
          matching PageTransition's own real timing/size. The source shows
          this on route change; this app is a single scrolling page for
          its first paint, so it's replayed once per browser session as
          the opening moment instead, then PageTransition takes over for
          real navigations. Plain inline script, not a client component —
          it never touches the hydrated JS bundle, and motion-reduce:hidden
          keeps it from ever rendering for reduced-motion users.

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
          <Image src="/logo-mark.svg" alt="" width={70} height={82} priority />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var k='cc-entered';if(sessionStorage.getItem(k)){var el=document.getElementById('cc-preloader');if(el)el.style.display='none';}else{sessionStorage.setItem(k,'1');window.addEventListener('load',function(){var el=document.getElementById('cc-preloader');if(!el)return;el.style.transition='opacity 700ms ease';el.style.opacity='0';setTimeout(function(){el.style.display='none';},720);});}}catch(e){}})();",
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
      </body>
    </html>
  );
}
