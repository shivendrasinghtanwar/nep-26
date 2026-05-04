# Claude Code — Crawl Plan to Refresh Nepal Trip Data

**Why this exists:** the Cowork-mode session that built this trip workspace was sandboxed and could not reach `*.gov.np` or general news sites — egress was locked to package mirrors and GitHub only. Claude Code on your laptop has no such restriction. Run this plan there to live-scrape the authoritative sources and overwrite the relevant files in `/Users/sunny/mine/trips/NEPAL-2026/`.

**Goal:** produce fresh, source-attributed JSON in `data/` and a side-by-side change report in `docs/` so I can quickly see what shifted between my baseline (knowledge through May 2025 + your supplied 2026 notes) and the current ground truth.

**Run this on or after 2026-05-07** so the data is fresh for the 2026-05-09 departure.

---

## How to invoke

Open Claude Code in this directory:

```bash
cd "/Users/sunny/mine/trips/NEPAL-2026"
claude
```

Then paste the entire **"Prompt to give Claude Code"** block at the bottom of this file as your first message. It is self-contained and assumes no prior context.

---

## Target sources (priority order)

| # | Source | URL | What to extract |
|---|--------|-----|-----------------|
| 1 | Nepal Department of Customs (Bhansar) | https://www.customs.gov.np/ | Current daily Bhansar rates by vehicle category, list of accepted documents, latest circulars about Indian vehicles |
| 2 | Nepal Department of Transport Management | https://www.dotm.gov.np/ | Yatayat (transport) permit fee structure, the 30-day cumulative-cap rule for foreign vehicles, any 2026 amendments |
| 3 | Nepal Department of Immigration | https://immigration.gov.np/ | Confirmation that Indian nationals are visa-free + acceptable IDs |
| 4 | Annapurna Conservation Area Project (ACAP) / NTNC | https://ntnc.org.np/ | Current ACAP fee for SAARC vs foreigners, where the permit is issued |
| 5 | Nepal Tourism Board | https://www.welcomenepal.com/ | TIMS card rules, Mustang restricted-area permit details |
| 6 | Indian Embassy, Kathmandu | https://www.indembkathmandu.gov.in/ | Current advisory + emergency phone, OCI/Indian-citizen guidance |
| 7 | (Cross-reference) Nepal customs FAQ on hpages | search Google for "Nepal Bhansar Indian vehicle 2026 fee" — pick top 2 reputable travel-blog or news results published after 2026-01-01, only to corroborate the .gov.np data |

> **Bias rule:** when blog/news contradicts a .gov.np page, trust the .gov.np page. Note the conflict in the change-report.

---

## Output contract

Write these files. Overwrite if they exist.

```
data/
├── rules.json              ← fully refreshed from official sources
├── rules.raw/              ← raw HTML + screenshots, source attribution
│   ├── customs_gov_np_<timestamp>.html
│   ├── dotm_gov_np_<timestamp>.html
│   ├── immigration_gov_np_<timestamp>.html
│   ├── ntnc_acap_<timestamp>.html
│   └── welcomenepal_<timestamp>.html
└── rules.fetch_log.json    ← URL, status, byte-count, sha256, fetched_at
docs/
└── RULES_CHANGE_REPORT.md  ← human-readable diff vs the prior data/rules.json
```

### Schema for `data/rules.json`

Keep the existing top-level shape (so the website keeps working). Augment each rule with a `source` and `fetchedAt`:

```json
{
  "lastUpdated": "ISO date",
  "verifyBefore": "ISO date",
  "officialSources": [ { "label": "...", "url": "..." } ],
  "rules": [
    {
      "category": "Vehicle | Customs | Identity | Driving | ...",
      "title": "short title",
      "detail": "1–3 sentences of the rule, in plain English",
      "source": "https://...",
      "fetchedAt": "ISO timestamp",
      "confidence": "official | corroborated | inferred"
    }
  ],
  "emergencies": [ { "label": "...", "value": "..." } ]
}
```

`confidence` levels:
- `official` — fact came directly from a .gov.np page.
- `corroborated` — present on .gov.np in vague form, confirmed exact figure on a reputable secondary source.
- `inferred` — not stated on any source today; carrying forward the prior baseline.

### Schema for `data/rules.fetch_log.json`

```json
[
  {
    "url": "https://www.customs.gov.np/",
    "fetchedAt": "2026-05-08T09:13:00+05:45",
    "status": 200,
    "bytes": 84321,
    "sha256": "...",
    "savedTo": "data/rules.raw/customs_gov_np_20260508-0913.html"
  }
]
```

