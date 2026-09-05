# Rakshan Hegde — Personal Website

Production-oriented personal site: **Next.js App Router**, **TypeScript (strict)**, **Tailwind CSS**, **Framer Motion**, **MDX** content in-repo. Deployed on **Vercel**; DNS often fronted by **Cloudflare**.

## Single source of truth

**This `README.md` is canonical** for stack, request flow, entry/exit points, directory map, rendering model, content rules, env vars, security baseline, CI, and "where to change what."

Other files under `docs/` are **narrow runbooks** (deploy steps, checklists). They link back here and do not duplicate architecture—if something disagrees, **trust this README** and fix the doc.

**For LLMs / tools:** ingest this file first when mapping the codebase.

---

## Design goals

- Server Components by default for lean client bundles.
- Git-based MDX with strict runtime validation (zod).
- Search/filter only where needed (client islands).
- Production-oriented SEO, security headers, optional analytics, and CI gates.

---

## Design system

Terminal / phosphor green aesthetic. Dark-only — no light mode.

| Token      | Value     | Usage                                        |
| ---------- | --------- | -------------------------------------------- |
| `--bg`     | `#0c0c0c` | Page background                              |
| `--panel`  | `#111111` | Card / surface background                    |
| `--text`   | `#e2e8f0` | Primary text                                 |
| `--muted`  | `#6b7280` | Secondary text, labels, timestamps           |
| `--accent` | `#00ff88` | Phosphor green — CTAs, section labels, links |
| `--border` | `#1e1e1e` | All borders (0.5px throughout)               |

**Typography:** `JetBrains Mono` for all UI chrome (nav, headings, labels, terminal elements). `Inter` / system-sans for body and description text only.

**Borders:** `0.5px solid #1e1e1e` throughout. No drop shadows. No background gradients.

**Buttons:** ghost-green primary (`transparent` bg, `#00ff88` text + border) and ghost-gray secondary (`transparent` bg, `#2a2a2a` border).

**Section labels:** `// label` format rendered in small green mono via `SectionHeading`.

CSS variables and `@theme inline` mappings live in `app/globals.css`. Tailwind config is `tailwind.config.mjs`.

---

## Stack (pinned intent)

| Layer                | Choice                                                             |
| -------------------- | ------------------------------------------------------------------ |
| Framework            | Next.js **16** App Router (`next` 16.x)                            |
| Language             | TypeScript strict                                                  |
| Styling              | Tailwind v4, design tokens in CSS variables (phosphor green theme) |
| Motion               | Framer Motion, `prefers-reduced-motion` aware                      |
| Content              | Git-tracked MDX under `content/`                                   |
| Parsing / validation | `gray-matter` + **zod** schemas in `lib/schema/`                   |
| MDX render           | `next-mdx-remote` on detail pages (`components/MdxContent.tsx`)    |
| Analytics            | `@vercel/analytics`, gated by env                                  |
| Tests                | Vitest + Testing Library; Playwright e2e smoke                     |
| Git hooks            | Husky (`prepare` in `package.json`)                                |

Node: **20.x** (`package.json` `engines`; matches Vercel major). Package manager: **pnpm** (see CI).

---

## Request flow (high level)

Every incoming request hits **Next.js** first. The root **`proxy.ts`** (Next.js 16+ successor to `middleware.ts`) runs **only** for paths matched by its `config.matcher`; static framework assets are excluded.

```mermaid
flowchart TD
  subgraph ingress [Ingress]
    B[Browser / client]
  end

  subgraph edge [Next boundary]
    P[proxy.ts optional Basic Auth]
    R[Route handler / App Router page / Route Handler]
  end

  subgraph data [Server-side data]
    L[lib/content/loaders.ts]
    C[content/*.mdx]
    FS[node:fs read at request or build time]
  end

  B --> P
  P -->|401 + WWW-Authenticate| B
  P -->|NextResponse.next| R
  R --> L
  L --> FS
  C --> FS
  R -->|HTML RSC payload / JSON / XML / headers| B
```

**Order of operations (conceptual):**

1. **`proxy.ts`** — If `SITE_PASSWORD` is set, require HTTP Basic Auth; otherwise `NextResponse.next()`. Matcher skips `/_next/*` and `/favicon.ico`. After auth, content-page requests ending in `.md` (or sent with `Accept: text/markdown`) are rewritten to `/api/markdown` (see **Agent-native surface**).
2. **`next.config.ts` `headers()`** — Global security headers + CSP from `lib/security/headers.ts` (applies broadly via `source: "/(.*)"`).
3. **App Router** — Matched `app/**` segment renders (mostly Server Components) or invokes Route Handlers under `app/api/*` and `app/research/rss.xml/route.ts`.

