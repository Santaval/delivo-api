/**
 * Time-window helpers for billing/entitlement enforcement (Billing MVP).
 *
 * Billing windows are evaluated in America/Costa_Rica (fixed UTC-6, no DST),
 * so a company's month/day rolls over at local midnight regardless of server TZ.
 *
 * This is the single place that computes these boundaries — `UsageService` (#14)
 * and anything else that needs "this month" / "today" for a company must reuse
 * these helpers rather than re-deriving the offset.
 */
export const BILLING_TIMEZONE = "America/Costa_Rica";

/** Fixed America/Costa_Rica UTC offset, in milliseconds. Costa Rica has never observed DST. */
const COSTA_RICA_UTC_OFFSET_MS = 6 * 60 * 60 * 1000;

/** A half-open date range: `start` is inclusive, `end` is exclusive — i.e. `[start, end)`. */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Shifts `instant` by the fixed Costa Rica offset so that reading its UTC getters
 * (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`, ...) yields the wall-clock date/time
 * in America/Costa_Rica, without depending on the server's local timezone or ICU data.
 */
function toCostaRicaLocal(instant: Date): Date {
  return new Date(instant.getTime() - COSTA_RICA_UTC_OFFSET_MS);
}

/**
 * Converts a UTC instant expressed in "Costa Rica local" UTC fields (i.e. the output of
 * `Date.UTC` applied to the fields read from `toCostaRicaLocal`) back into the real,
 * absolute UTC instant it represents.
 */
function fromCostaRicaLocal(localMillis: number): Date {
  return new Date(localMillis + COSTA_RICA_UTC_OFFSET_MS);
}

/**
 * Calendar month containing `now` in Costa Rica local time, as absolute UTC instants.
 * Half-open: `[start, end)`, where `start` is the 1st of the month at 00:00:00
 * America/Costa_Rica and `end` is the 1st of the following month at 00:00:00
 * America/Costa_Rica.
 */
export function currentMonthRange(now: Date = new Date()): DateRange {
  const local = toCostaRicaLocal(now);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();

  const start = fromCostaRicaLocal(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const end = fromCostaRicaLocal(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));

  return { start, end };
}

/**
 * Calendar day containing `now` in Costa Rica local time, as absolute UTC instants.
 * Half-open: `[start, end)`, where `start` is 00:00:00 America/Costa_Rica of that day
 * and `end` is 00:00:00 America/Costa_Rica of the following day.
 */
export function currentDayRange(now: Date = new Date()): DateRange {
  const local = toCostaRicaLocal(now);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();
  const day = local.getUTCDate();

  const start = fromCostaRicaLocal(Date.UTC(year, month, day, 0, 0, 0, 0));
  const end = fromCostaRicaLocal(Date.UTC(year, month, day + 1, 0, 0, 0, 0));

  return { start, end };
}
