# Constraints

## Don't edit
- `docs/MASTER_CHECKLIST.md`
- `docs/ITINERARY.md`
- `docs/AUTHORIZATION_LETTER_TEMPLATE.md`
- `data/itinerary.json`
- `data/checklist.json`
- Any `website/*.html`
- `website/css/style.css`
- `website/js/app.js`
- **Anything under top-level `/plans/`** — that directory is the user's personal trip-plan space, not yours.

If a playbook says otherwise, the playbook wins — but ask the user first.

## Do refresh
- `data/rules.json` (per plan 01)
- `website/js/data.js` (regenerate from JSON; script is in plan 01)
- New files under `docs/` for change reports and shortlists

## Network etiquette
- User-Agent: `Mozilla/5.0 (compatible; NepalTripPrep/1.0)`
- Respect `robots.txt`. If a path is disallowed, skip it and note in fetch log.
- Throttle: max 1 request per second per host. No parallel requests against the same `.gov.np` host.
- Retries: max 3 with exponential backoff (1s, 3s, 9s). After that, mark the source as unreachable.

## Source priority (when sources disagree)
1. Nepal `.gov.np` pages.
2. Indian Embassy Kathmandu advisories.
3. Reputable English-language Nepali news (kathmandupost.com, onlinekhabar.com, recordnepal.com) **dated after 2026-01-01**.
4. Travel forums and blogs **dated after 2026-01-01** — corroboration only, never primary.

If a `.gov.np` page contradicts a blog, trust `.gov.np`. Note the conflict in the change report.

## Output discipline
- Every claim in `data/rules.json` carries `source` + `fetchedAt` + `confidence`.
- Every external URL persisted in any output is HTTPS.
- Never persist any data that looks like a credential, secret token, or session cookie.

## Privacy
- Do not log into anything. Don't accept cookies that store consent.
- Don't fetch the user's personal Google/Apple/Booking accounts.
- Don't access saved passwords or autofill data.

## Git
- Don't commit anything unless the workspace is already a git repo (`git rev-parse --is-inside-work-tree`) AND `git status --porcelain` is empty before you start.
- If you do commit, use a single commit at the end with subject like `data: refresh Nepal rules from official sources (2026-05-08)`.

## Ask the user before
- Editing any file in the "don't edit" list above.
- Running for more than ~15 minutes.
- Spending money or making bookings (these plans are research-only).
- Sending any email or message on the user's behalf.
