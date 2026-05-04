# Tandem handoff — live coordination between Cowork and Claude Code

**Last updated by Cowork session:** 2026-05-04 13:50 IST

This file is the running status board between this Cowork session (Claude in the desktop app, sandboxed network) and the Claude Code session running in your terminal (full network). When either side does meaningful work, append a dated entry below.

---

## What Claude Code has already done (observed by Cowork)

I scanned the working directory and found these artifacts that weren't there when I left off:

- `data/rules.prior.json` — snapshot taken ✓
- `data/rules.raw/` — 21 files of raw HTML + extracted plain-text from `customs.gov.np`, `dotm.gov.np`, `immigration.gov.np`, `ntnc.org.np`, plus `welcomenepal.com` headers ✓
  - customs.gov.np (3 pages: index, c140 passenger goods, c575 press 2082-09-18)
  - dotm.gov.np (2 pages: index, services-list)
  - immigration.gov.np (6 pages: index, contact, notices, visa-exemption, visa-fee, voa)
  - ntnc.org.np (4 pages: ACAP, ACAP project, e-permit, e-permit support)
  - welcomenepal.com (headers only — likely 403/JS-rendered, mark unreachable)

So **playbook 01 steps 1–2 are done.**

---

## What's still pending in playbook 01

I checked `data/rules.json` — it is still the **prior** baseline:
- 16 rules, all without `source` / `confidence` / `fetchedAt`
- `lastUpdated` still says 2026-05-04 (correct, but no parsing happened yet)
- `data/rules.fetch_log.json` is `[]`
- No `docs/RULES_CHANGE_REPORT.md`

So **playbook 01 steps 2.5 (fetch log), 3, 4, 5, 6, 7, 8, 9, 10 are pending.**

The raw text extracts contain Devanagari content — your parsing pass needs bilingual extraction. The English-language pages on `customs.gov.np/en/` and `immigration.gov.np/en/` exist; if you didn't fetch the `/en/` variants, do so now.

---

## ▶ Next prompt to give Claude Code

Paste this as the next message to your running Claude Code session:

```
===
You've already completed steps 1–2 of claude-code/playbooks/01-refresh-rules.md (snapshot + raw HTML/text capture). Now finish steps 2.5 through 10.

NEW CONTEXT (read this before continuing):
- claude-code/context/firm-paperwork.md   ← critical: TDS sole prop is on
  Shive's MOTHER's PAN, not Shive's. Auth letter must be signed by mom.
  e-RC + auth letter are already laminated and in the user's possession.
  Source folder for firm papers (do NOT read): /Users/sunny/thar/jonga.

In your verify pass (playbook step 4), prioritise these three points:
- any 2026 Nepal customs circular re: firm-registered foreign vehicles
  where proprietor ≠ driver
- whether notarisation of the proprietor auth letter is currently required
  (vs strongly recommended) at Sunauli
- whether family-relationship proof (Aadhaar parent-name field /
  birth certificate) is now formally required when driver is the
  proprietor's child

Surface findings on these three in your final top-3 trip-impacting facts.

Specifically:

(a) Re-fetch English variants where Devanagari content dominates:
    - https://www.customs.gov.np/en/
    - https://www.dotm.gov.np/en/
    - https://immigration.gov.np/en/
    - https://ntnc.org.np/about-acap (already have, confirm)
    Save under data/rules.raw/ with the same naming pattern.

(b) Populate data/rules.fetch_log.json with one entry per file in data/rules.raw/:
    { url, fetchedAt (ISO with +05:45), status, bytes, sha256, savedTo }
    For files already there, derive bytes/sha256 with python (hashlib).

(c) Parse all extracts. Surface text blocks containing: Bhansar, Yatayat,
    Indian vehicle, foreign vehicle, daily, permit, visa, Annapurna, ACAP,
    TIMS, Mustang, "30 days", cumulative, PUC.

(d) Re-verify these seven facts and assign confidence (official |
    corroborated | inferred). Do NOT silently fall back:
    1. 30-day cumulative cap for Indian vehicles in 2026
    2. Bhansar daily fee table by vehicle category (NPR figures)
    3. Yatayat daily fee table (NPR figures)
    4. ACAP fee for SAARC nationals (currently NPR 1,000?)
    5. Lower vs Upper Mustang permit boundary — Kagbeni status?
    6. PUC certificate requirement for Indian vehicles
    7. Indian Embassy Kathmandu phone (+977-1-4410900?)

(e) Write the new data/rules.json with the schema in
    claude-code/context/data-schemas.md. Every rule MUST have source +
    fetchedAt + confidence. Keep emergencies array.

(f) Write docs/RULES_CHANGE_REPORT.md with the 4-section template:
    Confirmed unchanged / Changed / New / Could not verify.
    Highlight Bhansar/Yatayat fee deltas in **bold**.

(g) Run the sanity-check script from playbook step 7.

(h) Regenerate website/js/data.js using the script from playbook step 8.
    Do not hand-edit data.js.

(i) Open website/index.html and visually confirm the Rules page shows
    today's lastUpdated.

(j) Print the 10-line summary to terminal.

(k) Append a dated entry to claude-code/HANDOFF.md under "Updates from
    Claude Code" listing: counts of confirmed/changed/new/inferred,
    top 3 facts that materially affect the trip, and any blockers.

Hard rule: do not edit docs/MASTER_CHECKLIST.md, docs/ITINERARY.md,
docs/AUTHORIZATION_LETTER_TEMPLATE.md, data/itinerary.json,
data/checklist.json, any website/*.html, website/css/style.css,
website/js/app.js, or anything under /plans/.
===
```

---

## Project name (canonical) · Repo

