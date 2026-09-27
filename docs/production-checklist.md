# Production checklist

Use the [README](../README.md) for commands and environment settings and the [deployment guide](deployment.md) for hosting steps.

## Local quality

- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass.
- [ ] `pnpm build` passes under Node 24.
- [ ] `PLAYWRIGHT_USE_BUILD=true pnpm test:e2e` passes.
- [ ] Desktop and mobile screenshots have been visually reviewed.
- [ ] Keyboard navigation, focus indicators, zoom, and readable contrast are checked.
- [ ] `pnpm audit` and `pnpm audit --prod` findings have been reviewed.

## Content

- [ ] Project claims and career history are accurate and approved for publication.
- [ ] No sample articles, invented achievements, or old placeholder projects remain.
- [ ] Contact and external links stay disabled until destinations are supplied.
- [ ] No resume file, private contact data, credentials, or employer-confidential data are published.
- [ ] Writing's empty state and empty RSS feed are intentional.

## Hosting and discovery

- [ ] Vercel runtime is Node 24 and the intended environment variables are configured.
- [ ] Basic Auth remains enabled until public launch is approved.
- [ ] Production domain, canonical metadata, sitemap, RSS, and Markdown endpoints agree.
- [ ] Removed routes return 404; legacy writing redirects work.
- [ ] Security headers are present and production CSP omits `unsafe-eval`.
- [ ] No unexpected third-party requests occur during page loads.
- [ ] Deployment is approved and live routes, DNS, and TLS are verified afterward.
