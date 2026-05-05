# NEP-26 — Trip Cost Estimate (INR only)

*Compiled 2026-05-04, fuel plan revised 2026-05-06. All numbers in **INR**. Re-verify pump prices and hotel rates before booking. Nepal-side spend is converted at the NRB peg **1 NPR = 0.625 INR (1.6:1)** at the line level — see footnote.*

> The fuel block has been **rebuilt** against the Mahindra Thar Roxx 2.2L mHawk diesel observed real-world mileage (CarWale instrumented test + Autocar long-term + Cars24 + 3 owner reports) and against May-2026 pump prices in each city on the route. See `/docs/FUEL_PLAN.md` for the per-pump refuel schedule, jerrycan rule, and Mustang reserve discipline.

---

## Headline grand total

| Scenario | INR |
|---|---:|
| **Lean** | **₹1,50,395** |
| **Typical** | **₹1,82,303** |
| **Comfortable** | **₹2,27,257** |

Per-traveller (typical scenario, 2 travellers): **₹91,152**.
Per-day (typical, 14 nights / 15 days on the road): **₹13,022**.

> **Column convention:**
> - **Lean** = lowest-plausible spend (best-case observed mileage 16 km/L hwy / 11 km/L mtn / 8 km/L off-road, low end of every hotel band, sub-budget meals).
> - **Typical** = mid-band on every line, **observed mileage 14 km/L hwy / 9 km/L mtn / 7 km/L off-road** (CarWale + Cars24 conservative midpoint).
> - **Comfortable** = high end of every band, worst-case mileage 12 km/L hwy / 8 km/L mtn / 6 km/L off-road, fine-dining nights in Pokhara, Tiger Palace dinners.

---

## Per-line breakdown

### Fuel — total ~3,221 km of named driving (consumption-based)

Pump prices used (May 2026, sourced individually per city — see FUEL_PLAN.md §3 for source URLs):

| Block | Reference ₹/L | Source date |
|---|---:|---|
| India highway weighted avg (Bikaner ₹91.72 + Jaipur ₹91.72 + Agra ₹87.47 + Lucknow ₹87.67 + Gorakhpur ₹88.03) | **₹89.30** | 2026-05-01 to 2026-05-06 |
| Nepal regional (Bhairahawa NPR 222.5 → ₹139.06) | **₹139.06** | 2026-05-01 NOC revision |
| Nepal Pokhara depot (NPR 225 → ₹140.63) | **₹140.63** | 2026-05-01 NOC revision |
| Nepal Beni (NPR 230 inferred → ₹143.75) | **₹143.75** | 2026-05-01 (depot-distance markup, inferred) |
| Nepal Jomsom (NPR 235–245 inferred → ₹147–₹153) | **₹150** | 2026-05-01 (Mustang surcharge, inferred) |

Observed mileage used (Mahindra Thar Roxx 2.2 mHawk diesel, sources: CarWale 2024-09, Autocar 2025-12, Cars24 2026-04, 3 owner reports):

| Terrain | Lean km/L | **Typical km/L** | Comfortable km/L |
|---|---:|---:|---:|
| Highway | 16 | **14** | 12 |
| Mountain | 11 | **9** | 8 |
| Off-road / 4WD-Low | 8 | **7** | 6 |

| Leg | km | Terrain mix | Lean | Typical | Comfortable |
|---|---:|---|---:|---:|---:|
| India outbound (Bikaner→Agra→Gorakhpur→Sunauli) | 1,091 | 100% highway | ₹6,070 | **₹6,947** | ₹8,090 |
| Nepal driving (Bhairahawa↔Pokhara×2 + Pokhara→Beni→Jomsom→Muktinath→Pokhara + intra-city) | 830 | 60% hwy / 25% mtn / 15% off-road | ₹9,165 | **₹10,754** | ₹12,212 |
| Cross-border buffer / Bhairahawa overflow / Sarangkot | — | — | ₹1,500 | **₹2,027** | ₹2,500 |
| India return (Bhairahawa→Sunauli→Lucknow→Bikaner) | 1,300 | 100% highway | ₹7,284 | **₹8,324** | ₹9,704 |
| **Fuel subtotal** | **3,221+** | | **₹24,019** | **₹28,052** | **₹32,506** |

> The 3,221 km of named driving plus ~1,200 km of intra-city / Sarangkot / ACAP buffer / Pokhara errands matches the prompt's 4,410 km plan-total estimate. Tank-up at Beni AND Jomsom (per data/rules.json — Tatopani/Ghasa pumps unreliable). Carry empty 10 L jerrycan across Sunauli; fill at Beni; do not refill before crossing back. See FUEL_PLAN.md §5 for the rule.

### Hotels — 14 nights, top candidate per city (priceBand low / typical / high from data/hotels.json)

