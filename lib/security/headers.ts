export type SecurityHeader = {
  key: string;
  value: string;
};

const isDev = process.env.NODE_ENV === "development";

/** React dev uses eval() for stack reconstruction; production builds never need it. */
const scriptSrcDirectives = [
  "'self'",
  "'unsafe-inline'",
  "https://va.vercel-scripts.com",
  ...(isDev ? ["'unsafe-eval'"] : []),
];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrcDirectives.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "media-src 'self' blob: https:",
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
