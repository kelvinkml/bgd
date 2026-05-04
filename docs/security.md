# Security Notes

This document captures the security decisions made for the bgd admin form. The admin form lives at `/admin/add-bag` and lets a single admin add new bag entries via the web rather than editing source files. Anything mutable (login, add-bag) goes through API routes protected by the threat model below.

## Threat model

**In scope:**
- Single admin user (the site owner) authenticating from a browser
- Unauthenticated users reaching `/admin/*` and `/api/admin/*` routes
- Brute-force password attacks against the login endpoint
- CSRF on state-changing endpoints
- Session theft via XSS or insecure cookie configuration
- Malformed or malicious input to the add-bag endpoint
- Bots/automated scanners hitting admin URLs

**Out of scope (and why):**
- Multi-user accounts — single admin only, so no user tables, password hashing of multiple users, or role-based access
- Image uploads — currently the admin pastes a path to an image already in `public/web-ready/`. File upload (with type/size validation, virus scanning, object storage) is a follow-up
- Production-grade session storage — using stateless JWT cookies; revocation requires waiting for expiry. Acceptable for a single admin
- Rate limiting across multiple instances — in-memory rate limiter resets on deploy. Acceptable until traffic justifies a shared store

## Decisions

### 1. Authentication: env-var password + JWT cookie
**What:** A single password lives in the `ADMIN_PASSWORD` env var. On login, the supplied password is compared against it using `crypto.timingSafeEqual` (constant-time). On success, a JWT signed with HS256 is set as an `HttpOnly` cookie.

**Why this over alternatives:**
- **Auth.js / NextAuth:** overkill for a single user. Adds tables, providers, and config for use cases we don't have.
- **Database with hashed password:** would need a users table and bcrypt/argon2. The env-var approach has the same effective security for one admin (and avoids storing a hash that could leak from a DB dump).
- **Plain session cookie (random token in DB):** would require a sessions table and DB lookup on every request. Stateless JWT is simpler and cheaper.

**Tradeoff:** JWT can't be revoked before expiry. Mitigated by short session lifetime (8 hours) and the ability to rotate `AUTH_SECRET` to invalidate all outstanding sessions.

### 2. Constant-time password comparison
Password comparison uses `crypto.timingSafeEqual` rather than `===` to prevent timing attacks. Even though the env-var approach makes timing leaks low-impact, it's the correct primitive.

### 3. JWT signing: HS256 via `jose`
Symmetric signing with `AUTH_SECRET` (>=32 chars) using the `jose` library. HS256 is appropriate for single-tenant signing where the same process verifies tokens it signs. Asymmetric (RS256) would only matter if a third party needed to verify tokens.

### 4. Cookie configuration
The session cookie is set with:
- `HttpOnly` — JS cannot read it (mitigates XSS exfil)
- `Secure` (production) — HTTPS only, so it can't leak over plaintext
- `SameSite=Lax` — sent on top-level navigations from other origins but not on cross-origin POSTs (mitigates CSRF for state-changing actions, while allowing the user to follow a link into the site)
- `Path=/` — sent for all routes
- 8-hour max age

`SameSite=Lax` (vs `Strict`) is chosen so that returning to the site from an external link doesn't immediately log the admin out. For the specific risk of CSRF on POST endpoints, Lax is sufficient because cross-origin POSTs do not include the cookie.

### 5. CSRF protection
Relies on `SameSite=Lax` cookies, which prevent cross-origin POST requests from including the session cookie. No additional CSRF token because every state-changing endpoint requires the cookie (which won't be sent from a third-party origin).

If the site grows to use cross-origin requests legitimately (embedded widgets, federated auth), this needs a CSRF token.

### 6. Input validation: Zod at the API boundary
Every API endpoint parses its body with a Zod schema before doing anything with it. The same `BagSchema` is the source of truth for the type used on the form and the validation used on the server — so the form and server agree on shape, and the server still enforces it (forms can be bypassed by a hand-crafted request).

**Includes:**
- String length caps on every field (prevents oversized payloads)
- `slug` is constrained to `[a-z0-9-]` (prevents path traversal, weird URLs, and duplicate-slug shenanigans)
- `madeOn` must match `YYYY-MM-DD` regex
- Arrays have max sizes
- Numbers have positive range constraints

### 7. Rate limiting on login
A simple in-memory rate limiter (`lib/rate-limit.ts`) caps login attempts to 5 per IP per 15 minutes. Returns HTTP 429 with `Retry-After` header when exceeded.

**Tradeoff:** in-memory means it resets on server restart and doesn't share state across instances. For a single-instance Vercel deployment this is acceptable for now; if we ever scale horizontally, this needs to move to Upstash Redis or similar.

### 8. Authorization via middleware
`middleware.ts` runs on every request matching `/admin/*` and `/api/admin/*`. It verifies the session cookie and redirects unauthenticated users to `/admin/login`. The login page itself is excluded so it remains reachable.

This puts the auth check in *one* place rather than relying on every page/API to remember to check.

### 9. Persistence: file-based JSON (dev only)
Currently `data/bags.json` is the source of truth. The API appends to it on disk via `fs.writeFile`.

**This won't work on Vercel** — serverless functions have an ephemeral filesystem. Before deploying to production, this needs to swap to a real database (likely Vercel Postgres or Turso). The `data/bags.ts` module is the abstraction layer where that swap happens — page components don't need to change.

### 10. Secrets management
- `.env.local` is gitignored (already covered by the scaffold's gitignore)
- `.env.local.example` is committed as a template, with placeholder values
- The auth code throws (rather than defaulting to insecure values) if `AUTH_SECRET` or `ADMIN_PASSWORD` are missing

## Known gaps / follow-ups

- **Image uploads** — admin currently types in image paths. Real file upload with type/size validation and object storage (Vercel Blob) is a deferred feature.
- **Production database** — file-based persistence will not work on Vercel. Swap to Vercel Postgres or Turso before deployment.
- **Rate limiting at the edge** — in-memory works for now; a shared store (Upstash Redis) is needed for multi-instance deployments.
- **Audit log** — currently no record of who added/edited what, when. Useful if multi-admin is ever added.
- **Content Security Policy** — no CSP headers set. Worth adding at the middleware level to harden against XSS even though the surface area is small.
- **Password rotation** — rotating `ADMIN_PASSWORD` is straightforward; rotating `AUTH_SECRET` invalidates all sessions, which is the desired emergency-out behaviour.

## How to set up locally

1. Copy `.env.local.example` to `.env.local`
2. Set `ADMIN_PASSWORD` to a strong password
3. Generate `AUTH_SECRET`: `openssl rand -base64 48`
4. Run `npm run dev` and visit `/admin/add-bag` (you'll be redirected to login)