### `docs/RULES_CHANGE_REPORT.md`

A markdown report with three sections:

1. **Confirmed unchanged** — bullets matching the prior file.
2. **Changed** — table of (rule title, prior value, new value, source URL, your action).
3. **New rules picked up** — items present on official sources that weren't in the prior file.
4. **Could not verify** — items in the prior file that no source today corroborates; mark as `inferred` in `rules.json`.

---

## Crawl procedure (step by step)

1. **Snapshot the current baseline.** Copy `data/rules.json` → `data/rules.prior.json` so the change report has a clean reference.
2. **Fetch each target URL.** Use `curl -L -A "Mozilla/5.0 ..." --max-time 30 <url>` and save raw HTML under `data/rules.raw/`. Record sha256 + bytes in `rules.fetch_log.json`.
3. **Parse with BeautifulSoup or readability-style extraction.** For each page, surface text content blocks that mention vehicle, customs, Bhansar, Yatayat, Indian, foreign, daily, permit, visa, Annapurna, ACAP. Save extracted plain-text alongside the HTML.
4. **Map to rules.** Build the new `rules` array. For each entry: pull the `detail` from the official text where possible. If the source says nothing on a topic that mattered last time, mark `confidence: "inferred"` and copy from `rules.prior.json`.
5. **Re-verify these specific facts** (these are the items most likely to have changed since May 2025):
   - 30-day cumulative cap for Indian vehicles in 2026 — still in force? Same threshold?
   - Bhansar daily fee table by vehicle category — exact NPR figures.
   - Yatayat daily fee table — exact NPR figures.
   - ACAP fee for SAARC nationals — currently NPR 1,000? Still valid for road travel?
   - Lower vs Upper Mustang permit boundaries — has Kagbeni been re-classified? (it has flipped before)
   - Whether a Pollution Under Control (PUC) certificate is now required for Indian vehicles entering — Nepal added this requirement in past circulars.
   - Whether tourist SIM rules changed (NTC/Ncell paperwork).
   - Indian Embassy Kathmandu phone (rarely changes but worth confirming).
6. **Write `RULES_CHANGE_REPORT.md`** comparing prior vs new. Highlight Bhansar/Yatayat fee deltas in bold.
7. **Sanity-check.** Run a tiny script that re-parses the new `rules.json` and asserts:
   - At least 12 rules
   - Every `Vehicle`-category rule has a `source`
   - `lastUpdated` is today's ISO date in `Asia/Kathmandu` (`+05:45`)
   - `emergencies` array still contains the 5 prior entries (or is updated)
8. **Print a 10-line summary** at the end: "Confirmed unchanged: N. Changed: M. New: K. Inferred: I."

---

## Cross-check: route conditions for Beni–Jomsom (May 2026)

This is the actual driving risk. After the rules pass:

1. Search Google + Reddit + Lonely Planet forum for: `"Beni Jomsom" road condition 2026 May` and `"Mustang road" landslide 2026`.
2. Capture 3–5 recent first-hand accounts (date stamped after 2026-03-01) into `data/route_intel/beni_jomsom_<timestamp>.md`.
3. Summarise into `docs/ROUTE_CONDITIONS.md` with a "Drive / hold / postpone" recommendation.

---

## Bonus pass: hotel & fuel availability

If time permits:

1. Open `https://www.booking.com/` and `https://www.makemytrip.com/` and search Pokhara, Bhairahawa, Jomsom for the trip dates (12–13, 17–20 May Pokhara; 11, 21 May Bhairahawa; 15–16 May Jomsom).
2. Save 3 candidate hotels per city to `data/hotels.json` with name, price band, distance from city centre, fibre/wifi mention.
3. Note `docs/HOTELS_SHORTLIST.md` for the proprietor to actually book.

---

## Validation before finishing

Run all of these before declaring done:

