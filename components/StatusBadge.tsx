import type { Bag } from "@/lib/types";
import { getAvailabilityLabel } from "@/lib/types";

export default function StatusBadge({ bag }: { bag: Bag }) {
  const label = getAvailabilityLabel(bag);
  return (
    <span className="inline-block px-2 py-1 text-xs uppercase tracking-wide border border-stone-400 text-stone-700 bg-stone-50">
      {label}
    </span>
  );
}