---

## Entry points (where work starts)

Use this table when routing a task to the right file.

| Kind                  | Path                                       | Role                                                                                              |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Proxy (pre-route)** | `proxy.ts`                                 | Optional site-wide Basic Auth; `SITE_USERNAME` / `SITE_PASSWORD`                                  |
| **Root layout**       | `app/layout.tsx`                           | `<html>`, fonts, global `metadata`, root JSON-LD (`Person`, `WebSite`), optional Vercel Analytics |
| **Chrome layout**     | `app/(site)/layout.tsx`                    | `SiteHeader`, `<main>`, `SiteFooter` — route group `(site)` does **not** appear in URLs           |
| **Site config**       | `lib/config/site.ts`                       | Name, nav, social links, email, `siteConfig.url` (from `NEXT_PUBLIC_SITE_URL` or fallback)        |
| **Next config**       | `next.config.ts`                           | Security headers attachment                                                                       |
| **Content load**      | `lib/content/loaders.ts`                   | Read `content/{projects,research}/*.mdx`, parse frontmatter, zod validate, sort by `updatedAt`    |
| **Schemas**           | `lib/schema/*.ts`                          | Frontmatter + contact payload shapes                                                              |
| **SEO helpers**       | `lib/seo/metadata.ts`, `lib/seo/jsonld.ts` | Page metadata and JSON-LD builders                                                                |
| **Contact API**       | `app/api/contact/route.ts`                 | POST handler; gated by `ENABLE_CONTACT_FORM`; zod + rate limit                                    |
| **Markdown API**      | `app/api/markdown/route.ts`                | Markdown versions of content pages (reached via proxy rewrite, not linked directly)               |
| **llms.txt**          | `app/llms.txt/route.ts`                    | Agent-facing site overview generated from content                                                 |
| **OG images**         | `app/opengraph-image.tsx` + per-slug files | Generated phosphor-terminal social cards via `lib/og/template.tsx` (`next/og`)                    |
| **RSS**               | `app/research/rss.xml/route.ts`            | GET → RSS XML for research entries                                                                |
| **Sitemap**           | `app/sitemap.ts`                           | Metadata route for sitemap                                                                        |
| **Robots**            | `app/robots.ts`                            | Metadata route for robots.txt                                                                     |
| **404**               | `app/not-found.tsx`                        | Global not-found UI                                                                               |

**Pages (all under `app/(site)/` unless noted):**

| URL                | File                              |
| ------------------ | --------------------------------- |
| `/`                | `(site)/page.tsx`                 |
| `/projects`        | `(site)/projects/page.tsx`        |
| `/projects/[slug]` | `(site)/projects/[slug]/page.tsx` |
| `/research`        | `(site)/research/page.tsx`        |
| `/research/[slug]` | `(site)/research/[slug]/page.tsx` |
| `/about`           | `(site)/about/page.tsx`           |
| `/privacy`         | `(site)/privacy/page.tsx`         |
| `/terms`           | `(site)/terms/page.tsx`           |

Detail routes use **`generateStaticParams`** where applicable so slugs are known at build time.

---

## Exit points (what leaves the app)

| Response type                       | Where                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------ |
| **HTML (RSC)**                      | App Router pages → streamed/flight response to browser                   |
| **401 + `WWW-Authenticate: Basic`** | `proxy.ts` when auth missing or invalid                                  |
| **JSON**                            | `POST /api/contact` — success/error body from `app/api/contact/route.ts` |
| **Markdown**                        | `GET /llms.txt`, `GET <content-path>.md`, `Accept: text/markdown`        |
| **PNG (OG images)**                 | `GET /opengraph-image`, per-slug `opengraph-image` routes                |
| **XML (RSS)**                       | `GET /research/rss.xml`                                                  |
| **Metadata routes**                 | `GET` sitemap / robots via `app/sitemap.ts`, `app/robots.ts`             |
| **Static assets**                   | `public/`, `_next/static` (bypassed by proxy matcher)                    |

Outbound **webhook** (optional): contact form POSTs to `CONTACT_FORM_WEBHOOK_URL` when backend form is enabled.

---

## Directory map (responsibilities)