```bash
# 1. JSON validity
python3 -c "import json; [json.load(open(f)) for f in ['data/rules.json','data/itinerary.json','data/checklist.json']]; print('OK')"

# 2. Open the local site
open "/Users/sunny/mine/trips/NEPAL-2026/website/index.html"

# 3. Check every doc still renders by listing
ls -la docs/ data/ data/rules.raw/

# 4. Refresh data.js so the website mirrors the new JSON
python3 - <<'PY'
import json, pathlib
root = pathlib.Path("/Users/sunny/mine/trips/NEPAL-2026")
rules     = json.load(open(root/"data/rules.json"))
itinerary = json.load(open(root/"data/itinerary.json"))
checklist = json.load(open(root/"data/checklist.json"))
out = (
  "/* auto-generated from /data/*.json — do not hand-edit */\n"
  "window.TRIP = " + json.dumps({"name":"Nepal Workation 2026","depart":"2026-05-09","return":"2026-05-23","nights":14,"travellers":2,"vehicle":"Mahindra Thar Roxx (Thar Digital Services)","capDays":30,"permitDaysUsed":18,"totalKm":4410}, indent=2) + ";\n"
  "window.ITINERARY = " + json.dumps(itinerary["days"], indent=2) + ";\n"
  "window.RULES = "     + json.dumps(rules, indent=2) + ";\n"
  "window.CHECKLIST = " + json.dumps(checklist, indent=2) + ";\n"
)
(root/"website/js/data.js").write_text(out)
print("data.js refreshed")
PY
```

---

## Things to NOT do

- Do not bypass any robots.txt — if a Nepal gov page disallows crawl on a path, skip it.
- Do not log in anywhere or accept cookies that store consent.
- Do not edit `docs/MASTER_CHECKLIST.md`, `docs/ITINERARY.md`, or `docs/AUTHORIZATION_LETTER_TEMPLATE.md` — they are human-curated.
- Do not edit `data/itinerary.json` or `data/checklist.json` — only `data/rules.json` is up for refresh.
- Do not commit anything to git unless the workspace is already a git repo and you can confirm `git status` is clean before starting.

---

## Prompt to give Claude Code

> Copy everything between the `===` markers as a single message.

```
===
You are taking over a workspace at /Users/sunny/mine/trips/NEPAL-2026 that I built in a sandboxed Cowork session. Egress there was blocked, so the rules data in /data/rules.json is based on model knowledge (May 2025) plus user-supplied 2026 notes. Your job is to live-scrape authoritative sources and refresh the data, producing a transparent change report.

Before you do anything, read these files in order, in full:
1. /Users/sunny/mine/trips/NEPAL-2026/docs/CLAUDE_CODE_CRAWL_PLAN.md  — the crawl plan, your spec
2. /Users/sunny/mine/trips/NEPAL-2026/data/rules.json                 — the prior baseline you are refreshing
3. /Users/sunny/mine/trips/NEPAL-2026/docs/NEPAL_RULES_2026.md         — narrative version of the same rules
4. /Users/sunny/mine/trips/NEPAL-2026/website/js/data.js               — keep this in sync at the end

Then execute the crawl plan exactly as specified. Specifically:

(a) Snapshot the current /data/rules.json to /data/rules.prior.json.
(b) Fetch each of the seven target URLs listed in the plan, save raw HTML to /data/rules.raw/, log to /data/rules.fetch_log.json. User-Agent: Mozilla/5.0. Respect robots.txt.
(c) Parse and re-verify the seven specific facts listed under "Re-verify these specific facts" in the plan. Each fact must end up with confidence "official", "corroborated", or "inferred" — do not silently fall back.
(d) Write the new /data/rules.json with the source-attributed schema described in the plan.
(e) Write /docs/RULES_CHANGE_REPORT.md with the four sections: Confirmed unchanged / Changed / New / Could not verify. Highlight Bhansar/Yatayat fee deltas in bold.
(f) Run the validation block at the bottom of the plan, including the data.js refresh script.
(g) Open /website/index.html and visually confirm the site still renders.
(h) Print the 10-line summary.

Constraints:
- Do not edit /docs/MASTER_CHECKLIST.md, /docs/ITINERARY.md, /docs/AUTHORIZATION_LETTER_TEMPLATE.md, /data/itinerary.json, /data/checklist.json.
- If any source disagrees with .gov.np, trust .gov.np.
- If you cannot reach a source after 3 retries, mark its rules as "inferred" with a note in the change report rather than guessing.
- If the optional route-conditions and hotel passes from the plan would take more than 15 minutes, ask me first.

When done, leave a one-screen status summary covering: how many rules confirmed/changed/new/inferred, top 3 facts that materially affect the 9–23 May trip, and any link to drop into the website that I should add.
===
```

---

## After Claude Code finishes

The website auto-loads the new data because `js/data.js` is regenerated from the JSON. Open `website/index.html` and skim:

- Rules page — should show updated `lastUpdated` and any new rules.
- Folders page — link to the new `RULES_CHANGE_REPORT.md` (already present).
- Index page — re-confirm the "Re-verify on 8 May" callout has been resolved.

If the change report flags Bhansar/Yatayat fee deltas, update the **money** category of the master checklist with the new INR cash floor. That's the only checklist mutation worth caring about post-crawl.
