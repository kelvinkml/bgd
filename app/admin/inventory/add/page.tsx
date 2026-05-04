"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { INVENTORY_TYPES, INVENTORY_UNITS, type InventoryItemInput } from "@/lib/schemas";

const TYPE_LABELS: Record<(typeof INVENTORY_TYPES)[number], string> = {
  fabric: "Fabric",
  hardware: "Hardware",
  webbing: "Webbing",
  misc: "Misc",
};

const VARIANT_LABEL: Record<(typeof INVENTORY_TYPES)[number], string> = {
  fabric: "Colour",
  hardware: "Size",
  webbing: "Size",
  misc: "Variant (optional)",
};

const VARIANT_PLACEHOLDER: Record<(typeof INVENTORY_TYPES)[number], string> = {
  fabric: "Black",
  hardware: "20mm",
  webbing: "25mm",
  misc: "",
};

export default function AddInventoryItemPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const [type, setType] = useState<(typeof INVENTORY_TYPES)[number]>("fabric");
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState<(typeof INVENTORY_UNITS)[number]>("m");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setErrorDetails([]);
    setSubmitting(true);

    const payload: InventoryItemInput = {
      type,
      name: name.trim(),
      variant: variant.trim() || undefined,
      qty: Number(qty),
      unit,
      notes: notes.trim() || undefined,
    };

    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push("/admin/inventory");
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
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Add inventory item</h1>
        <p className="text-sm text-stone-600 mt-1">
          Add a new material to your stock.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="type" className={labelClass}>Type</label>
          <select
            id="type"
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
          >
            {INVENTORY_TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input
              id="name"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "fabric" ? "Cordura" : type === "hardware" ? "Buckle" : type === "webbing" ? "Nylon webbing" : "Thread"}
              required
            />
          </div>
          <div>
            <label htmlFor="variant" className={labelClass}>{VARIANT_LABEL[type]}</label>
            <input
              id="variant"
              className={inputClass}
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder={VARIANT_PLACEHOLDER[type]}
              required={type !== "misc"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="qty" className={labelClass}>Quantity</label>
            <input
              id="qty"
              type="number"
              step="0.1"
              min="0"
              className={inputClass}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="unit" className={labelClass}>Unit</label>
            <select
              id="unit"
              className={inputClass}
              value={unit}
              onChange={(e) => setUnit(e.target.value as typeof unit)}
            >
              {INVENTORY_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>Notes (optional)</label>
          <input
            id="notes"
            className={inputClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Brand, supplier, weight, etc."
          />
        </div>

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
            {submitting ? "Saving..." : "Add item"}
          </button>
        </div>
      </form>
    </div>
  );
}
