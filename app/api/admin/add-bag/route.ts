import { NextRequest, NextResponse } from "next/server";
import { BagSchema } from "@/lib/schemas";
import { appendBag } from "@/data/bags";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await appendBag(parsed.data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save bag";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  return NextResponse.json({ ok: true, slug: parsed.data.slug });
}
