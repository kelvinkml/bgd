import { NextRequest, NextResponse } from "next/server";
import { InventoryItemInputSchema } from "@/lib/schemas";
import { appendItem } from "@/data/inventory";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InventoryItemInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const item = await appendItem(parsed.data);
  return NextResponse.json({ ok: true, item });
}
