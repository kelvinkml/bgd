"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BagInput } from "@/lib/schemas";

type ImageRow = { src: string; alt: string; caption?: string };

const emptyImage = (): ImageRow => ({ src: "", alt: "" });

export default function AddBagPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [madeOn, setMadeOn] = useState("");
  const [priceOrPOA, setPriceOrPOA] = useState("POA");

  const [forSale, setForSale] = useState(true);
  const [customAvailable, setCustomAvailable] = useState(true);
  const [archived, setArchived] = useState(false);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const [images, setImages] = useState<ImageRow[]>([emptyImage()]);
  const [processImages, setProcessImages] = useState<ImageRow[]>([]);

  const [materialsCsv, setMaterialsCsv] = useState("");
  const [tagsCsv, setTagsCsv] = useState("");

  function updateImage(list: ImageRow[], setter: (l: ImageRow[]) => void, i: number, key: keyof ImageRow, value: string) {
    const next = [...list];
    next[i] = { ...next[i], [key]: value };
    setter(next);
  }

  function normalizeImageSrc(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    const filename = trimmed.replace(/^\/?web-ready\//, "");
    return `/web-ready/${filename}`;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setErrorDetails([]);
    setSubmitting(true);

    const payload: BagInput = {
      slug: slug.trim(),
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      story: story.trim() || undefined,
      images: images.filter((img) => img.alt.trim()).map((img) => ({
        src: normalizeImageSrc(img.src),
        alt: img.alt.trim(),
        caption: img.caption?.trim() || undefined,
      })),
      processImages: processImages.length > 0
        ? processImages.filter((img) => img.alt.trim()).map((img) => ({
            src: normalizeImageSrc(img.src),
            alt: img.alt.trim(),
            caption: img.caption?.trim() || undefined,
          }))
        : undefined,
      materials: materialsCsv.split(",").map((m) => m.trim()).filter(Boolean),
      dimensions: {
        width: Number(width),
        height: Number(height),
        depth: Number(depth),
        unit,
      },
      madeOn: madeOn.trim(),
      forSale,
      customAvailable,
      archived,
      priceOrPOA: priceOrPOA.trim() || undefined,
      tags: tagsCsv.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await fetch("/api/admin/add-bag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/bags/${data.slug}`);
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({}));
    setError(data.error || "Failed to save");
    if (data.details?.fieldErrors) {
      const flat: string[] = [];
      for (const [field, errs] of Object.entries(data.details.fieldErrors)) {
        if (Array.isArray(errs)) errs.forEach((m) => flat.push(`${field}: ${m}`));
      }
      setErrorDetails(flat);
    }
  }

  const inputClass = "w-full px-3 py-2 border border-stone-300 rounded text-sm";
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Add a bag</h1>
        <p className="text-sm text-stone-600 mt-1">
          Fill in the bag details. Images should already be in <code className="bg-stone-100 px-1">public/web-ready/</code>.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4">
          <h2 className="font-medium">Basics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="slug" className={labelClass}>Slug (URL)</label>
              <input id="slug" className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="day-bag-green" required />
            </div>
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input id="name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="tagline" className={labelClass}>Tagline</label>
            <input id="tagline" className={inputClass} value={tagline} onChange={(e) => setTagline(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" className={inputClass} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="story" className={labelClass}>Story (optional)</label>
            <textarea id="story" className={inputClass} rows={4} value={story} onChange={(e) => setStory(e.target.value)} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-medium">Status</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={forSale} onChange={(e) => setForSale(e.target.checked)} />
              For sale
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={customAvailable} onChange={(e) => setCustomAvailable(e.target.checked)} />
              Custom available
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
              Archived
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="madeOn" className={labelClass}>Made on (YYYY-MM-DD)</label>
              <input id="madeOn" className={inputClass} value={madeOn} onChange={(e) => setMadeOn(e.target.value)} placeholder="2026-05-01" required />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>Price or POA</label>
              <input id="price" className={inputClass} value={priceOrPOA} onChange={(e) => setPriceOrPOA(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-medium">Dimensions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="width" className={labelClass}>Width</label>
              <input id="width" type="number" step="0.1" className={inputClass} value={width} onChange={(e) => setWidth(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="height" className={labelClass}>Height</label>
              <input id="height" type="number" step="0.1" className={inputClass} value={height} onChange={(e) => setHeight(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="depth" className={labelClass}>Depth</label>
              <input id="depth" type="number" step="0.1" className={inputClass} value={depth} onChange={(e) => setDepth(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="unit" className={labelClass}>Unit</label>
              <select id="unit" className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as "cm" | "in")}>
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Images</h2>
            <button type="button" onClick={() => setImages([...images, emptyImage()])} className="text-sm text-stone-700 hover:underline">
              + Add image
            </button>
          </div>
          {images.map((img, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_auto] gap-2 items-end">
              <div>
                <label className={labelClass}>Filename</label>
                <div className="flex">
                  <span className="px-3 py-2 border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-sm rounded-l">
                    /web-ready/
                  </span>
                  <input
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-r text-sm"
                    value={img.src}
                    onChange={(e) => updateImage(images, setImages, i, "src", e.target.value)}
                    placeholder="IMG_1234.webp"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Alt text</label>
                <input className={inputClass} value={img.alt} onChange={(e) => updateImage(images, setImages, i, "alt", e.target.value)} required={i === 0} />
              </div>
              {images.length > 1 && (
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-sm text-red-700 hover:underline px-2 py-2">
                  Remove
                </button>
              )}
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Process images (optional)</h2>
            <button type="button" onClick={() => setProcessImages([...processImages, emptyImage()])} className="text-sm text-stone-700 hover:underline">
              + Add process image
            </button>
          </div>
          {processImages.map((img, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_2fr_auto] gap-2 items-end">
              <div>
                <label className={labelClass}>Filename</label>
                <div className="flex">
                  <span className="px-2 py-2 border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-xs rounded-l">
                    /web-ready/
                  </span>
                  <input
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-r text-sm"
                    value={img.src}
                    onChange={(e) => updateImage(processImages, setProcessImages, i, "src", e.target.value)}
                    placeholder="IMG_1234.webp"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Alt</label>
                <input className={inputClass} value={img.alt} onChange={(e) => updateImage(processImages, setProcessImages, i, "alt", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Caption</label>
                <input className={inputClass} value={img.caption ?? ""} onChange={(e) => updateImage(processImages, setProcessImages, i, "caption", e.target.value)} />
              </div>
              <button type="button" onClick={() => setProcessImages(processImages.filter((_, j) => j !== i))} className="text-sm text-red-700 hover:underline px-2 py-2">
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-medium">Lists</h2>
          <div>
            <label htmlFor="materials" className={labelClass}>Materials (comma-separated)</label>
            <input id="materials" className={inputClass} value={materialsCsv} onChange={(e) => setMaterialsCsv(e.target.value)} placeholder="Cordura, YKK Zippers, ..." required />
          </div>
          <div>
            <label htmlFor="tags" className={labelClass}>Tags (comma-separated)</label>
            <input id="tags" className={inputClass} value={tagsCsv} onChange={(e) => setTagsCsv(e.target.value)} placeholder="climbing, sling, everyday" />
          </div>
        </section>

        {error && (
          <div className="p-3 border border-red-200 bg-red-50 rounded text-sm">
            <p className="text-red-700 font-medium">{error}</p>
            {errorDetails.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-red-700">
                {errorDetails.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-stone-900 text-stone-50 hover:bg-stone-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Add bag"}
          </button>
        </div>
      </form>
    </div>
  );
}
