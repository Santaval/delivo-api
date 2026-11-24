import z from "zod";

// `driverId: null` unassigns the route; the key itself is required.
const assignDriverSchema = z.object({
  driverId: z.uuid({ error: "driverId must be a UUID or null" }).nullable(),
});

export default assignDriverSchema;