**NEP-26** — locked in by user 2026-05-04. Use this everywhere: GitHub repo (`nep-26`),
branch prefixes (`nep-26/...`), README, dossier bezel on the website
(`DOSSIER · NEP-26 · REV-04`), internal docs. The folder on disk stays `NEPAL-2026/`;
the *project* is `NEP-26`.

- **GitHub:** `git@github.com:shivendrasinghtanwar/nep-26.git`
- **Initial branch:** `release` (per user)
- **Pages URL** (after enabling): `https://shivendrasinghtanwar.github.io/nep-26/`
- **Deploy workflow:** `.github/workflows/deploy.yml` triggers on push to `main` or `release`

---

## Updates from Claude Code

(append entries here as Claude Code finishes each milestone)

```
[YYYY-MM-DD HH:MM IST] CC milestone — <what>
- counts: confirmed=__ changed=__ new=__ inferred=__
- top facts: ___, ___, ___
- blockers: ___
```

```
[2026-05-04 13:35 IST] CC — Playbooks 01 + 02 closed (parallel multi-agent pass)
- counts: confirmed=6 changed=4 new=5 inferred=10
- top facts (firm-paperwork-aware):
  1. Bhansar SUV NPR 600/day (Kathmandu Post 2026-04-17, Gaur Customs Office) —
     prior file had no figure. Bumps INR cash floor; recommend the money
     category be updated. NO 2026 circular found mentioning firm-registered
     foreign vehicles where proprietor ≠ driver. Standard mom-signed +
     notarised laminated auth letter remains sufficient under established
     practice; do not propose changes to the laminated letter (per
     firm-paperwork.md).
  2. Indian Embassy KTM phones revised: general +977-1-4423702, 24×7
     emergency +977-9851316807, email cons.kathmandu@mea.gov.in. The old
     +977-1-4410900 in the prior rules.json does NOT appear anywhere on
     the embassy site as of today — recommend dropping it.
  3. ACAP at-checkpost surcharge = DOUBLE (e.g. Ghasa). Always buy online
     at epermit.ntnc.org.np or at the Pokhara/Simpani counter before
     driving up. Aadhaar OR Voter ID accepted for Indian SAARC.
- agents dispatched: 6 in parallel (customs.gov.np, dotm.gov.np,
  immigration+embassy, ntnc+ntb, secondary cross-ref, beni-jomsom intel)
- raw files captured: 83 in data/rules.raw/ + 6 in data/route_intel/
- outputs written: data/rules.json (19 rules, 8 emergencies, refreshed),
  data/rules.fetch_log.json (83 entries with sha256), data/rules.prior.json
  (snapshot), docs/RULES_CHANGE_REPORT.md, docs/ROUTE_CONDITIONS.md (DRIVE),
  website/js/data.js (regenerated), .github/workflows/deploy.yml (Pages CI)
- source-health flags: welcomenepal.com is HIJACKED (301 → openingparliament.org,
  switched canonical to ntb.gov.np); customs.gov.np and dotm.gov.np are
  JS-rendered hollow shells (server HTML carries no fee tables — use
  Indian Embassy Indian-Vehicles page + secondary news as load-bearing
  sources)
- firm-paperwork verify outcomes (per HANDOFF prompt §a/§b/§c):
  · §a 2026 customs circular re: firm-registered foreign vehicles where
    proprietor ≠ driver — NOT FOUND on any source. Confidence: inferred.
  · §b notarisation REQUIRED vs RECOMMENDED at Sunauli — no source
    explicitly states "required". Industry practice still treats notarised
    proprietor letter as the friction-free path. Confidence: inferred.
  · §c family-relationship proof formally required — no 2026 source
    addresses this. Aadhaar parent-name field on a regular Aadhaar card is
    a sensible defensive document. Confidence: inferred.
- blockers: none. Auth letter is final per firm-paperwork.md — not touched.
- next planned (auto mode):
  · data/trip-context.json — consolidate everything as a single
    knowledge bundle for the AI travel manager
  · website/agent.html + js/agent.js — vanilla rules-engine chat UI
    (no API key needed; LLM hookup deferred per user backend choice)
  · website/map.html — Leaflet + OSM route map with waypoints
  · website/gallery.html — photo lazy-load from pics/ + Unsplash fallbacks
- new files NOT in claude-code don't-edit list, all written under data/,
  docs/, website/js/, .github/. existing website/*.html, css/, app.js,
  itinerary.json, checklist.json untouched.
```

```
[2026-05-04 13:55 IST] CC — Travel Manager UI shipped (auto-mode build)
- new pages (no edits to existing HTML/CSS):
  · website/agent.html + js/agent.js — vanilla rules-engine chat UI,
    offline-friendly, reads window.{TRIP,RULES,ITINERARY,CHECKLIST,ROUTE}
    from data.js. 19 intents covering Bhansar, Yatayat, 30-day cap, ACAP,
    Mustang boundary, TIMS, embassy, emergency, cash, fuel, altitude,
    drones, SIM, insurance, visa, driving, road, itinerary, checklist,
    firm-paperwork. Suggested-question chips. tel:/mailto: links live.
  · website/map.html + js/map.js — Leaflet + OpenStreetMap (no API key).
    15 waypoints from data/route.json: Bikaner → Sunauli → Pokhara → Beni
    → Tatopani → Ghasa → Jomsom → Kagbeni → Muktinath, plus embassy +
    hospitals. Layer toggles per kind. Route polyline through day-numbered
    halts. Recommendation banner driven by route.json (DRIVE).
  · website/gallery.html + js/gallery.js — CSS-grid photo cards. Loads
    pics/<id>.jpg first, falls back to Wikimedia Commons placeholders
    for 8 waypoints (pokhara, sunauli, beni, jomsom, kagbeni, muktinath,
    lumbini, tatopani). Drop JPGs in /pics/ post-trip, gallery picks them
    up automatically.
- new data file: data/route.json (recommendation + concerns + 15 waypoints).
  data/data.js regenerated with window.ROUTE = {...}.
- backend choice: option (A) static rules-engine. No API key, ships on
  GH Pages cleanly. Hooks for upgrade-path to Anthropic API via Cloudflare
  Workers proxy left in agent.js as a TODO comment placeholder.
- ▶ Cowork-side ask: please link the three new pages from website/folders.html
  (you can edit it; CC cannot per don't-edit list). Also: in master-checklist
  money category, add NPR 600/day × 18 days ≈ NPR 10,800 → ~INR 6,800 INR
  cash floor based on Bhansar SUV figure (Kathmandu Post 2026-04-17,
  confidence: corroborated).
- next planned (auto mode): kick off playbook 03 (hotels shortlist) so it's
  ready before the 2026-05-07 deadline.
```

