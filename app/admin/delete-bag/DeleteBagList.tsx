"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BagSummary = { slug: string; name: string; archived: boolean };

export default function DeleteBagList({ bags }: { bags: BagSummary[] }) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setError(null);
    setPendingSlug(slug);

    const res = await fetch(`/api/admin/bags/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });

    setPendingSlug(null);

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete");
    }
  }

  if (bags.length === 0) {
    return <p className="text-stone-600">No bags to delete.</p>;
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <ul className="border border-stone-200 divide-y divide-stone-200">
        {bags.map((bag) => (
          <li key={bag.slug} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-medium text-stone-900">{bag.name}</p>
              <p className="text-xs text-stone-500">
                {bag.slug}
                {bag.archived && <span className="ml-2 px-1.5 py-0.5 bg-stone-100 text-stone-700">archived</span>}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bag.slug, bag.name)}
              disabled={pendingSlug === bag.slug}
              className="px-3 py-1.5 text-sm border border-red-700 text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {pendingSlug === bag.slug ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
