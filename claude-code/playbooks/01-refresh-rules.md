# Plan 01 — Refresh `data/rules.json` from official Nepal sources

**Run on or after 2026-05-07.** This is the priority plan because it directly affects what gets paid at the Sunauli border on 2026-05-11.

## Goal

Replace the model-knowledge baseline in `data/rules.json` with live, source-attributed data from the seven official sources listed below, and produce a transparent change report.

## Inputs you will read first

1. `claude-code/context/trip-overview.md`
2. `claude-code/context/workspace-layout.md`
3. `claude-code/context/data-schemas.md`
4. `claude-code/context/constraints.md`
5. `claude-code/context/glossary.md`
6. `data/rules.json` — the prior baseline you are refreshing
7. `docs/NEPAL_RULES_2026.md` — narrative version of the same baseline

## Target sources

| # | Source | URL | What to extract |
|---|--------|-----|-----------------|
| 1 | Nepal Department of Customs | https://www.customs.gov.np/ | Bhansar daily fee table by vehicle category, accepted documents, latest 2026 circulars about Indian vehicles |
| 2 | Nepal Department of Transport Management | https://www.dotm.gov.np/ | Yatayat daily fee structure, the 30-day cumulative cap rule for foreign vehicles, 2026 amendments |
| 3 | Nepal Department of Immigration | https://immigration.gov.np/ | Confirmation that Indian nationals are visa-free + acceptable IDs |
| 4 | NTNC / ACAP | https://ntnc.org.np/ | ACAP fee for SAARC vs foreigners, where the permit is issued |
| 5 | Nepal Tourism Board | https://www.welcomenepal.com/ | TIMS card rules, Mustang restricted-area permit details |
| 6 | Indian Embassy, Kathmandu | https://www.indembkathmandu.gov.in/ | Current advisory + emergency phone, OCI/Indian-citizen guidance |
| 7 | Cross-reference | Google search `Nepal Bhansar Indian vehicle 2026 fee` | Pick top 2 reputable travel-blog or news results published after 2026-01-01, only to corroborate the .gov.np data |

## Output contract

```
data/
├── rules.json              ← fully refreshed
├── rules.prior.json        ← snapshot of the previous file
├── rules.fetch_log.json    ← URL, status, byte-count, sha256, fetched_at per source
└── rules.raw/              ← raw HTML + extracted text per source
    ├── customs_gov_np_<timestamp>.html
    ├── customs_gov_np_<timestamp>.txt
    ├── dotm_gov_np_<timestamp>.{html,txt}
    ├── immigration_gov_np_<timestamp>.{html,txt}
    ├── ntnc_acap_<timestamp>.{html,txt}
    └── welcomenepal_<timestamp>.{html,txt}

docs/
└── RULES_CHANGE_REPORT.md  ← human-readable diff vs the prior data/rules.json

website/js/data.js           ← regenerated from /data/*.json
```

The schema for `rules.json` is in `claude-code/context/data-schemas.md`.

## Procedure

### Step 1 — Snapshot
```bash
cp data/rules.json data/rules.prior.json
mkdir -p data/rules.raw
```

### Step 2 — Fetch
For each target URL:
- `curl -L -A "Mozilla/5.0 (compatible; NepalTripPrep/1.0)" --max-time 30 <url>` and save raw HTML.
- Extract plain text (use `python3 -c "from bs4 import BeautifulSoup; ..."` or `pandoc -f html -t plain`).
- Append to `data/rules.fetch_log.json` with: url, fetchedAt (ISO with `+05:45`), status, bytes, sha256, savedTo.
- Throttle: minimum 1s gap between requests to the same host. Max 3 retries with 1s/3s/9s backoff.

### Step 3 — Parse and map
For each fetched page, surface text blocks containing any of: `Bhansar`, `Yatayat`, `Indian vehicle`, `foreign vehicle`, `daily`, `permit`, `visa`, `Annapurna`, `ACAP`, `TIMS`, `Mustang`, `30 days`, `cumulative`. Save the surfaced extracts as the `.txt` companion files in `data/rules.raw/`.

