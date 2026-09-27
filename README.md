# Rakshan Hegde

A personal website for software engineering, AI, cybersecurity, and scientific curiosity. The design takes its cues from an old newspaper: warm paper, serif headlines, ink drawings, restrained burgundy accents, and generous reading space.

This README is the architecture and content-authoring reference. Deployment procedures live in [docs/deployment.md](docs/deployment.md).

## Stack

- Node **24.x**, selected by `.node-version` and `package.json`; pnpm version in `packageManager`.
- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4.
- Server Components, local Newsreader and Instrument Sans fonts, CSS paper textures, and inline SVG illustrations.
- Repository-owned MDX, parsed with `gray-matter`, validated by Zod, rendered with `next-mdx-remote`.
- Vitest for content/security checks; Playwright with Chromium for browser behavior.

There is no CMS or database. Contact and social links remain disabled placeholders until real destinations are supplied. Writing deliberately starts empty. The former Lab, terminal, command palette, contact API, and sample articles are removed.

## Local development

Select Node 24 with your installed version manager, then:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. Optional local settings go in the ignored `.env.local` file.

| Variable               | Behavior                                                        |
| ---------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL; defaults to `https://rakshanhegde.com`.          |
| `SITE_USERNAME`        | Basic Auth username; defaults to `rakshan`.                     |
| `SITE_PASSWORD`        | A nonempty value enables Basic Auth; unset means public access. |

Store production credentials in hosting environment settings. Never put them in content, screenshots, logs, or source control.

## Where to change things

| Path                                    | Responsibility                                                            |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `app/(site)/page.tsx`                   | Newspaper front page.                                                     |
| `app/(site)/projects/`                  | Project index and MDX detail pages.                                       |
| `app/(site)/writing/`                   | Writing index, empty state, and future MDX articles.                      |
| `app/(site)/about/page.tsx`             | Biography, experience, education, and interests.                          |
| `lib/config/profile.ts`                 | Resume-backed experience and education.                                   |
| `lib/config/site.ts`                    | Site identity, navigation, canonical URL, contact placeholders.           |
| `app/globals.css`                       | Paper, ink, typography, layout, and responsive styles.                    |
| `components/`                           | Masthead, footer, project cards, scientific illustrations, MDX elements.  |
| `content/projects/`, `content/writing/` | Published MDX content.                                                    |
| `lib/schema/`, `lib/content/`           | Content validation, loading, sorting, and Markdown serialization.         |
| `lib/seo/`, `lib/og/`                   | Metadata, structured data, and social preview images.                     |
| `proxy.ts`, `lib/security/headers.ts`   | Optional Basic Auth, Markdown negotiation, and response security headers. |

Public page routes are `/`, `/projects`, `/projects/[slug]`, `/writing`, `/writing/[slug]`, and `/about`. Legacy `/research` routes permanently redirect to `/writing` equivalents. Removed features and unknown content slugs return 404.

## Adding content

Only trusted, reviewed files belong in `content/`: MDX is compiled code, not an upload format. Do not put confidential employer data or unpublished contact details in these files.

### Projects

Add `content/projects/<slug>.mdx`. Use the same kebab-case value for the filename and `slug`. The frontmatter schema is `lib/schema/project.ts`:

| Field                      | Meaning                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| `slug`, `title`, `summary` | URL identifier, headline, and short description.                              |
| `category`, `context`      | Discipline and where the work was undertaken.                                 |
| `status`                   | `in-use` or `ongoing`.                                                        |
| `updatedAt`                | Last editorial update as an ISO date; not an inferred project start date.     |
| `stack`, `tags`            | Nonempty lists; normalized to lowercase and deduplicated.                     |
| `impact`                   | A concise, substantiated outcome.                                             |
| `featured`                 | Optional boolean, defaults to `false`; includes the project in selected work. |
| `order`                    | Nonnegative integer; projects sort ascending, then by slug.                   |

Follow the existing VulTrack, ThreatNet, or Multi-Agent Development Harness entry for MDX body structure. Unsupported fields fail validation. External project links have no schema fields until real links are introduced deliberately.

### Writing

Add `content/writing/<slug>.mdx` when a real article is ready. Required frontmatter: `slug`, `title`, `summary`, `updatedAt`, and nonempty `tags`. Optional fields: `hypothesis`, `findings`, URL `references`, and boolean `featured`. Entries sort by newest `updatedAt`.

The empty directory is retained with `.gitkeep`. Adding the first entry populates the writing index and RSS feed. Update the tests that currently assert the intentional empty state and the three-project inventory when publishing new content.

## Discovery and rendering

Content loaders read and validate local MDX on the server. Detail pages generate static parameters from the same collections used by navigation and metadata. Page layouts remain server-rendered; typography and paper effects do not require animation libraries.

- `/sitemap.xml` lists current page and content routes.
- `/robots.txt` publishes crawl rules and the sitemap location.
- `/writing/rss.xml` is valid even when no writing has been published.
- `/llms.txt` describes the site and links to Markdown content.
- `/projects/<slug>.md` and `/writing/<slug>.md` return Markdown. The homepage and collection indexes also support `.md` and `Accept: text/markdown`.

The proxy applies Basic Auth before Markdown rewrites. Protected content uses `private, no-store` cache controls. Security headers are configured in `next.config.ts` from `lib/security/headers.ts`. Production CSP omits `unsafe-eval`; development includes it for tooling. Fonts and illustrations are local, and no analytics or third-party embeds are loaded.

## Verification

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
PLAYWRIGHT_USE_BUILD=true pnpm test:e2e
```

`pnpm test:e2e` starts a dedicated server at `http://localhost:3100` with generated credentials shared only by that test run. It never reuses the development server or reads real credentials. Tracing is disabled to avoid capturing Authorization headers. `PLAYWRIGHT_USE_BUILD=true` tests the production build; CI uses production mode automatically. Without that flag, local E2E starts a development server.

Browser tests check navigation, keyboard access, resume-backed project details, contact placeholders, removed routes, discovery endpoints, and overflow at 320, 390, and 1440 pixels. Future writing serialization is covered with an in-memory fixture, not a published sample article.

`pnpm ci` runs typecheck, lint, Vitest, build, and E2E in order. GitHub Actions uses `.node-version` and installs Chromium with its Linux dependencies. On Arch Linux, use the system package manager if Chromium reports missing shared libraries; Playwright's dependency installer targets supported Debian/Ubuntu systems.

Dependencies are audited with `pnpm audit` and `pnpm audit --prod`. Lockfile updates and audit overrides belong in the same review as their verification. No command here deploys the website.
