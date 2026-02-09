import z from "zod";

const startRouteSchema = z.object({
  startLocation: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }, { error: "Invalid start location" })
});

export default startRouteSchema;