### Step 4 — Re-verify these specific facts (highest priority)
These are the items most likely to have shifted since the May 2025 baseline. Each must end in the new `rules.json` with `confidence: official | corroborated | inferred`. Do **not** silently fall back.

1. **30-day cumulative cap for Indian vehicles** — still in force in 2026? Same threshold?
2. **Bhansar daily fee table** by vehicle category — exact NPR figures.
3. **Yatayat daily fee table** — exact NPR figures.
4. **ACAP fee for SAARC nationals** — currently NPR 1,000? Still valid for road travel only?
5. **Lower vs Upper Mustang permit boundary** — has Kagbeni been reclassified? (it has flipped before)
6. **PUC certificate requirement** for Indian vehicles entering — Nepal added this in past circulars.
7. **Indian Embassy Kathmandu phone** — currently `+977-1-4410900`?

### Step 5 — Build the new `rules.json`
- Carry forward categories from the prior file: `Identity`, `Vehicle`, `Customs`, `Driving`, `Fuel`, `Money`, `Connectivity`, `Insurance`, `Permits`, `Altitude`, `Restricted`.
- Each rule gets `source`, `fetchedAt`, `confidence`.
- If a rule from prior file has no live source today, copy it forward and tag `confidence: inferred` with a note.
- Update `lastUpdated` to today's ISO date in `Asia/Kathmandu`.
- Update `verifyBefore` to `2026-05-08`.

### Step 6 — Change report
Write `docs/RULES_CHANGE_REPORT.md` with these sections:

1. **Confirmed unchanged** — bullets that match the prior file.
2. **Changed** — markdown table: rule title · prior value · new value · source URL · recommended action.
3. **New rules picked up** — items present on official sources today that weren't in the prior file.
4. **Could not verify** — items in the prior file that no source today corroborates (these are now `inferred`).

Highlight Bhansar/Yatayat fee deltas in **bold**.

### Step 7 — Sanity check
```bash
python3 - <<'PY'
import json
r = json.load(open('data/rules.json'))
assert len(r['rules']) >= 12, "too few rules"
assert all('source' in x and 'confidence' in x for x in r['rules']), "missing source/confidence"
assert any(x['category']=='Vehicle' for x in r['rules']), "no vehicle rule"
print("rules.json sanity OK")
PY
```

### Step 8 — Regenerate `website/js/data.js`
```bash
python3 - <<'PY'
import json, pathlib
root = pathlib.Path('.')
rules     = json.load(open(root/'data/rules.json'))
itinerary = json.load(open(root/'data/itinerary.json'))
checklist = json.load(open(root/'data/checklist.json'))
out = (
  "/* auto-generated from /data/*.json — do not hand-edit */\n"
  "window.TRIP = " + json.dumps({"name":"Nepal Workation 2026","depart":"2026-05-09","return":"2026-05-23","nights":14,"travellers":2,"vehicle":"Mahindra Thar Roxx (Thar Digital Services)","capDays":30,"permitDaysUsed":18,"totalKm":4410}, indent=2) + ";\n"
  "window.ITINERARY = " + json.dumps(itinerary['days'], indent=2) + ";\n"
  "window.RULES = "     + json.dumps(rules, indent=2) + ";\n"
  "window.CHECKLIST = " + json.dumps(checklist, indent=2) + ";\n"
)
(root/'website/js/data.js').write_text(out)
print('data.js refreshed')
PY
```

### Step 9 — Visual confirmation
```bash
open "website/index.html"
```
Click through to **Rules** and confirm the `lastUpdated` is today's date.

### Step 10 — Print a 10-line summary
Print exactly: `Confirmed unchanged: N. Changed: M. New: K. Inferred: I.` plus a bullet for each fact in step 4 with its final confidence level.

## Done criteria

- All seven sources fetched OR explicitly marked unreachable in the fetch log.
- All seven re-verify facts have a confidence level.
- `RULES_CHANGE_REPORT.md` exists and follows the four-section template.
- `data.js` regenerated and the website opens cleanly.
- A summary message printed to the terminal.
