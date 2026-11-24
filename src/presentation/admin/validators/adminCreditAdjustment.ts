import z from "zod";

/** Body for POST /admin/companies/:companyId/credits. */
const adminCreditAdjustmentSchema = z.object({
  delta: z
    .number()
    .int()
    .min(-10000)
    .max(10000)
    .refine((delta) => delta !== 0, { message: "delta must not be 0" }),
  note: z.string().trim().min(3).max(500),
});

export type AdminCreditAdjustmentBody = z.infer<typeof adminCreditAdjustmentSchema>;

export default adminCreditAdjustmentSchema;
