# Route optimization

A distributor's day starts with a set of pending orders and a vehicle. Delivo turns them into an ordered, traffic-aware route using the **Google Maps Platform Route Optimization API**, and then tracks each stop until the route closes itself.

- [Lifecycle](#lifecycle)
- [Optimization request](#optimization-request)
- [What gets stored](#what-gets-stored)
- [Delivery tracking](#delivery-tracking)
- [Design notes](#design-notes)

---

## Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant App as Driver app
    participant API as RoutesController / RouteService
    participant OPT as RouteOptimizationService
    participant G as Google Route Optimization
    participant DB as MariaDB

    App->>API: POST /routes { name }                    (counts against daily "routes" quota)
    API->>DB: Route (CREATED)
    loop for each order to deliver
      App->>API: POST /routes/:id/points { orderId }
      API->>DB: RoutePoint (CREATED), order → ON_ROUTE
    end
    App->>API: POST /routes/:id/start { startLocation: { lat, lng } }
    API->>OPT: optimize(routeId, startLocation)
    OPT->>DB: load route + points + orders + client coordinates
    OPT->>G: optimizeTours(shipments, vehicle, time window, traffic)
    G-->>OPT: ordered visits + encoded polyline
    OPT->>DB: point.index for each stop, route.polyline
    API->>DB: route → STARTED, every order → IN_TRANSIT
    API-->>App: RouteResponse (points in visit order + polyline for the map)
    loop at each stop
      App->>API: PATCH /routes/points/:pointId/complete
      API->>DB: point → VISITED, order → DELIVERED
      API->>API: tryMarkAsFinished(route)
    end
    Note over API,DB: When no point is still CREATED: route → COMPLETED<br/>and orders of SKIPPED points go back to PENDING
```

## Optimization request

`RouteOptimizationService` converts the domain `Route` into provider-neutral `RouteDelivery` and `RouteVehicle` types (declared on the `IRouteOptimizationProvider` port). `GoogleRouteOptimizationProvider` then maps those onto the Google request:

| Model element | Value |
|---|---|
| **Shipments** | One delivery-only shipment per route point. The arrival location is the client's stored `lat`/`lng`, and the label is the route point ID |
| **Time windows** | Every delivery must happen between the start and end of today |
| **Vehicle** | One vehicle that starts **and ends** at the driver's `startLocation` (a round trip back to the depot) |
| **Costs** | `costPerHour: 10`, `costPerKilometer: 5`, so the solver balances drive time against distance |
| **Traffic** | `considerRoadTraffic: true` |
| **Output** | `populatePolylines` and `populateTransitionPolylines` enabled |

The solver returns visits in their optimal order. Each visit carries its label, which lets the service match results back to route points without depending on array positions:

```ts
route.points.forEach((point) => {
  point.setIndex(visits.findIndex(visit => visit.id === point.id));
});
```

## What gets stored

| Field | Meaning |
|---|---|
| `RoutePoint.index` | 0-based position in the optimized visiting order (`null` until the route is optimized) |
| `Route.polyline` | Encoded polyline of the whole trip (`TEXT`), drawn directly on the map by the app |
| `RoutePoint.polyline` | Space for per-leg polylines (`TEXT`) |
| `Route.status` | `CREATED → STARTED → COMPLETED` |

## Delivery tracking

- **Completing a stop** marks the point `VISITED` and the order `DELIVERED`. At that point the order can take payments.
- **Auto-completion:** after each stop, the service tries to finish the route. It succeeds once no point is still `CREATED`. Any order whose stop was `SKIPPED` goes back to `PENDING` so it can be scheduled on a later route.
- **One route per order:** `RoutePoint.billId` is unique, so the same order can never be on two routes.

## Design notes

- **Provider isolation.** Google-specific types (`optimizeTours`, `visitLabel`, `routePolyline`) never leave `GoogleRouteOptimizationProvider`. Failures there are wrapped in an `InfrastructureError` and mapped centrally to a clean HTTP error.
- **Quota counted once.** The daily `routes` limit is applied to `POST /routes`, not to `/start`, so a driver can re-optimize after changing the stops without being charged twice.
- **Geo-aware data entry.** Client coordinates usually come from `GET /locations/autocomplete` and `/locations/place/:id` (Google Places, limited to Costa Rica), which gives the optimizer accurate destinations.
