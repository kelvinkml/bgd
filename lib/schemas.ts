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

export const INVENTORY_TYPES = ["fabric", "hardware", "webbing", "misc"] as const;
export const INVENTORY_UNITS = ["m", "cm", "pcs", "g", "kg"] as const;

export const InventoryItemInputSchema = z.object({
  type: z.enum(INVENTORY_TYPES),
  name: z.string().min(1).max(100),
  variant: z.string().max(100).optional(),
  qty: z.number().min(0).max(100000),
  unit: z.enum(INVENTORY_UNITS),
  notes: z.string().max(500).optional(),
});

export const InventoryItemSchema = InventoryItemInputSchema.extend({
  id: z.string().min(1).max(100),
});

export const InventoryItemPatchSchema = z.object({
  qty: z.number().min(0).max(100000).optional(),
  variant: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export type InventoryItemInput = z.infer<typeof InventoryItemInputSchema>;
export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type InventoryItemPatch = z.infer<typeof InventoryItemPatchSchema>;
