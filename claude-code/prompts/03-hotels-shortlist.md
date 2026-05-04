# Prompt — Hotel shortlist

Copy everything between the `===` markers and paste as your first message to Claude Code.

```
===
You are working in /Users/sunny/mine/trips/NEPAL-2026. The user needs a shortlist of three candidate hotels per overnight stop, vetted for SUV parking + work-friendly wifi (Pokhara especially). Do NOT book anything — research only.

Read these files first:
1. claude-code/README.md
2. claude-code/context/trip-overview.md
3. claude-code/context/data-schemas.md
4. claude-code/playbooks/03-hotels-shortlist.md   ← your spec
5. docs/ITINERARY.md

Required overnight stays:
- Noida 9 May (1 night)
- Gorakhpur 10 May (1 night)
- Bhairahawa/Lumbini 11 May, 21 May (2 nights, can be different hotels)
- Pokhara 12, 13, 17, 18, 19, 20 May (6 nights — same hotel preferred)
- Beni or Tatopani 14 May (1 night)
- Jomsom 15, 16 May (2 nights)
- Lucknow 22 May (1 night)

Selection criteria per stop are in claude-code/playbooks/03-hotels-shortlist.md. Pokhara needs fibre wifi ≥ 50 Mbps and 6-night availability — that is the most constrained search.

Outputs:
- data/hotels.json (schema in context/data-schemas.md)
- docs/HOTELS_SHORTLIST.md (template in claude-code/playbooks/03-hotels-shortlist.md)

Hard constraints:
- Do NOT book.
- Do NOT enter payment information anywhere.
- Do NOT create an account on any aggregator.
- Flag any aggregator price difference > 30% between Booking / MMT / Agoda as a price-watch item.
- For Jomsom, supplement Booking with iOverlander and recent travel-blog posts (dated after 2026-03-01) — Booking's Jomsom inventory is incomplete.

When done, print: total candidates, any city with fewer than 3 hits (with reason), and any availability red flags I should act on quickly.
===
```

## When to use this prompt

- Run on or after **2026-05-05** but before **2026-05-07** — Pokhara fibre rooms book out a week ahead in May.
