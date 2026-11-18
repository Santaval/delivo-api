import z from "zod";

// `recordedAt` is the device timestamp: an ISO-8601 string (e.g. "2026-11-18T15:04:05.000Z")
// or epoch milliseconds (expo-location's `timestamp`). The controller converts it to a Date.
const locationPoint = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heading: z.number().min(0).max(360).nullish(),
  speed: z.number().min(0).nullish(),
  accuracy: z.number().min(0).nullish(),
  recordedAt: z.union([z.iso.datetime({ offset: true }), z.number().int().positive()], {
    error: "recordedAt must be an ISO date string or epoch milliseconds",
  }),
});

const reportLocationSchema = z.object({
  locations: z.array(locationPoint).min(1, "At least one location is required").max(50, "At most 50 locations per request"),
});

export default reportLocationSchema;
