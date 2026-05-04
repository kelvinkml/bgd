import { promises as fs } from "fs";
import path from "path";
import type { InventoryItem, InventoryItemInput, InventoryItemPatch } from "@/lib/schemas";

const INVENTORY_JSON_PATH = path.join(process.cwd(), "data", "inventory.json");

export async function getAllItems(): Promise<InventoryItem[]> {
  const raw = await fs.readFile(INVENTORY_JSON_PATH, "utf-8");
  return JSON.parse(raw) as InventoryItem[];
}

async function writeAll(items: InventoryItem[]): Promise<void> {
  await fs.writeFile(INVENTORY_JSON_PATH, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

export async function appendItem(input: InventoryItemInput): Promise<InventoryItem> {
  const items = await getAllItems();
  const item: InventoryItem = { id: crypto.randomUUID(), ...input };
  items.push(item);
  await writeAll(items);
  return item;
}

export async function updateItem(id: string, patch: InventoryItemPatch): Promise<InventoryItem | null> {
  const items = await getAllItems();
  const i = items.findIndex((it) => it.id === id);
  if (i === -1) return null;
  items[i] = { ...items[i], ...patch };
  await writeAll(items);
  return items[i];
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await getAllItems();
  const filtered = items.filter((it) => it.id !== id);
  if (filtered.length === items.length) return false;
  await writeAll(filtered);
  return true;
}
