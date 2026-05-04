import { getAllBags } from "@/data/bags";
import DeleteBagList from "./DeleteBagList";

export const metadata = { title: "Delete a bag — bgd" };

export default async function DeleteBagPage() {
  const bags = await getAllBags();
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold">Delete a bag</h1>
        <p className="text-sm text-stone-600 mt-1">
          Remove a bag listing. This is permanent.
        </p>
      </header>
      <DeleteBagList bags={bags.map((b) => ({ slug: b.slug, name: b.name, archived: b.archived }))} />
    </div>
  );
}