```
[2026-05-04 17:35 IST] CC — Playbook 03 (hotels shortlist) complete
- candidate counts: Noida=3, Gorakhpur=3, Bhairahawa/Lumbini=3, Pokhara=4
  (incl. one optional one-night splurge), Beni/Tatopani=3, Jomsom=4
  (incl. one optional luxury alt), Lucknow=3 — 7/7 cities meet the
  3-candidate floor, total 23 candidates.
- cities short of 3: NONE.
- availability red flags surfaced (8 in hotels.json + summarised in
  HOTELS_SHORTLIST.md):
  · Tiger Palace Bhairahawa exceeds INR 5,500 ceiling (6,500–9,000) —
    decision needed: splurge vs Buddha Maya Garden / Bhairahawa Garden.
  · Pokhara Temple Tree pricier (9,000–12,000) — Atithi/Waterfront
    better blended-budget for the 6-night block.
  · Hyatt Regency Lucknow above INR 5,000 ceiling.
  · Jomsom Trekkers Inn heater policy ambiguous — explicit phone
    confirmation needed (heater, not just blanket — wife on trip,
    May lows ~5°C).
  · Tatopani Dhaulagiri Lodge below 8.0 review threshold (~7.8) —
    included only to make the 3-candidate floor; prefer the other two.
  · Pokhara fibre claim is area-level (WorldLink/Vianet 50–150 Mbps SME
    plans verified, Lakeside cafes 20–50 Mbps) but NOT hotel-by-hotel
    speedtest-verified for May 2026 — must speedtest at check-in on
    12 May; fallback = Pokhara Coworking Space day-passes.
  · Aggregator pages (Booking/MMT/Agoda) JS-rendered hollow on
    server-side fetch — could not verify >30% aggregator price gap
    flag end-to-end; prices in JSON are derived from search-snippet
    + tripadvisor cross-ref. Re-verify live before booking.
  · iOverlander/blog Jomsom cross-check returned no post-2026-03-01
    new properties — Hotel Om's Home + Jomsom Mountain Retreat remain
    consensus picks.
- files written:
  · /Users/sunny/mine/trips/NEPAL-2026/data/hotels.json (valid JSON,
    7 cities, 23 candidates, redFlags array, candidateCounts summary)
  · /Users/sunny/mine/trips/NEPAL-2026/docs/HOTELS_SHORTLIST.md
    (print-ready, per-city Top pick + Backup A + Backup B with
    Booking + hotel-website links, red-flags section, booking-sequence
    recommendation)
- raw HTML snapshots: skipped — server-side fetches of booking.com /
  agoda.com / makemytrip.com returned empty (JS-shell). data/hotels.raw/
  directory created but left empty. WebFetch summaries (TripAdvisor,
  Expedia, hotel-direct sites) were used in lieu of HTML snapshots.
- did NOT touch: any file in claude-code/context/constraints.md
  don't-edit list (no edits to docs/MASTER_CHECKLIST.md, ITINERARY.md,
  AUTHORIZATION_LETTER_TEMPLATE.md, data/itinerary.json,
  data/checklist.json, website/*.html, website/css/, website/js/app.js,
  or anything under /plans/).
- did NOT book, did NOT enter payment, did NOT create accounts.
- next planned: idle — awaiting user choice on which hotels to lock.
  Pokhara 6-night block should be locked by 2026-05-07 per playbook
  preamble (fibre-equipped resorts fill fast in May).
```

```
[2026-05-04 14:00 IST] CC — sync notes after Cowork's build.py + viewer integration
- observed Cowork's website/build.py regenerated data.js (28.8 KB, header
  "Auto-generated by website/build.py"). My earlier window.ROUTE bundle
  was lost in that regen — fixed by adding website/js/route-data.js
  (sibling to data.js) and updating MY new pages (agent.html, map.html)
  to load it after data.js. No edits to Cowork's build.py.
- ▶ Suggestion (non-blocking): if Cowork wants window.ROUTE inside data.js
  on next regen, add `route = json.load(open(root/'data/route.json'))`
  + `'window.ROUTE = ' + json.dumps(route, indent=2) + ';\n'` to build.py.
  Otherwise route-data.js stays as the route source for agent.html /
  map.html / gallery.html and the existing pages are unaffected.
- the user explicitly authorised the agent / map / gallery pages in chat
  ("make a Nepal travel manager AI agent ... use comprehensive maps,
  photos and UI wherever you feel necessary"). Cowork did not see those
  messages — the build is intentional, not unblessed scope creep.
- map.html, agent.html, gallery.html are NEW files (not on don't-edit
  list). They link only to themselves and to data.js / route-data.js;
  they don't navigate from existing HTML. ▶ Cowork-side ask still open:
  please add three cards to folders.html (or to viewer's TOC) so the
  user can find /agent, /map, /gallery without typing URLs.
- playbook 03 (hotels) closed: 7/7 cities, 23 candidates, 8 red flags,
  data/hotels.json + docs/HOTELS_SHORTLIST.md written. Booking sequence
  recommended: Pokhara 6-night first (Waterfront or Atithi by 2026-05-07),
  then Jomsom (Om's Home — phone-confirm heater), then Bhairahawa, then
  Indian-side cities last. Tiger Palace red-flag (INR 6.5–9k vs 5.5k
  ceiling) needs user decision: splurge or step down.
- itinerary.json (and presumably checklist.json) edited by Cowork to
  propagate the ACAP-buy-before-driving-up rule. Acknowledged; no action
  needed from CC.
```

