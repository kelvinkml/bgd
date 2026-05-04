import { getArchivedBags } from "@/data/bags";
import BagCard from "@/components/BagCard";

export const metadata = { title: "Archive — bgd" };

export default async function ArchivePage() {
  const bags = await getArchivedBags();
  return (
    <div className="space-y-8">
      <header className="space-y-2 max-w-2xl">
        <h1 className="text-3xl font-semibold">Archive</h1>
        <p className="text-stone-700">
          Past pieces I keep around because they taught me something — not for sale, just for fun.
        </p>
      </header>
      {bags.length === 0 ? (
        <p className="text-stone-600">Nothing in the archive yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bags.map((bag) => (
            <BagCard key={bag.slug} bag={bag} />
          ))}
        </div>
      )}
    </div>
  );
}
