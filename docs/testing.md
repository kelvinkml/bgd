# Manual Testing Checklist

End-to-end verification for site functionality. Layered by dependency — each section assumes the previous works.

**Suggested order:** §1–3 (public site smoke test) → §4–5, §7 (auth basics) → §8–12 (bag CRUD) → §13–16 (inventory CRUD) → §6, §17 (edge cases) → §18 (production build).

## Prerequisites

- `.env.local` set up with `ADMIN_PASSWORD` and `AUTH_SECRET` (>=32 chars). See `.env.local.example`.
- `npm run dev` running.

---

## 1. Public site routing (no auth)
- [ ] `/` loads with hero image background and dark overlay
- [ ] "See the bags" button → `/bags`
- [ ] "Design your own" button → `/design`
- [ ] `/bags` shows all non-archived bags
- [ ] `/bags/[slug]` loads for each bag (try `sandbgd`, `daybgd`)
- [ ] `/bags/non-existent-slug` → 404 page
- [ ] `/archive` shows only archived bags
- [ ] `/design`, `/about`, `/contact` all load

## 2. Image rendering
- [ ] Landing page hero background image visible (rotated 180°)
- [ ] Featured bag cards on landing show real images
- [ ] `/bags` cards show images
- [ ] Bag detail page shows hero + secondary images
- [ ] Process images render (only on bags that have them)
- [ ] Bags without `src` (e.g. `first-satchel`) fall back to gray placeholder
- [ ] Status badge on detail page is clickable → `/contact`
- [ ] Archived bag's status badge is NOT a link

