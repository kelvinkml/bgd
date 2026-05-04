import Link from "next/link";
import { getAllItems } from "@/data/inventory";
import InventoryList from "./InventoryList";

export const metadata = { title: "Inventory — bgd" };

export default async function InventoryPage() {
  const items = await getAllItems();
  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-stone-600 mt-1">
            Materials in stock, grouped by type.
          </p>
        </div>
        <Link
          href="/admin/inventory/add"
          className="px-3 py-1.5 text-sm bg-stone-900 text-stone-50 hover:bg-stone-700 whitespace-nowrap"
        >
          + Add item
        </Link>
      </header>
      <InventoryList items={items} />
    </div>
  );
}
