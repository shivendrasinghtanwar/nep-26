# Plan 02 — Beni–Jomsom road condition intel

**Run on or after 2026-05-09 (after departure)** so the intel is fresh for the 2026-05-15 4×4 leg.

## Goal

Find first-hand reports of the Beni → Jomsom road condition from sources dated after 2026-03-01, summarise into a single drive-or-postpone recommendation, and capture raw extracts for traceability.

## Why this matters

The Beni–Jomsom stretch is the only true 4×4 segment of the trip. It has historically been disrupted by:
- Pre-monsoon landslides (April–May).
- River-crossing wash-outs after early storms.
- Construction blockages between Tatopani and Ghasa.

A Mustang detour adds 2 days to a 15-day trip. Knowing the road state before leaving Pokhara on 2026-05-14 lets the user back out gracefully and add days to Pokhara workation if needed.

## Inputs you will read first

1. `claude-code/context/trip-overview.md`
2. `claude-code/context/glossary.md`
3. `docs/ITINERARY.md` (especially day 6–9)
4. `data/rules.json` (don't edit)

## Sources to query

| Source | Search |
|--------|--------|
| Google | `"Beni Jomsom" road 2026` and `"Mustang road" 2026 May` and `Tatopani Ghasa landslide 2026` |
| Reddit | `site:reddit.com Mustang road 2026`, `site:reddit.com Muktinath drive 2026` |
| Lonely Planet Thorn Tree | `Mustang 2026` |
| iOverlander | check waypoint comments along the Beni–Jomsom route, sort by date |
| Nepali news | `kathmandupost.com`, `onlinekhabar.com`, `recordnepal.com` — search `Mustang road` and `Beni Jomsom` |
| YouTube | recent vlog uploads tagged "Mustang drive 2026" — read comments, scan video descriptions |

For each source, prefer hits dated after **2026-03-01**. Discard older.

## Output contract

```
data/route_intel/
├── beni_jomsom_<timestamp>.md     ← markdown summary of all hits
├── source_01_<host>.html          ← raw HTML / text per top hit
├── source_02_<host>.html
└── ... up to 8 sources

docs/
└── ROUTE_CONDITIONS.md            ← single-page recommendation, what the user reads
```

### `docs/ROUTE_CONDITIONS.md` template

```markdown
# Beni–Jomsom Road — Condition Snapshot
*Compiled <ISO date>*

## Recommendation

**DRIVE / HOLD / POSTPONE** — one word, then a single sentence justification.

## Top three concerns (most-recent first)

1. ...
2. ...
3. ...

## What to verify on 2026-05-13 in Pokhara

- ...

## Sources
- [Title](URL) — published <date> — relevance: high/med/low
- ...
```

## Procedure

1. Run each search query. Open each top result (max 12 total). Discard any pre-2026-03-01.
2. Save each kept HTML / text snippet under `data/route_intel/source_NN_<host>.html` with a sibling `.txt` of plain text.
3. Build `data/route_intel/beni_jomsom_<timestamp>.md` — one paragraph per source: title, date, author, quote (≤2 sentences), one-line takeaway.
4. Write `docs/ROUTE_CONDITIONS.md` from those takeaways, ending in the one-word recommendation.
5. Update `data/rules.json` only if a hard rule changed (e.g. a new Mustang permit requirement); otherwise leave it.
6. Print to terminal: the recommendation and the top three concerns.

## Done criteria

- ≥ 5 sources captured under `data/route_intel/`, all dated after 2026-03-01.
- `docs/ROUTE_CONDITIONS.md` exists and ends in DRIVE / HOLD / POSTPONE.
- A one-screen terminal summary.

## Stop conditions

- If you find no source after 30 minutes of search, stop, write `ROUTE_CONDITIONS.md` saying "no recent intel — rely on Pokhara local enquiry on 2026-05-13", and exit.
- If 3+ sources independently report the road is closed, write `POSTPONE` and surface the alternate plan: skip Mustang, use the freed days for Bandipur or Chitwan.
