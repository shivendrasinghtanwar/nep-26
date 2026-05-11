import { Link } from 'react-router-dom'
import triplog from '../../data/triplog.json'

/**
 * FieldStatus — walkie-talkie style status pill rendered inside the topnav.
 *
 *   ● LIVE · DAY 03 · POKHARA · ☔
 *
 * Pulls live state from the *last* entry in data/triplog.json:
 *   - day number      → padded to 2 digits
 *   - location        → derived from the leg's right-hand side (after the
 *                       last arrow) or the hotel's city when present
 *   - weather glyph   → from entry.weather, or inferred from location
 *                       (today's Pokhara entry has no `weather` key yet, so
 *                        we infer `rain` from the same heuristic RainOverlay
 *                        uses for visual consistency)
 *
 * LED dot colour:
 *   green  → "rolling" (entry.status === 'active' OR most recent entry today)
 *   amber  → halted   (entry.status === 'done' / not today)
 *   rust   → late-night transmission (local hour ≥ 22 OR < 5)
 *
 * Hidden on viewports < 480px (the topnav already gets crowded with the
 * hamburger + brand-tag; users can still reach the field log via the menu).
 *
 * Clicking the pill routes to /log.
 *
 * Returns null when there is no triplog entry at all.
 */

function lastEntry() {
  const entries = triplog?.entries || []
  return entries.length ? entries[entries.length - 1] : null
}

function deriveLocation(entry) {
  if (!entry) return ''
  // leg is typically "From → To" — take the trailing segment if present
  const leg = (entry.leg || '').toString()
  if (leg.includes('→')) {
    const tail = leg.split('→').pop().trim()
    return tail.replace(/[🇳🇵🇮🇳]/g, '').trim()
  }
  // fall back to hotel city
  const hotelLoc = (entry.hotel?.location || '').toString()
  if (hotelLoc) {
    // take first meaningful comma-segment (e.g. "Lakeside, Pokhara" → "Lakeside")
    // but prefer the city: usually the LAST segment when format is "Area, City"
    const parts = hotelLoc.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 2) return parts[parts.length - 1] // city
    if (parts.length === 1) return parts[0]
  }
  return ''
}

function deriveWeatherGlyph(entry) {
  const w = (entry?.weather || '').toString().toLowerCase()
  if (w) {
    if (/storm|thunder/.test(w)) return '⛈'
    if (/rain|shower|drizzle/.test(w)) return '☔' // ☔
    if (/snow/.test(w)) return '❄'
    if (/cloud|overcast/.test(w)) return '☁'
    if (/sun|clear/.test(w)) return '☀'
    if (/fog|mist|haze/.test(w)) return '🌫'
  }
  // No weather field on the entry yet — infer from location (Pokhara = rain
  // for this trip's monsoon window).
  const leg = (entry?.leg || '').toLowerCase()
  const hotelLoc = (entry?.hotel?.location || '').toLowerCase()
  if (/pokhara/.test(leg) || /pokhara/.test(hotelLoc)) return '☔'
  return null
}

function deriveLed(entry) {
  // late-night override (driver's local clock)
  const h = new Date().getHours()
  if (h >= 22 || h < 5) return 'is-late'
  // active = explicit status OR last entry's date matches today
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${mm}-${dd}`
  if (entry?.status === 'active') return ''
  if (entry?.date === todayStr) return ''
  return 'is-halted'
}

export default function FieldStatus() {
  const entry = lastEntry()
  if (!entry) return null

  const dayStr = String(entry.day || 0).padStart(2, '0')
  const loc = deriveLocation(entry).toUpperCase()
  const wx = deriveWeatherGlyph(entry)
  const ledClass = deriveLed(entry)

  const labelBits = [
    'LIVE',
    `DAY ${dayStr}`,
    loc,
  ].filter(Boolean)

  return (
    <Link
      to="/log"
      className={`field-status ${ledClass}`.trim()}
      aria-label={`Field status: Day ${dayStr}${loc ? `, ${loc}` : ''}${wx ? ', raining' : ''} — open field log`}
      title="Open field log"
    >
      <span className="fs-led" aria-hidden="true" />
      <span>{labelBits[0]}</span>
      <span className="fs-sep" aria-hidden="true">·</span>
      <span className="fs-day">{labelBits[1]}</span>
      {loc && (
        <>
          <span className="fs-sep" aria-hidden="true">·</span>
          <span className="fs-loc">{labelBits[2]}</span>
        </>
      )}
      {wx && (
        <>
          <span className="fs-sep" aria-hidden="true">·</span>
          <span className="fs-wx" aria-hidden="true">{wx}</span>
        </>
      )}
    </Link>
  )
}
