# Configuration

All configuration comes from environment variables, loaded with `dotenv` from `.env` in development. Start from [`.env.example`](../.env.example).

## Environment variables

### Core

| Variable | Required | Default | Used by |
|---|:-:|---|---|
| `NODE_ENV` | | `development` | General runtime mode |
| `PORT` | | `3000` | HTTP listener |
| `ENV` | | `development` | Selects the CORS origin allow-list (`development` / `test` / `production`) |
| `MIN_FRONTEND_VERSION` | ✅ | none | `GET /system/min-frontend-version`. **Must be valid semver** |

### Database

| Variable | Required | Default | Used by |
|---|:-:|---|---|
| `DATABASE_URL` | ✅ | none | Prisma CLI (`prisma.config.ts`): migrations and generation. Format `mysql://user:pass@host:3306/db` |
| `DB_HOST` | ✅ | `localhost` | Runtime MariaDB driver adapter |
| `DB_PORT` | ✅ | `3306` | 〃 |
| `DB_USER` | ✅ | `root` | 〃 |
| `DB_PASSWORD` | ✅ | empty | 〃 |
| `DB_NAME` | ✅ | none | 〃 |
| `DB_ROOT_PASSWORD` | | `changeme` | `docker-compose.yml` only |

> The Prisma CLI and the runtime connect differently. The CLI uses `DATABASE_URL`. The application uses `@prisma/adapter-mariadb` with the discrete `DB_*` settings and a connection pool limited to 10 connections.

### Auth

| Variable | Required | Default | Used by |
|---|:-:|---|---|
| `JWT_SECRET` | ✅ | none (set a strong value) | Signing and verifying API tokens |
| `JWT_EXPIRES_IN` | | `7d` | Token lifetime |
| `GOOGLE_CLIENT_ID` | ✅ for Google sign-in | none | Google OAuth client |
| `GOOGLE_IOS_CLIENT_ID` | ✅ for Google sign-in | none | Accepted ID-token audience |
| `GOOGLE_ANDROID_CLIENT_ID` | ✅ for Google sign-in | none | Accepted ID-token audience |
| `APPLE_CLIENT_ID` | ✅ for Apple sign-in | none | ID-token audience (bundle/service ID) |
| `APPLE_TEAM_ID` | optional | none | Apple token revocation on account deletion |
| `APPLE_KEY_ID` | optional | none | 〃 |
| `APPLE_PRIVATE_KEY` | optional | none | 〃 (full `.p8` PEM) |

### Google Maps Platform

| Variable | Required | Used by |
|---|:-:|---|
| `GOOGLE_MAPS_API_KEY` | ✅ for locations | Places autocomplete and details |
| `GOOGLE_SERVICE_ACCOUNT` | ✅ for routes | Service-account JSON (as a string) for the Route Optimization API |
| `GOOGLE_CLOUD_PROJECT` | ✅ for routes | GCP project ID (`projects/<id>`) |

### Email

| Variable | Required | Used by |
|---|:-:|---|
| `RESEND_API_KEY` | ✅ | Invitation and account-deletion emails |
| `MAIL_FROM` | ✅ | Sender address |
| `APP_INVITE_URL` | ✅ | Base URL of the accept-invitation link (`?token=` is appended) |

### Billing

| Variable | Required | Used by |
|---|:-:|---|
| `REVENUECAT_WEBHOOK_AUTH` | optional | Shared secret for `POST /billing/webhooks/revenuecat`. **When it is unset, every webhook is rejected** |
| `REVENUECAT_API_KEY` | optional | Deleting subscribers on account deletion. Skipped when unset |

### Store review login

| Variable | Required | Used by |
|---|:-:|---|
| `TEST_LOGIN_ENABLED` | | `"true"` registers `POST /auth/qa`. Anything else leaves the route unregistered |
| `TEST_LOGIN_EMAIL` | when enabled | Demo account email |
| `TEST_LOGIN_PASSWORD` | when enabled | At least 16 characters (for example `openssl rand -base64 24`) |

## Boot-time validation

[`src/presentation/core/config/env.ts`](../src/presentation/core/config/env.ts) is imported before the app starts, and the process **refuses to start** with a clear error when:

- `RESEND_API_KEY`, `MAIL_FROM`, `APP_INVITE_URL` or `MIN_FRONTEND_VERSION` is missing;
- `MIN_FRONTEND_VERSION` is not valid semver (for example `1.2` or `v1.2.0`), because a broken version gate would affect every client;
- `TEST_LOGIN_ENABLED=true` but the email is missing or the password is shorter than 16 characters.

Error messages never include the secret values themselves.

Integrations whose credentials are optional (Apple revocation, RevenueCat) **degrade gracefully**: the server boots, the feature is skipped, and a single warning is logged.
