# NEP-26 — Trip Cost Estimate
*Compiled 2026-05-04. Re-verify pump prices and hotel rates before booking. FX peg: 1 NPR = 0.625 INR (NRB fixed peg 1.6:1).*

## Headline grand total

| Scenario | INR | NPR equiv |
|---|---|---|
| **Lean** | ₹1,54,838 | NPR 2,47,741 |
| **Typical** | ₹1,85,876 | NPR 2,97,402 |
| **Comfortable** | ₹2,30,329 | NPR 3,68,526 |

Per-traveller (typical scenario): ₹92,938 / NPR 1,48,701.
Per-day (typical, 14 nights): ₹13,277 / NPR 21,243.

> Column convention: **Lean** = lowest plausible spend (best fuel mileage 15 km/L, low end of hotel band, sub-budget meals). **Typical** = midpoint of every band, 13.5 km/L. **Comfortable** = high end of every band, 12 km/L (worst-case mileage, top-of-band rates, fine-dining nights in Pokhara).

---

## Per-line breakdown

### Fuel — total ~4,410 km

Pump prices used (representative May 2026, **re-verify on the road**):
- India diesel ≈ **₹90/L** (range observed Apr–May 2026: ₹88–₹93)
- Nepal diesel ≈ **NPR 175/L** (NOC retail, Pokhara/Bhairahawa nozzles)

Mileage scenario: Mahindra Thar Roxx 2.2L diesel real-world **12–15 km/L** (highway-loaded, AC on, two-up + luggage).

| Leg | km | Lean (15 km/L) | Typical (13.5 km/L) | Comfortable (12 km/L) |
|---|---:|---:|---:|---:|
| India outbound (Bikaner→Agra→Gorakhpur) | 1,330 | ₹7,980 | ₹8,867 | ₹9,975 |
| Nepal (Sunauli↔Pokhara↔Mustang loop) | 1,550 | NPR 18,083 (≈₹11,302) | NPR 20,093 (≈₹12,558) | NPR 22,604 (≈₹14,128) |
| India return (Sunauli→Lucknow→Bikaner) | 1,530 | ₹9,180 | ₹10,200 | ₹11,475 |
| **Fuel subtotal (INR)** | **4,410** | **₹28,462** | **₹31,625** | **₹35,578** |

> Caveat: itinerary.json per-day km sums to ~3,131 km of *driving* (rest are work/leisure halts). The 4,410 figure used here matches the prompt's leg breakdown — likely includes intra-Pokhara errands, Sarangkot detours, ACAP buffer, and Bhairahawa/Lumbini side-runs. Tank up at Beni AND Jomsom (per data/rules.json — Tatopani/Ghasa pumps unreliable).

### Hotels — 14 nights, top candidate per city (data/hotels.json playbook 03 convention)

| City | Top pick | Band (INR/night) | Nights | Lean | Typical | Comfortable |
|---|---|---|---:|---:|---:|---:|
| Agra | Crystal Sarovar Premiere | 5,500–6,500 | 1 | 5,500 | 6,000 | 6,500 |
| Gorakhpur | Ramada by Wyndham | 4,000–5,000 | 1 | 4,000 | 4,500 | 5,000 |
| Bhairahawa | Tiger Palace by Soaltee | 6,500–9,000 | 2 | 13,000 | 15,500 | 18,000 |
| Pokhara | Waterfront Resort by KGH | 7,500–10,000 | 6 | 45,000 | 52,500 | 60,000 |
| Beni / Tatopani | Shrestha Hotel HotSpring | 3,500–5,000 | 1 | 3,500 | 4,250 | 5,000 |
| Jomsom | Hotel Om's Home | 6,500–8,500 | 2 | 13,000 | 15,000 | 17,000 |
| Lucknow | Lemon Tree | 4,000–5,000 | 1 | 4,000 | 4,500 | 5,000 |
| **Hotels subtotal** | — | — | **14** | **₹88,000** | **₹1,02,250** | **₹1,16,500** |