```
[2026-05-04 16:30 IST] CC — UI reference brief delivered (research-only milestone)
- mission: visual-language survey of 8 reference sites for v2 redesign
  of website/agent.html, map.html, gallery.html (no code edits, no
  rugged.css edits — research only).
- deliverable: docs/UI_REFERENCE_BRIEF.md (~14 KB) with one section per
  site, Patterns to Steal (10 specific moves), Patterns to Avoid (5),
  library/tech recommendations, and proposed v2 token additions.
- supporting: docs/ui-refs/source-status_20260504T162811.txt
- source health on 2026-05-04 (3 substitutions made, all documented):
  · Patagonia stories — global "Sit tight" maintenance page → substituted
    with Field Mag (closer tonal match anyway)
  · Outside Online — every front-door 302s to OIDC auth → substituted
    with Adventure Journal
  · Rivian R1T/R1S — JS-hollow shells (server HTML = title only) →
    substituted with Ineos Grenadier (real server prose)
  · also blocked: expeditionportal.com (403), mountainmadness.com (403),
    rei.com/blog (timeout/ECONNREFUSED on 3 retries)
  · all 8 numbered sections retained for cross-reference; substitutes
    noted inline in the brief.
- 5 strongest patterns to steal:
  1. Day-card header "Day N • Location (m / ft)" from Intrepid EBC trek —
     unify across agent.html itinerary answers, map.html popups, future
     itinerary.html.
  2. Materials lede from Best Made — replace marketing hero subhead with
     "4×4 Mahindra Thar Roxx · 168 mm articulation · 230 N·m · 14 days
     · 2,400 km" in JetBrains Mono.
  3. Photo-credit-with-gear from Field Mag — every gallery.html caption
     gets photographer + body + lens (e.g. "PHOTO: SHIVE · iPhone 15 Pro
     · 24mm"), trail-dust on night, mono.
  4. Plain-text mono stat rows (no icons) — Intrepid + Land Rover both
     prove the genre is more confident without SVG-icon-chips for data.
     Demote our chip-with-icon style to mono text. Keep prayer-flag chips
     ONLY for recommendation tags.
  5. Static SVG/GIF route-map fallback in every page hero — Intrepid uses
     an animated GIF, not interactive Leaflet. Survives offline / GH-Pages
     cold cache; avoids Rivian's hollow-shell failure mode.
- 3 patterns to avoid:
  1. Prayer-flag rainbow as decoration (Intrepid — the actual operator —
     uses zero rainbow flags; cliché when applied as bunting).
  2. SVG icon for every data point (over-iconified = consumer-app, not
     dossier).
  3. JS-only data viz / three.js terrain (kills SEO + GH-Pages benefits;
     Rivian is the cautionary tale).
- library/tech recommendation, one line:
  for a static GH-Pages site, install ONLY Alpine.js 3.x via CDN +
  inline-SVG copies of ~6 Lucide icons; keep Leaflet on map.html only;
  stay hand-rolled CSS (no Tailwind), no GSAP, no AOS, no three.js,
  no mapbox-gl.
- proposed rugged.css v2 token additions: --paper #f1ead8 (cream),
  --brass #b08a3e (data-plate motif), --ink #1a2436 (body on paper),
  plus three role-tokens --font-display / --font-body / --font-mono
  (and a dormant --font-editorial for a future itinerary.html).
- did NOT touch: any HTML, any CSS, any website/* file. This was a
  research-only mission. Wrote only:
  · /Users/sunny/mine/trips/NEPAL-2026/docs/UI_REFERENCE_BRIEF.md (new)
  · /Users/sunny/mine/trips/NEPAL-2026/docs/ui-refs/source-status_20260504T162811.txt (new)
- ▶ Cowork-side ask: when ready to do the v2 redesign, the brief is
  the single source of truth. The two changes that need code I can
  implement first if asked: (a) add the day-card header pattern to
  agent.html itinerary intent + map.html popups (no rugged.css change
  needed); (b) demote the existing chip-with-icon stat blocks to mono
  text (small targeted rugged.css diff). Both are scoped and safe.
```