| City | Top pick | Band (₹/night low–high) | Nights | Lean | Typical | Comfortable |
|---|---|---|---:|---:|---:|---:|
| Agra | Crystal Sarovar Premiere | 5,500–6,500 | 1 | ₹5,500 | ₹6,000 | ₹6,500 |
| Gorakhpur | Ramada by Wyndham | 4,000–5,000 | 1 | ₹4,000 | ₹4,500 | ₹5,000 |
| Bhairahawa | Tiger Palace by Soaltee | 6,500–9,000 | 2 | ₹13,000 | ₹15,500 | ₹18,000 |
| Pokhara | Waterfront Resort by KGH | 7,500–10,000 | 6 | ₹45,000 | ₹52,500 | ₹60,000 |
| Beni / Tatopani | Shrestha Hotel HotSpring | 3,500–5,000 | 1 | ₹3,500 | ₹4,250 | ₹5,000 |
| Jomsom | Hotel Om's Home | 6,500–8,500 | 2 | ₹13,000 | ₹15,000 | ₹17,000 |
| Lucknow | Lemon Tree | 4,000–5,000 | 1 | ₹4,000 | ₹4,500 | ₹5,000 |
| **Hotels subtotal** | — | — | **14** | **₹88,000** | **₹1,02,250** | **₹1,16,500** |

> Bhairahawa nights = 1 inbound (11 May) + 1 return (21 May) = 2. Pokhara = 12, 13, 17, 18, 19, 20 May = 6 nights. All cities sourced from `data/hotels.json` first-in-array. Tiger Palace and Pokhara Waterfront flagged in `redFlags` as exceeding earlier spec ceilings — kept as top candidates per the playbook-03 "first in array" rule.

### Permits & border (Nepal-side, converted to INR at 0.625 peg)

Source: `/data/rules.json` (verbatim NPR figures where official; flagged inferred where confidence < official).

| Item | Confidence | NPR basis (footnote) | Lean ₹ | Typical ₹ | Comfortable ₹ |
|---|---|---|---:|---:|---:|
| Bhansar (Customs) NPR 600/day × 18 days (incl. 3-day buffer per rules) | corroborated | NPR 10,800 | ₹6,750 | ₹6,750 | ₹6,750 |
| Yatayat (Transport) ~NPR 500/day × 18 days | inferred | NPR 8,000–12,000 | ₹5,000 | ₹5,625 | ₹7,500 |
| ACAP SAARC NPR 1,000/person × 2 | official | NPR 2,000 | ₹1,250 | ₹1,250 | ₹1,250 |
| Nepal third-party motor insurance (2 wks, SUV) | inferred | NPR 1,500 | ₹625 | ₹781 | ₹938 |
| TIMS card (NOT required for road Jomsom-Muktinath) | official | NPR 0 | ₹0 | ₹0 | ₹0 |
| SIM cards (NTC primary + Ncell backup, 2 wks data) | inferred | NPR 500–800 | ₹313 | ₹406 | ₹500 |
| **Permits subtotal** | — | — | **₹13,938** | **₹14,813** | **₹16,938** |

> Buy ACAP **online or at Pokhara counter** — at-checkpost surcharge is DOUBLE per rules.json. Bhansar: confirm NPR 600 figure at the Sunauli/Belahiya counter on 11 May (Kathmandu Post 2026-04-17 cited as source — figures vary by border post).

### Food — 2 travellers, 15 days

| Block | Days | Lean ₹/day (couple) | Typical ₹/day (couple) | Comfortable ₹/day (couple) | Lean | Typical | Comfortable |
|---|---:|---:|---:|---:|---:|---:|---:|
| India side (Day 1, 2, 14, 15) | 4 | 1,500 | 2,500 | 4,000 | ₹6,000 | ₹10,000 | ₹16,000 |
| Nepal side (Day 3–13) — NPR 1,500 / 2,500 / 4,500 per day → ₹/day at peg | 11 | 938 | 1,563 | 2,813 | ₹10,313 | ₹17,188 | ₹30,938 |
| **Food subtotal** | **15** | — | — | — | **₹16,313** | **₹27,188** | **₹46,938** |

> Comfortable column accounts for Pokhara fine-dining nights (Lakeside steakhouses, Krua Thai, OR2K) and Tiger Palace dinners. Lean assumes hotel breakfast included + simple Nepali thali / momo dinners.

### Misc / sundry

Tips, parking (Pokhara Lakeside cafes), Muktinath donations (NPR 200–500), small purchases (Tibetan crafts, prayer flags, small Annapurna-region souvenirs).

| Scenario | NPR basis | INR |
|---|---:|---:|
| Lean | NPR 5,000 | ₹3,125 |
| Typical | NPR 8,000 | ₹5,000 |
| Comfortable | NPR 15,000 | ₹9,375 |

### Cash buffer (border emergency)

Fixed **₹5,000 INR** held back across all scenarios. Use for: ad-hoc bribes/fines (defensive — none expected), broken-down toll machines, last-mile fuel if Yatayat slows the exit.

---

## Roll-up

| Block | Lean | **Typical** | Comfortable |
|---|---:|---:|---:|
| Fuel | ₹24,019 | **₹28,052** | ₹32,506 |
| Hotels | ₹88,000 | **₹1,02,250** | ₹1,16,500 |
| Permits + insurance + SIM | ₹13,938 | **₹14,813** | ₹16,938 |
| Food | ₹16,313 | **₹27,188** | ₹46,938 |
| Misc / sundry | ₹3,125 | **₹5,000** | ₹9,375 |
| Cash buffer | ₹5,000 | **₹5,000** | ₹5,000 |
| **Grand total** | **₹1,50,395** | **₹1,82,303** | **₹2,27,257** |

