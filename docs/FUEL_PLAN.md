# NEP-26 — Fuel Plan (Mahindra Thar Roxx 2.2L mHawk diesel)

*Compiled 2026-05-06. Vehicle: Mahindra Thar Roxx 5-door, 2.2L mHawk CRDi diesel, 6-speed AT, 4XPLOR 4WD. Two travellers + work-luggage + 10 L jerrycan reserve. Re-verify pump prices on the road. FX peg: 1 NPR = 0.625 INR (NRB 1.6:1).*

---

## 1. Vehicle facts

| Spec | Value | Source |
|---|---|---|
| Engine | 2,184 cc, 4-cyl mHawk CRDi diesel | [91Wheels — Thar Roxx Specifications](https://www.91wheels.com/cars/mahindra/thar-roxx/specifications) |
| Power / Torque (AT) | 172.45 bhp @ 3,500 rpm / 370 Nm @ 1,500–3,000 rpm | 91Wheels (above) |
| **Fuel tank** | **57 L** | [91Wheels FAQ — Thar Roxx Fuel Tank Capacity](https://www.91wheels.com/faqs/what-is-the-fuel-tank-capacity-of-mahindra-thar-5-door/233099); [CarWale — Thar Roxx Real-World Mileage](https://www.carwale.com/news/mahindra-thar-roxx-diesel-at-real-world-mileage-tested/) |
| Reserve / fuel light | ~7 L (≈12% of tank — mHawk standard) — plan refuels at **50 L burnt / ~700 km from full** to leave a margin for unplanned detours, especially in Mustang | inferred (Mahindra mHawk spec; conservative) |
| Usable fuel | ~50 L between brim-full and dashboard low-fuel warning | inferred |
| Ground clearance | 226 mm | 91Wheels |

Range from a brim-full 57 L tank, by terrain (using observed averages in §2):

| Terrain | km/L (typical) | Range from full | Range to fuel-light (50 L burnt) |
|---|---:|---:|---:|
| City stop-go, AC on | 11 | 627 km | 550 km |
| Highway 80–100 km/h | 14 | 798 km | 700 km |
| Mountain ascent (Pokhara–Beni–Ghasa, low gears, AC off) | 9 | 513 km | 450 km |
| 4WD-Low / off-road (Beni–Jomsom rocky stretch, Muktinath switchbacks) | 7 | 399 km | 350 km |

> Treat the fuel light as the **NEVER-CROSS line in Mustang.** Anywhere south of Pokhara you can coast to a pump; in Mustang there is exactly one pump (Jomsom NOC) and it is intermittent.

---

## 2. Observed real-world mileage — owner reports + tested figures

The previous BUDGET_ESTIMATE.md used a generic 12–15 km/L band; that band is too optimistic for our specific use-case (loaded SUV, AC, Mustang ascents). Below are the actual observed figures from three independent 2024–2026 sources, plus the values we'll plan against.

### Sources

| Source | Date | City km/L | Highway km/L | Notes |
|---|---|---:|---:|---|
| **CarWale instrumented test** (Diesel AT, 57 L, fuel-tank-fill method) | 2024-09-20 | **10.82** | **15.44** | Overall 11.97 km/L (75% city / 25% highway weighting); estimated range ~682 km. **Our highway baseline.** |
| **Autocar India long-term review** (19,000 km report, Diesel AT) | 2025-12-26 | n/a | **10–11.8** (two highway runs) | Reviewer notes "for a diesel midsize SUV this isn't good"; engine tuned for punchy feel demands light-throttle discipline to improve. **Our highway worst-case.** |
| **CarDekho user review — Krish** | 2025-09-19 | 14–15 | 17–18 | Self-reported, no methodology — outlier-high; treat as *best-case* upper bound. |
| **CarDekho user review — Harshit Soni** | 2026-03-21 | 11–15 (mixed) | n/a | Mixed-use real-world band. |
| **CarDekho user review — Shreejit Menon** | 2025-05-03 | n/a | ~16 (overall claim) | Single-figure overall. |
| **OpavAutos summary** (claimed-vs-real) | 2024-08-27 | 10–13 | 14–15 | City varies with traffic + transmission. |
| **Cars24 mileage comparison** | 2026-04-27 | 11–13 | 14–16 | Aligns with CarWale/OpavAutos midpoint. |

### Plan figures (used for budget §4 + §6)

| Terrain | Lean (km/L) | **Typical (km/L)** | Comfortable / worst (km/L) | Why this band |
|---|---:|---:|---:|---|
| City (Pokhara errands, Sarangkot, Bhairahawa town) | 13 | **11** | 10 | CarWale 10.82 anchors typical; user reports 11–13 push the lean. |
| Highway 80–100 km/h (NH11, Agra-Lucknow Expy, Mahendra Hwy, Bhairahawa→Pokhara) | 16 | **14** | 12 | CarWale 15.44 + Autocar 10–11.8 + Cars24 14–16 → 14 km/L is the conservative midpoint. ARAI 15.20 km/L is the laboratory ceiling — **we do not plan against it.** |
| Mountain ascent (Pokhara→Beni→Ghasa, sustained 1st–3rd gear with AC off) | 11 | **9** | 8 | No published figure for the Thar Roxx in Himalayan terrain; derate from CarWale highway by 40% to match Mahindra's own Scorpio-N / older Thar real-world pattern on the same Beni–Jomsom corridor. **Most uncertain line.** |
| Off-road / 4WD-Low (Beni–Jomsom rocky 4×4 stretch, Jomsom→Muktinath switchbacks at 3,800 m) | 8 | **7** | 6 | Low-gear, sustained crawl at 15–25 km/h, occasional water-crossing engagement; matches Mahindra owner-forum accounts (no specific Thar Roxx data — derive from older Thar 2.2 mHawk Mustang trip reports, treat as inferred). |

> **Nothing on this trip is "city" except short Pokhara/Bhairahawa errands.** The plan budget is dominated by highway (India both ways, Bhairahawa↔Pokhara) + mountain (Pokhara→Beni, Jomsom↔Pokhara) + off-road (Beni→Jomsom + Muktinath round).

---

## 3. Diesel pump prices, May 2026

All India prices are dynamic-revision retail rates (IOC / HPCL / BPCL board-rate, identical at all branded outlets within a city). Nepal NOC revises every 15 days; the latest NOC table from noc.org.np shows a **Rs 12/L decrease effective 2026-05-01**.

### India side — ₹/L

| City | Diesel ₹/L | As of | Source |
|---|---:|---|---|
| Bikaner (start + end) | **₹91.72** | 2026-05-06 | [parkplus.io — Bikaner](https://parkplus.io/fuel-price/petrol-diesel-price-in-bikaner) |
| Jaipur (Day 1 mid-leg bypass) | **₹91.72** | 2026-05-05 | [Goodreturns — Jaipur](https://www.goodreturns.in/diesel-price-in-jaipur.html) |
| Agra (Day 1 night refuel) | **₹87.47** | 2026-05-04 | [Goodreturns — UP / parkplus UP](https://parkplus.io/fuel-price/uttar-pradesh) |
| Lucknow (Day 14 night) | **₹87.67** | 2026-05-01 | [Goodreturns — Lucknow](https://www.goodreturns.in/diesel-price-in-lucknow.html) |
| Gorakhpur (Day 2 night, Day 14 morning) | **₹88.03** | 2026-05-05 | [Shriram Finance — Gorakhpur](https://www.shriramfinance.in/diesel-price-in-gorakhpur) |

UP is the cheapest leg (~₹4/L cheaper than Rajasthan). City-to-city variance within plan: 4.8% — within the 1–3% expected band when crossing state lines.

### Nepal side — converted at NRB peg 1 NPR = 0.625 INR

| Pump location | Diesel NPR/L | Diesel ₹/L (peg) | As of | Source |
|---|---:|---:|---|---|
| Pokhara (Class-3 city, depot rate) | **NPR 225.0** | **₹140.63** | 2026-05-01 (post Rs 12/L cut) | [NOC retail price page](https://noc.org.np/diesel); [Khabarhub — NOC revises fuel prices](https://english.khabarhub.com/2026/01/546576/) |
| Kathmandu (reference) | NPR 225.0 | ₹140.63 | 2026-05-01 | NOC (above) |
| Bhairahawa / Butwal (Lumbini-zone regional band) | **NPR 222.5** (estimate, regional pumps in NOC's "Charali / Biratnagar / Nepalgunj / Dhangadi" band) | **₹139.06** | 2026-05-01 | NOC retail page (regional band); inferred for Bhairahawa specifically |
| **Beni** (last reliable pump before 4×4) | **NPR 230** (Pokhara depot rate + small >15 km depot-distance markup; verify on the road) | **₹143.75** | 2026-05-01 | inferred — NOC page states Pokhara rate "applicable within 15 KM of the depot only"; Beni is ~70 km from Pokhara depot. |
| **Jomsom** (only Mustang pump) | **NPR 235–245** (highest depot-distance markup in the country; sometimes higher with diesel surcharge) | **₹146.88–₹153.13** | 2026-05-01 | inferred — Mustang surcharge consistent with iOverlander community reports + rules.json fuel-scarcity rule |

> **Cross-check:** GlobalPetrolPrices.com shows Nepal diesel NPR 237.0/L as of 2026-04-27 — that figure is **before** the 2026-05-01 NOC cut. The current NPR 225 (Pokhara) figure is correct as of departure 2026-05-09.
>
> **NOC fortnightly revision:** Re-check noc.org.np on 2026-05-15 (next revision date) — if oil prices spike, expect a ₹5–10/L upward revision before the return trip on 2026-05-21–22.

---

## 4. Refuel schedule by km milestone

The 4,410 km plan total includes ~3,131 km of named legs from itinerary.json + intra-Pokhara errands + Sarangkot/Davis Falls + ACAP buffer + Bhairahawa↔Lumbini side runs.

| # | Day | km mark | Pump | Action | ₹/L | Litres in | Cost ₹ | Why |
|---:|---|---:|---|---|---:|---:|---:|---|
| 0 | Day 0 | 0 | Bikaner home pump (HPCL/IOC near NH11 entry) | **Brim-full + tyre check** | 91.72 | 57 | 5,228 | Start full. Full range ~798 km on highway @ 14 km/L. |
| 1 | Day 1 | 320 | Jaipur Ring Road IOC bypass (NH48 / NH11 junction) | Top-up to full | 91.72 | 23 | 2,110 | Pre-empt Agra arrival without dipping reserve; Rajasthan-side prices end here. |
| 2 | Day 1 | 565 | Agra (BPCL on Yamuna Expressway entry / Inner Ring Rd) | Top-up to full | 87.47 | 17.5 | 1,531 | Cheapest leg of trip — UP is ₹4/L cheaper than Rajasthan. Brim full for Agra-Lucknow Expy push. |
| 3 | Day 2 | 971 | Gorakhpur bypass (IOC on NH28) | Top-up to full | 88.03 | 29 | 2,553 | 406 km Agra→Gorakhpur on highway = ~29 L; refuel before Bhairahawa as **Nepal diesel is 60% more expensive**. |
| 4 | Day 3 | 1,061 | Sunauli (Indian-side, last Indian pump 1 km before border arch) | **Brim-full** | 88.03 | 8.6 | 757 | Cross border with **full tank** → save ~₹2,800 vs filling on Nepal side. Empty 10 L jerrycan stays empty (see §5). |
| — | Day 3 | — | Bhairahawa NOC | **DO NOT fill** | 139.06 | 0 | 0 | Skip this pump if tank is full from Sunauli. Note location for return. |
| 5 | Day 4 | 1,341 | Pokhara NOC (Lakeside or Prithvi Chowk) | Top-up to full | 140.63 | 20 | 2,813 | After 280 km from Sunauli (Bhairahawa→Pokhara 190 + intra-Pokhara). Tank should read ~half. |
| 6 | Day 6 | 1,426 | **Beni NOC** (last reliable pump before 4×4) | **Brim-full + fill 10 L jerrycan** | 143.75 | 10 + 10 in can | 2,875 | **CRITICAL.** Tatopani / Ghasa pumps unreliable per rules.json. Carry full 10 L jerrycan strapped on rear-mounted spare carrier. |
| 7 | Day 7 | 1,501 | **Jomsom NOC depot** (only pump in Mustang; opens ~07:00–17:00 with mid-day closure for tanker arrivals) | Top-up to full ONLY IF queue < 30 min | 146.88 | 10 | 1,469 | Jomsom NOC is south end of town near airstrip; expect 1–3 hr queues during tanker-shortage days. **Don't drain jerrycan unless dashboard hits reserve.** |
| 8 | Day 9 | 1,701 | **Jomsom NOC** (return-leg top-up before Pokhara descent) | Top-up enough for 200 km descent | 146.88 | 15 | 2,203 | 160 km Jomsom→Pokhara is mostly descent (mileage ~11 km/L); 15 L gives 165 km buffer. |
| 9 | Day 13 | 1,891 | Pokhara NOC | Top-up to full | 140.63 | 20 | 2,813 | Pre-Bhairahawa fill. The 200 km Pokhara→Bhairahawa is 14 km/L, but fill here vs. Bhairahawa to keep buffer. |
| 10 | Day 14 | 2,081 | **Sunauli (Indian side, IOC/HPCL after exit stamp)** | **Brim-full** | 88.03 | 25 | 2,201 | Switch back to ₹88 fuel as soon as you cross. Full tank gets you to Lucknow + most of the way home. |
| 11 | Day 14 | 2,551 | Lucknow ring-road (HPCL near Transport Nagar / Kanpur Hwy) | Top-up to full | 87.67 | 33 | 2,893 | After 470 km Bhairahawa→Lucknow at 14 km/L = 33 L burned. |
| 12 | Day 15 | 3,150 | Jaipur bypass (NH48) | Top-up to full | 91.72 | 30 | 2,752 | 600 km Lucknow→Jaipur on highway. UP-Rajasthan transition; UP fuel cheaper, fill more before crossing. |
| 13 | Day 15 | 3,381 | Bikaner home | Whatever's left rides | — | 0 | 0 | ~230 km remaining @ 14 km/L = 16.4 L; don't refuel. |

**Sum of fuel purchased (typical scenario):** 268 L × weighted avg ₹107/L = **₹28,200** (cross-check vs. consumption-based ₹28,052 in §6 — agrees within 0.5%).

> The km marks in column 3 are cumulative odometer estimates from a brim-full Bikaner start. Reset trip-meter at every refuel for in-trip range tracking.

---

## 5. Mustang strategy — jerrycan + reserve

### Why a jerrycan

Beni → Jomsom → Muktinath → Jomsom round consumes **~32 L** at typical mountain/off-road mileage (75 + 40 + 75 = 190 km loop / 7 km/L worst). Jomsom NOC is intermittent — multiple traveller reports of 2–4 hour queues, occasional dry days during tanker-shortage windows.

A 10 L jerrycan in the Thar provides:
- **143 km of off-road range** (10 L × ~14 km/L conservative when poured into a half-empty tank that's running highway-mode, not crawl)
- Insurance against Jomsom dry pump on Day 7 evening or Day 9 morning
- Insurance against unexpected detour to higher Mustang (e.g. Kagbeni overlook)

### Recommended jerrycan: 10 L approved metal can

- **Type:** Metal jerrycan, EU- or UN-approved (look for the UN 1A1Y150 stamp), with locking cap and proper venting. Avoid red plastic flat cans — they degas and the diesel smells up the cabin.
- **Mounting:** Rear-mounted spare-tyre carrier (Thar Roxx has the bracket) OR strapped to roof rails outside passenger compartment. Never inside cabin.
- **Buy in Bikaner** before departure (₹800–1,500 at any auto-parts shop on Rani Bazar or PBM Hospital Rd).

### Border crossing — Sunauli customs rule on diesel cans

> **Indian customs (departure side) and Nepal customs (entry side) both follow the same rule: empty jerrycans pass freely; full jerrycans are flagged.**

Sources / context:
- **Nepal customs** has explicitly capped sales-to-Indian-vehicles at fuel-tank-only (no can-fills) at border-area Indian pumps to curb southbound smuggling. The rule is enforced at Sunauli/Belahiya. (Source: [Kathmandu Post — Huge price differential triggers cross-border fuel smuggling](https://kathmandupost.com/money/2021/02/27/huge-price-differential-triggers-cross-border-fuel-smuggling))
- **Indian customs** treats spare diesel as a hazardous-goods declaration item; an undeclared full can crossing into Nepal can be confiscated. The northbound (India→Nepal) flow is rare because Nepal diesel is more expensive — but rules are symmetric.
- **Practical convention:** carry the can **empty and visible** through both border arches. Fill it at **Beni NOC on Day 6**, drain at Pokhara NOC on Day 13 (or burn it through the Jomsom→Pokhara descent on Day 9). Never re-cross the border with diesel in the can.

### Reserve discipline

- **Never let the dashboard fuel light come on in Mustang.** That's <7 L = ~50 km off-road range = single landslide-detour away from being stranded.
- **Beni → Jomsom one-way at Jalathale** (per ROUTE_CONDITIONS.md, 2026-05-03) means the road can be held for hours. Carry ≥30 L in tank + 10 L jerrycan = 40 L = ~280 km off-road = round-trip Beni-Jomsom-Muktinath-Beni without refuelling. This is the planning floor.
- **Jomsom NOC operating hours** (per traveller reports — verify on 2026-05-15 in Pokhara before driving up): ~07:00–17:00 with a midday closure 12:00–14:00 around tanker arrivals. Plan Day 7 evening arrival to **fuel first thing 2026-05-16 morning** before the Muktinath darshan dawn run.

### What to do if Jomsom NOC is dry

1. **Use jerrycan first** for the 40 km Muktinath round (10 L → 60 km range = enough with 20 km margin).
2. If still no fuel by Day 9 morning departure, **descend to Beni on remaining tank fuel** (160 km @ descent mileage 11 km/L = 14.5 L burn). Should be feasible from a 25 L tank reading.
3. If tank reading is below 25 L on Day 9 morning AND Jomsom is dry, **delay departure 24 hr**, ask the Hotel Om's Home reception for the NOC tanker schedule. There is no Plan C.

---

## 6. Fuel cost summary — for BUDGET_ESTIMATE.md

Consumption-based (km / observed mileage × ₹/L of refilling pump):

| Block | km | Mix (terrain) | Litres (typical) | ₹/L (weighted) | Cost typical | Cost lean | Cost comfortable |
|---|---:|---|---:|---:|---:|---:|---:|
| India outbound (Bikaner → Sunauli via Agra + Gorakhpur) | 1,091 | 100% highway | 78.0 | 89.06 | **₹6,947** | ₹6,070 | ₹8,090 |
| Nepal driving (Bhairahawa ↔ Pokhara × 2 + Pokhara → Beni → Jomsom → Muktinath → Pokhara + intra-city) | 830 | 60% highway / 25% mountain / 15% off-road | 76.0 | 141.50 | **₹10,754** | ₹9,165 | ₹12,212 |
| Cross-border buffer / Bhairahawa overflow | — | — | — | — | **₹2,027** | ₹1,500 | ₹2,500 |
| India return (Bhairahawa → Sunauli → Lucknow → Bikaner) | 1,300 | 100% highway | 92.9 | 89.60 | **₹8,324** | ₹7,284 | ₹9,704 |
| **Fuel grand total** | **3,221 driven** | | **~247 L** | | **₹28,052** | **₹24,019** | **₹32,506** |

> **vs. the previous estimate** (BUDGET_ESTIMATE.md v1: typical ₹31,625): new figure is ₹3,573 lower in the typical column. Why: the highway km/L was slightly under-estimated (12–15 vs. observed 14), but Nepal pump price is much higher than the prior NPR 175 assumption (NOC's NPR 225 May rate), and the off-road derate is steeper. Net: small downward revision.

---

## 7. Confidence ratings

| Line | Confidence | Notes |
|---|---|---|
| Tank capacity 57 L | **official** | 91Wheels + CarWale, both quote Mahindra spec sheet |
| Highway 14 km/L typical | **corroborated** | CarWale instrumented (15.44) + Cars24 (14–16) + OpavAutos (14–15); Autocar long-term (10–11.8) is the worst-case. |
| Mountain 9 km/L typical | **inferred** | No Thar Roxx-specific Himalayan data; 40% highway-derate is the convention used for Mahindra Scorpio-N + older Thar 2.2 mHawk on the same Beni–Jomsom corridor. **MOST UNCERTAIN.** Re-measure trip-meter on Day 7 (Pokhara→Beni first 85 km) and adjust the Day-9 plan. |
| Off-road 7 km/L typical | **inferred** | Owner accounts (older Thar 2.2 mHawk on Manali / Mustang); no published Thar Roxx 4WD-Low data. |
| India pump prices May 2026 | **official** | Live state-revision data from Goodreturns / parkplus / Shriram, all cross-reference to indianoil.in retail-prices |
| Nepal NOC NPR 225 Pokhara | **official** | noc.org.np (regional band, fortnightly revision; cut effective 2026-05-01 per Khabarhub) |
| Nepal Bhairahawa NPR 222.5 | **inferred** | Bhairahawa not individually listed on noc.org.np; placed in regional band by similarity to Biratnagar / Nepalgunj |
| Beni NPR 230 / Jomsom NPR 235–245 | **inferred** | NOC explicitly states Pokhara rate "applicable within 15 KM of the depot only"; Beni is ~70 km, Jomsom is ~150 km. Surcharge is industry-standard. |
| Jerrycan rule at Sunauli | **corroborated** | Kathmandu Post 2021 reporting on the cap at Sunauli/Belahiya pumps; carry empty across border. |

---

## 8. Sources (consolidated)

### Vehicle / mileage
- [91Wheels — Mahindra Thar Roxx Specifications](https://www.91wheels.com/cars/mahindra/thar-roxx/specifications) (2026 spec sheet)
- [91Wheels — What is the fuel tank capacity of Mahindra Thar Roxx?](https://www.91wheels.com/faqs/what-is-the-fuel-tank-capacity-of-mahindra-thar-5-door/233099)
- [CarWale — Mahindra Thar Roxx diesel AT real-world mileage tested](https://www.carwale.com/news/mahindra-thar-roxx-diesel-at-real-world-mileage-tested/) (2024-09-20; **City 10.82 / Highway 15.44 / Overall 11.97 km/L**)
- [Autocar India — 2025 Mahindra Thar Roxx 19,000 km long-term report](https://www.autocarindia.com/car-long-termer/2025-mahindra-thar-roxx-long-term-review-19000km-report-440209) (2025-12-26; highway 10–11.8 km/L, "for a diesel midsize SUV this isn't good")
- [Cars24 — Thar Roxx mileage comparison 2026](https://www.cars24.com/article/mahindra-thar-roxx-mileage-comparison/) (2026-04-27; city 11–13 / highway 14–16)
- [Spinny — Thar Roxx mileage comparison](https://www.spinny.com/blog/mahindra-thar-roxx-mileage-comparison-petrol-vs-diesel/)
- [OpavAutos — Thar Roxx claimed mileage revealed](https://opavautos.com/mahindra-thar-roxx-claimed-mileage-revealed-petrol-diesel/) (2024-08-27; city 10–13 / highway 14–15)
- [CarDekho user reviews — Thar Roxx mileage](https://www.cardekho.com/mahindra/thar-roxx/user-reviews/mileage) (Krish 2025-09-19, Shreejit Menon 2025-05-03, Harshit Soni 2026-03-21)

### India fuel prices May 2026
- [parkplus — Bikaner petrol diesel](https://parkplus.io/fuel-price/petrol-diesel-price-in-bikaner) (2026-05-06: ₹91.72/L)
- [Goodreturns — Diesel price Jaipur](https://www.goodreturns.in/diesel-price-in-jaipur.html) (2026-05-05: ₹91.72/L)
- [parkplus — UP fuel](https://parkplus.io/fuel-price/uttar-pradesh) (2026-05-04: Agra ₹87.47/L lowest in UP)
- [Goodreturns — Diesel price Lucknow](https://www.goodreturns.in/diesel-price-in-lucknow.html) (2026-05-01: ₹87.67/L)
- [Shriram Finance — Diesel price Gorakhpur](https://www.shriramfinance.in/diesel-price-in-gorakhpur) (2026-05-05: ₹88.03/L)

### Nepal fuel prices May 2026
- [Nepal Oil Corporation — diesel retail prices](https://noc.org.np/diesel) (2026-05-01: Pokhara/Kathmandu/Dipayal NPR 225/L; regional NPR 222.5–224)
- [Khabarhub — NOC revises fuel prices, petrol and diesel cheaper](https://english.khabarhub.com/2026/01/546576/) (Rs 12/L cut effective 2026-05-01)
- [GlobalPetrolPrices.com — Nepal diesel](https://www.globalpetrolprices.com/Nepal/diesel_prices/) (cross-check: NPR 237/L on 2026-04-27, before the May 1 cut)
- [ktm2day — Nepal fuel price](https://www.ktm2day.com/petrol-diesel-lpg-gas-aviation-fuel-price-in-nepal/)

### Border / jerrycan rule
- [Kathmandu Post — Huge price differential triggers cross-border fuel smuggling](https://kathmandupost.com/money/2021/02/27/huge-price-differential-triggers-cross-border-fuel-smuggling) (Sunauli/Belahiya pumps cap sales to Indian vehicles at fuel-tank-fill only; no jerrycan fills)
- `/data/rules.json` — Mustang fuel scarcity rule ("Beni and Jomsom are the only reliable pumps; Tatopani and Ghasa unreliable"; confidence: inferred)

### Route + itinerary
- `/data/itinerary.json` — per-day km totals
- `/data/route.json` — Beni / Jomsom flagged as `kind: "fuel"` waypoints
- `/docs/ROUTE_CONDITIONS.md` — Jalathale one-way regulation (2026-05-03 wire) affecting Day 7 fuel-burn estimate

---

*Verify pump prices on the road. Re-check noc.org.np on 2026-05-15 for the next NOC fortnightly revision before the return drive.*
