# Domain model

The schema lives in [`src/infrastructure/prisma/schema.prisma`](../src/infrastructure/prisma/schema.prisma) and has evolved through 20 versioned Prisma migrations. Every business table is scoped to a `Company`, which is the tenant boundary.

- [Entity-relationship diagram](#entity-relationship-diagram)
- [Aggregates](#aggregates)
- [State machines](#state-machines)
- [Data integrity rules](#data-integrity-rules)

---

## Entity-relationship diagram

```mermaid
erDiagram
    User ||--o{ UserCompany : "belongs to"
    Company ||--o{ UserCompany : "has members"
    User ||--o{ CompanyInvitation : "sends"
    Company ||--o{ CompanyInvitation : "has"
    Company ||--o| Subscription : "has plan"

    Company ||--o{ Client : owns
    Company ||--o{ Product : owns
    Company ||--o{ PaymentMethod : configures
    Company ||--o{ ClientBill : issues
    Company ||--o{ Route : plans
    Company ||--o{ Supplier : owns
    Company ||--o{ SupplierBill : records
    Company ||--o{ TaxPeriod : declares

    Client ||--o{ ClientBill : "orders"
    ClientBill ||--o{ ClientBillItem : contains
    Product ||--o{ ClientBillItem : "priced from"
    ClientBill ||--o{ ClientPayment : "paid by"
    PaymentMethod ||--o{ ClientPayment : "used in"

    Route ||--o{ RoutePoint : stops
    ClientBill ||--o| RoutePoint : "delivered at"

    Supplier ||--o{ SupplierBill : bills
    SupplierBill ||--o{ SupplierBillItem : contains

    User {
      uuid id PK
      string email UK
      string name
      string surnames
    }
    Company {
      uuid id PK
      string name
    }
    UserCompany {
      uuid id PK
      uuid userId FK
      uuid companyId FK
      enum role "OWNER | ADMIN | DEALER"
    }
    CompanyInvitation {
      uuid id PK
      string email
      enum role
      enum status "PENDING | ACCEPTED | REVOKED | EXPIRED"
      string token UK
      datetime expiresAt
    }
    Subscription {
      uuid id PK
      enum tier "FREE | BASIC"
      enum status "ACTIVE | IN_GRACE_PERIOD | EXPIRED | CANCELLED"
      enum provider "REVENUECAT"
      string providerCustomerId
      datetime currentPeriodEnd
      uuid companyId UK
    }
    Client {
      uuid id PK
      string name
      string phoneNumber
      string email
      decimal lat
      decimal lng
      datetime deletedAt
    }
    Product {
      uuid id PK
      string name
      decimal grossPrice
      decimal ivaRate "default 13.00"
      datetime deletedAt
    }
    ClientBill {
      uuid id PK
      int number UK "autoincrement"
      enum status "PENDING | PAID | CANCELLED"
      enum deliveryStatus
      decimal subtotal
      decimal ivaTotal
      decimal total
      decimal paid
    }
    ClientBillItem {
      uuid id PK
      decimal unitGrossPrice
      decimal ivaRate
      decimal quantity
    }
    ClientPayment {
      uuid id PK
      decimal amount
    }
    PaymentMethod {
      uuid id PK
      string name
    }
    Route {
      uuid id PK
      string name
      enum status "CREATED | STARTED | COMPLETED"
      text polyline
    }
    RoutePoint {
      uuid id PK
      enum status "CREATED | VISITED | SKIPPED"
      int index
      text polyline
      uuid billId UK
    }
```

> `Supplier`, `SupplierBill`, `SupplierBillItem` and `TaxPeriod` model purchases and the monthly IVA declaration (IVA collected − deductible IVA = IVA payable). They are part of the schema, and their domain and application layers exist, ahead of the upcoming tax-reporting features.

## Aggregates

| Aggregate | Root | Notes |
|---|---|---|
| **Identity** | `User` | Created on the first Google/Apple sign-in. Has no password column: authentication is delegated to the identity providers. |
| **Company** | `Company` | The tenant. Memberships (`UserCompany`) carry a role, and invitations carry a single-use token and a 7-day expiry. |
| **Subscription** | `Subscription` | One per company (`companyId` is unique). Created as FREE in the same transaction as the company. |
| **Client** | `Client` | Optional geolocation used as the delivery destination. Name, phone and email are each unique per company. |
| **Product** | `Product` | Stores the gross price and the IVA rate. Order lines snapshot both at the time of sale. |
| **Order** | `ClientBill` | Order lines, running totals (`subtotal`, `ivaTotal`, `total`, `paid`), payment and delivery status, and a sequential human-readable `number`. |
| **Route** | `Route` | An ordered list of `RoutePoint`s, each tied to exactly one order (`billId` is unique, so an order can only be on one route). Stores the encoded polylines returned by the optimizer. |

## State machines

### Order delivery status

```mermaid
stateDiagram-v2
    [*] --> PENDING : order created
    PENDING --> ON_ROUTE : added to a route
    ON_ROUTE --> PENDING : removed from route
    ON_ROUTE --> IN_TRANSIT : route started (optimized)
    IN_TRANSIT --> DELIVERED : stop completed
    PENDING --> DELIVERED : marked delivered manually
    IN_TRANSIT --> PENDING : stop skipped and route closed
    DELIVERED --> [*]
    RETURNED --> [*]
```

- Order lines can only be added or removed while the order is **not** `DELIVERED` or `RETURNED`.
- "Open" orders are `PENDING | ON_ROUTE | IN_TRANSIT`. "Billed" orders are `DELIVERED`.

### Order payment status

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> PENDING : partial payment (paid < total)
    PENDING --> PAID : payment brings paid ≥ total
```

(`CANCELLED` is reserved in the `BillStatus` enum.)

Payments are accepted only for `DELIVERED` orders, and a payment that would take `paid` above `total` is rejected.

### Route and stops

```mermaid
stateDiagram-v2
    direction LR
    state Route {
      [*] --> CREATED
      CREATED --> STARTED : POST /routes/:id/start
      STARTED --> COMPLETED : every stop VISITED or SKIPPED
    }
    state RoutePoint {
      [*] --> P_CREATED
      P_CREATED --> VISITED
      P_CREATED --> SKIPPED
    }
```

### Invitation and subscription

| Machine | States | Transitions |
|---|---|---|
| `CompanyInvitation.status` | `PENDING → ACCEPTED \| REVOKED \| EXPIRED` | Only a `PENDING`, unexpired invitation sent to the caller's own email can be accepted |
| `Subscription.status` | `ACTIVE`, `IN_GRACE_PERIOD`, `CANCELLED`, `EXPIRED` | Driven by RevenueCat events. `effectiveTier()` falls back to FREE once the subscription is expired or its period has ended |

## Data integrity rules

- **Tenant scoping:** every business row has a `companyId` foreign key, and repositories always filter by it.
- **Soft delete:** `Client` and `Product` have a `deletedAt` column. Deleting sets the timestamp, and reads and plan-usage counts exclude soft-deleted rows, so historic orders keep pointing to valid rows.
- **Money:** every monetary column is `DECIMAL(12,2)` and rates are `DECIMAL(5,2)`. Coordinates are `DECIMAL(10,8)` / `DECIMAL(11,8)`.
- **Restrictive foreign keys:** relations use the default `ON DELETE RESTRICT`. Tenant deletion is therefore explicit and ordered from leaves to root (see [account deletion](account-deletion.md)) rather than relying on implicit cascades.
- **Uniqueness:** `(userId, companyId)` membership, `(email, companyId)` invitation, `(name|phone|email, companyId)` client, and `(month, year, companyId)` tax period.
