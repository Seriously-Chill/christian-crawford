import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Everything the site loads is its own: self-hosted font, local images, no
// third-party scripts. Scripts still need 'unsafe-inline': the pages are
// static, so there's no request to mint a nonce for, and Next's inline RSC
// payload differs per page, so hashes can't cover it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // No upgrade-insecure-requests: every asset is same-origin and HSTS already
  // keeps the site on https, and WebKit applies it to http://127.0.0.1 too,
  // which breaks the local and CI test server.
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
