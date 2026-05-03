import type { Bag } from "@/lib/types";

export const bags: Bag[] = [
  {
    slug: "tan-tote-no-1",
    name: "Tan Tote No. 1",
    tagline: "Roomy everyday tote in vegetable-tanned leather.",
    description:
      "A generous everyday carry, hand-stitched in vegetable-tanned leather. Develops a deep patina with use.",
    story:
      "This was the first piece I made after switching to a heavier weight leather. The grain pulls beautifully through the saddle stitch, and I learned a lot about edge finishing on this one.",
    images: [
      { src: "", alt: "Tan Tote No. 1 — front view" },
      { src: "", alt: "Tan Tote No. 1 — interior" },
      { src: "", alt: "Tan Tote No. 1 — strap detail" },
    ],
    processImages: [
      { src: "", alt: "Pattern cut", caption: "Cutting the main panels from a single hide." },
      { src: "", alt: "Edge burnishing", caption: "Burnishing the edges before final assembly." },
    ],
    materials: ["Vegetable-tanned leather", "Solid brass hardware", "Waxed linen thread"],
    dimensions: { width: 38, height: 30, depth: 12, unit: "cm" },
    madeOn: "2026-02-14",
    forSale: true,
    customAvailable: true,
    archived: false,
    priceOrPOA: "POA",
    tags: ["tote", "everyday", "leather"],
  },
  {
    slug: "weekender-olive",
    name: "Olive Weekender",
    tagline: "Made-to-order weekend bag in waxed canvas and bridle leather.",
    description:
      "A weekend-sized travel bag with waxed canvas body and bridle leather trim. Built to be lived in.",
    images: [
      { src: "", alt: "Olive Weekender — angled" },
      { src: "", alt: "Olive Weekender — handle close-up" },
    ],
    materials: ["Waxed canvas", "Bridle leather", "Antique brass hardware"],
    dimensions: { width: 50, height: 28, depth: 22, unit: "cm" },
    madeOn: "2026-03-22",
    forSale: false,
    customAvailable: true,
    archived: false,
    priceOrPOA: "POA",
    tags: ["weekender", "travel", "canvas"],
  },
  {
    slug: "first-satchel",
    name: "First Satchel",
    tagline: "The very first bag I ever made — kept as a reminder.",
    description:
      "A small satchel from my earliest days of leatherwork. Uneven stitches and all — kept on display because the lessons stuck.",
    story:
      "Every flaw on this bag taught me something. The stitch spacing wanders, the edges are rough, but it still holds together years later. I keep it in the archive to remind me where I started.",
    images: [
      { src: "", alt: "First Satchel — front" },
      { src: "", alt: "First Satchel — stitching detail" },
    ],
    materials: ["Chrome-tanned leather", "Mixed hardware"],
    dimensions: { width: 24, height: 20, depth: 8, unit: "cm" },
    madeOn: "2023-08-01",
    forSale: false,
    customAvailable: false,
    archived: true,
    tags: ["satchel", "early-work"],
  },
];

export function getBagBySlug(slug: string): Bag | undefined {
  return bags.find((b) => b.slug === slug);
}

export function getActiveBags(): Bag[] {
  return bags.filter((b) => !b.archived);
}

export function getArchivedBags(): Bag[] {
  return bags.filter((b) => b.archived);
}
