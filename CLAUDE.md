# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack, localhost:3000)
npm run build     # Production build (Turbopack)
npm run start     # Start production server
npm run lint      # Run ESLint
npm run lint:fix  # Run ESLint with auto-fix
npx prisma studio          # Open Prisma Studio (DB GUI)
npx prisma migrate dev     # Run pending migrations
npx prisma generate        # Regenerate Prisma client
```

## Architecture

- **Next.js 16.2.1** with the **App Router** (`app/` directory). No `pages/` directory.
- **React 19.2** — includes View Transitions, `useEffectEvent`, Activity component.
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in CSS (no `tailwind.config.js`); PostCSS uses `@tailwindcss/postcss`.
- **TypeScript** strict mode; path alias `@/*` maps to the repo root.
- **ESLint** uses the modern flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Run via `eslint` CLI directly — `next lint` is deprecated in v16.
- **Prisma 7** with PostgreSQL — client generated to `app/generated/prisma/`. Import from `@/app/generated/prisma/client`. Uses driver adapter `@prisma/adapter-pg`.
- **Multer** — handles multipart file uploads in API routes. Files saved to `public/user_documents/`. Use `lib/multer.ts` helper (`runMulter`) which bridges `NextRequest` → Node.js stream.
- **Axios** — all client-side API calls go through `lib/api.ts`. Auto-redirects to `/login` on 401.
- **JWT Auth** — HTTP-only cookie (`token`, 7-day expiry). Login via `POST /api/auth/login`.

## Next.js 16 Breaking Changes to Know

- **Turbopack is default** for both `next dev` and `next build`. Use `--webpack` flag to opt out.
- **All Request-time APIs are async-only** — no synchronous access. Always `await` these:
  - `cookies()`, `headers()`, `draftMode()`
  - `params` and `searchParams` in layouts, pages, route handlers
- **`middleware` → `proxy`**: The file must be named `proxy.ts`/`proxy.js` and the named export must be `proxy` (not `middleware`). The `edge` runtime is not supported in `proxy`; use `middleware` file if you need edge runtime.
- **`cacheLife` and `cacheTag`**: Import directly from `next/cache` without `unstable_` prefix.
- **`revalidateTag`** accepts an optional second argument (a `cacheLife` profile).
- **New cache API `updateTag`**: Server Actions only; provides read-your-writes semantics.
- **`next/image`**: Local images with query strings require `images.localPatterns.search` config. Default `minimumCacheTTL` is now 4 hours (was 60 seconds).
- **PPR**: `experimental.ppr` is removed; use `cacheComponents: true` in `next.config.ts`.
- **Node.js 20.9+** required.

## Key File Conventions

| File/Dir | Purpose |
|----------|---------|
| `app/layout.tsx` | Root layout — includes `<Navbar />`, wraps all pages |
| `app/page.tsx` | Home route (`/`) — Hero, HowItWorks, StudentExperiences, Footer |
| `app/contact/page.tsx` | Contact form — submits to `POST /api/tickets` via axios |
| `app/login/page.tsx` | Login page — submits to `POST /api/auth/login` via axios |
| `app/globals.css` | Global styles + Tailwind import |
| `app/components/Navbar.tsx` | Fixed top navbar (rendered in root layout) |
| `app/components/Footer.tsx` | Dark footer |
| `app/components/HowItWorks.tsx` | Steps section with data |
| `app/components/StudentExperiences.tsx` | Reviews section with data |
| `app/generated/prisma/` | Auto-generated Prisma client — do not edit manually |
| `prisma/schema.prisma` | Prisma schema — models: `Ticket`, `Agent` |
| `prisma.config.ts` | Prisma config — datasource URL for CLI/migrations |
| `lib/prisma.ts` | Prisma client singleton using `PrismaPg` adapter |
| `lib/api.ts` | Axios instance (`baseURL=/api`, `withCredentials=true`, 401→/login) |
| `lib/multer.ts` | Multer helper — `runMulter(req, fieldName)` for file uploads |
| `next.config.ts` | Next.js configuration |
| `proxy.ts` | Network proxy/routing logic (replaces `middleware.ts`) |
| `public/user_documents/` | Uploaded result documents |

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Accepts `{ username, password }`, sets JWT HTTP-only cookie |

### Agents
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/agents` | List all agents |
| `PATCH` | `/api/agents` | Upsert agent (no `id` = create, with `id` = update) |
| `DELETE` | `/api/agents/:id` | Delete agent |

### Tickets
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/tickets` | List tickets — open/on_going + priority first, then created_at desc |
| `GET` | `/api/tickets/:id` | Get single ticket (includes agent) |
| `POST` | `/api/tickets` | Create ticket — `multipart/form-data`, file field: `document` |
| `PATCH` | `/api/tickets/:id` | Partial update ticket |

## Database Models

### Ticket
`id`, `name`, `address`, `ticket_type` (online/offline), `status` (open/on_going/resolved/not_interested), `contact_number`, `board`, `exam_detail`, `user_call_comments`, `document_url`, `priority`, `commission_money`, `commission_received`, `master_commission_pending`, `created_at`, `updated_at`, `agent_id` (FK → Agent)

### Agent
`id`, `name`, `contact_number`, `total_commission`, `first_commission`, `second_commission`, `created_at`, `updated_at`

## Prisma Notes (v7)

- Generator: `provider = "prisma-client"`, output `"../app/generated/prisma"`
- No `url` in `schema.prisma` datasource — URL lives in `prisma.config.ts` (for CLI) and is passed via `PrismaPg` adapter in `lib/prisma.ts` (for runtime)
- After schema changes: run `npx prisma migrate dev` then `npx prisma generate`

## Environment Variables

```env
DATABASE_URL        # PostgreSQL connection string
JWT_SECRET          # Secret for signing JWT tokens
ADMIN_USERNAME      # (legacy) — auth now uses USERS array in route.ts
ADMIN_PASSWORD      # (legacy) — auth now uses USERS array in route.ts
```

Auth users are defined directly in `app/api/auth/login/route.ts` as a `USERS` array.

Consult `node_modules/next/dist/docs/` for authoritative API details before writing code — this version differs from prior training data.
