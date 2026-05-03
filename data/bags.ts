import type { Bag } from "@/lib/types";

export const bags: Bag[] = [
  {
    slug: "Day-Bag",
    name: "Day Bag",
    tagline: "Enough for the day",
    description:
      "A 6L sling bag with roll top, magnetic closure. Made from 1000D Cordura. Perfect carry for when you're out and about.",
    story:
      "This is a slight upgrade from the previous day bag, just added some extra padding, straps and added a liner with a couple pockets for this. It's carries a coat, water bottle and still has a bit left over for a few more dailys, camera, notepad whatever you want.",
    images: [
      { src: "", alt: "Day Bag — front view" },
      { src: "", alt: "Day Bag — interior" },
      { src: "", alt: "Day Bag — strap detail" },
    ],
    processImages: [
      { src: "", alt: "Pattern cut", caption: "Cutting the main panels from a single hide." },
      { src: "", alt: "Edge burnishing", caption: "Burnishing the edges before final assembly." },
    ],
    materials: ["Cordura", "Ripstop", "YKK hardware"],
    dimensions: { width: 38, height: 30, depth: 12, unit: "cm" },
    madeOn: "2026-02-14",
    forSale: true,
    customAvailable: false,
    archived: false,
    priceOrPOA: "£60",
    tags: ["sling", "everyday"],
  },
  {
    slug: "Camp Bag",
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