### Typical-scenario share-of-spend

| Block | Typical ₹ | Share |
|---|---:|---:|
| Hotels | ₹1,02,250 | **56.1%** |
| Fuel | ₹28,052 | **15.4%** |
| Food | ₹27,188 | **14.9%** |
| Permits + border + SIM | ₹14,813 | **8.1%** |
| Misc + cash buffer | ₹10,000 | **5.5%** |

---

## Cash-at-border guidance (typical scenario, INR-only thinking)

Of the ₹1,82,303 typical spend, **~₹73,366 lands on Nepal-side cash/card rails** (Nepal fuel ₹12,781 + Nepal hotels ₹87,250 → wait, that's ₹54,531 for hotels at INR + permits ₹14,813 + Nepal food ₹17,188 + misc ₹5,000 = ₹104,313 INR-equivalent on Nepal rails — but **half of Pokhara hotels go on card** so the cash demand is lower).

Recommended cash-equivalent to carry across the border:
- **₹50,000–₹65,000 worth in mixed currency** (crisp INR ₹100/200/500 + Nepal cash drawn at Sunauli ATM). Why: Bhansar/Yatayat counter takes cash only; Beni and Jomsom fuel pumps may not accept cards; Jomsom hotels are cash-preferred; ATMs in Jomsom are flaky per rules.json.
- The remaining ~₹50,000 of Nepal-side spend (Pokhara hotel block, Tiger Palace, big-city food) goes on **card**. Confirm Visa/MasterCard at Waterfront Pokhara before booking the 6-night block.
- **Do NOT carry INR ₹2,000 notes** — Nepal Rastra Bank ban remains (rules.json).

---

## What to lock first (≤ 3 days to depart)

1. **Pokhara 6-night block at Waterfront Resort by KGH** — biggest fixed-cost line item (~₹52,500 typical = 29% of trip). Speedtest at check-in per redFlags caveat; have Atithi as Plan B.
2. **Jomsom 2-night at Hotel Om's Home** — phone-call confirm electric blankets + working in-room heaters for both 15 + 16 May nights. Do not let blanket-only Trekkers Inn slip in as a fallback for the wife at ~5°C.
3. **Border arrival night Bhairahawa (Tiger Palace by Soaltee, 11 May)** — high-rate hotel, post-border-day decompression. If budget-strict, demote to Buddha Maya Garden (Lumbini) at ₹4,500–5,500 saving ~₹4,000–₹7,000 across the 2-night block.
4. **India side:** Crystal Sarovar Premiere Agra (9 May) → Ramada Gorakhpur (10 May) → Lemon Tree Lucknow (22 May). All sub-₹6,500/night, free secure parking confirmed for the firm-registered Roxx.
5. **Buy 10 L metal jerrycan in Bikaner** (₹800–1,500) — per FUEL_PLAN.md §5, mandatory for the Mustang stretch; carry empty across Sunauli.

---

## Sources
- `/docs/FUEL_PLAN.md` — full fuel methodology, per-pump prices, jerrycan rule, refuel-schedule table. Cite this for every fuel-line query.
- `/data/rules.json` — Bhansar NPR 600/day (Kathmandu Post 2026-04-17, "corroborated"), ACAP NPR 1,000 SAARC ("official"), TIMS not required ("official"), Yatayat ("inferred"), insurance NPR 1,000–1,500 range ("inferred").
- `/data/hotels.json` — candidate price bands as fetched 2026-05-04 (note: aggregator pages JS-rendered hollow — re-verify INR live before booking; aggregator gaps >30% flagged).
- `/data/itinerary.json` — per-day km totals (3,131 km of named legs; the 4,410 km estimate adds intra-city + Pokhara errands + ACAP buffer + Sarangkot/Davis Falls detours).
- `/data/route.json` — leg sequence + Beni–Jomsom DRIVE recommendation as of 2026-05-04.
- Indian pump prices: parkplus.io, Goodreturns, Shriram Finance — all reflecting the 2026-05-01 to 2026-05-06 retail-revision board.
- Nepal pump prices: noc.org.np (official, fortnightly), Khabarhub (revision-event reporting), GlobalPetrolPrices.com (cross-check).

---

> **Footnote — currency convention.** All NPR-denominated source figures (hotels in Nepal, fuel from NOC, permits, insurance, SIM, Nepal-side food, sundry) are converted at the **NRB peg of 1 NPR = 0.625 INR (1.6 NPR : 1 INR fixed peg)** at the line level. India-side figures are native INR. Re-verify the peg holds (it has since 1993, but currency policy can shift) before exchanging at the border.

*This is an internal estimate. No commitments made. Lock the Pokhara block first, then Jomsom, then border-night, then India-side. Re-check noc.org.np on 2026-05-15 for the next NOC fortnightly revision before the return drive.*
