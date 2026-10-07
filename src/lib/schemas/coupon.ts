import { z } from "zod";

export const couponInputSchema = z.object({
  code: z
    .string()
    .min(1)
    .transform((value) => value.toUpperCase()),
  type: z.enum(["percent", "flat"]),
  value: z.number().int().positive(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  productSlugs: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponInputSchema>;