## 3. Data layer & async pages
- [ ] All bag data comes from `data/bags.json` (modify a bag's name, hard refresh, see it update)
- [ ] No console errors about missing `await`
- [ ] Page load times reasonable (under 1s in dev)

## 4. Authentication — unauthenticated paths
- [ ] Visit `/admin` → redirects to `/admin/login?from=/admin`
- [ ] Visit `/admin/add-bag` → redirects to login with `from` param
- [ ] Visit `/admin/delete-bag` → redirects to login
- [ ] `POST /api/admin/add-bag` directly (e.g. via curl) → blocked by middleware
- [ ] Login page loads at `/admin/login`

## 5. Authentication — login flow
- [ ] Wrong password → "Invalid password" error shown
- [ ] Empty password → form's `required` blocks submit
- [ ] Correct password → redirects back to original `from` URL
- [ ] After login, refreshing `/admin/add-bag` keeps you signed in
- [ ] "Sign out" button clears cookie → redirects to login
- [ ] After signing out, `/admin/add-bag` redirects to login again

## 6. Authentication — rate limiting
- [ ] Submit wrong password 5 times in a row → 6th attempt returns 429 (visible in DevTools Network tab)
- [ ] Wait 15 minutes (or restart dev server) → can try again
- [ ] Correct password during rate limit window also blocked

## 7. Admin dashboard
- [ ] `/admin` shows three cards: "Add a bag", "Delete a bag", "Inventory"
- [ ] Each card navigates to the correct page
- [ ] "Sign out" link in admin layout works on every admin page

## 8. Add bag — form validation
- [ ] Submit empty form → HTML required-field validation blocks
- [ ] Slug with uppercase/spaces (e.g. "My Bag") → server returns "Lowercase letters, numbers, and hyphens only"
- [ ] `madeOn` not matching `YYYY-MM-DD` (e.g. "2026/05/04") → server validation error
- [ ] Materials field empty → server validation error (min 1 required)
- [ ] No images with alt text → server validation error
- [ ] Validation errors render in the red error box at the bottom

## 9. Add bag — happy path
- [ ] Fill in all required fields with valid data → submits successfully
- [ ] Redirects to `/bags/[new-slug]` and the bag renders correctly
- [ ] New bag appears on `/bags` listing
- [ ] New bag appears on landing page if it's in the recent 3
- [ ] If `archived: true` set, bag appears on `/archive` and NOT on `/bags`

## 10. Add bag — image filename helper
- [ ] Type `IMG_1234.webp` only → submits as `/web-ready/IMG_1234.webp` (verify on bag detail page src)
- [ ] Paste `/web-ready/IMG_1234.webp` → still submits as `/web-ready/IMG_1234.webp` (no double prefix)
- [ ] Empty filename + non-empty alt → submits with empty src, falls back to placeholder

## 11. Add bag — duplicate detection
- [ ] Try adding a bag with an existing slug (e.g. `sandbgd`) → 409 error: "Bag with slug already exists"
- [ ] Existing bag remains unchanged

## 12. Delete bag
- [ ] `/admin/delete-bag` lists all bags (active and archived)
- [ ] Archived bags show "archived" tag
- [ ] Click delete → browser confirm dialog appears with bag name
- [ ] Cancel → nothing happens, list unchanged
- [ ] Confirm → bag removed from list, `/bags/[slug]` returns 404
- [ ] Bag removed from `data/bags.json` on disk
- [ ] Try deleting a non-existent bag (via direct API) → 404 error

## 13. Inventory — list view
- [ ] Visit `/admin/inventory` while unauthenticated → redirects to login with `from` param
- [ ] Empty `data/inventory.json` (just `[]`) → page shows "No inventory yet. Add your first item."
- [ ] With items present, page shows four sections in order: Fabrics, Hardware, Webbing, Misc
- [ ] Each section header shows item count (e.g. "Fabrics (2)")
- [ ] Empty sections show "None." (not hidden)
- [ ] Variant column header switches per section: "Colour" for fabrics, "Size" for hardware/webbing, "Variant" for misc
- [ ] Items missing a variant render as "—" in the variant cell
- [ ] Notes (if set) render under the item name in smaller grey text
- [ ] "+ Add item" button at top-right links to `/admin/inventory/add`

## 14. Inventory — add form
- [ ] Submit empty form → HTML required-field validation blocks
- [ ] Variant field is required when type is fabric/hardware/webbing, optional when type is misc
- [ ] Variant placeholder updates with type ("Black" for fabric, "20mm" for hardware, etc.)
- [ ] Negative qty (e.g. -5) → server validation error
- [ ] Qty over 100,000 → server validation error
- [ ] Notes longer than 500 chars → server validation error
- [ ] Validation errors render in the red error box at the bottom
- [ ] Happy path: fill all fields → submits, redirects to `/admin/inventory`, new item appears in correct section
- [ ] Each new item gets a unique uuid `id` in `data/inventory.json` (verify by reading the file)
- [ ] Adding two items with identical name + variant is allowed (no duplicate detection — separate rows)

## 15. Inventory — qty edits
- [ ] Open `/admin/inventory`, type a new value into a qty field → "Save" button appears next to that row only
- [ ] Type the original value back → "Save" button disappears (no spurious save)
- [ ] Click "Save" with a valid number → row updates, `data/inventory.json` reflects new qty
- [ ] Negative number in the input → red error banner: "Quantity must be a non-negative number"
- [ ] Decimal qty (e.g. 2.5 for fabric) accepted
- [ ] While save is in flight, the button shows "…" and is disabled
- [ ] Editing two different items in sequence works (state for one doesn't bleed into the other)

## 16. Inventory — delete
- [ ] Click "Delete" on an item → browser confirm dialog shows the name (and variant if set)
- [ ] Cancel → row remains, `data/inventory.json` unchanged
- [ ] Confirm → row removed from list, `data/inventory.json` no longer contains that id
- [ ] Section count in header decrements (e.g. "Fabrics (2)" → "Fabrics (1)")
- [ ] Direct DELETE on a non-existent id (via curl/devtools) → 404 with `{"error":"Item not found"}`
- [ ] Direct PATCH on a non-existent id → 404
- [ ] Direct POST/PATCH/DELETE without a session cookie → blocked by middleware

## 17. Edge cases / persistence
- [ ] Stop and restart `npm run dev` → existing session cookie still valid (until 8h expiry)
- [ ] Manually corrupt `data/bags.json` (invalid JSON) → pages show error or 500 (graceful)
- [ ] Manually corrupt `data/inventory.json` (invalid JSON) → `/admin/inventory` shows error or 500 (graceful)
- [ ] Change `AUTH_SECRET` in `.env.local` → existing session invalidated, redirected to login
- [ ] After editing `next.config.ts`, restart dev server (Turbopack caches config — see Session 3 notes)

## 18. Build verification
- [ ] `npm run build` succeeds
- [ ] All routes generated, including bag dynamic `/api/admin/bags/[slug]` and inventory dynamic `/api/admin/inventory/[id]`
- [ ] Both inventory pages listed: `/admin/inventory` and `/admin/inventory/add`
- [ ] `Proxy (Middleware)` listed in route output
- [ ] `npm start` (production mode) — full bag + inventory flow still works

---

## When this needs updating

This is a manual checklist intended to grow as features are added. Each new feature should add a section here covering its primary path and at least one edge case. As the project matures, sections can graduate into automated tests (Playwright for E2E, Vitest/Jest for unit/integration).
