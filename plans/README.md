# /plans/ — Your personal trip-plan space

This directory is for **your** trip planning — contingencies, work deliverables, budget, packing strategy, communication, post-trip to-dos. The files in here are starter scaffolds: fill in the personal details that don't belong in the public `docs/` folder or in the website.

## Why this is separate

| Directory | Purpose | Edited by |
|-----------|---------|-----------|
| `/docs/` | Public-ish reference docs the website renders | Claude (with care) |
| `/data/` | Structured data the website renders | Claude / Claude Code |
| `/website/` | The local mission-control site | Claude |
| `/claude-code/` | Briefing for Claude Code (when you want a live web crawl) | Claude |
| **`/plans/`** | **Your private trip thinking** | **You** |

Claude and Claude Code are instructed not to write into `/plans/` unless you explicitly ask. That keeps your private notes private.

## What's in here

| File | What goes in it |
|------|-----------------|
| `contingencies.md` | What to do if things go wrong on the road |
| `work-deliverables.md` | Client commitments during 9–23 May |
| `budget.md` | Expected expenses + actuals tracking |
| `packing-strategy.md` | What goes where in the Thar Roxx |
| `communication-plan.md` | Who to keep informed, when |
| `wife-preferences.md` | Comfort / pace decisions you've already made together |
| `post-trip-todos.md` | What needs doing after 23 May |

Add more as needed. Nothing references these files outside this directory.

## How to use this with Claude

If you want help thinking through any of these — e.g. *"draft a contingency for vehicle breakdown in Mustang"* — paste the relevant file content into chat and ask. I won't auto-edit `/plans/` unless you say so.