| Directory       | Responsibility                                                               |
| --------------- | ---------------------------------------------------------------------------- |
| `app/`          | Routes, layouts, API & RSS Route Handlers, sitemap/robots                    |
| `components/`   | UI; client components for search/filter, motion, contact form, MDX overrides |
| `content/`      | Source of truth: `projects/`, `research/` MDX                                |
| `lib/config/`   | Site copy, nav, command-palette items                                        |
| `lib/content/`  | Loaders, typed entry aliases, markdown serializers                           |
| `lib/schema/`   | Zod frontmatter + API schemas                                                |
| `lib/search/`   | Fuzzy filter/scoring for list pages and command palette                      |
| `lib/seo/`      | Metadata + JSON-LD                                                           |
| `lib/security/` | CSP / security header definitions                                            |
| `lib/terminal/` | Pure command engine for the interactive home-page terminal                   |
| `lib/github/`   | Recent public GitHub activity fetch (ISR-cached, fails silent)               |
| `lib/og/`       | Shared `next/og` template for generated social cards                         |
| `lib/motion/`   | Motion timing/easing shared values                                           |
| `lib/utils/`    | Small helpers (`cn`, dates)                                                  |
| `assets/fonts/` | JetBrains Mono TTFs (OFL) read at build time for OG rendering                |
| `tests/`        | Vitest unit/integration; Playwright in `tests/e2e/`                          |
| `docs/`         | Deploy runbook + checklist only (architecture is this README)                |

---

## Rendering & client boundaries

- **Default:** Server Components — data fetching via loaders in server `page.tsx` files.
- **Client Components** (examples): `*ClientView.tsx` list/search UIs, `ContactForm`, `MotionReveal` and motion-enhanced cards.
- **MDX body:** Detail pages render through `MdxContent` (`next-mdx-remote/rsc`) with `remark-gfm`, `rehype-highlight`, and internal `href` mapped to Next `Link`.

---

## Content data flow (MDX → pages)

```mermaid
flowchart LR
  F[content/*.mdx] --> M[gray-matter]
  M --> Z[lib/schema zod]
  Z --> L[lib/content/loaders.ts]
  L --> R[app route pages]
  R --> UI[components + SEO]
```

---

## Performance

- Server rendering and static params on detail routes keep client JS small.
- Motion respects **`prefers-reduced-motion`**.

---

## Local setup

