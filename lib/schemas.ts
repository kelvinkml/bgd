import { z } from "zod";

export const BagImageSchema = z.object({
  src: z.string().max(500),
  alt: z.string().min(1).max(200),
  caption: z.string().max(500).optional(),
});

export const BagDimensionsSchema = z.object({
  width: z.number().positive().max(500),
  height: z.number().positive().max(500),
  depth: z.number().positive().max(500),
  unit: z.enum(["cm", "in"]),
});

export const BagSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1).max(120),
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(4000),
  story: z.string().max(8000).optional(),
  images: z.array(BagImageSchema).min(1).max(20),
  processImages: z.array(BagImageSchema).max(20).optional(),
  materials: z.array(z.string().min(1).max(100)).min(1).max(20),
  dimensions: BagDimensionsSchema,
  madeOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  forSale: z.boolean(),
  customAvailable: z.boolean(),
  archived: z.boolean(),
  priceOrPOA: z.string().max(50).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20),
});

export type BagInput = z.infer<typeof BagSchema>;
