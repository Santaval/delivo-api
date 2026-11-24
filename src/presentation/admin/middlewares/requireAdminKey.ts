import { createHash, timingSafeEqual } from "crypto";
import { NextFunction, Request, Response } from "express";
import ENV from "@/presentation/core/config/env";

let warnedUnset = false;

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/**
 * Guards /admin routes with the shared `ADMIN_API_KEY` (header `x-admin-key`). There is no
 * platform-admin role. Fails closed: when the key is not configured every request is a 401.
 * Digests are compared so the inputs have equal length for `timingSafeEqual`. The key is never logged.
 */
export default function requireAdminKey(req: Request, res: Response, next: NextFunction): void {
  const expected = ENV.ADMIN_API_KEY;
  if (!expected) {
    if (!warnedUnset) {
      warnedUnset = true;
      console.warn("[admin] ADMIN_API_KEY is not set; rejecting all /admin requests");
    }
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const provided = req.headers["x-admin-key"];
  if (typeof provided !== "string" || provided.length === 0) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!timingSafeEqual(sha256(provided), sha256(expected))) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
}