> Bhairahawa nights = 1 inbound (11 May) + 1 return (21 May) = 2. Pokhara = 12,13,17,18,19,20 May = 6 nights (4 May 12+13 base + 4 post-Mustang 17–20). All cities sourced verbatim from `data/hotels.json`. Tiger Palace and Pokhara Waterfront flagged in `redFlags` as exceeding earlier spec ceilings — kept as top candidates per the playbook-03 "first in array" rule.

### Permits & border — NPR-denominated

Source: `data/rules.json` (verbatim NPR figures where official; flagged inferred where confidence < official).

| Item | Confidence | Lean | Typical | Comfortable |
|---|---|---:|---:|---:|
| Bhansar (Customs) NPR 600/day × 18 days (with 3-day buffer per rules) | corroborated | NPR 10,800 | NPR 10,800 | NPR 10,800 |
| Yatayat (Transport) ~NPR 500/day × 18 days | inferred | NPR 8,000 | NPR 9,000 | NPR 12,000 |
| ACAP SAARC NPR 1,000/person × 2 | official | NPR 2,000 | NPR 2,000 | NPR 2,000 |
| Nepal third-party motor insurance (2 wks, SUV) | inferred | NPR 1,000 | NPR 1,250 | NPR 1,500 |
| TIMS card (NOT required for road Jomsom-Muktinath) | official | NPR 0 | NPR 0 | NPR 0 |
| SIM cards (NTC primary + Ncell backup, 2 wks data) | inferred | NPR 500 | NPR 650 | NPR 800 |
| **Permits subtotal NPR** | — | **NPR 22,300** | **NPR 23,700** | **NPR 27,100** |
| **Permits subtotal INR equiv** | — | **₹13,938** | **₹14,813** | **₹16,938** |

> Buy ACAP **online or at Pokhara counter** — at-checkpost surcharge is DOUBLE per rules.json. Bhansar: confirm NPR 600 figure at the Sunauli/Belahiya counter on 11 May (Kathmandu Post 2026-04-17 cited as source — figures vary by border post).

### Food — 2 travellers

| Block | Days | Lean (₹/NPR per day) | Typical | Comfortable |
|---|---:|---:|---:|---:|
| India side (Day 1, 2, 14, 15) | 4 | ₹1,500 → ₹6,000 | ₹2,500 → ₹10,000 | ₹4,000 → ₹16,000 |
| Nepal side (Day 3–13) | 11 | NPR 1,500 → NPR 16,500 (≈₹10,313) | NPR 2,500 → NPR 27,500 (≈₹17,188) | NPR 4,500 → NPR 49,500 (≈₹30,938) |
| **Food subtotal (INR)** | **15** | **₹16,313** | **₹27,188** | **₹46,938** |

> Comfortable column accounts for Pokhara fine-dining nights (Lakeside steakhouses, Krua Thai, OR2K) and Tiger Palace dinners. Lean assumes hotel breakfast included + simple Nepali thali/momo dinners.

### Misc / sundry — NPR

Tips, parking (Pokhara Lakeside cafes), Muktinath donations (NPR 200–500), small purchases (Tibetan crafts, prayer flags, small Annapurna-region souvenirs).

| Scenario | NPR | INR equiv |
|---|---:|---:|
| Lean | NPR 5,000 | ₹3,125 |
| Typical | NPR 8,000 | ₹5,000 |
| Comfortable | NPR 15,000 | ₹9,375 |

### Cash buffer (border emergency)

Fixed ₹5,000 INR held back across all scenarios. Use for: ad-hoc bribes/fines (defensive — none expected), broken-down toll machines, last-mile fuel if Yatayat slows the exit.

---

## Currency split (typical scenario)

Spend that hits **INR** rails (India fuel, India hotels, India food, buffer):