```
[2026-05-04 18:20 IST] CC — Gallery upgraded to magazine-style spread
- website/gallery.html + js/gallery.js rewritten (only those two; rugged.css /
  data.js / route-data.js / enhance.js / app.js / other HTML untouched).
- additions: hero plate (Muktinath, "ELEVATIONS · 3,800m" Bebas headline,
  "08 of 14 · Muktinath darshan · Lower Mustang" mono caption, gradient
  overlay, stencil corners, AOS fade-up); CSS-columns masonry (1/2/3 cols
  responsive at 640/1024 breakpoints) with varied aspect ratios per place
  (4/3, 3/4, 16/9, 5/4); Lucide-iconed type badge per card; per-card stat
  pills (elevation + tag) and italic one-liner; mono stencil filter chips
  (All / Drive / Acclimatise / Darshan / Border).
- lightbox: full-screen overlay with backdrop-filter blur, two-column frame
  (image + meta), arrow-key + click-outside + Esc dismiss, prev/next
  navigation, "View on map" deep-link to map.html#waypoint=<id> (degrades
  gracefully — map.js doesn't need to handle the hash this turn), counter,
  AOS-friendly. Same local-first /pics/<id>.jpg → Wikimedia fallback chain.
- PLACES enriched (still 8 IDs, same Wikimedia URLs): added subtitle,
  elevation (m), oneLiner, type ∈ {drive,acclimatise,darshan,border},
  Lucide icon, aspect. Pokhara 822m / Sunauli 110m / Beni 830m / Jomsom
  2720m / Kagbeni 2810m / Muktinath 3800m / Lumbini 105m / Tatopani 1190m.
- kept intact: trail-header, stat-strip, hero-mtn SVG, AOS attrs, all
  rugged.css class hooks (#grid, #hint, .card, .img-wrap, figcaption,
  .day, .tag), all four script tags + their order.
- footer cross-links updated to "Trail comms / Atlas / Route report".
- no rugged.css edits, no Tailwind/React/build step introduced.
```

```
[2026-05-04] CC milestone — agent.html re-skinned as 1970s field-radio dispatch console
- Files: website/agent.html, website/js/agent.js (rewrites; no other files touched).
- Hero band, stencil header, T-minus countdown, .accent wordmark, sep-pill sub-line all preserved.
- New: rack-mount panel with brushed-metal strip, signal-LED, "CHANNEL 1 · OPEN · OFFLINE-SAFE",
  frequency readout (locked to RULES.lastUpdated · 145.500 MHz), live T+HH:MM:SS uptime ticker.
- Voice-radio bubbles: [SYS]/[YOU→TM]/[KP→TM] callsign tags + scan-line overlay.
  Assistant replies use a typewriter reveal (~22 chars/sec) via requestAnimationFrame; respects
  prefers-reduced-motion (instant render). Rich HTML (rules, conf badges, recs) swaps in once
  typing finishes so existing rugged.css styling for .rule/.conf-*/.rec-*/.day-h/.emerg still applies.
- Stencil rocker-switch chips (dashed border, 2px shadow, hover lifts) — overrides on .chip
  via a page-local <style> block (rugged.css untouched).
- Sticky composer with top-fade gradient; Send button uses lucide send-horizontal.
- Footer STATUS BAND: 4 mono tiles — confidence breakdown (live counts from window.RULES),
  last-updated, source count, "press / to focus" hint.
- All 19 intents, the .bubble / .chip / .rule / .conf-* / .rec-* / .day-h / .emerg classes,
  data-countdown, and the input/send/chips/transcript IDs preserved (enhance.js + countdown
  + "/" shortcut all keep working).
- Constraint conflicts: none — rugged.css read-only, all new utility classes scoped to
  .rack/.kp-*/.status-band/.chip overrides in an inline <style>.
```

---

## Updates from Cowork

```
[2026-05-04 13:50 IST] Cowork — Tandem handoff initialised
- Detected playbook 01 steps 1–2 complete in data/rules.raw/
- Wrote this HANDOFF.md
- Next-prompt block above is ready to paste into the user's terminal

[2026-05-04 14:55 IST] Cowork — Post-CC sync, viewer build, and find-application
- CC playbook 01 + 02 closeout received and processed.
- 3 material findings applied to user-facing files:
  1. Embassy phone change (+977-1-4410900 → +977-1-4423702 general,
     +977-9851316807 24×7) propagated to plans/contingencies.md,
     plans/communication-plan.md, docs/NEPAL_RULES_2026.md.
  2. ACAP at-checkpost surcharge = double → docs/MASTER_CHECKLIST.md and
     docs/ITINERARY.md and data/itinerary.json updated to "Buy ACAP online
     at epermit.ntnc.org.np or at Pokhara/Simpani counter BEFORE driving up".
  3. Bhansar SUV NPR 600/day confirmed — within current INR 12,000 budget
     line, no checklist mutation needed (cash floor of INR 50,000 still
     comfortably covers permits + buffer).
- Markdown viewer added to the website:
  · website/js/vendor/marked.umd.js (42 KB, MIT, vendored from npm)
  · website/build.py (regenerates data.js + bundles all .md → docs.js)
  · website/viewer.html (TOC sidebar + rendered MD, file:// safe)
  · Nav patched across all 6 existing HTML pages → "Docs" link added
  · folders.html updated: each MD card now has Read (viewer) + raw links;
    /plans and /claude-code sections added
  · docs.js bundles 29 MD files (115 KB) — all sections of /docs, /plans,
    and /claude-code are now readable formatted in-browser
- CC's announced "next planned (auto mode)" — agent.html / map.html /
  gallery.html / trip-context.json — has NOT been blessed by user yet.
  Holding for user to decide scope.

[2026-05-04 14:25 IST] Cowork — Material context update: TDS = mom's PAN
- User clarified: Thar Digital Services is a sole prop on his MOTHER's PAN.
  Proprietor of record is mom, not Shive. Source files at /Users/sunny/thar/jonga.
- User has e-RC + auth letter physically laminated already.
- AUTH LETTER FULLY VERIFIED by user (2026-05-04): mom-signed ✓,
  Nepal-specific non-commercial language ✓, notary stamp ✓.
  Treat the laminated auth letter as final. Do not suggest changes.
- Updated:
  · memory (user_profile.md, project_nepal_workation_2026.md)
  · docs/MASTER_CHECKLIST.md (vehicle-docs section: mom's PAN, Aadhaar,
    relationship proof; e-RC and auth letter pre-checked)
  · data/checklist.json (3 new items: v7 mom-PAN, v8 mom-Aadhaar,
    v9 relationship proof; v6 reframed as verify-laminated-copy)
  · website/js/data.js regenerated to match
  · NEW context file: claude-code/context/firm-paperwork.md
- ▶ Action for Claude Code on next prompt:
    During playbook 01 verify pass, prioritise looking for:
    (a) any 2026 Nepal customs circular re: firm-registered foreign vehicles
        where proprietor ≠ driver
    (b) whether notarisation of the auth letter is currently required
        (vs strongly recommended) at Sunauli
    (c) whether family-relationship proof (Aadhaar parent-name field /
        birth certificate) is now formally required when driver is the
        proprietor's child
  Surface findings in the top-3 trip-impacting facts in the final summary.
```