1. **Node** 20.x and **pnpm** (repo assumes pnpm; CI uses Node 20).
2. `pnpm install` (runs Husky `prepare`).
3. `cp .env.example .env.local` and set variables as needed.
4. `pnpm dev` → [http://localhost:3000](http://localhost:3000).

### E2E / Playwright

CI: `pnpm exec playwright install --with-deps chromium`. On minimal or Arch-based systems, install OS libs if Chromium fails to start.

---

## Environment variables

Authoritative template: **`.env.example`**.

| Variable                            | Purpose                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | Canonical URL (`metadataBase`, sitemap, OG, JSON-LD)           |
| `NEXT_PUBLIC_ENABLE_ANALYTICS`      | `true` → Vercel `<Analytics />` in root layout                 |
| `NEXT_PUBLIC_ENABLE_CONTACT_FORM`   | Show contact UI on About                                       |
| `SITE_USERNAME`                     | Basic Auth user (default `rakshan` if unset)                   |
| `SITE_PASSWORD`                     | If set (non-empty), enables site-wide Basic Auth in `proxy.ts` |
| `ENABLE_CONTACT_FORM`               | Allow `POST /api/contact`                                      |
| `CONTACT_FORM_WEBHOOK_URL`          | Webhook for submissions                                        |
| `CONTACT_FORM_RATE_LIMIT_WINDOW_MS` | Rate-limit window (ms)                                         |
| `CONTACT_FORM_RATE_LIMIT_MAX`       | Max POSTs per IP per window                                    |

Secrets stay in **`.env.local`** (local) and **Vercel project settings** (production).

---

## Content authoring

MDX lives in:

- `content/projects/*.mdx`
- `content/research/*.mdx`

Pipeline: **read file** → **gray-matter** → **zod parse** (`lib/schema/*`) → **sort** by `updatedAt` desc → **detail pages** compile MDX via `next-mdx-remote`.

### Project frontmatter (required)

`slug`, `title`, `summary`, `status` (`ongoing` \| `completed`), `startedAt`, `updatedAt`, `stack[]`, `tags[]`, `aiFocus[]`.  
`completed` → require `completedAt`. Optional `featured: true` to include on the home page preview (max 4 shown).

### Research frontmatter (required)

`slug`, `title`, `summary`, `updatedAt`, `tags[]`. Optional `hypothesis` and `findings` — both are shown inline on the research list card if present.

---

## Scripts

| Script                      | Action                                |
| --------------------------- | ------------------------------------- |
| `pnpm dev`                  | Dev server                            |
| `pnpm build` / `pnpm start` | Production build / serve              |
| `pnpm typecheck`            | `tsc --noEmit`                        |
| `pnpm lint`                 | ESLint                                |
| `pnpm format`               | Prettier                              |
| `pnpm test`                 | Vitest                                |
| `pnpm test:e2e`             | Playwright                            |
| `pnpm test:e2e:ui`          | Playwright UI                         |
| `pnpm ci`                   | typecheck → lint → test → build → e2e |

---

## CI

GitHub Actions: `.github/workflows/ci.yml`, job **`quality`** — checkout, pnpm install, typecheck, lint, vitest, build, Playwright chromium + e2e.

PR template at `.github/pull_request_template.md` — auto-populated on new PRs.

---

## Interactive features

- **Interactive terminal** (home page): `components/InteractiveTerminal.tsx` over a pure engine in `lib/terminal/commands.ts` (unit-tested). Commands: `help`, `whoami`, `focus`, `ls`, `cat <slug>`, `open <target>`, `contact`, `clear`, plus easter eggs. Tab completion, up/down history, `prefers-reduced-motion`-aware boot typing.
- **Command palette**: `components/CommandPalette.tsx`, opened with `⌘K` / `Ctrl+K` or `/`. Fuzzy-searches pages, projects, research, and actions (items built server-side in `lib/config/palette.ts`, scoring via `lib/search/fuzzy.ts`).
- **GitHub activity strip** (home page): recent public events for the configured GitHub account, fetched server-side with `revalidate: 3600`; the section renders nothing on error or empty feed.

---

## Agent-native surface

The site is first-class for AI agents and scrapers:

- **`/llms.txt`** — generated markdown overview of the whole site with links to markdown versions of every entry.
- **`.md` suffix** — any content page (`/`, `/projects`, `/research`, and detail slugs) returns clean markdown when `.md` is appended, e.g. `/projects/<slug>.md`.
- **Content negotiation** — the same pages return markdown when requested with `Accept: text/markdown`.

Both are implemented as a proxy rewrite (`proxy.ts`, after Basic Auth) to `app/api/markdown/route.ts`, with serializers in `lib/content/markdown.ts`.

---

## SEO & discovery

- Per-page metadata helpers and JSON-LD (`Article` for research; `SoftwareSourceCode` for projects).
- Generated OG images (phosphor terminal style) for the root and every project/research detail page via `next/og` — template in `lib/og/template.tsx`, fonts in `assets/fonts/`.
- `app/robots.ts`, `app/sitemap.ts`.
- RSS: `/research/rss.xml`.

---

## Security baseline

- CSP + security headers: `lib/security/headers.ts` → `next.config.ts`. Production omits `unsafe-eval`; dev adds it so React’s dev tooling can run under CSP.
- Contact route: zod validation, env flags, in-memory IP rate limiting.
- Optional **Basic Auth** in `proxy.ts` (timing-safe credential check via SHA-256 digest comparison — Edge-safe pattern).
- No committed secrets.

---

## Deployment (summary)

1. Import repo into Vercel; set env vars.
2. Custom domain in Vercel; Cloudflare DNS → Vercel target; SSL Full (strict).
3. Smoke-test routes, sitemap/robots/RSS, headers, analytics if enabled.

Details: **`docs/deployment.md`**.

---

## Branch protection (recommended)

On `main`: require PR, require **`quality`** CI success, up-to-date branch, no force-push.

---

## Dependency rationale (short)

- **next-mdx-remote:** MDX from repo files without bundling all MDX at edge cases in the main bundle.
- **zod:** Runtime validation for content and API payloads.
- **In-repo fuzzy search:** `lib/search/fuzzy.ts` avoids pulling a heavy search dependency.
- **ESLint 9.x:** `eslint-plugin-react` (via `eslint-config-next`) does not yet support ESLint 10. The direct devDependency is pinned to **9.39.4**, and **`pnpm.overrides.eslint`** forces the same version for the whole graph so CI and Dependabot cannot resolve `eslint@10` until plugins catch up.

---

## Related documentation (non-canonical)

| File                           | Role                                               |
| ------------------------------ | -------------------------------------------------- |
| `docs/architecture.md`         | Pointer to this README (no duplicate architecture) |
| `docs/deployment.md`           | Step-by-step Vercel + Cloudflare + validation      |
| `docs/production-checklist.md` | Pre-ship checkbox list                             |
