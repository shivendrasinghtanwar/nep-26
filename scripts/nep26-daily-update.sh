#!/usr/bin/env bash
# nep26-daily-update.sh — run daily from launchd. Fetches the current weather
# for the trip's last/today location, updates data/triplog.json, drains
# data/pending-log.md into today's notes, commits + pushes to origin/release.
# Idempotent: if nothing changed, no commit. Network-fault tolerant: if
# Open-Meteo is unreachable, the weather step is skipped but the log drain
# (which doesn't need internet) still runs.

set -euo pipefail

REPO="/Users/sunny/mine/trips/NEPAL-2026"
TRIPLOG="$REPO/data/triplog.json"
PENDING="$REPO/data/pending-log.md"
LOG="$REPO/.local-cron.log"

cd "$REPO"

log() { printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" | tee -a "$LOG" >&2; }

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

log "—— run start (dry-run=$DRY_RUN) ——"

# Today in Asia/Kathmandu (the trip's working timezone)
TODAY=$(TZ='Asia/Kathmandu' date +%Y-%m-%d)
WEEKDAY=$(TZ='Asia/Kathmandu' date +%a)
log "today (NPT): $TODAY $WEEKDAY"

# ── Step 1: pull latest from release so we don't fight a phone-side commit
if [[ $DRY_RUN -eq 0 ]]; then
  git pull --rebase --autostash origin release >>"$LOG" 2>&1 || {
    log "git pull failed — aborting to avoid divergence"
    exit 1
  }
fi

# ── Step 2: locate target entry (today's, else last)
TARGET_IDX=$(jq --arg t "$TODAY" '
  ([.entries[] | .date] | index($t)) // ((.entries | length) - 1)
' "$TRIPLOG")
[[ "$TARGET_IDX" == "null" || -z "$TARGET_IDX" ]] && { log "no entries[] in triplog — abort"; exit 1; }
log "target entry index: $TARGET_IDX"

# ── Step 3: derive location
LOC=$(jq -r --argjson i "$TARGET_IDX" '
  .entries[$i] as $e |
  ($e.leg // "") as $leg |
  if ($leg | test("→")) then
    ($leg | split("→") | last | gsub("^[\\s]+|[\\s]+$"; ""))
  else
    ($e.hotel.location // "" | split(",") | last | gsub("^[\\s]+|[\\s]+$"; ""))
  end
' "$TRIPLOG" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z ]//g' | awk '{$1=$1};1')
log "derived location: '$LOC'"

# ── Step 4: hardcoded lat/lon lookup (validated against Open-Meteo geocoder
# 2026-05-12; Beni/Tatopani/Marpha/Ghasa/Kalopani hardcoded because the
# geocoder returns wrong-country/wrong-district homonyms for those names).
# Written as a case statement instead of an associative array because macOS
# ships /bin/bash 3.2, which predates declare -A.
COORDS=""
COORD_KEY=""
for key in pokhara jomsom muktinath kagbeni tatopani marpha beni ghasa kalopani butwal lucknow bikaner; do
  if [[ "$LOC" == *"$key"* ]]; then
    COORD_KEY="$key"
    break
  fi
done
case "$COORD_KEY" in
  pokhara)   COORDS="28.2096,83.9856" ;;
  jomsom)    COORDS="28.7826,83.7236" ;;
  muktinath) COORDS="28.8167,83.8728" ;;
  kagbeni)   COORDS="28.8344,83.7842" ;;
  tatopani)  COORDS="28.4969,83.6483" ;;
  marpha)    COORDS="28.7536,83.6878" ;;
  beni)      COORDS="28.3547,83.5649" ;;
  ghasa)     COORDS="28.6019,83.6430" ;;
  kalopani)  COORDS="28.6390,83.6030" ;;
  butwal)    COORDS="27.7006,83.4484" ;;
  lucknow)   COORDS="26.8467,80.9462" ;;
  bikaner)   COORDS="28.0229,73.3119" ;;
esac
[[ -n "$COORDS" ]] && log "matched '$COORD_KEY' → $COORDS"

