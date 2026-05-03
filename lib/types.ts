export type BagImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type BagDimensions = {
  width: number;
  height: number;
  depth: number;
  unit: "cm" | "in";
};

export type Bag = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story?: string;
  images: BagImage[];
  processImages?: BagImage[];
  materials: string[];
  dimensions: BagDimensions;
  madeOn: string;
  forSale: boolean;
  customAvailable: boolean;
  archived: boolean;
  priceOrPOA?: string;
  tags: string[];
};

export type BagAvailabilityLabel =
  | "Archive piece"
  | "Available — custom orders welcome"
  | "Made to order"
  | "Available"
  | "Sold";

export function getAvailabilityLabel(bag: Bag): BagAvailabilityLabel {
  if (bag.archived) return "Archive piece";
  if (bag.forSale && bag.customAvailable) return "Available — custom orders welcome";
  if (!bag.forSale && bag.customAvailable) return "Made to order";
  if (bag.forSale && !bag.customAvailable) return "Available";
  return "Sold";
}
