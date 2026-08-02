# AGENTS.md

## Architecture

DDL / Clean Architecture with 4 layers. Dependency direction: **domain → application → infrastructure → presentation**.

- `src/domain/{model}/` — entities, value objects, repository interfaces
- `src/application/{model}/` — service interfaces + implementations, errors
- `src/infrastructure/{model}/` — Prisma repositories, mappers; `src/infrastructure/prisma/` for DB client
- `src/presentation/{model}/` — controllers, routes, validators (Zod), request/response DTOs, mappers
- `src/dependencyInjection/container.ts` — manual DI wiring (no framework)

New models must follow the conventions in `.github/instructions/ddd-*-layer.instructions.md`.

## Prisma (non-standard paths)

- Schema: `src/infrastructure/prisma/schema.prisma`
- Migrations: `src/infrastructure/prisma/migrations`
- Generated client: `src/infrastructure/prisma/generated/` (gitignored)
- Config: `prisma.config.ts` at repo root defines these paths

After schema changes, regenerate:
```
npx prisma generate
```

## Database

MariaDB (not MySQL, not MongoDB). Uses `@prisma/adapter-mariadb`. Connection config in `src/infrastructure/core/config/keys/mysql.ts`.

Required env vars (see `.env.example`): `DATABASE_URL`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`, `APP_INVITE_URL`.

## Commands

- `npm run dev` — nodemon + ts-node (entry: `src/presentation/server.ts`)
- `npm run build` — `tsc && tsc-alias` (resolves `@/*` path aliases)
- `npm run start` — runs built JS with tsconfig-paths (production debugging)
- `npm run start:prod` — runs built JS directly (Docker CMD)

No test, lint, or typecheck scripts are configured.

## Path Aliases

`@/*` → `src/*` (configured in `tsconfig.json`, resolved at build by `tsc-alias`).

## Auth

API auth uses JWT (`src/presentation/auth/middlewares/jwtAuth.ts`). Extracts `Bearer` token from `Authorization` header, sets `req.user`. Routes apply `jwtAuth` middleware as needed. Google OAuth for login flow.

## Test login (App Store / Play review)

`POST /api/v1/auth/test-login` exists because Apple and Google require a working demo account
for app review, and this app has no email/password login otherwise (only Google/Apple OAuth,
which reviewers cannot exercise as themselves). Credentials live entirely in env vars
(`TEST_LOGIN_ENABLED`, `TEST_LOGIN_EMAIL`, `TEST_LOGIN_PASSWORD`) — there is no password column
on `User` and no migration; the service (`TestLoginService`,
`src/application/auth/services/implementations/TestLoginService.ts`) compares the submitted
email/password against the configured ones with `crypto.timingSafeEqual` and never reveals
whether the email exists.

The route is only mounted when `TEST_LOGIN_ENABLED === "true"` (`auth.route.ts`); with the flag
unset or false, `POST /api/v1/auth/test-login` 404s rather than existing-but-rejecting. `env.ts`
fails fast at boot if the flag is on but the email/password are missing or the password is
shorter than 16 characters, and prints a loud warning banner on every boot while the flag is on.
The route is additionally rate-limited (10 attempts / 15 min per IP,
`src/presentation/core/middlewares/rateLimit.ts`), and every successful login is logged
(IP only, never the password).

On first login, the account is seeded once with a demo company, clients, products and orders
(`TestAccountSeeder`) so reviewers see a populated app; from then on it is a completely ordinary
FREE-plan user — same `jwtAuth`, `requireCompanyId`, `requireCompanyRole` and `enforceLimit`
checks as any other account, no special role or bypass.

**Operating rule: turn it on for submission, turn it off as soon as the app is approved.** This
is not a product feature — see the submission checklist on issue #37 for the exact steps.

## Billing

Plans are per `Company`, not per user. RevenueCat's `app_user_id` MUST be the `companyId` — the
mobile client passes the organization id as the app user id when starting a purchase. Webhook
events (`POST /api/v1/billing/webhooks/revenuecat`) are unauthenticated by JWT — there is no
`jwtAuth`/`requireCompanyId` on that route — and are instead verified server-to-server against
the `REVENUECAT_WEBHOOK_AUTH` shared secret in the `Authorization` header
(`src/infrastructure/billing/providers/RevenueCatProvider.ts`). The provider is abstracted behind
`IPaymentProvider` (`src/domain/billing/providers/`) so a future Tilopay adapter can be added
without touching application code. Plan limits (per resource, per tier) live in code in
`src/application/billing/PlanCatalog.ts`.

Every company gets a FREE subscription at creation time, in the same transaction as the company
itself (`PrismaCompanyCreationUnitOfWork`); companies predating this were backfilled by the
`20260725130000_backfill_free_subscriptions` data migration. Limits are enforced in the
presentation layer by the `enforceLimit(resource)` middleware, which returns **HTTP 402** with a
machine-readable `PLAN_LIMIT_EXCEEDED` payload — the API never blocks silently, the client owns
the upgrade UX. Monthly/daily windows are evaluated in `America/Costa_Rica`
(`src/application/billing/utils/billingWindows.ts`).

Optional env vars: `REVENUECAT_WEBHOOK_AUTH` (must match the `Authorization` header configured in
the RevenueCat dashboard; when unset the webhook fails closed and rejects everything),
`REVENUECAT_API_KEY`.

## Key Quirks

- Express **5.x** (not 4) — response methods may differ from 4.x patterns
- Some value object files have typos (e.g., `valouObject.ts`) — match existing naming when editing
- `prisma.config.ts` uses `dotenv/config` import for env loading
- All API routes mounted under `/api/v1`
- `requireCompanyId` middleware parses company context from requests