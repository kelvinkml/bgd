import Link from "next/link";
import type { Bag } from "@/lib/types";
import BagPlaceholder from "./BagPlaceholder";
import StatusBadge from "./StatusBadge";

export default function BagDetail({ bag }: { bag: Bag }) {
  const { width, height, depth, unit } = bag.dimensions;
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          {!bag.archived ? (
            <Link href="/contact" className="hover:opacity-75 transition-opacity">
              <StatusBadge bag={bag} />
            </Link>
          ) : (
            <StatusBadge bag={bag} />
          )}
          {bag.priceOrPOA && (
            <span className="text-sm text-stone-600">{bag.priceOrPOA}</span>
          )}
        </div>
        <h1 className="text-3xl font-semibold text-stone-900">{bag.name}</h1>
        <p className="text-lg text-stone-700">{bag.tagline}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bag.images.map((img, i) => (
          <div
            key={i}
            className={`w-full ${i === 0 ? "sm:col-span-2" : ""}`}
          >
            {img.src ? (
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full object-cover ${i === 0 ? "aspect-[4/3]" : "aspect-square"}`}
              />
            ) : (
              <BagPlaceholder
                alt={img.alt}
                aspect={i === 0 ? "landscape" : "square"}
              />
            )}
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-medium text-stone-900">About this piece</h2>
          <p className="text-stone-700 whitespace-pre-line">{bag.description}</p>
          {bag.story && (
            <>
              <h3 className="text-lg font-medium text-stone-900 pt-4">Notes from the maker</h3>
              <p className="text-stone-700 whitespace-pre-line">{bag.story}</p>
            </>
          )}
        </div>
        <aside className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-stone-900 mb-1">Materials</h3>
            <ul className="text-stone-700 space-y-1">
              {bag.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-stone-900 mb-1">Dimensions</h3>
            <p className="text-stone-700">
              {width} × {height} × {depth} {unit}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-stone-900 mb-1">Made</h3>
            <p className="text-stone-700">{bag.madeOn}</p>
          </div>
          {bag.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-stone-900 mb-1">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {bag.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs bg-stone-100 text-stone-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      {bag.processImages && bag.processImages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-medium text-stone-900">Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bag.processImages.map((img, i) => (
              <figure key={i} className="space-y-2">
                <BagPlaceholder alt={img.alt} aspect="landscape" />
                {img.caption && (
                  <figcaption className="text-sm text-stone-600">{img.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
