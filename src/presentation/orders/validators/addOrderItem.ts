import z from "zod";

const addOrderItemSchema = z.object({
  productId: z.string({
    error: "Product ID is required",
  }),
  quantity: z.number({
    error: "Quantity must be a positive number",
  }).min(1),
});

export default addOrderItemSchema;
