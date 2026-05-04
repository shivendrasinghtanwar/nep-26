# claude-code/ — Operating manual for the higher-privilege agent

This directory is the briefing room for Claude Code (the desktop / terminal version with full network access). It exists because the Cowork session that built this workspace was sandboxed — it could not reach `*.gov.np` or general travel sites — so any task that requires live web access has been deferred to here.

## When to use this directory

Open Claude Code in this folder, paste a prompt from `prompts/`, and let it run. Each prompt is self-contained and will read its own context. There is **no need to summarise the trip** in your message — the prompts already pull `context/*.md` and the relevant plan from `plans/`.

```bash
cd "/Users/sunny/mine/trips/NEPAL-2026"
claude
# then paste the contents of claude-code/prompts/01-refresh-rules.md
```

## Structure

```
claude-code/
├── README.md                          ← you are here
├── context/                           ← what Claude Code should know up-front
│   ├── trip-overview.md
│   ├── workspace-layout.md
│   ├── data-schemas.md
│   ├── constraints.md
│   ├── firm-paperwork.md              ← TDS = sole prop on mom's PAN; auth-letter implications
│   └── glossary.md
├── playbooks/                         ← detailed step-by-step task specs
│   ├── 01-refresh-rules.md            ← the primary task: scrape Nepal gov sites
│   ├── 02-route-conditions.md         ← Beni–Jomsom road intel
│   └── 03-hotels-shortlist.md         ← booking research
├── prompts/                           ← ready-to-paste user messages
│   ├── 01-refresh-rules.md
│   ├── 02-route-conditions.md
│   └── 03-hotels-shortlist.md
└── outputs/                           ← Claude Code's scratch / drafts
    └── .gitkeep
```

> **Note:** the top-level `/plans/` directory at the workspace root is the **user's** personal trip-planning space (contingencies, work deliverables, budget, etc.) — not for Claude Code to write into. This dir is `claude-code/playbooks/` for that reason.

## Task priority

1. **`01-refresh-rules`** — must-do before 2026-05-08. Refreshes `data/rules.json` with live data from `customs.gov.np`, `dotm.gov.np`, `immigration.gov.np`, `ntnc.org.np`, `welcomenepal.com`. Produces a change report.
2. **`02-route-conditions`** — should-do before 2026-05-12 (the Pokhara arrival day). Scrapes recent first-hand accounts of the Beni–Jomsom 4×4 stretch.
3. **`03-hotels-shortlist`** — nice-to-have before 2026-05-07. Three candidate hotels per overnight city.

## Ground rules for Claude Code

These are repeated in `context/constraints.md`, but the gist:

- Do not edit `docs/MASTER_CHECKLIST.md`, `docs/ITINERARY.md`, `docs/AUTHORIZATION_LETTER_TEMPLATE.md`, `data/itinerary.json`, or `data/checklist.json`. They are human-curated.
- Do refresh `data/rules.json` and regenerate `website/js/data.js` when the rules pass completes.
- Trust `.gov.np` over any blog or news source. Mark conflicts in the change report.
- Respect robots.txt. Use a polite User-Agent.
- Do not commit to git unless the workspace is already a git repo and `git status` is clean before starting.

## After Claude Code finishes

The website auto-loads new data because `js/data.js` is regenerated from JSON. Open `website/index.html` and check:

- Rules page shows a fresh `lastUpdated` timestamp.
- Folders page links the new change report.
- Index page's "Re-verify on 8 May" callout is satisfied.

If Bhansar/Yatayat fees changed materially, update the **money** category of `docs/MASTER_CHECKLIST.md` to bump the INR cash floor — that is the only checklist mutation worth making post-crawl.
