# Workspace layout

The repo root is `/Users/sunny/mine/trips/NEPAL-2026`. Treat all paths in plans and prompts as relative to this root unless otherwise stated.

```
NEPAL-2026/
├── README.md                              (workspace root readme — may be absent; create if useful)
│
├── docs/                                  HUMAN-CURATED MARKDOWN — do not edit unless instructed
│   ├── MASTER_CHECKLIST.md                The 11-section, 98-item checklist
│   ├── NEPAL_RULES_2026.md                Narrative rules reference
│   ├── ITINERARY.md                       Day-by-day table
│   └── AUTHORIZATION_LETTER_TEMPLATE.md   For the firm-registered Thar Roxx
│
├── data/                                  STRUCTURED DATA — refresh per plan
│   ├── checklist.json                     don't edit
│   ├── itinerary.json                     don't edit
│   ├── rules.json                         REFRESH this in plan 01
│   ├── rules.prior.json                   created by plan 01 as snapshot
│   ├── rules.fetch_log.json               created by plan 01
│   └── rules.raw/                         created by plan 01 — raw HTML + extracts
│
├── pics/                                  empty; user fills with trip photos
├── repos/                                 empty; user backs up work code here
├── plans/                                 USER'S PERSONAL TRIP-PLAN DIR — DO NOT WRITE HERE
│   └── ...                                contingencies, deliverables, budget, packing strategy etc.
│
├── website/                               LOCAL STATIC SITE — viewable by opening index.html
│   ├── index.html  itinerary.html  checklist.html  rules.html  route.html  folders.html
│   ├── css/style.css
│   └── js/
│       ├── data.js                        REGENERATE from /data/*.json after any data refresh
│       └── app.js                         pure rendering, no edits needed
│
└── claude-code/                           THIS DIR — instructions for Claude Code
    ├── README.md
    ├── context/        trip-overview · workspace-layout · data-schemas · constraints · glossary
    ├── playbooks/      01-refresh-rules · 02-route-conditions · 03-hotels-shortlist
    ├── prompts/        ready-to-paste user messages, one per playbook
    └── outputs/        scratchpad for in-progress drafts
```

## Files that are safe to write

- Anything under `data/` **except** `itinerary.json` and `checklist.json`.
- New files in `docs/` (e.g. `RULES_CHANGE_REPORT.md`, `ROUTE_CONDITIONS.md`, `HOTELS_SHORTLIST.md`).
- Anything under `claude-code/outputs/`.
- Regenerate `website/js/data.js` (the regeneration script is in `plans/01-refresh-rules.md`).

## Files that must not be edited

- `docs/MASTER_CHECKLIST.md`
- `docs/ITINERARY.md`
- `docs/AUTHORIZATION_LETTER_TEMPLATE.md`
- `data/itinerary.json`
- `data/checklist.json`
- All `website/*.html` pages
- `website/css/style.css`
- `website/js/app.js`
- **Anything under top-level `/plans/`** — that's the user's personal planning space.

If a playbook tells you to update one of these, that overrides this list — but ask the user first.
