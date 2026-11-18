import { NextFunction, Request, Response } from "express";

// In-memory fixed-window rate limiter. No new dependency: it is meant to blunt brute force /
// enumeration attempts against sensitive endpoints (e.g. /auth/test-login, DELETE /me, adding a
// member by code), not to be a general-purpose limiter. By default requests are bucketed per IP;
// pass `keyGenerator` to bucket by something else (e.g. the authenticated user id).
//
// Known, accepted limitation: the counter is per-process (a `Map` in module scope), not
// shared between instances behind a load balancer, and resets on every restart/deploy. That
// is an accepted trade-off for the endpoints protected so far; revisit with a shared store
// (e.g. Redis) if stronger guarantees are needed.
interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

export default function rateLimit({ windowMs, max, keyGenerator }: RateLimitOptions) {
  const hits = new Map<string, WindowEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator ? keyGenerator(req) : (req.ip ?? "unknown");
    const now = Date.now();

    // Opportunistically evict expired entries so the map does not grow unbounded.
    for (const [entryKey, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(entryKey);
    }

    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      res.status(429).json({ message: "Demasiados intentos. Intenta de nuevo más tarde." });
      return;
    }

    next();
  };
}
