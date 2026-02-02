import z from "zod";

const createOrderSchema = z.object({
  clientId: z.string({
    error: "Client id is required"
  }),
});

export default createOrderSchema;