DIRTY=0

# ── Step 5+6: fetch + map + write weather (only if location matched and net up)
WEATHER_OUT=""
if [[ -n "$COORDS" ]]; then
  LAT="${COORDS%,*}"
  LON="${COORDS#*,}"
  URL="https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weather_code,temperature_2m,precipitation,cloud_cover&timezone=Asia%2FKathmandu"
  if API_RESPONSE=$(curl -sSf --max-time 12 "$URL" 2>/dev/null); then
    WCODE=$(jq -r '.current.weather_code // empty' <<<"$API_RESPONSE")
    if [[ -n "$WCODE" ]]; then
      case "$WCODE" in
        0) WEATHER_OUT="clear" ;;
        1|2) WEATHER_OUT="partly cloudy" ;;
        3) WEATHER_OUT="overcast" ;;
        45|48) WEATHER_OUT="fog" ;;
        51|53|55|56|57) WEATHER_OUT="drizzle" ;;
        61|63|65|66|67|80|81|82) WEATHER_OUT="rain" ;;
        71|73|75|77|85|86) WEATHER_OUT="snow" ;;
        95|96|99) WEATHER_OUT="thunderstorm" ;;
        *) log "unmapped weather_code: $WCODE" ;;
      esac
    fi
    log "weather_code=$WCODE → '$WEATHER_OUT'"
  else
    log "open-meteo unreachable (offline?), skipping weather"
  fi
else
  log "no coord match for '$LOC' — skipping weather"
fi

if [[ -n "$WEATHER_OUT" ]]; then
  CURRENT_WEATHER=$(jq -r --argjson i "$TARGET_IDX" '.entries[$i].weather // ""' "$TRIPLOG")
  if [[ "$CURRENT_WEATHER" == "$WEATHER_OUT" ]]; then
    log "weather unchanged ('$WEATHER_OUT')"
  else
    log "weather: '$CURRENT_WEATHER' → '$WEATHER_OUT'"
    if [[ $DRY_RUN -eq 0 ]]; then
      jq --indent 2 --argjson i "$TARGET_IDX" --arg w "$WEATHER_OUT" \
        '.entries[$i].weather = $w' "$TRIPLOG" > "$TRIPLOG.tmp" && mv "$TRIPLOG.tmp" "$TRIPLOG"
    fi
    DIRTY=1
  fi
fi

# ── Step 7: drain pending-log.md (append verbatim to target entry's notes)
if [[ -f "$PENDING" ]]; then
  PENDING_CONTENT=$(cat "$PENDING" | sed -e 's/[[:space:]]*$//' | awk 'NF{found=1} found' )
  if [[ -n "$PENDING_CONTENT" ]]; then
    log "draining pending-log.md ($(wc -c < "$PENDING" | tr -d ' ') bytes)"
    if [[ $DRY_RUN -eq 0 ]]; then
      NEW_NOTES=$(jq -r --argjson i "$TARGET_IDX" --arg p "$PENDING_CONTENT" \
        '(.entries[$i].notes // "") + " " + $p | gsub("^[\\s]+|[\\s]+$"; "")' "$TRIPLOG")
      jq --indent 2 --argjson i "$TARGET_IDX" --arg n "$NEW_NOTES" \
        '.entries[$i].notes = $n' "$TRIPLOG" > "$TRIPLOG.tmp" && mv "$TRIPLOG.tmp" "$TRIPLOG"
      : > "$PENDING"
    fi
    DIRTY=1
  fi
fi

# ── Step 8/9: commit + push if anything changed
if [[ $DIRTY -eq 1 ]]; then
  if [[ $DRY_RUN -eq 0 ]]; then
    git add data/triplog.json data/pending-log.md
    git -c commit.gpgsign=false commit -m "chore(triplog): $TODAY weather + notes" >>"$LOG" 2>&1
    git push origin release >>"$LOG" 2>&1
    log "pushed"
  else
    log "(dry-run) would commit + push"
  fi
else
  log "no-op"
fi

log "—— run end ——"
