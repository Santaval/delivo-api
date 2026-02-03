import z from "zod";

const createRouteSchema = z.object({
  name: z.string({
    error: "Name must be between 2 and 100 characters"
  }).min(2).max(100),
});

export default createRouteSchema;