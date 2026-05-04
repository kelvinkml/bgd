import { promises as fs } from "fs";
import path from "path";
import type { Bag } from "@/lib/types";

const BAGS_JSON_PATH = path.join(process.cwd(), "data", "bags.json");

export async function getAllBags(): Promise<Bag[]> {
  const raw = await fs.readFile(BAGS_JSON_PATH, "utf-8");
  return JSON.parse(raw) as Bag[];
}

export async function getBagBySlug(slug: string): Promise<Bag | undefined> {
  const bags = await getAllBags();
  return bags.find((b) => b.slug === slug);
}

export async function getActiveBags(): Promise<Bag[]> {
  const bags = await getAllBags();
  return bags.filter((b) => !b.archived);
}

export async function getArchivedBags(): Promise<Bag[]> {
  const bags = await getAllBags();
  return bags.filter((b) => b.archived);
}

export async function appendBag(bag: Bag): Promise<void> {
  const bags = await getAllBags();
  if (bags.some((b) => b.slug === bag.slug)) {
    throw new Error(`Bag with slug "${bag.slug}" already exists`);
  }
  bags.push(bag);
  await fs.writeFile(BAGS_JSON_PATH, JSON.stringify(bags, null, 2) + "\n", "utf-8");
}

export async function deleteBagBySlug(slug: string): Promise<boolean> {
  const bags = await getAllBags();
  const filtered = bags.filter((b) => b.slug !== slug);
  if (filtered.length === bags.length) return false;
  await fs.writeFile(BAGS_JSON_PATH, JSON.stringify(filtered, null, 2) + "\n", "utf-8");
  return true;
}
