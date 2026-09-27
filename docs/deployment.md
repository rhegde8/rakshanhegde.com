# Deployment

See the [README](../README.md) for architecture, content authoring, and environment variables.

## Vercel setup

1. Select the Next.js framework preset and **Node.js 24.x** in project settings. Keep the selected major aligned with `.node-version` and `package.json`.
2. Install with `pnpm install --frozen-lockfile`; build with `pnpm build`.
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical domain.
4. Keep Basic Auth credentials in hosting settings. Remove `SITE_PASSWORD` only when the site is ready for public access.

Do not deploy until the local checks in the README and the production checklist have been reviewed. A source change does not itself authorize a deployment.

## Domain setup

Add the custom domain in Vercel and use the DNS records it provides. If Cloudflare fronts the domain, retain Full (strict) TLS and verify that the canonical host redirects correctly.

## After deployment

- Check `/`, `/projects`, all three project details, `/writing`, and `/about` on desktop and mobile.
- Confirm `/research` redirects to `/writing`; removed `/lab` and unknown content routes return 404.
- Confirm contact labels have no live destinations and writing contains no sample posts.
- Verify `/sitemap.xml`, `/robots.txt`, `/writing/rss.xml`, `/llms.txt`, and a project's `.md` response.
- Inspect the canonical URL, title, social preview image, structured data, and response security headers.
- If Basic Auth is enabled, confirm unauthenticated requests are rejected before HTML or Markdown is returned.

Deployment and live-service validation are separate from local build and browser checks.
