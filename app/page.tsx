import Link from "next/link";
import { getActiveBags } from "@/data/bags";
import BagCard from "@/components/BagCard";

export default async function Home() {
  const featured = (await getActiveBags()).slice(0, 3);
  return (
    <div className="space-y-16">
      <section className="relative px-6 py-16 rounded-lg overflow-hidden min-h-96">
        <div
          className="absolute inset-0 rotate-180"
          style={{
            backgroundImage: `url(/web-ready/IMG_0893.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center calc(50% + 180px)",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-semibold text-white">Handmade bags, one at a time.</h1>
          <p className="text-lg text-stone-100">
            A small portfolio of bags built by hand. Browse the collection, peek at the archive, or
            start designing one of your own.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              href="/bags"
              className="inline-block px-4 py-2 bg-stone-900 text-stone-50 hover:bg-stone-700"
            >
              See the bags
            </Link>
            <Link
              href="/design"
              className="inline-block px-4 py-2 border border-stone-50 text-stone-50 bg-stone-400/60 hover:bg-stone-400/80"
            >
              Design your own
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-medium">Recent work</h2>
            <Link href="/bags" className="text-sm text-stone-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((bag) => (
              <BagCard key={bag.slug} bag={bag} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
