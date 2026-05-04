import Link from "next/link";
import type { Bag } from "@/lib/types";
import BagPlaceholder from "./BagPlaceholder";
import StatusBadge from "./StatusBadge";

export default function BagCard({ bag }: { bag: Bag }) {
  const hero = bag.images[0];
  return (
    <Link
      href={`/bags/${bag.slug}`}
      className="group block border border-stone-200 hover:border-stone-400 transition-colors"
    >
      {hero?.src ? (
        <img
          src={hero.src}
          alt={hero.alt}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <BagPlaceholder alt={hero?.alt ?? bag.name} aspect="square" />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-stone-900 group-hover:underline">{bag.name}</h3>
          <StatusBadge bag={bag} />
        </div>
        <p className="text-sm text-stone-600">{bag.tagline}</p>
      </div>
    </Link>
  );
}
