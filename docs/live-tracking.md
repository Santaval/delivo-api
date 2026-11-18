# Live driver tracking

While a route is `STARTED`, the user assigned as its driver (`Route.driverId`) sends their position and the
company's `OWNER`/`ADMIN` members watch it live on the route map.

- [Design](#design)
- [Endpoints](#endpoints)
- [SSE events](#sse-events)
- [Rules and privacy](#rules-and-privacy)
- [Timeouts and proxies](#timeouts-and-proxies)
- [Scaling](#scaling)

## Design

| Concern | Choice | Why |
|---|---|---|
| Ingest (driver -> API) | Plain HTTP `POST` | Mobile background tasks cannot keep a socket open; a short `POST` is reliable and can be retried offline |
| Delivery (API -> admins) | Server-Sent Events | One-way, no new dependency, works through the Coolify proxy. Fallback: poll `GET /routes/:id/location` |
| Fan-out | In-memory `EventEmitter` behind `ILocationBroadcaster` | Single API instance today; swappable |
| Persistence | Only the **latest** position per route (`RouteDriverLocation`) | Initial marker + polling fallback. No history |

## Endpoints

All require `Authorization: Bearer <jwt>` (a `?token=` query param is deliberately **not** accepted).

### `POST /api/v1/routes/:id/location`

```json
{ "locations": [ { "lat": 9.9981, "lng": -84.1198, "heading": 87.5, "speed": 8.3, "accuracy": 12, "recordedAt": "2026-11-18T15:04:05.000Z" } ] }
```

- 1 to 50 points (the background task delivers several at once). Only the point with the latest `recordedAt` is processed.
- `recordedAt`: ISO-8601 string or epoch milliseconds (expo-location `timestamp`). Not more than 5 minutes in the future.
- `lat` in [-90, 90], `lng` in [-180, 180], `heading` in [0, 360], `speed` and `accuracy` >= 0; the last three are optional/nullable.
- Rate limit: 60 requests / minute per user (`429` beyond that; per-process counter).
- Responses: `204` (also when the point was dropped as stale or throttled), `400` invalid body, `401`, `403` caller is not the route's driver, `404` route not found, `409` route is not `STARTED` (the app must stop sending on 403/409).

Dropped silently (still `204`): a point whose `recordedAt` is not newer than the stored one (retries arrive out of order), and any point
arriving less than 3 s after the previous accepted one for that route.

### `GET /api/v1/routes/:id/location`

`200` with `{ "lat", "lng", "heading", "speed", "accuracy", "recordedAt" }` or the JSON literal `null` when there is none
(never started, driver reassigned, or route completed). `403` unless the caller is the route's driver or an `OWNER`/`ADMIN` of its company
(another `DEALER` gets 403); `404` if the route does not exist.

### `GET /api/v1/routes/:id/location/stream`

`text/event-stream`; same permissions as above. Authorization and the 401/403/404 checks happen **before** the headers are sent,
so those arrive as ordinary JSON error responses. Headers: `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`,
`X-Accel-Buffering: no`.

### `driverLocation` in `RouteResponse`

`{ lat, lng, heading, recordedAt } | null`, for the initial render. Filled only when the caller may read the location (the route's driver or
`OWNER`/`ADMIN`); `null` for everybody else.

## SSE events

The stream starts with `retry: 5000`. Then:

| Event | `data` | Meaning |
|---|---|---|
| `location` | `{ "lat", "lng", "heading", "speed", "accuracy", "recordedAt" }` (ISO date) | Sent on connect (last known position, if any) and on every accepted update |
| `cleared` | `null` | The driver was reassigned/unassigned: remove the marker (the stream stays open) |
| `finished` | `{}` | The route was completed; the server ends the response. Also sent immediately (and the stream closed) when connecting to an already `COMPLETED` route. Do not reconnect |

A `: ping` comment line is written every 25 s so proxies keep the connection open. The server stops the interval and removes its
subscription when the client disconnects.

## Rules and privacy

- A location is accepted only from the route's `driverId` and only while the route is `STARTED`.
- The stored row is deleted when the route completes (`RouteService.finish`, which also publishes `finished`) and whenever the driver changes
  (`RouteService.assignDriver`, which publishes `cleared`). It is also removed by `ON DELETE CASCADE` if the route is deleted.
- Only the driver and `OWNER`/`ADMIN` members of the route's company can read it.
- Out of scope: history/breadcrumb trail, ETA, customer notifications.

## Timeouts and proxies

`src/presentation/server.ts` sets `keepAliveTimeout = 65 s` and `headersTimeout = 66 s` (above the usual 60 s proxy idle timeout).
`requestTimeout` only bounds receiving the request, and `server.timeout` is disabled by default, so open SSE responses are not killed;
the stream handler also calls `socket.setTimeout(0)`. Behind a reverse proxy response buffering must be off (`X-Accel-Buffering: no` is sent).

## Scaling

`InMemoryLocationBroadcaster` and the per-route throttle map live in the process, as does the rate limiter. With more than one API
instance a driver's `POST` and an admin's stream could land on different instances. Before scaling horizontally, implement
`ILocationBroadcaster` on top of Redis pub/sub (`src/domain/routes/providers/ILocationBroadcaster.ts`) and wire it in `container.ts`.
