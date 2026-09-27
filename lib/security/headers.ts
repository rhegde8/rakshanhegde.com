export type SecurityHeader = {
  key: string;
  value: string;
};

const isDev = process.env.NODE_ENV === "development";

/** React dev uses eval() for stack reconstruction; production builds never need it. */
const scriptSrcDirectives = ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrcDirectives.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const securityHeaders: SecurityHeader[] = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** Password-protected content must never enter a shared CDN cache. */
export function contentCacheControl(): string {
  return process.env.SITE_PASSWORD
    ? "private, no-store"
    : "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
}