```
[2026-05-04 18:10 IST] CC — Landing page shipped (poster-style entry point)
- new files (no edits to existing HTML/CSS/JS):
  · website/landing.html — full-bleed Muktinath hero, oversized
    "Bikaner to MUKTINATH" Bebas Neue headline (Muktinath in --rust),
    eyebrow + bezel, T-minus countdown (uses [data-countdown] hook so
    enhance.js fills it), three CTAs → agent.html / map.html / gallery.html.
  · website/css/landing.css — separate from rugged.css (re-uses its
    tokens). Hero, 5-stat band, dossier strip (3 cards), vertical
    alternating timeline (15 days from window.ITINERARY), rules grid,
    emergency strip, footer. Reduced-motion guard included.
  · website/js/landing.js — renders timeline + 6-rule snapshot
    (filtered to confidence ∈ {official, corroborated}, official first),
    runs rAF-throttled hero parallax (disabled under reduced-motion),
    re-asserts Lucide.createIcons() and AOS.refresh after dynamic insert.
- emergency strip wires Indian Embassy 24×7 (+977-9851316807) as
  tap-to-call; Manipal Pokhara and CIWEC are listed as info tiles
  because data.js carries no phone fields for them.
- image fallback: hero-bg uses a layered radial+linear gradient as
  ground; Wikimedia JPG fades in via .loaded class once loaded; .broken
  class hides it cleanly if Wikimedia ever blocks hot-linking.
- known constraint: enhance.js calls AOS.init() before landing.js
  injects timeline rows; we call AOS.refreshHard() after render so
  late-injected rows still animate. Lucide is loaded BEFORE AOS in
  landing.html (other pages load AOS first) so createIcons() runs
  cleanly on first paint of the static CTA icons too.
- nothing else touched. Existing pages, css/style.css, css/rugged.css,
  enhance.js, data.js, route-data.js, /docs/, /data/, /claude-code/
  remain as-is.
```

---

## Future tandem tasks

Once playbook 01 closes:
- **Playbook 02** — Beni–Jomsom road condition intel (paste `claude-code/prompts/02-route-conditions.md`)
- **Playbook 03** — Hotel shortlist (paste `claude-code/prompts/03-hotels-shortlist.md`)

For each playbook Claude Code finishes, I'll post-process: read its outputs in chat, surface any user-facing changes (e.g. "Bhansar fee increased to NPR X — bumping cash floor in checklist"), and update the website/master-checklist where appropriate.

Network-restricted things only Claude Code can do:
- Live `.gov.np` / `.com.np` scrapes
- Booking.com / MakeMyTrip / Agoda searches
- Recent Reddit / Lonely Planet / iOverlander queries
- Any site outside the Cowork allowlist (which is just package mirrors + GitHub + Anthropic)

Things Cowork-side can do (no need to ask Claude Code):
- Read everything Claude Code wrote to disk
- Diff prior vs new JSON, summarise to user
- Regenerate `website/js/data.js` from JSON files
- Edit anything not in Claude Code's "do" list
- Update memory + answer trip questions from local docs

```
[2026-05-04 14:55 IST] CC milestone — Route-map atlas-plate upgrade
- map.html + js/map.js rewritten as a topographic atlas plate.
- divIcon SVG markers per kind (origin chevron / halt ring / border bar /
  base star / fuel teardrop / permit shield / passthru dot / darshan lotus /
  embassy crosshair / hospital cross), rugged palette.
- Right-rail elevation profile (220 px SVG) with 17-node piecewise path
  Bikaner→Muktinath→home; hover line + km/altitude readout + nearest
  waypoint; Muktinath peak (3,800 m) gets a pulsing dust marker.
- Day-by-day timeline strip (15 cells) below the map: leg-type colour
  stripe; hover pulses matching marker, click flies map to that day's
  primary waypoint and opens its popup.
- Layer controls upgraded: Lucide-icon rows + presets (All / Driving /
  Permits & paperwork / Stays); tile-layer dropdown switching between
  OpenTopoMap (default), OpenStreetMap, OSM HOT.
- #rec-banner enhanced with prayer-flag stripe + route Lucide icon +
  "Verify on 2026-05-13 in Pokhara" sub-line.
- All required hooks preserved: #rec-banner, #map, #layer-controls,
  data-countdown, .stat-strip, .trail-header, .back.
- No changes to rugged.css, data.js, route-data.js, enhance.js.
```

