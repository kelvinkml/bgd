import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const LoginSchema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`login:${ip}`, 5, 15 * 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (!verifyPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createSession();
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
