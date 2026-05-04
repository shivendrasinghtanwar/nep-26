# Plan 03 — Hotel shortlist for the trip

**Run on or after 2026-05-05.** Earlier is better — the Pokhara fibre-equipped resorts and the Jomsom guesthouses fill up fast in May.

## Goal

Produce a vetted shortlist of three candidate hotels per overnight city, with enough information that the user can book in under 30 minutes. Do **not** book anything yourself.

## Required overnight stays

| City | Nights |
|------|--------|
| Noida (India) | 9 May |
| Gorakhpur (India) | 10 May |
| Bhairahawa or Lumbini (Nepal) | 11, 21 May |
| Pokhara (Nepal) | 12, 13, 17, 18, 19, 20 May (6 nights) |
| Beni or Tatopani (Nepal) | 14 May |
| Jomsom (Nepal) | 15, 16 May |
| Lucknow (India) | 22 May |

## Inputs you will read first

1. `claude-code/context/trip-overview.md`
2. `docs/ITINERARY.md`

## Sources

- `https://www.booking.com/`
- `https://www.makemytrip.com/`
- `https://www.agoda.com/`
- `https://www.tripadvisor.com/` (for reviews — don't book here)
- For Pokhara high-end: `https://www.tigerpalace.com/`, `https://www.radissonpokhara.com/`, `https://www.pavilionshimalayan.com/`

## Selection criteria per city

| Stop | Must-have | Nice-to-have |
|------|-----------|--------------|
| Noida | Secure parking for SUV, breakfast, ≤ INR 6,000 | Near WPE on-ramp |
| Gorakhpur | Secure parking, breakfast, ≤ INR 5,000 | Near bypass |
| Bhairahawa / Lumbini | Secure parking, ≤ INR 5,500 | Walking distance to Lumbini gate |
| Pokhara | **Fibre wifi (≥ 50 Mbps), 6-night availability, Lakeside or Pamebagar** | Lake-facing room, work-friendly desk |
| Beni / Tatopani | Secure parking, hot water | Hot-spring access (Tatopani) |
| Jomsom | Secure parking, electric blanket, breakfast | Diesel heater in room (May nights drop to 5°C) |
| Lucknow | Secure parking, breakfast, ≤ INR 5,000 | Near outer ring road |

## Output contract

```
data/
└── hotels.json              ← structured candidates (schema in context/data-schemas.md)

docs/
└── HOTELS_SHORTLIST.md      ← human-readable, what the user reads
```

### `docs/HOTELS_SHORTLIST.md` template

```markdown
# Hotels Shortlist
*Compiled <ISO date>. Prices and availability change daily — re-check before booking.*

## <City>, <check-in> → <check-out>

### Top pick — <Hotel name>
- INR <price> per night · <rating>/5 (<n> reviews)
- Why: <one sentence>
- [Open on Booking](URL) · [Hotel website](URL)

### Backup A — ...
### Backup B — ...

---

## ... next city
```

## Procedure

1. For each city, run a search on Booking.com filtered to the right dates and "free parking" + "wifi". Capture the top 3 by review score (min 8.0).
2. For Pokhara specifically, also check Tiger Palace / Radisson / Pavilions Himalayan direct sites — these high-end resorts often have better direct-rate fibre guarantees than aggregator sites.
3. For Jomsom, query iOverlander and recent travel-blog posts dated after 2026-03-01 for guesthouse names — Booking's Jomsom inventory is incomplete.
4. Record each candidate to `data/hotels.json` (schema in `context/data-schemas.md`).
5. Compose `docs/HOTELS_SHORTLIST.md` — one section per overnight stop.
6. Print to terminal: total candidates, any cities with fewer than 3 hits, any availability red flags.

## Constraints

- **Do not book**. Research only.
- **Do not enter payment information** anywhere.
- **Do not create an account** on any aggregator.
- Aggregator price differences > 30% between Booking / MMT / Agoda — flag in the shortlist as a price-watch item.

## Done criteria

- 3 candidates per city OR fewer with explanation.
- `data/hotels.json` valid JSON.
- `docs/HOTELS_SHORTLIST.md` exists and is print-ready.
- Terminal summary.