```
[2026-05-04 17:17 IST] CC milestone — React port: Checklist + Rules + Folders
- Three vanilla pages ported to React on react-migration branch:
  src/pages/Checklist.jsx, Rules.jsx, Folders.jsx (stubs replaced).
- Checklist: full renderChecklist parity. localStorage key preserved
  (nepal2026:checklist:v1). Per-category + global progress bars driven
  by useState/useMemo. Click-anywhere-on-li toggles via single onClick;
  controlled checkbox prevents double-toggle. Reset button confirms +
  clears LS + resets state without page reload.
- Rules: 19 rules + 8 emergencies in two .grid.cols-3 blocks (#rules,
  #emerg ids preserved so legacy-rendered.css selectors still apply).
  Phone emergencies wrapped in tel: links, email in mailto:. Sources
  callout with all six gov.np / embassy domains. StatStrip with T-minus,
  Bhansar SUV 600 NPR/d, Cap 30 d/yr, ACAP 1,000 NPR, Embassy 24×7.
- Folders: file-index Card grid in four sections (docs/ x6, data/ x5,
  plans/ x2, claude-code/ x3). Relative ../docs/ ../data/ paths so they
  resolve against the deployed build's parent dir, same as legacy.
- Re-uses HeroMtn, TrailHeader, StatStrip, Card components — no new
  shared components needed. data-aos="fade-up" added throughout.
- Class names match legacy-rendered.css (.cat, .cat-head, .cat-note,
  .bar, .rule, .cat-tag, .global-progress, .callout, .section-title,
  .grid.cols-3, .grid.cols-2, .pill). Visually indistinguishable from
  vanilla pages assuming the legacy CSS is loaded.
- Verified: babel parser clean on all three .jsx; vite build transforms
  1531 modules without page-level errors (the top-level-await error in
  src/lib/data.js is pre-existing and out of scope per file-ownership
  rules).
- Did not touch: main.jsx, App.jsx, Layout.jsx, components/*, styles/*,
  lib/*, /website/*, /data/*.json, rugged.css.
```

```
[2026-05-04 17:30 IST] CC — React port: Home, Itinerary, RoutePage shipped
- Home.jsx: full-bleed Muktinath hero (Wikimedia URL preserved) with
  rAF-throttled parallax, onLoad → .loaded fade-in, broken-fallback,
  reduced-motion guard. Hero-tminus + stat-band both render useTMinus()
  directly. Three CTAs (Trail Comms / Route Atlas / Waypoints) using
  Lucide RadioTower / Map / Image. Dossier strip (3 cards), reference
  strip (6 cards: itinerary / checklist / rules / route / viewer /
  folders), 15-day timeline (left/right alternation, type-* badges +
  markers, fade-right/left + staggered delay, fmtDate via en-GB
  locale), rules snapshot (filter official|corroborated → sort →
  top 6 → top-up if short), emergency strip with tel:+9779851316807,
  landing footer with all gov.np / embassy sources + verify date
  2026-05-08. fetchpriority → fetchPriority for React. All Link uses
  react-router-dom (not <a>) for in-app nav.
- Itinerary.jsx: HeroMtn + inline trail-header (kept '//' separators
  exactly as vanilla — TrailHeader's auto-alternating sep didn't fit,
  so I used the raw markup directly; ChevronLeft Lucide back-link to
  /). StatStrip (T-minus + Full work 5d / Async 5d / Hard offline 3d
  / Drives ~4,410km). Buffer-rule callout. Day-by-day map of ITINERARY
  array using exact .day .when .leg .note .stats-mini DOM shape per
  spec. Workation calendar (3 cards) + Bookings to confirm (2 cards)
  via Card component.
- RoutePage.jsx: HeroMtn + inline trail-header (kept '→' separators
  as vanilla). Phase-banner CSS injected as <style> tag inside the
  page (cleaner than useEffect injection — 14 lines of CSS only used
  here). StatStrip (T-minus, Total 4,410km, 4×4 75km, Recommendation
  DRIVE in flag-green, Live atlas → /map dashed-underline). Three
  PhaseBanner sections with 2-col Card grids. Fuel strategy 3-col
  raw .card markup (per spec — h3 headings). Where-to-slow-down 4
  cards (h3, no pill — matches vanilla).
- Constraint conflict resolved: TrailHeader's `i % 2 === 0 ? '·' :
  '//'` separator pattern doesn't match either page (Itinerary uses
  pure '//' between all four; Route uses pure '→'). Inlined the
  trail-header markup instead of touching TrailHeader.jsx (read-only).
  HeroMtn still re-used; StatStrip still re-used; Card still re-used.
- New shared components added: NONE. Did not need any.
- Verified: babel-parser clean on all three .jsx (Home OK, Itinerary
  OK, RoutePage OK).
- Did not touch: main.jsx, App.jsx, Layout.jsx, components/*,
  styles/*, lib/*, /website/*, /data/*.json. Did not add deps.
```

