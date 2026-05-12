# pending-log.template.md · reference, not edited by cron

This file documents the format for `data/pending-log.md` — the phone-dictation
channel that the daily 09:00 Asia/Kathmandu cron drains into
`data/triplog.json`.

## How to use it from your phone

1. Open `data/pending-log.md` in the GitHub mobile app (or the github.com
   mobile web editor — both let you edit + commit in three taps).
2. Replace the file's contents with one of the two formats below.
3. Commit on the `release` branch directly. The site rebuilds + redeploys.
4. The next morning (09:00 NPT) the cron parses your text into a real
   triplog entry and truncates `pending-log.md` back to empty.

If you want the parse to happen sooner than 09:00 NPT next day, you can
also run the routine on-demand from
https://claude.ai/code/routines/trig_01WStXd35i8YiSqqVG7kfVXB

## Mode A — Notes for the CURRENT day

Just narrative text, no special markers. Gets appended to today's
`entry.notes` field in `triplog.json`.

```
Lunch at Maldhunga café was decent. The road from Beni to Galeshwor had a
30-min landslide hold. Reached hotel by 4 PM. Roxx took the rough patch
near Galeshwor in second gear with diff lock off, no drama.
```

## Mode B — Whole NEW day entry

First non-blank line must contain `→` (or start with `day N` / a
`YYYY-MM-DD` date). Optional keyed lines for the structured fields:

```
Pokhara → Beni
date: 2026-05-13
km: 78
hours: ~3 h
route: Beni-Jomsom Road
hotel: Sun Rise Tatopani, Tatopani, Myagdi
map: https://maps.app.goo.gl/?q=28.4969,83.6483
notes: Paved to Beni then gravel from Maldhunga. Two checkpoints — ACAP
permit checked at Beni. Camped at the hot springs guesthouse.
```

The cron picks up:
- `leg` ← first arrow-line
- `km`, `hours`, `route`, `notes` ← keyed lines
- `hotel.name` ← before the first comma on the `hotel:` line
- `hotel.location` ← rest after the first comma
- `hotel.map` ← `map:` URL
- `day` ← previous entry's day + 1
- `date` ← `date:` if specified, else today's Kathmandu date
- `weekday` ← derived from date
- `status` ← `"active"`
- `weather` ← from the same Open-Meteo lookup the cron does for the
  derived location

Anything you don't specify falls back to empty string or null.

## Edge cases

- **Wrong day fires twice** — the cron is idempotent on weather (no-op
  if already correct) but NOT on note appends. To avoid accidental
  double-appends, just don't commit `pending-log.md` while the cron
  is running. Daily fire only takes ~30 s; collision odds are negligible.
- **Location not in the cron's lookup** — weather step is skipped but
  the log drain still runs. Add a coord pair to the lookup table in the
  routine prompt (https://claude.ai/code/routines/trig_01WStXd35i8YiSqqVG7kfVXB)
  if you take a detour to somewhere new.
- **Geocoder ambiguity** — Beni / Tatopani / Marpha / Ghasa / Kalopani
  are hardcoded in the cron because Open-Meteo's free geocoder returns
  wrong-country (Beni → Nigeria) or wrong-district (Tatopani → Jumla)
  homonyms. Validated 2026-05-12 against the geocoding API.
