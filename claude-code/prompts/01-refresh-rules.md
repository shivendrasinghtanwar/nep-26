# Prompt — Refresh Nepal rules data

Copy everything between the `===` markers and paste as your first message to Claude Code.

```
===
You are taking over a workspace at /Users/sunny/mine/trips/NEPAL-2026 that was built in a sandboxed Cowork session. Egress was blocked there, so the rules data in /data/rules.json is based on model knowledge (May 2025) plus user-supplied 2026 notes. Your job is to live-scrape authoritative sources and refresh that data, producing a transparent change report.

Read these files first, in order, in full:
1. claude-code/README.md
2. claude-code/context/trip-overview.md
3. claude-code/context/workspace-layout.md
4. claude-code/context/data-schemas.md
5. claude-code/context/constraints.md
6. claude-code/context/glossary.md
7. claude-code/playbooks/01-refresh-rules.md   ← this is your spec, follow it exactly
8. data/rules.json                          ← the prior baseline you are refreshing
9. docs/NEPAL_RULES_2026.md                 ← narrative version

Then execute claude-code/playbooks/01-refresh-rules.md exactly as specified — including:
- snapshotting data/rules.json → data/rules.prior.json
- fetching all seven target URLs into data/rules.raw/ with a fetch log
- re-verifying the seven listed facts with explicit confidence levels
- writing the new data/rules.json with source attribution
- writing docs/RULES_CHANGE_REPORT.md with the four-section template
- regenerating website/js/data.js using the script in step 8 of the plan
- opening website/index.html for visual confirmation
- printing the 10-line summary

Hard constraints (also in claude-code/context/constraints.md):
- Do not edit docs/MASTER_CHECKLIST.md, docs/ITINERARY.md, docs/AUTHORIZATION_LETTER_TEMPLATE.md, data/itinerary.json, data/checklist.json, any website/*.html, website/css/style.css, or website/js/app.js.
- If a .gov.np source contradicts a blog or news source, trust .gov.np. Note conflicts in the change report.
- If you cannot reach a source after 3 retries (1s/3s/9s backoff), mark its rules "inferred" with a note rather than guessing.
- Throttle: max 1 request per second per host, no parallel hits on the same .gov.np host.
- Do not commit to git unless the workspace is already a git repo and `git status --porcelain` is empty before you start.
- If you find anything that materially changes the trip (e.g. a new permit, a fee delta > 50%, a closure), surface it as the first line of your final summary.

When you finish, leave a one-screen status summary covering:
- counts: confirmed unchanged / changed / new / inferred
- top 3 facts that materially affect the 9–23 May trip
- any link or snippet that should be added to the website
===
```

## When to use this prompt

- Run on or after **2026-05-07** so the data is fresh for the 2026-05-09 departure.
- Re-run if Bhansar/Yatayat fees change again before crossing.
