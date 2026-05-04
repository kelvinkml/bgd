"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InventoryItem } from "@/lib/schemas";
import { INVENTORY_TYPES } from "@/lib/schemas";

const TYPE_LABELS: Record<(typeof INVENTORY_TYPES)[number], string> = {
  fabric: "Fabrics",
  hardware: "Hardware",
  webbing: "Webbing",
  misc: "Misc",
};

const VARIANT_LABELS: Record<(typeof INVENTORY_TYPES)[number], string> = {
  fabric: "Colour",
  hardware: "Size",
  webbing: "Size",
  misc: "Variant",
};

export default function InventoryList({ items }: { items: InventoryItem[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

  async function saveQty(item: InventoryItem) {
    const draft = draftQty[item.id];
    if (draft === undefined) return;
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }
    if (next === item.qty) {
      setDraftQty((s) => {
        const next = { ...s };
        delete next[item.id];
        return next;
      });
      return;
    }

    setError(null);
    setPendingId(item.id);
    const res = await fetch(`/api/admin/inventory/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: next }),
    });
    setPendingId(null);

    if (res.ok) {
      setDraftQty((s) => {
        const next = { ...s };
        delete next[item.id];
        return next;
      });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to update");
    }
  }

  async function handleDelete(item: InventoryItem) {
    const label = item.variant ? `${item.name} — ${item.variant}` : item.name;
    if (!confirm(`Delete "${label}"?`)) return;

    setError(null);
    setPendingId(item.id);
    const res = await fetch(`/api/admin/inventory/${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    });
    setPendingId(null);

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete");
    }
  }

  if (items.length === 0) {
    return <p className="text-stone-600">No inventory yet. Add your first item.</p>;
  }

  const grouped = INVENTORY_TYPES.map((type) => ({
    type,
    items: items.filter((it) => it.type === type),
  }));

  return (
    <div className="space-y-8">
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {grouped.map(({ type, items: typeItems }) => (
        <section key={type} className="space-y-3">
          <h2 className="font-medium text-stone-900">
            {TYPE_LABELS[type]}
            <span className="text-stone-500 text-sm ml-2">({typeItems.length})</span>
          </h2>

          {typeItems.length === 0 ? (
            <p className="text-sm text-stone-500">None.</p>
          ) : (
            <ul className="border border-stone-200 divide-y divide-stone-200">
              <li className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-4 py-2 text-xs uppercase tracking-wide text-stone-500 bg-stone-50">
                <span>Name</span>
                <span>{VARIANT_LABELS[type]}</span>
                <span>Qty</span>
                <span></span>
              </li>
              {typeItems.map((item) => {
                const draft = draftQty[item.id];
                const dirty = draft !== undefined && Number(draft) !== item.qty;
                const busy = pendingId === item.id;
                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-4 py-3 items-center"
                  >
                    <div>
                      <p className="text-sm text-stone-900">{item.name}</p>
                      {item.notes && (
                        <p className="text-xs text-stone-500 mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <p className="text-sm text-stone-700">{item.variant || "—"}</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={draft ?? String(item.qty)}
                        onChange={(e) =>
                          setDraftQty((s) => ({ ...s, [item.id]: e.target.value }))
                        }
                        className="w-20 px-2 py-1 border border-stone-300 rounded text-sm text-right"
                      />
                      <span className="text-xs text-stone-500 w-8">{item.unit}</span>
                      {dirty && (
                        <button
                          onClick={() => saveQty(item)}
                          disabled={busy}
                          className="px-2 py-1 text-xs bg-stone-900 text-stone-50 hover:bg-stone-700 disabled:opacity-50"
                        >
                          {busy ? "…" : "Save"}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={busy}
                      className="px-2 py-1 text-xs border border-red-700 text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
