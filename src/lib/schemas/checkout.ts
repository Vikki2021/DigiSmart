import { z } from "zod";

export const createOrderInputSchema = z.object({
  productSlug: z.string().min(1),
  // Mongo ObjectId strings for the bumps the buyer opted into. Validated
  // against the product's actual bumpProductIds server-side - see
  // resolveBumpSelection in src/lib/checkout.ts.
  bumpProductIds: z.array(z.string()).default([]),
  couponCode: z.string().trim().min(1).optional(),
  customer: z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(6).max(20),
  }),
  consent: z.literal(true),
  utm: z.record(z.string(), z.string()).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const verifyPaymentInputSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
