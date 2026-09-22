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
// pulled from the real @fontsource/montserrat package (weights 400/500 —
// the only two the Design System's type scale ever uses).
const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "../fonts/montserrat-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/montserrat-500.woff2", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://christiancrawford.dev"),
  title: {
    default: "Christian Crawford — Frontend Architecture & Complex Product Systems",
    template: "%s — Christian Crawford",
  },
  description:
    "Christian Crawford is a Senior Software Engineer focused on frontend architecture and complex product systems — turning complicated systems into ones people can actually work with.",
  openGraph: {
    title: "Christian Crawford — Frontend Architecture & Complex Product Systems",
    description:
      "Senior Software Engineer focused on frontend architecture and complex product systems.",
    url: "https://christiancrawford.dev",
    siteName: "Christian Crawford",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Crawford — Frontend Architecture & Complex Product Systems",
    description:
      "Senior Software Engineer focused on frontend architecture and complex product systems.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${montserrat.variable} min-h-full flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-10001 focus:top-4 focus:left-4 focus:rounded-sm focus:bg-surface focus:px-space-2 focus:py-2 focus:text-primary focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/*
          Entrance preloader — the real page-transition treatment from the
          Design System (motion.md), corrected: a flat overlay (no
          gradient — that was wrong in an earlier pass) and a 700ms fade
          (was 500ms), matching PageTransition's own real timing. Uses
          `bg-primary` rather than the source's literal white background —
          see PageTransition.tsx for why (the real white-fill logo mark is
          invisible on the source's own white overlay). The source shows
          this on route change; this app is a single scrolling page for
          its first paint, so it's replayed once per browser session as
          the opening moment instead, then PageTransition takes over for
          real navigations. Plain inline script, not a client component —
          it never touches the hydrated JS bundle, and motion-reduce:hidden
          keeps it from ever rendering for reduced-motion users.
        */}
        <div
          id="cc-preloader"
          aria-hidden="true"
          className="fixed inset-0 z-10000 flex items-center justify-center bg-primary motion-reduce:hidden"
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
