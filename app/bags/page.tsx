import { getActiveBags } from "@/data/bags";
import BagCard from "@/components/BagCard";

export const metadata = { title: "Bags — bgd" };

export default async function BagsPage() {
  const bags = await getActiveBags();
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Bags</h1>
        <p className="text-stone-700">Current and recent work.</p>
      </header>
      {bags.length === 0 ? (
        <p className="text-stone-600">No bags yet — check back soon.</p>
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
