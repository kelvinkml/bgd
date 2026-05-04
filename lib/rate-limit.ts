type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= maxAttempts) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}
