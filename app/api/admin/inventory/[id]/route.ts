import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { InventoryItemPatchSchema } from "@/lib/schemas";
import { updateItem, deleteItem } from "@/data/inventory";

const IdSchema = z.string().min(1).max(100);

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  const idParsed = IdSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InventoryItemPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updated = await updateItem(idParsed.data, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  const idParsed = IdSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const removed = await deleteItem(idParsed.data);
  if (!removed) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
