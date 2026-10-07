import { z } from "zod";

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const productSectionsSchema = z.object({
  subHeadline: z.string().min(1),
  headline: z.string().min(1),
  whyBuy: z.array(z.string().min(1)).min(1),
  whatsInside: z.array(z.string().min(1)).min(1),
  samples: z.array(z.string().min(1)).optional(),
  bonus: z.array(z.string().min(1)).optional(),
  faq: z.array(faqItemSchema).min(1),
});

export const productFileSchema = z.object({
  r2Key: z.string().min(1),
  label: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

// Validates every Product field except bumpProductIds: bump relationships are
// resolved separately (by slug in the seed script, by picker in the future
// admin UI) after the referenced products already exist.
export const productCoreSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  pricePaise: z.number().int().nonnegative(),
  compareAtPaise: z.number().int().nonnegative().optional(),
  coverImageUrl: z.string().optional(),
  sections: productSectionsSchema,
  files: z.array(productFileSchema).default([]),
  isActive: z.boolean().default(true),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export type ProductCoreInput = z.infer<typeof productCoreSchema>;
