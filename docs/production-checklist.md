# Production Checklist

**Canonical stack, CI job name (`quality`), routes, and env reference:** **[`README.md`](../README.md)**. Use this file as a **checkbox runbook** only.

## Pre-launch quality

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] `pnpm test:e2e` passes in CI

## Content readiness

- [ ] Home hero copy finalized
- [ ] Projects content reviewed and links verified
- [ ] Research entries reviewed for clarity and references
- [ ] Demo links and media verified
- [ ] About/contact details updated from placeholders

## SEO and indexing

- [ ] `NEXT_PUBLIC_SITE_URL` points to production domain
- [ ] `/sitemap.xml` returns all expected routes
- [ ] `/robots.txt` allows crawl and references sitemap
- [ ] JSON-LD present on home, research, and detail routes
- [ ] Social preview metadata verified (Open Graph/Twitter)

## Security and privacy

- [ ] Response security headers present (CSP, HSTS, nosniff, frame deny)
- [ ] No secrets committed to repository
- [ ] Contact API disabled until webhook configured
- [ ] Contact payload validation and rate-limit behavior verified
- [ ] Privacy and Terms pages reviewed and customized

## Analytics and observability

- [ ] Vercel Analytics enabled intentionally (`NEXT_PUBLIC_ENABLE_ANALYTICS`)
- [ ] Analytics events visible after deploy
- [ ] Error monitoring plan documented (if external tool used)

## Deployment and DNS

- [ ] Vercel production deployment successful
- [ ] Cloudflare DNS records point to Vercel
- [ ] SSL/TLS set to Full (strict)
- [ ] Domain/canonical redirects behave as expected

## GitHub branch protection

- [ ] Required check `quality` enforced on main branch
- [ ] Pull request reviews required
- [ ] Up-to-date branch requirement enabled
- [ ] Force-push and branch deletion restrictions enabled