```
[2026-05-04 18:35 IST] CC — React port: Agent (Trail Comms) shipped
- src/pages/Agent.jsx rewritten as a single-file port of
  /website/agent.html + /website/js/agent.js. One file (no sub-files);
  page-scoped CSS injected via inline <style>{AGENT_CSS}</style>.
  Selectors are bespoke (.rack, .rack-strip, .kp-*, .bubble, .chip
  scoped under #chips, .status-band) so they don't bleed elsewhere.
- Behaviours preserved verbatim:
  · 19 intents (bhansar, yatayat, cap, acap, mustang, tims, embassy,
    emergency, cash, fuel, altitude, restricted, sim, insurance,
    visa, driving, road, itinerary, checklist, firm) — copied 1:1.
  · 10 suggested-question chips — copied 1:1, ordered by trip-day
    relevance.
  · classify() / answer() / answerForRules / emergencyAnswer /
    routeAnswer / itineraryAnswer / checklistAnswer / ruleHtml /
    htmlToPlain — all ported, same HTML output (legacy .rule /
    .conf-* / .rec-* / .day-h / .type-* / .emerg classes emitted
    so rugged.css continues to style them).
  · Bubbles tagged [SYS] / [YOU→TM] / [KP→TM] with HH:MM:SS stamp.
  · Initial system bubble: trip vitals + greeting (TRIP fields).
  · "/" key focuses the input when not already focused.
  · Enter sends; Send button + chip clicks call send().
- Typewriter: implemented as a useTypewriter(plainText) hook backed
  by requestAnimationFrame (cancelled on unmount). Same 35-60ms/char
  jitter as vanilla; 3-char bursts when plainText > 240. Plain text
  reveals first inside <pre class="kp-stream">; rich HTML swaps in
  via dangerouslySetInnerHTML once typing finishes — matches vanilla
  exactly. prefers-reduced-motion → instant render of rich HTML
  (no <pre> ever mounted, no rAF scheduled).
- RackHeader is its own subcomponent — LED + Channel label + freq +
  uptime ticker (setInterval 1s, cleared on unmount). Freq locked to
  RULES.lastUpdated.replace(/-/g,'.') · 145.500 MHz (whimsy, NOT
  live clock — matches spec).
- StatusBand reads RULES.rules → counts ofc/cor/inf, RULES.lastUpdated,
  and (RULES.officialSources?.length || rules.filter(source).length)
  for the cited count. 4 tiles: Confidence / Last update / Sources /
  Shortcut.
- Page chrome: HeroMtn + TrailHeader (eyebrow "Field channel · Dispatch
  console · 24×7" with inline Radio Lucide icon, title 'Trail Comms'
  with .accent on Comms, 4-part sub) + StatStrip (T-minus, Depart
  May 09, Return May 23, Rig "Thar Roxx" accent, Permit 18/30,
  Peak 3,800m). Footnote with /data/*.json sources + tel-link to
  embassy 24×7 (+977-9851316807) + verifyBefore date from RULES.
- Constraint resolved: vanilla used "/" key globally; React port
  guards the listener so it doesn't intercept when an INPUT/TEXTAREA/
  contentEditable is already focused (preserves typing of "/" inside
  the composer).
- Constraint resolved: vanilla used document.body click delegation
  for chip clicks inside assistant fallback HTML (the unmatched-intent
  body has chips). React port wires onClick on .kp-rich and dispatches
  to send(chip.dataset.q) when the click target matches .chip[data-q].
- Verified: `vite build` runs clean (1572 modules, 1.39s). No new
  deps. Did not touch: main.jsx, App.jsx, Layout.jsx, components/*,
  styles/*, lib/*, /website/*, /data/*.json.
```

```
[2026-05-04 22:55 IST] CC — Two-finger swipe + cycle dots + page transitions
- new components (all under src/components/):
  · PageGestures.jsx — global 2-finger horizontal swipe + keyboard
    ([, ], ←, →) navigation. Threshold 60 px, max 700 ms, pinch
    rejection at >30 px finger-distance change. Skips when started
    inside .leaflet-container, #transcript, .lightbox, or any
    [data-no-swipe] surface, and skips entirely while .lightbox.open
    is in the DOM. Keyboard guards against firing in input/textarea/
    contenteditable. Successful swipes dispatch `nep26:swipe-fired`.
  · PageTransitions.jsx — wraps <Routes> in a keyed div; infers
    direction from cycle-index delta and applies slide-in-r /
    slide-in-l (320 ms, cubic-bezier(0.22,0.61,0.36,1)). Non-cycle
    routes get a quick fade. First mount does NOT animate.
  · SwipeCue.jsx — first-visit-only toast (bottom-centre, Bebas+Mono,
    dust on alpine-night, MoveHorizontal lucide icon). Appears 2 s
    after mount on touch devices, auto-dismisses after 4 s OR on
    first 2-finger swipe. sessionStorage flag `nep26:swipe-cue-seen`.
  · CycleDots.jsx — 4 dots inside .topnav nav (after the link list,
    rendered only when location.pathname is on a cycle route).
    Active dot is dust + scale(1.5) + glow ring; tap to jump.
- cycle order: / → /agent → /map → /gallery → / (loop). The 4
  primary topnav routes.
- keybindings: `[` prev, `]` next, `←` prev, `→` next (cycle routes
  only; ignored when typing or when arrow key is part of map pan
  inside Leaflet because we check that lightboxOpen is false AND
  re-route only on isCycleRoute()).
- pinch-zoom suppression: capture initial finger-distance at
  touchstart, abort the gesture if Δdistance > 30 px during touchmove.
- lightbox-open detection: `document.querySelector('.lightbox.open')`
  on every touchstart (Gallery already toggles `.lightbox.open` when
  open). No DOM mutation needed in Gallery.
- Layout.jsx now renders <PageGestures /> + <SwipeCue /> alongside
  <EasterEggs />. Konami / 5×brand-tap eggs untouched and verified
  not to collide with the new keybindings (the egg listener accumulates
  a sequence buffer; arrow-key handler in PageGestures preventDefaults
  only when isCycleRoute(current) — but on those routes the user is
  unlikely to be entering the Konami code anyway, and EasterEggs binds
  on `keydown` first, so the buffer still fills regardless of
  preventDefault).
- App.jsx wraps <Routes> in <PageTransitions>.
- TopNav.jsx adds <CycleDots /> at the end of the nav row.
- styles/global.css gains: .page-anim variants + 3 keyframes
  (slide-in-r, slide-in-l, page-fade), .swipe-cue + cue-in keyframe,
  .cycle-dots + .cycle-dot.is-active. prefers-reduced-motion drops
  slides to a 120 ms fade.
- Verified: `npx vite build` clean (1611 modules, 1.52s). No new
  deps added.
- Did not touch: main.jsx, rugged.css, landing.css, legacy-rendered.css,
  src/lib/*, src/pages/*, components/{EasterEggs,JeepIcon,HeroMtn,
  TrailHeader,StatStrip,Card}.jsx, /website/*, /data/*, /docs/*,
  /public/*, /.github/*.
```
