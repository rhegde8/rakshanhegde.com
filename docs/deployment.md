# Deployment Guide

## Target

- Hosting: Vercel Pro
- DNS: Cloudflare
- Runtime: Next.js App Router

## 1) Vercel project setup

1. Import repository into Vercel.
2. Configure framework preset as Next.js.
3. Set environment variables for Production and Preview:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_ENABLE_ANALYTICS`
   - `NEXT_PUBLIC_ENABLE_CONTACT_FORM`
   - `ENABLE_CONTACT_FORM`
   - `CONTACT_FORM_WEBHOOK_URL` (if form enabled)
   - `CONTACT_FORM_RATE_LIMIT_WINDOW_MS`
   - `CONTACT_FORM_RATE_LIMIT_MAX`
4. Enable Vercel Analytics for project.

## 2) Build and output checks

Expected generated endpoints include:

- `/sitemap.xml`
- `/robots.txt`
- `/research/rss.xml`
- Site + legal + content-detail routes

Pre-deploy local checks:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 3) Cloudflare DNS configuration

1. Add custom domain in Vercel.
2. Add DNS records in Cloudflare as instructed by Vercel:
   - apex/root: ALIAS/ANAME or CNAME flattening to Vercel target
   - `www` subdomain: CNAME to Vercel target
3. SSL/TLS mode: **Full (strict)**.
4. Keep proxy mode consistent with Vercel recommendations.

## 4) Post-deploy validation

1. Route checks:
   - `/`, `/projects`, `/research`, `/demos`, `/about`, `/privacy`, `/terms`
2. Crawl checks:
   - `/robots.txt`
   - `/sitemap.xml`
   - `/research/rss.xml`
3. SEO checks:
   - metadata tags
   - JSON-LD scripts
4. Security checks:
   - response headers/CSP present
5. Analytics checks:
   - event ingestion visible in Vercel dashboard

## 5) Contact form rollout

By default, keep form backend disabled:

- `NEXT_PUBLIC_ENABLE_CONTACT_FORM=false`
- `ENABLE_CONTACT_FORM=false`

When ready:

1. Configure secure webhook destination.
2. Set both flags to `true`.
3. Verify successful form relay and rate-limit behavior.
