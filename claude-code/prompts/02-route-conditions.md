# Prompt — Beni–Jomsom road condition intel

Copy everything between the `===` markers and paste as your first message to Claude Code.

```
===
You are working in /Users/sunny/mine/trips/NEPAL-2026. The user is driving a Mahindra Thar Roxx into Mustang on 2026-05-15 and wants a fresh Beni → Jomsom road condition snapshot before committing to the leg.

Read these files first:
1. claude-code/README.md
2. claude-code/context/trip-overview.md
3. claude-code/context/glossary.md
4. claude-code/playbooks/02-route-conditions.md   ← your spec
5. docs/ITINERARY.md (especially days 6–9)

Then execute claude-code/playbooks/02-route-conditions.md. Specifically:
- Search the listed sources for Beni–Jomsom road state, accepting only hits dated after 2026-03-01.
- Capture ≥ 5 first-hand sources to data/route_intel/source_NN_<host>.{html,txt}.
- Build data/route_intel/beni_jomsom_<timestamp>.md with one paragraph per source.
- Write docs/ROUTE_CONDITIONS.md ending in a single-word recommendation: DRIVE, HOLD, or POSTPONE.
- Print the recommendation + top three concerns to the terminal.

Hard constraints:
- Respect robots.txt. User-Agent: Mozilla/5.0 (compatible; NepalTripPrep/1.0).
- Do not edit any file in claude-code/context/constraints.md "Don't edit" list.
- Do not modify data/rules.json unless you find a hard new rule (then update only the relevant rule with confidence "official" + source).
- If you cannot find ≥ 5 recent sources after 30 minutes, stop and write ROUTE_CONDITIONS.md saying "no recent intel — rely on Pokhara local enquiry on 2026-05-13".

When done, print a one-screen summary: recommendation, top three risks, and any contingency the user should plan for (e.g. extra Pokhara nights if POSTPONE).
===
```

## When to use this prompt

- Run **after 2026-05-09** (after the user has departed Bikaner) so the intel is freshest.
- Re-run on **2026-05-13 morning** in Pokhara as a final go/no-go check.
