import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteBagBySlug } from "@/data/bags";

const SlugSchema = z.string().regex(/^[a-z0-9-]+$/).max(80);

type Context = { params: Promise<{ slug: string }> };

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { slug } = await params;

  const parsed = SlugSchema.safeParse(slug);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const removed = await deleteBagBySlug(parsed.data);
  if (!removed) {
    return NextResponse.json({ error: "Bag not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
