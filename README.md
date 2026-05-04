# NEP-26 · Nepal Workation 2026 — Expedition Dossier

[![Verify by](https://img.shields.io/badge/verify%20rules%20by-2026--05--08-orange)](docs/RULES_CHANGE_REPORT.md)
[![Depart](https://img.shields.io/badge/depart-2026--05--09-blue)](docs/ITINERARY.md)
[![Route](https://img.shields.io/badge/road-DRIVE-green)](docs/ROUTE_CONDITIONS.md)
[![Vehicle](https://img.shields.io/badge/rig-Mahindra%20Thar%20Roxx-c8552a)](docs/AUTHORIZATION_LETTER_TEMPLATE.md)

A 14-night Himalayan workation: **Bikaner → Sunauli → Pokhara → Beni → Jomsom → Muktinath → home** in a firm-registered Mahindra Thar Roxx. ~4,410 km round-trip, well inside Nepal's 30-day cumulative cap for Indian-registered vehicles.

**Project callsign:** `NEP-26`. Use this everywhere — repo name, branch prefixes, internal docs, the dossier bezel on the website.

---

## Site

Open `website/index.html` directly (`file://`) — the site is fully static, no server needed. The new dossier nav links every page.

| URL | What it is |
|-----|------------|
| `index.html` | The poster entry — full-bleed Muktinath hero, T-minus countdown, three CTAs, 15-day timeline, rules snapshot |
| `agent.html` | **Trail Comms** — offline-friendly chat travel manager (rules-engine, no API key) |
| `map.html` | **Route Atlas** — Leaflet + OpenTopoMap with custom SVG markers, elevation profile sidebar, day timeline |
| `gallery.html` | **Waypoints** — masonry gallery + click-to-expand lightbox, filter chips |
| `itinerary.html` · `checklist.html` · `rules.html` · `route.html` | The original tabular reference pages (human-curated) |
| `viewer.html` | In-browser markdown viewer for everything under `docs/`, `plans/`, `claude-code/` |
| `folders.html` | File-system index card |

To put it online:

```bash
cd /Users/sunny/mine/trips/NEPAL-2026
git init && git add . && git commit -m "NEP-26 initial"
gh repo create nep-26 --public --source=. --push
# In repo Settings → Pages → Source: GitHub Actions
# .github/workflows/deploy.yml will pick it up.
```

GitHub Pages will serve the site at `https://<your-username>.github.io/nep-26/`.

---

## Layout

```
NEP-26/
├── README.md                      ← you are here
├── .github/workflows/deploy.yml   ← Pages deploy CI
│
├── docs/                          HUMAN-CURATED markdown
│   ├── MASTER_CHECKLIST.md        11-section, 98+ item checklist
│   ├── ITINERARY.md               day-by-day table
│   ├── NEPAL_RULES_2026.md        narrative rules
│   ├── AUTHORIZATION_LETTER_TEMPLATE.md
│   ├── RULES_CHANGE_REPORT.md     diff vs prior baseline
│   ├── ROUTE_CONDITIONS.md        Beni–Jomsom drive/hold/postpone (DRIVE)
│   ├── HOTELS_SHORTLIST.md        7-city candidate set
│   └── UI_REFERENCE_BRIEF.md      v2 UI design research
│
├── data/                          STRUCTURED data — drives the website
│   ├── rules.json                 19 rules, 8 emergencies, sourced
│   ├── rules.prior.json           snapshot from before the refresh
│   ├── rules.fetch_log.json       83 entries with sha256
│   ├── rules.raw/                 83 raw HTML/text snapshots
│   ├── itinerary.json             15-day schedule (don't hand-edit)
│   ├── checklist.json             checklist categories (don't hand-edit)
│   ├── hotels.json                23 hotel candidates × 7 cities
│   ├── route.json                 15 waypoints + Beni–Jomsom recommendation
│   └── route_intel/               raw beni–jomsom news/forum scrapes
│
├── website/                       LOCAL static site
│   ├── index.html                 dossier entry
│   ├── agent.html, map.html, gallery.html
│   ├── itinerary.html, checklist.html, rules.html, route.html
│   ├── viewer.html, folders.html
│   ├── css/{rugged,landing,style}.css
│   └── js/{data,route-data,enhance,agent,map,gallery,landing,app,docs}.js
│
├── plans/                         user's personal trip-planning space
├── pics/                          drop /pics/<id>.jpg to override placeholders
├── repos/                         (empty) for trip-side work code
│
└── claude-code/                   tandem-coordination dir (see HANDOFF.md)
    ├── README.md                  operating manual
    ├── HANDOFF.md                 live cowork ↔ claude-code coordination
    ├── context/                   trip-overview, constraints, schemas, glossary, firm-paperwork
    ├── playbooks/                 01-refresh-rules · 02-route-conditions · 03-hotels-shortlist
    ├── prompts/                   ready-to-paste user messages
    └── outputs/                   scratchpad
```

---

## Trip vitals

| Field | Value |
|---|---|
| Project callsign | **NEP-26** |
| Depart | Saturday **2026-05-09** from Bikaner |
| Return | Saturday **2026-05-23** to Bikaner |
| Nights | 14 (15 days on the road) |
| Distance | ~4,410 km RT |
| Permit days | ~18 of Nepal's 30-day cap |
| Vehicle | Mahindra Thar Roxx (Thar Digital Services — firm-registered) |
| Travellers | 2 |
| High point | Muktinath (3,800 m) |

---

## Re-verify before departure

The rules snapshot in `data/rules.json` was refreshed on 2026-05-04. Re-run [`claude-code/playbooks/01-refresh-rules.md`](claude-code/playbooks/01-refresh-rules.md) on **2026-05-08** to confirm Bhansar / Yatayat fees and the embassy phone before crossing Sunauli on 2026-05-11.

---

## Credits

- Site + data orchestrated as a Cowork × Claude Code tandem; coordination log in [`claude-code/HANDOFF.md`](claude-code/HANDOFF.md).
- Map tiles © OpenStreetMap contributors / OpenTopoMap.
- Reference photos via Wikimedia Commons (public domain).
- Type: Bebas Neue, Inter, JetBrains Mono via Google Fonts.
- Icons: Lucide.
- Source-of-truth for the data: `.gov.np` pages + Indian Embassy Kathmandu + reputable secondary news; full audit in `data/rules.fetch_log.json`.