| Item | Typical INR |
|---|---:|
| India fuel (outbound + return) | ₹19,067 |
| India hotels (Agra, Gorakhpur, Lucknow) | ₹15,000 |
| India food (4 days) | ₹10,000 |
| Cash buffer | ₹5,000 |
| **INR-side total** | **₹49,067** |

Spend that hits **NPR** rails (Nepal fuel, Nepal hotels, permits, Nepal food, misc):

| Item | Typical NPR | INR equiv |
|---|---:|---:|
| Nepal fuel | NPR 20,093 | ₹12,558 |
| Nepal hotels (Bhairahawa, Pokhara, Beni, Jomsom) | NPR 1,39,600 | ₹87,250 |
| Permits + insurance + SIM | NPR 23,700 | ₹14,813 |
| Nepal food (11 days) | NPR 27,500 | ₹17,188 |
| Misc / sundry | NPR 8,000 | ₹5,000 |
| **NPR-side total** | **NPR 2,18,894** | **₹1,36,809** |

**Recommended cash to carry at border** (typical):
- Carry **NPR 80,000–1,00,000 in cash equivalent** (mix of crisp INR ₹100/200/500 + Nepal cash drawn at Sunauli ATM). Why: Bhansar/Yatayat counter takes cash only; Beni and Jomsom fuel pumps may not accept cards; Jomsom hotels are cash-preferred; ATMs in Jomsom are flaky per rules.json.
- The remaining ~NPR 1,30,000 of Nepal-side spend (Pokhara hotel block, Tiger Palace, big-city food) goes on **card**. Confirm Visa/MasterCard at Waterfront Pokhara before booking the 6-night block.
- **Do NOT carry INR ₹2,000 notes** — Nepal Rastra Bank ban remains (rules.json).

---

## What to lock first (≤ 7 days to depart)

1. **Pokhara 6-night block at Waterfront Resort by KGH** — biggest fixed-cost line item (~₹52,500 typical). Booking gap on this single line moves the budget more than any other. Speedtest at check-in per redFlags caveat; have Atithi as Plan B.
2. **Jomsom 2-night at Hotel Om's Home** — phone-call confirm electric blankets + working in-room heaters for both 15 + 16 May nights. Do not let blanket-only Trekkers Inn slip in as a fallback for the wife at ~5°C.
3. **Border arrival night Bhairahawa (Tiger Palace by Soaltee, 11 May)** — high-rate hotel, post-border-day decompression. If budget-strict, demote to Buddha Maya Garden (Lumbini) at ₹4,500–5,500 saving ~₹4,000–₹7,000 across the 2-night block.
4. **India side:** Crystal Sarovar Premiere Agra (9 May) → Ramada Gorakhpur (10 May) → Lemon Tree Lucknow (22 May). All sub-₹6,500/night, free secure parking confirmed for the firm-registered Roxx.

---

## Sources
- `data/rules.json` — Bhansar NPR 600/day (Kathmandu Post 2026-04-17, "corroborated"), ACAP NPR 1,000 SAARC ("official"), TIMS not required ("official"), Yatayat ("inferred"), insurance NPR 1,000–1,500 range ("inferred").
- `data/hotels.json` — candidate price bands as fetched 2026-05-04 (note: aggregator pages JS-rendered hollow — re-verify INR live before booking; aggregator gaps >30% flagged).
- `data/itinerary.json` — per-day km totals (3,131 km of named legs; the 4,410 km estimate adds intra-city + Pokhara errands + ACAP buffer + Sarangkot/Davis Falls detours).
- `data/route.json` — leg sequence + Beni–Jomsom DRIVE recommendation as of 2026-05-04.
- Public pump-price reference: indianoil.in retail-prices (India), nepaloilcorporation.com.np/retail-price (Nepal). Both **re-check 1–2 days before depart**, especially Nepal NOC fortnightly revision.

---

*This is an internal estimate. No commitments made. Lock the Pokhara block first, then Jomsom, then border-night, then India-side.*
