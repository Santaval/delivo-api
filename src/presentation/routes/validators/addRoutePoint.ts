import z from "zod";

const addRoutePointSchema = z.object({
  orderId: z.string({
    error: "Order ID is required"
  }),
});

export default addRoutePointSchema;