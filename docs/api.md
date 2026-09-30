# API reference

Base URL: `https://<host>/api/v1`. All request and response bodies are JSON.

- [Conventions](#conventions)
- [Auth](#auth) · [Profile](#profile) · [Companies](#companies) · [Members and invitations](#members-and-invitations)
- [Clients](#clients) · [Products](#products) · [Orders](#orders) · [Payment methods](#payment-methods)
- [Routes](#routes) · [Stats](#stats) · [Locations](#locations) · [Billing](#billing) · [System](#system)
- [Errors](#errors)

---

## Conventions

| Header | When | Example |
|---|---|---|
| `Authorization` | Endpoints marked **JWT** | `Bearer eyJhbGciOi...` |
| `x-company-id` | Endpoints marked **Tenant** (active company) | `3f1c9a0e-...` |
| `Content-Type` | Requests with a body | `application/json` |

The **Guards** column lists the middleware that runs before each handler:

| Guard | Meaning |
|---|---|
| **JWT** | `jwtAuth`: valid bearer token required, otherwise `401` |
| **Tenant** | Handler is scoped to the company in `x-company-id` (`400` if it is missing and `requireCompanyId` is mounted) |
| **Role** | `requireCompanyRole`: caller must be `OWNER` or `ADMIN` of `:companyId`, otherwise `403` |
| **Limit(x)** | `enforceLimit(x)`: `402 PLAN_LIMIT_EXCEEDED` when the plan quota for `x` is used up |
| **Rate(n/15m)** | Per-IP rate limit, `429` when exceeded |

Validation failures return `400 { "message": "<first Zod issue>" }`.

---

## Auth

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `POST` | `/auth/google` | none | `{ token }`: Google ID token from the mobile SDK | `200 AuthResponse` |
| `POST` | `/auth/apple` | none | `{ identityToken, firstName?, lastName? }` | `200 AuthResponse` |
| `POST` | `/auth/refresh` | Bearer (current token) | none | `200 { token, expiresIn }` |
| `POST` | `/auth/logout` | JWT | none | `200 { message }` |
| `GET` | `/auth/me` | JWT | none | `200 UserResponse` |
| `POST` | `/auth/qa` | Rate(10/15m), **only mounted when `TEST_LOGIN_ENABLED=true`** | `{ email, password }` | `200 AuthResponse` |

The first sign-in with an email that has never been seen creates the user.

```jsonc
// AuthResponse
{
  "user": { "id": "uuid", "email": "ana@example.com", "name": "Ana", "surnames": "Mora" },
  "token": "eyJhbGciOi...",
  "expiresIn": "7d"
}
```

See [authentication.md](authentication.md) for the full flow.

---

## Profile

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `GET` | `/me` | JWT | none | `200 UserResponse` (includes `companies[]`) |
| `PUT` | `/me` | JWT | `{ name, surnames, birthdate, gender: "male"\|"female"\|"other" }` | `200 UserResponse` |
| `POST` | `/me` | JWT, Rate(5/15m) | `{ appleAuthCode? }` | `204` (account permanently deleted) |

```jsonc
// UserResponse
{
  "id": "uuid", "email": "ana@example.com", "name": "Ana", "surnames": "Mora",
  "companies": [{ "id": "uuid", "name": "Distribuidora Mora", "createdAt": "…", "updatedAt": "…" }]
}
```

The deletion flow is explained in [account-deletion.md](account-deletion.md).

---

## Companies

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `POST` | `/companies` | JWT | `{ name }` | `200 CompanyResponse`. The caller becomes `OWNER` and a FREE subscription is created in the same transaction |
| `GET` | `/companies` | JWT | none | `200 CompanyResponse[]` |
| `GET` | `/companies/:id` | JWT | none | `200 CompanyResponse` / `404` |
| `PUT` | `/companies/:id` | JWT | `{ name? }` | `200 CompanyResponse` |
| `DELETE` | `/companies/:id` | JWT | none | `204` |

## Members and invitations

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `GET` | `/companies/:companyId/members` | JWT (caller must be a member) | none | `200 MemberResponse[]` |
| `GET` | `/companies/:companyId/invitations` | JWT, Role | none | `200 InvitationResponse[]` (pending only) |
| `POST` | `/companies/:companyId/invitations` | JWT, Role, Limit(drivers) *when `role = DEALER`* | `{ email, role: "ADMIN"\|"DEALER" }` | `201 InvitationResponse` + invitation email |
| `DELETE` | `/companies/:companyId/invitations/:invitationId` | JWT, Role | none | `204` |
| `DELETE` | `/companies/:companyId/members/:userId` | JWT, Role | none | `204` |
| `POST` | `/invitations/accept` | JWT | `{ token }` | `204` |

Error cases: `409` already a member, invitation already pending, or removing the last owner · `410` invitation expired · `403` ADMIN removing an OWNER, or accepting an invitation addressed to another email.

---

## Clients

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `POST` | `/clients` | Tenant, Limit(clients) | `{ name, phoneNumber?, email?, lat, lng }` (`lat`/`lng` nullable) | `201 ClientResponse` |
| `GET` | `/clients` | Tenant | none | `200 ClientResponse[]` |
| `GET` | `/clients/:id` | Tenant | none | `200 ClientResponse` / `404` |
| `PUT` | `/clients/:id` | Tenant | `{ name?, phoneNumber?, email? }` | `200 ClientResponse` |
| `DELETE` | `/clients/:id` | Tenant | none | `204` (soft delete) |

```jsonc
// ClientResponse
{
  "id": "uuid", "name": "Pulpería La Esquina", "phoneNumber": "88887777", "email": null,
  "location": { "lat": 9.93333, "lng": -84.08333 },
  "companyId": "uuid", "createdAt": "…", "updatedAt": "…"
}
```

## Products

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `POST` | `/products` | Tenant, Limit(products) | `{ name, grossPrice, ivaRate? = 13 }` | `201 ProductResponse` |
| `GET` | `/products` | Tenant | none | `200 ProductResponse[]` |
| `GET` | `/products/:id` | Tenant | none | `200 ProductResponse` / `404` |
| `PUT` | `/products/:id` | Tenant | `{ name?, grossPrice?, ivaRate? }` | `200 ProductResponse` |
| `DELETE` | `/products/:id` | Tenant | none | `204` (soft delete) |

```jsonc
// ProductResponse
{
  "id": "uuid", "name": "Arroz 1kg",
  "pricing": { "netPrice": 1150.44, "ivaRate": 13, "ivaAmount": 149.56, "totalPrice": 1300 },
  "createdAt": "…", "updatedAt": "…", "deletedAt": null
}
```

---

## Orders

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `POST` | `/orders` | Tenant, Limit(documents) | `{ clientId }` | `201 OrderResponse` |
| `GET` | `/orders` | Tenant | none | `200 OrderResponse[]`: open orders (`PENDING`, `ON_ROUTE`, `IN_TRANSIT`) |
| `GET` | `/orders/bills` | Tenant | none | `200 OrderResponse[]`: delivered orders |
| `GET` | `/orders/:id` | Tenant | none | `200 OrderResponse` / `404` |
| `POST` | `/orders/:id/items` | Tenant | `{ productId, quantity ≥ 1 }` | `201 OrderResponse` (totals recalculated) |
| `DELETE` | `/orders/:id/items/:itemId` | Tenant | none | `200 OrderResponse` |
| `PATCH` | `/orders/:id/delivered` | Tenant | none | `200 OrderResponse` |
| `POST` | `/orders/:id/payments` | Tenant | `{ amount ≥ 0, methodId }` | `201 PaymentResponse` |
| `GET` | `/orders/client/:clientId` | Tenant | none | `200 OrderResponse[]`: the client's open orders |
| `GET` | `/orders/client/:clientId/billed` | Tenant | none | `200 OrderResponse[]`: the client's delivered orders |

Business rules:
- Items cannot be changed once an order is `DELIVERED` or `RETURNED`.
- Payments require `deliveryStatus = DELIVERED` and cannot exceed the outstanding total. The order becomes `PAID` when `paid ≥ total`.

```jsonc
// OrderResponse
{
  "id": "uuid", "number": 1042,
  "client": { /* ClientResponse */ },
  "pricing": { "subtotal": 2300.88, "ivaTotal": 299.12, "total": 2600 },
  "paid": 1000,
  "items": [{ "productId": "uuid", "quantity": 2, "name": "Arroz 1kg", "pricing": { /* … */ } }],
  "status": "PENDING",
  "deliveryStatus": "DELIVERED",
  "createdAt": "…", "updatedAt": "…"
}
```

## Payment methods

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `GET` | `/payments/methods` | Tenant | none | `200 PaymentMethodResponse[]` |
| `POST` | `/payments/methods` | Tenant | `{ name }` (2–100 characters) | `201 PaymentMethodResponse` |

---

## Routes

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `POST` | `/routes` | Tenant, Limit(routes) | `{ name }` (2–100 characters) | `201 RouteResponse` |
| `GET` | `/routes` | Tenant | none | `200 RouteResponse[]` |
| `GET` | `/routes/:id` | Tenant | none | `200 RouteResponse` / `404` |
| `POST` | `/routes/:id/points` | Tenant | `{ orderId }` | `201 RoutePointResponse`. The order moves to `ON_ROUTE` |
| `DELETE` | `/routes/:id/points/:pointId` | Tenant | none | `204` |
| `POST` | `/routes/:id/start` | Tenant | `{ startLocation: { lat, lng } }` | `200 RouteResponse`, optimized: points get an `index` and `polyline`, and orders move to `IN_TRANSIT` |
| `PATCH` | `/routes/points/:pointId/complete` | Tenant | none | `200 RoutePointResponse`. The order moves to `DELIVERED`, and the route auto-completes when every stop is done |

Starting a route does **not** count against the daily `routes` quota again, because it was already counted when the route was created. See [route-optimization.md](route-optimization.md).

```jsonc
// RouteResponse
{
  "id": "uuid", "name": "Ruta Heredia – martes", "status": "STARTED", "companyId": "uuid",
  "polyline": "a~l~Fjk~uOwHJy@P…",
  "points": [
    { "id": "uuid", "status": "CREATED", "index": 0, "routeId": "uuid", "order": { /* OrderResponse */ } }
  ]
}
```

---

## Stats

| Method | Path | Guards | Query | Success |
|---|---|---|---|---|
| `GET` | `/stats/financial-summary` | Tenant | `start?`, `end?` (ISO dates, default: current month) | `200 FinancialSummary` |

```jsonc
{
  "incomes": {
    "total": 1250000,
    "averagePerDay": 41666.67,
    "increasePercentage": 12.5,      // vs. the previous period of equal length
    "byDay":     { "2026-09-01": 52000, "…": 0 },
    "byWeek":    { "36": 310000 },
    "byMonth":   { "2026-09": 1250000 },
    "byQuarter": { "3": 1250000 },
    "byYear":    { "2026": 1250000 }
  }
}
```

## Locations

| Method | Path | Guards | Query | Success |
|---|---|---|---|---|
| `GET` | `/locations/autocomplete` | none | `q` (required) | `200 { results: [{ description, placeId }] }`, limited to Costa Rica |
| `GET` | `/locations/place/:id` | none | none | `200 { placeId, name, address, latitude, longitude }` / `404` |

---

## Billing

| Method | Path | Guards | Body | Success |
|---|---|---|---|---|
| `GET` | `/billing/subscription` | JWT, Tenant | none | `200 SubscriptionStatusResponse` |
| `POST` | `/billing/webhooks/revenuecat` | Shared secret in `Authorization` (server-to-server) | RevenueCat webhook payload | `200` processed · `202` ignored event type · `401` bad secret |

```jsonc
// SubscriptionStatusResponse
{
  "tier": "FREE",
  "status": "ACTIVE",
  "currentPeriodEnd": null,
  "limits": [
    { "resource": "documents", "limit": 10, "used": 8, "remaining": 2, "percentUsed": 80 },
    { "resource": "routes",    "limit": 1,  "used": 0, "remaining": 1, "percentUsed": 0 },
    { "resource": "clients",   "limit": 25, "used": 25, "remaining": 0, "percentUsed": 100 },
    { "resource": "products",  "limit": 20, "used": 4, "remaining": 16, "percentUsed": 20 },
    { "resource": "drivers",   "limit": 1,  "used": 1, "remaining": 0, "percentUsed": 100 }
  ]
}
```

See [billing.md](billing.md).

## System

| Method | Path | Guards | Success |
|---|---|---|---|
| `GET` | `/system/min-frontend-version` | none (callable before login) | `200 { "minVersion": "1.2.0" }` |

The mobile app calls this at startup and blocks with a "please update" screen when its own version is lower.

---

## Errors

| Status | Body | Typical cause |
|---|---|---|
| `400` | `{ message }` | Zod validation failure, or missing `x-company-id` |
| `401` | `{ message }` | Missing or invalid JWT, failed OAuth, bad webhook secret |
| `402` | `{ code: "PLAN_LIMIT_EXCEEDED", resource, limit, used, tier, upgradeTo }` | Plan quota used up |
| `403` | `{ message }` | Not allowed to manage members |
| `404` | `{ message }` | Resource not found |
| `409` | `{ message }` | Conflict: already a member, duplicate invitation, last owner |
| `410` | `{ message }` | Invitation expired |
| `429` | `{ message }` | Rate limit hit |
| `500` | `{ message: "Internal Server Error" }` | Unexpected error (details are only logged) |

```json
{
  "code": "PLAN_LIMIT_EXCEEDED",
  "resource": "clients",
  "limit": 25,
  "used": 25,
  "tier": "FREE",
  "upgradeTo": "BASIC"
}
```

User-facing `message` strings are in Spanish (es-CR), because they are shown directly in the app.
