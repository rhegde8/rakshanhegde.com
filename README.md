# Rakshan Hegde - Personal Website v1

Production-grade personal website built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.  
The site is content-driven via in-repo MDX and targets Vercel Pro deployment.

## Stack

- `next` + App Router + TypeScript (strict)
- `tailwindcss` (tokenized via CSS variables, Tokyo Night Storm inspired)
- `framer-motion` (reduced-motion aware)
- `zod` + `gray-matter` (frontmatter validation and typed content loading)
- `next-mdx-remote` (MDX rendering)
- `@vercel/analytics` (env-gated analytics)
- `vitest` + Testing Library + Playwright (unit/integration/e2e smoke)

## Routes

- `/`
- `/projects`
- `/research`
- `/demos`
- `/about`
- `/privacy`
- `/terms`

Also includes content detail routes:

- `/projects/[slug]`
- `/research/[slug]`
- `/demos/[slug]`

## Local setup (WSL2 Arch + pnpm)

1. Install Node.js 20+ and pnpm.
2. Install dependencies:
   - `pnpm install`
3. Copy env template and configure:
   - `cp .env.example .env.local`
4. Start dev server:
   - `pnpm dev`
5. Open:
   - `http://localhost:3000`

### Optional local e2e browser deps

Playwright browser/system dependencies vary by distro.  
CI on Ubuntu installs them automatically via `playwright install --with-deps chromium`.

On Arch-based WSL images, install required runtime libs if `pnpm test:e2e` fails due missing shared libraries.

## Environment variables

See `.env.example`.

- `NEXT_PUBLIC_SITE_URL` - canonical site URL (used in metadata/sitemap/schema)
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - enable Vercel Analytics in layout (`true`/`false`)
- `NEXT_PUBLIC_ENABLE_CONTACT_FORM` - show/hide contact form UI (`true`/`false`)
- `ENABLE_CONTACT_FORM` - enable backend contact API route (`true`/`false`)
- `CONTACT_FORM_WEBHOOK_URL` - destination webhook for contact submissions
- `CONTACT_FORM_RATE_LIMIT_WINDOW_MS` - in-memory rate limit window
- `CONTACT_FORM_RATE_LIMIT_MAX` - max requests per IP window

## Content authoring guide

Content is git-based MDX and lives in:

- `content/projects/*.mdx`
- `content/research/*.mdx`
- `content/demos/*.mdx`

Each file:

1. Uses YAML frontmatter (validated by zod schemas in `lib/schema`).
2. Includes required fields from schema.
3. Can include markdown/MDX body rendered on detail pages.

### Project frontmatter (required)

- `slug`, `title`, `summary`
- `status` (`ongoing` | `completed`)
- `startedAt`, `updatedAt` (ISO-compatible)
- `stack[]`, `tags[]`, `aiFocus[]`

`completed` projects must include `completedAt`.

### Research frontmatter (required)

- `slug`, `title`, `summary`, `updatedAt`
- `tags[]`

### Demo frontmatter (required)

- `slug`, `title`, `summary`, `updatedAt`
- `videoType` (`youtube` | `vimeo` | `local`)
- `videoUrl`
- `tags[]`

`local` videos must use absolute public paths (for example `/videos/demo.mp4`).

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm format`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm test:e2e:ui`
- `pnpm ci`

## Quality gates

`pnpm ci` runs:

1. Typecheck
2. Lint
3. Unit/integration tests
4. Production build
5. Playwright smoke tests

## SEO and discoverability

- Page metadata with canonical + OG + Twitter
- `app/robots.ts`
- `app/sitemap.ts`
- JSON-LD:
  - `Person`
  - `WebSite`
  - `Article` (research)
  - `SoftwareSourceCode` / `CreativeWork` (project/demo detail pages)
- RSS feed:
  - `/research/rss.xml`

## Security baseline

- Secure headers + CSP in `next.config.ts` via `lib/security/headers.ts`
- Contact API input validation with zod
- Simple IP rate limit guard for contact endpoint
- No secrets committed; use `.env.local` locally and Vercel project envs in production

## Deployment (Vercel Pro + Cloudflare DNS)

1. Import repository into Vercel.
2. Set production environment variables.
3. Configure custom domain in Vercel.
4. In Cloudflare DNS:
   - set CNAME/ALIAS target to Vercel-provided domain
   - keep SSL mode as Full (strict)
5. Validate:
   - homepage, key routes, sitemap/robots/rss
   - analytics ingestion
   - headers/CSP behavior in browser devtools

Detailed deployment notes are in `docs/deployment.md`.

## CI and branch protection recommendations

Use GitHub branch protection on `main`:

- Require PR before merge
- Require CI checks to pass:
  - `typecheck`
  - `lint`
  - `test`
  - `build`
  - `e2e-smoke`
- Current workflow runs these gates under the `quality` job in `.github/workflows/ci.yml`
- Require up-to-date branch before merge
- Disallow force pushes/deletions

## Dependency choices rationale

- `next-mdx-remote`: stable MDX rendering for repo-local content
- `zod`: explicit runtime validation and safer content ingestion
- No fuzzy-search dependency added: lightweight in-house fuzzy logic keeps bundle/deps lean

## Related docs

- `docs/architecture.md`
- `docs/deployment.md`
- `docs/production-checklist.md`
