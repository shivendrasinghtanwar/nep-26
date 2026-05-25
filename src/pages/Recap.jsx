/**
 * Recap — single-page condensed overview of the trip, computed entirely
 * from data/triplog.json (the real log). No hardcoded marketing numbers.
 *
 * Goal: someone landing on /recap should understand the whole trip in
 * ~5 minutes of scrolling — what we did, how far, who we met, what was
 * worth doing, what wasn't.
 *
 * Sections:
 *  1. Hero + vital stats
 *  2. The story in five acts (phase-based narrative)
 *  3. Route map (Leaflet)
 *  4. Altitude profile (SVG line)
 *  5. Daily distance chart (vehicle + walking bars)
 *  6. People we met
 *  7. Honest verdicts (lessons from warn-tone events)
 *  8. Where we slept (chronological hotels)
 *  9. Weather diary (distribution)
 * 10. Plan vs Actual
 */

import { useMemo, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import {
  ChevronLeft, MapPin, Mountain, Car, Footprints, Hotel,
  Users, AlertTriangle, Cloud, Calendar, ArrowRight, Route as RouteIcon,
  HeartHandshake, Camera, Backpack, Shield, Sparkles, Palette,
} from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { TRIPLOG, ITINERARY } from '../lib/data.js'

// ── Reference data ──────────────────────────────────────────────────────

// Altitude lookup (m). Lift-and-extend from Log.jsx so this page is
// self-contained.
const ALT = {
  bikaner: 224, lucknow: 123, agra: 171, gorakhpur: 84, noida: 200,
  sunauli: 90, bhairahawa: 109, butwal: 205, lumbini: 150,
  pokhara: 827, sarangkot: 1592, beni: 835, tatopani: 1190, jomsom: 2720,
  muktinath: 3760, thamel: 1400, kathmandu: 1400,
  bharatpur: 200, sauraha: 200, chitwan: 200,
}

// Lat/lon for the route map. Real coordinates of the cities where
// we slept or transited — used for markers + a schematic polyline.
const LOC = {
  bikaner:   { lat: 28.0229, lon: 73.3119, label: 'Bikaner' },
  lucknow:   { lat: 26.8467, lon: 80.9462, label: 'Lucknow' },
  sunauli:   { lat: 27.4977, lon: 83.4543, label: 'Sunauli' },
  butwal:    { lat: 27.7006, lon: 83.4484, label: 'Butwal' },
  pokhara:   { lat: 28.2096, lon: 83.9856, label: 'Pokhara' },
  muktinath: { lat: 28.8167, lon: 83.8728, label: 'Muktinath' },
  kathmandu: { lat: 27.7172, lon: 85.3240, label: 'Kathmandu' },
  sauraha:   { lat: 27.5793, lon: 84.4960, label: 'Sauraha' },
  agra:      { lat: 27.1767, lon: 78.0081, label: 'Agra' },
}

// Order in which the trip touched these cities (real overnight + transit
// points, in chronological order). Used to draw the polyline.
const TRIP_PATH = [
  'bikaner', 'lucknow', 'sunauli', 'butwal', 'pokhara',
  'muktinath', 'pokhara', 'kathmandu', 'sauraha',
  'sunauli', 'agra', 'bikaner',
]

// Five-act phase definition — date-range based so changes to entries
// don't break the narrative grouping.
const PHASES = [
  {
    id: 'outbound',
    title: 'The outbound surplus',
    dayRange: [1, 3],
    blurb: 'Bikaner → Pokhara in 3 days instead of the planned 4. The Agra-Lucknow Expressway gift + same-day border crossing + Butwal-to-Pokhara push banked 2 days of headroom.',
    pin: 'Arrived Pokhara a day ahead of plan.',
  },
  {
    id: 'basecamp',
    title: 'Pokhara base camp',
    dayRange: [4, 6],
    blurb: 'Used the banked days for the texture the plan never wrote in — Lakeside cafes, Sarangkot pre-dawn, Pumdikot at night, ACAP permits, INR→NPR cash, last-minute prep.',
    pin: 'Found the trip\'s rhythm without doing anything dramatic.',
  },
  {
    id: 'mustang',
    title: 'The Mustang compression',
    dayRange: [7, 8],
    blurb: 'Pokhara → Muktinath in half a day, same-day darshan at 3,810 m, AMS-aware descent next morning. Every planner said 4 days; we did 2.',
    pin: '108 dharas, the Hyderabad-neighbour coincidence at Bob Marley, French hitchhikers on the way down.',
  },
  {
    id: 'reinvest',
    title: 'The off-plan reinvestment',
    dayRange: [9, 12],
    blurb: 'Original plan had 4 Pokhara work days here. We bought Kathmandu instead — Boudha, Pashupati, Kopan, two Durbar squares, Swayambhunath at sunset.',
    pin: 'Reunited with Ayush at Pashupati after 8 years. The map closing on itself, mid-trip.',
  },
  {
    id: 'jungle-home',
    title: 'Jungle, then home',
    dayRange: [13, 16],
    blurb: 'Last unplanned destination — Chitwan. Canoe + safari + (the actual highlight) a wild rhino on the village street walking to dinner. Then Sunauli back, Gorakhpur fuel hunt, Agra one-night, Bikaner home.',
    pin: 'The free walk to dinner beat the paid 4-hour safari for wildlife sighting.',
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────

function fmtDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00+05:30')
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
  } catch { return iso }
}

// Derive end-of-day altitude (m) from a log entry — same logic as Log.jsx.
function entryAltitude(entry) {
  if (!entry) return 0
  let halt = entry.hotel?.location
  if (!halt && entry.leg) {
    halt = entry.leg.includes('→') ? entry.leg.split('→').pop() : entry.leg
  }
  if (!halt) return 0
  const lower = halt.toLowerCase()
  const order = [
    'muktinath', 'jomsom', 'sarangkot', 'tatopani', 'beni',
    'thamel', 'kathmandu',
    'pokhara', 'butwal', 'bhairahawa', 'lumbini', 'sunauli', 'gorakhpur',
    'sauraha', 'chitwan', 'bharatpur',
    'lucknow', 'agra', 'noida', 'bikaner',
  ]
  for (const k of order) {
    if (lower.includes(k)) return ALT[k] || 0
  }
  return 0
}

// People-encounter events: filtered curation across the trip.
function isPeopleEvent(ev) {
  if (!ev?.text) return false
  const icon = ev.icon || ''
  const txt = ev.text
  if (icon === '🤝') return true
  if (icon === '🥾' && /Hitchhiker|hitchhiker/.test(txt)) return true
  if (icon === '🎨' && /Mann|family/i.test(txt)) return true
  if (icon === '🚙' && /(photo-op|fan|Ukrainian)/i.test(txt)) return true
  return false
}

// Categorise an encounter so we can render each with its own visual
// signature instead of repeating the same handshake glyph everywhere.
// Returns { kind, label, Icon, accent } — `Icon` is a Lucide component.
function categoriseEncounter(ev) {
  const txt = (ev?.text || '').toLowerCase()
  if (/officer|customs|scan/.test(txt)) {
    return { kind: 'official', label: 'Official', Icon: Shield, accent: 'rgba(91,159,204,0.85)' }
  }
  if (/hitchhiker|valentina|gabe/.test(txt)) {
    return { kind: 'stranger', label: 'Travellers', Icon: Backpack, accent: 'rgba(212,165,116,0.9)' }
  }
  if (/photo-op|ukrainian|fan|guest at/.test(txt)) {
    return { kind: 'stranger', label: 'Stranger', Icon: Camera, accent: 'rgba(212,165,116,0.9)' }
  }
  if (/manager|family|mann|artist/.test(txt)) {
    return { kind: 'host', label: 'Host', Icon: Palette, accent: 'rgba(232,177,58,0.9)' }
  }
  if (/coincidence|pattern|three locations|part 2|part 3/.test(txt)) {
    return { kind: 'coincidence', label: 'Coincidence', Icon: Sparkles, accent: 'rgba(200,85,42,0.95)' }
  }
  // Default: a planned reunion or named meet-up
  return { kind: 'reunion', label: 'Reunion', Icon: HeartHandshake, accent: 'rgba(61,138,90,0.85)' }
}

// Weather glyph mapping
const WX_GLYPHS = {
  clear: '☀',
  'partly cloudy': '⛅',
  cloudy: '☁',
  overcast: '☁',
  drizzle: '🌦',
  rain: '🌧',
  thunderstorm: '⛈',
  snow: '❄',
  fog: '🌫',
}

// ── Subcomponents ───────────────────────────────────────────────────────

// Mini altitude sparkline · gives each act its own visual fingerprint.
// Pulled in as an inline SVG so it inherits the dossier palette.
function ActSparkline({ days }) {
  const W = 200, H = 56
  const PAD = 4
  if (!days.length) return null
  const alts = days.map((d) => entryAltitude(d))
  const maxAlt = Math.max(...alts, 1)
  const minAlt = 0
  const x = (i) =>
    days.length === 1
      ? W / 2
      : PAD + (i / (days.length - 1)) * (W - PAD * 2)
  const y = (a) =>
    H - PAD - ((a - minAlt) / (maxAlt - minAlt || 1)) * (H - PAD * 2)
  const linePath = days
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(alts[i]).toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L ${x(days.length - 1).toFixed(1)} ${H - PAD} L ${x(0).toFixed(1)} ${H - PAD} Z`
  const peakIdx = alts.indexOf(Math.max(...alts))
  return (
    <svg className="rc-act-spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Altitude trace for this act">
      <path d={areaPath} fill="rgba(212,165,116,0.10)" />
      <path d={linePath} fill="none" stroke="var(--dust)" strokeWidth="1.4" />
      {days.map((d, i) => (
        <circle
          key={d.day}
          cx={x(i)} cy={y(alts[i])}
          r={i === peakIdx ? 2.8 : 1.6}
          fill={i === peakIdx ? 'var(--rust)' : 'var(--dust)'}
          stroke="var(--night)" strokeWidth="0.8"
        />
      ))}
    </svg>
  )
}

// One chapter in the Story · single act of the five.
// Lives inside a zigzag layout — each card alternates left/right, with
// a connecting curve drawn between consecutive acts (see ActLink). The
// Roman numeral is a giant low-opacity watermark inside the card itself.
function ActChapter({ phase, idx, entries, side }) {
  const inRange = entries.filter(
    (e) => e.day >= phase.dayRange[0] && e.day <= phase.dayRange[1]
  )
  const km = inRange.reduce((s, e) => s + (e.km || 0), 0)
  const walkKm = inRange.reduce((s, e) => s + (e.walkKm || 0), 0)
  const days = inRange.length
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][idx] || String(idx + 1)
  const altMin = Math.min(...inRange.map(entryAltitude))
  const altMax = Math.max(...inRange.map(entryAltitude))

  return (
    <article
      className={`rc-act rc-act-${side}`}
      data-aos={`fade-${side === 'left' ? 'right' : 'left'}`}
    >
      <div className="rc-act-body">
        <span className="rc-act-watermark" aria-hidden="true">{roman}</span>
        <div className="rc-act-callsign">
          <span className="rc-act-tag">ACT {roman} · OP REPORT</span>
          <span className="rc-act-days">D{String(phase.dayRange[0]).padStart(2, '0')}–D{String(phase.dayRange[1]).padStart(2, '0')}</span>
        </div>
        <h3 className="rc-act-title">{phase.title}</h3>
        <div className="rc-act-stat-row">
          <div className="rc-act-stats">
            <span><Car size={11} strokeWidth={1.8} /> {km.toLocaleString()} <em>km</em></span>
            {walkKm > 0 && <span><Footprints size={11} strokeWidth={1.8} /> {walkKm} <em>km</em></span>}
            <span><Calendar size={11} strokeWidth={1.8} /> {days} <em>days</em></span>
            <span><Mountain size={11} strokeWidth={1.8} /> {altMin}–{altMax} <em>m</em></span>
          </div>
          <ActSparkline days={inRange} />
        </div>
        <p className="rc-act-blurb">{phase.blurb}</p>
        <div className="rc-act-intel">
          <span className="rc-act-intel-marker">▸ INTEL</span>
          <span className="rc-act-intel-text">{phase.pin}</span>
        </div>
      </div>
    </article>
  )
}

// Curve drawn between two consecutive acts in the zigzag.
//   direction === 'right' : we just placed a LEFT card, next is RIGHT.
//                           Curve exits the left half and arrives on right.
//   direction === 'left'  : we just placed a RIGHT card, next is LEFT.
//                           Mirror.
// The SVG uses preserveAspectRatio="none" so the curve stretches naturally
// to fill whatever width the grid hands it.
function ActLink({ direction }) {
  const path = direction === 'right'
    ? 'M 20 0 C 20 55 80 45 80 100'
    : 'M 80 0 C 80 55 20 45 20 100'
  return (
    <div className="rc-act-link" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={path}
          stroke="#c8552a"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function AltitudeChart({ entries }) {
  // Build a per-day altitude series, then render as an SVG line + filled
  // area. Day numbers on x-axis, altitudes on y-axis.
  const W = 880
  const H = 220
  const PAD = { top: 18, right: 18, bottom: 36, left: 56 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const series = entries.map((e) => ({
    day: e.day,
    date: e.date,
    alt: entryAltitude(e),
    halt: (e.hotel?.location || '').split(',').pop().trim() || 'Halt',
  }))
  const maxAlt = Math.max(...series.map((d) => d.alt), 100)
  const peak = series.reduce((p, c) => (c.alt > p.alt ? c : p), series[0])

  const x = (i) => PAD.left + (i / (series.length - 1)) * innerW
  const y = (alt) => PAD.top + innerH - (alt / maxAlt) * innerH

  const linePath = series
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.alt).toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L ${x(series.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${x(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`

  const gridLevels = [0, 1000, 2000, 3000, 4000].filter((g) => g <= maxAlt + 200)

  return (
    <div className="rc-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Altitude profile by day">
        {/* horizontal grid + y-axis labels */}
        {gridLevels.map((g) => (
          <g key={g}>
            <line
              x1={PAD.left} x2={W - PAD.right}
              y1={y(g)} y2={y(g)}
              stroke="var(--line)" strokeDasharray="2 4" strokeWidth="0.6"
            />
            <text
              x={PAD.left - 8} y={y(g) + 3}
              textAnchor="end"
              className="rc-axis"
            >
              {g.toLocaleString()}m
            </text>
          </g>
        ))}
        {/* altitude area */}
        <path d={areaPath} fill="rgba(212,165,116,0.10)" />
        <path d={linePath} fill="none" stroke="var(--dust)" strokeWidth="1.6" />
        {/* day markers */}
        {series.map((d, i) => (
          <g key={d.day}>
            <circle
              cx={x(i)} cy={y(d.alt)}
              r={d.day === peak.day ? 4 : 2.4}
              fill={d.day === peak.day ? 'var(--rust)' : 'var(--dust)'}
              stroke="var(--night)"
              strokeWidth="1.2"
            />
            {d.day === peak.day && (
              <text x={x(i)} y={y(d.alt) - 9} textAnchor="middle" className="rc-peak-label">
                {d.alt.toLocaleString()} m · {d.halt}
              </text>
            )}
          </g>
        ))}
        {/* x-axis day labels */}
        {series.map((d, i) => (
          <text
            key={d.day}
            x={x(i)}
            y={H - PAD.bottom + 16}
            textAnchor="middle"
            className="rc-axis"
          >
            D{String(d.day).padStart(2, '0')}
          </text>
        ))}
      </svg>
    </div>
  )
}

function DailyKmChart({ entries }) {
  // Vertical bars: vehicle km (dust) stacked with walk km (rust) per day.
  const W = 880
  const H = 220
  const PAD = { top: 18, right: 18, bottom: 36, left: 56 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const series = entries.map((e) => ({
    day: e.day,
    km: e.km || 0,
    walkKm: e.walkKm || 0,
    isDriving: (e.km || 0) > 0,
  }))
  const maxKm = Math.max(...series.map((d) => d.km), 1)

  const barW = innerW / series.length
  const gap = 4

  const yScale = (km) => (km / maxKm) * innerH

  const gridLevels = [0, 250, 500, 750, 1000].filter((g) => g <= maxKm + 50)

  return (
    <div className="rc-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily vehicle distance">
        {gridLevels.map((g) => (
          <g key={g}>
            <line
              x1={PAD.left} x2={W - PAD.right}
              y1={PAD.top + innerH - yScale(g)} y2={PAD.top + innerH - yScale(g)}
              stroke="var(--line)" strokeDasharray="2 4" strokeWidth="0.6"
            />
            <text
              x={PAD.left - 8} y={PAD.top + innerH - yScale(g) + 3}
              textAnchor="end" className="rc-axis"
            >
              {g}{g === 0 ? '' : ''}
            </text>
          </g>
        ))}
        {series.map((d, i) => {
          const x = PAD.left + i * barW + gap / 2
          const h = yScale(d.km)
          const yTop = PAD.top + innerH - h
          const w = barW - gap
          return (
            <g key={d.day}>
              {h > 0 && (
                <rect
                  x={x} y={yTop} width={w} height={h}
                  fill={d.isDriving ? 'var(--dust)' : 'var(--rust)'}
                  opacity={0.85}
                />
              )}
              {d.km > 0 && (
                <text
                  x={x + w / 2} y={yTop - 4}
                  textAnchor="middle"
                  className="rc-bar-label"
                >
                  {d.km}
                </text>
              )}
              {d.walkKm > 0 && d.km === 0 && (
                <text
                  x={x + w / 2} y={PAD.top + innerH - 4}
                  textAnchor="middle"
                  className="rc-bar-label rc-bar-label-walk"
                >
                  👣{d.walkKm}
                </text>
              )}
              <text
                x={x + w / 2} y={H - PAD.bottom + 16}
                textAnchor="middle" className="rc-axis"
              >
                D{String(d.day).padStart(2, '0')}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="rc-chart-legend">
        <span><span className="rc-swatch rc-swatch-drive" /> Drive day</span>
        <span><span className="rc-swatch rc-swatch-rest" /> Walking-only day</span>
      </div>
    </div>
  )
}

function RouteMap() {
  // Lightweight Leaflet schematic — markers at every overnight + transit
  // city, dashed polyline showing the path in order. Not a literal road
  // trace; just a "we went here, then here" overview.
  const path = TRIP_PATH.map((k) => [LOC[k].lat, LOC[k].lon])
  const dotIcon = useMemo(
    () => L.divIcon({
      className: 'rc-map-dot',
      html: '<span></span>',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    }),
    []
  )
  const peakIcon = useMemo(
    () => L.divIcon({
      className: 'rc-map-dot rc-map-dot-peak',
      html: '<span></span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    }),
    []
  )

  return (
    <div className="rc-map">
      <MapContainer
        center={[28.2, 81.5]}
        zoom={6}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <Polyline
          positions={path}
          pathOptions={{
            color: '#d4a574',
            weight: 2,
            dashArray: '4 5',
            opacity: 0.85,
          }}
        />
        {Object.entries(LOC).map(([k, v]) => (
          <Marker
            key={k}
            position={[v.lat, v.lon]}
            icon={k === 'muktinath' ? peakIcon : dotIcon}
          >
            <Tooltip permanent direction="top" offset={[0, -6]} className="rc-map-tip">
              {v.label}{k === 'muktinath' ? ' · 3,810 m' : ''}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

function WeatherDiary({ entries }) {
  const counts = {}
  entries.forEach((e) => {
    const w = e.weather || '—'
    counts[w] = (counts[w] || 0) + 1
  })
  const total = entries.length
  const order = ['clear', 'partly cloudy', 'overcast', 'cloudy', 'drizzle', 'rain', 'thunderstorm', 'snow', 'fog', '—']
  const rows = order.filter((k) => counts[k]).map((k) => ({ k, n: counts[k] }))

  return (
    <div className="rc-weather">
      {rows.map((r) => (
        <div key={r.k} className="rc-weather-row">
          <span className="rc-weather-glyph">{WX_GLYPHS[r.k] || '·'}</span>
          <span className="rc-weather-label">{r.k}</span>
          <span className="rc-weather-bar">
            <span
              className="rc-weather-fill"
              style={{ width: `${(r.n / total) * 100}%` }}
            />
          </span>
          <span className="rc-weather-count">{r.n}<span className="u">d</span></span>
        </div>
      ))}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────

export default function Recap() {
  const entries = TRIPLOG?.entries || []

  const stats = useMemo(() => {
    const totalKm = entries.reduce((s, e) => s + (e.km || 0), 0)
    const totalWalkKm = entries.reduce((s, e) => s + (e.walkKm || 0), 0)
    const drivingDays = entries.filter((e) => (e.km || 0) > 0).length
    const restDays = entries.length - drivingDays
    const altitudes = entries.map(entryAltitude)
    const peakAlt = Math.max(...altitudes, 0)
    const peakEntry = entries[altitudes.indexOf(peakAlt)] || entries[0]
    const longestDriveEntry = entries.reduce(
      (best, e) => ((e.km || 0) > (best?.km || 0) ? e : best),
      null
    )
    const longestWalkEntry = entries.reduce(
      (best, e) => ((e.walkKm || 0) > (best?.walkKm || 0) ? e : best),
      null
    )
    // Hotels (unique by name+location)
    const seen = new Set()
    const hotels = []
    entries.forEach((e) => {
      const key = `${e.hotel?.name || ''}|${e.hotel?.location || ''}`
      if (!seen.has(key) && e.hotel?.name) {
        seen.add(key)
        hotels.push({
          name: e.hotel.name,
          loc: e.hotel.location,
          map: e.hotel.map,
          firstDay: e.day,
          firstDate: e.date,
        })
      }
    })
    // Total events across the trip
    const eventCount = entries.reduce(
      (s, e) => s + (e.events?.length || 0),
      0
    )
    return {
      days: entries.length,
      nights: entries.length - 1,
      totalKm,
      totalWalkKm,
      drivingDays,
      restDays,
      peakAlt,
      peakEntry,
      longestDriveEntry,
      longestWalkEntry,
      hotels,
      eventCount,
      countries: 2,
    }
  }, [entries])

  const people = useMemo(() => {
    const out = []
    entries.forEach((e) => {
      (e.events || []).forEach((ev) => {
        if (isPeopleEvent(ev)) {
          out.push({ day: e.day, date: e.date, ...ev })
        }
      })
    })
    return out
  }, [entries])

  const lessons = useMemo(() => {
    const out = []
    entries.forEach((e) => {
      (e.events || []).forEach((ev) => {
        if (ev.tone === 'warn') {
          out.push({ day: e.day, date: e.date, ...ev })
        }
      })
    })
    return out
  }, [entries])

  const vitalStats = [
    { k: 'Days',       v: String(stats.days),                 u: '' },
    { k: 'Vehicle',    v: stats.totalKm.toLocaleString(),     u: 'km' },
    { k: 'On foot',    v: String(stats.totalWalkKm),          u: 'km' },
    { k: 'Peak',       v: stats.peakAlt.toLocaleString(),     u: 'm' },
    { k: 'Hotels',     v: String(stats.hotels.length),        u: '' },
    { k: 'Countries',  v: String(stats.countries),            u: '' },
  ]

  return (
    <main className="shell">
      <HeroMtn />

      <header className="trail-header">
        <div className="mark" aria-hidden="true">
          <RouteIcon size={32} strokeWidth={1.5} />
        </div>
        <div className="wordmark">
          <span className="rc-eyebrow">Section 11 · NEP-26 · the trip in one page</span>
          <h1>Re<span className="accent">cap</span></h1>
          <div className="sub">
            <span>How it actually went</span><span className="sep">//</span>
            <span><b>{stats.days}</b> days</span><span className="sep">//</span>
            <span><b>{stats.totalKm.toLocaleString()}</b> km</span><span className="sep">//</span>
            <span><b>{stats.peakAlt.toLocaleString()}</b> m peak</span>
          </div>
        </div>
        <Link className="back" to="/log">
          <ChevronLeft size={13} strokeWidth={1.6} />
          <span>Log</span>
        </Link>
      </header>

      <p className="muted" style={{ margin: '6px 0 24px', maxWidth: 760 }}>
        Everything below is computed from the actual field log, not the original itinerary —
        so the numbers, places, and verdicts on this page match what really happened.
      </p>

      <StatStrip stats={vitalStats} />

      {/* ────────── PLAN VS ACTUAL · the hook ────────── */}
      <section className="recap-section" id="delta">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Variance</span>
          <h2>Plan vs <span className="accent">actual</span></h2>
          <p className="muted">The plan was a vehicle for getting to Muktinath safely. Reality compressed the hard part and reinvested the surplus.</p>
        </div>
        <div className="rc-delta">
          <div className="rc-delta-col">
            <div className="rc-delta-label">Planned</div>
            <ul>
              <li>{ITINERARY.length} days · {ITINERARY.reduce((s, d) => s + (d.km || 0), 0).toLocaleString()} km</li>
              <li>1 country crossed (Nepal)</li>
              <li>4 Pokhara work days post-Mustang</li>
              <li>Muktinath = 4 days minimum</li>
              <li>Bikaner → Pokhara → Mustang → Pokhara → Bikaner</li>
            </ul>
          </div>
          <div className="rc-delta-arrow">→</div>
          <div className="rc-delta-col rc-delta-actual">
            <div className="rc-delta-label">Actual</div>
            <ul>
              <li>{stats.days} days · {stats.totalKm.toLocaleString()} km + {stats.totalWalkKm} km on foot</li>
              <li>2 countries (India + Nepal)</li>
              <li>4 KTM nights + 2 Chitwan nights added</li>
              <li>Muktinath done in <b>2 days</b></li>
              <li>Bikaner → Pokhara → Mustang → Pokhara → <b>Kathmandu</b> → <b>Chitwan</b> → Bikaner</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ────────── THE STORY · IN FIVE ACTS ────────── */}
      <section className="recap-section" id="story">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Story</span>
          <h2>In <span className="accent">five acts</span></h2>
          <p className="muted">Five chapters · each with its own altitude signature. The Mustang spike on Act III is the trip in one glance.</p>
        </div>
        <div className="rc-acts">
          {PHASES.map((p, i) => {
            const side = i % 2 === 0 ? 'left' : 'right'
            const nextSide = (i + 1) % 2 === 0 ? 'left' : 'right'
            return (
              <Fragment key={p.id}>
                <ActChapter phase={p} idx={i} entries={entries} side={side} />
                {i < PHASES.length - 1 && (
                  <ActLink direction={nextSide === 'right' ? 'right' : 'left'} />
                )}
              </Fragment>
            )
          })}
        </div>
      </section>

      {/* ────────── ROUTE MAP ────────── */}
      <section className="recap-section" id="route">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Route</span>
          <h2>Where we <span className="accent">went</span></h2>
          <p className="muted">{TRIP_PATH.length - 1} segments · {stats.totalKm.toLocaleString()} km on wheels. Schematic — straight lines between overnights, not literal roads.</p>
        </div>
        <RouteMap />
      </section>

      {/* ────────── ALTITUDE PROFILE ────────── */}
      <section className="recap-section" id="altitude">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Altitude</span>
          <h2>From plains to <span className="accent">peak</span></h2>
          <p className="muted">End-of-day altitude per logged day · peak at Muktinath, Day 7.</p>
        </div>
        <AltitudeChart entries={entries} />
      </section>

      {/* ────────── DAILY DISTANCE ────────── */}
      <section className="recap-section" id="distance">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Distance</span>
          <h2>Day by <span className="accent">day</span></h2>
          <p className="muted">
            Vehicle km per day · longest was D{String(stats.longestDriveEntry?.day || 0).padStart(2, '0')} ({stats.longestDriveEntry?.km?.toLocaleString()} km · {stats.longestDriveEntry?.leg}).
            Walking-only days are rust.
          </p>
        </div>
        <DailyKmChart entries={entries} />
      </section>

      {/* ────────── PEOPLE ────────── */}
      <section className="recap-section" id="people">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Encounters</span>
          <h2>The <span className="accent">people</span></h2>
          <p className="muted">{people.length} memorable encounters across the trip. The story-half of the dossier.</p>
        </div>
        <ul className="rc-encounter-list">
          {people.map((p, i) => {
            const cat = categoriseEncounter(p)
            const Icon = cat.Icon
            return (
              <li key={i} className={`rc-encounter rc-encounter-${cat.kind}`}>
                <div className="rc-encounter-side" style={{ '--cat-accent': cat.accent }}>
                  <span className="rc-encounter-icon" aria-hidden="true">
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <span className="rc-encounter-cat">{cat.label}</span>
                </div>
                <div className="rc-encounter-body">
                  <div className="rc-encounter-meta">
                    D{String(p.day).padStart(2, '0')} · {fmtDate(p.date)}
                  </div>
                  <div className="rc-encounter-text">{p.text}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ────────── LESSONS · HONEST VERDICTS ────────── */}
      <section className="recap-section" id="lessons">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Verdicts</span>
          <h2>Things to <span className="accent">know</span></h2>
          <p className="muted">{lessons.length} flagged events — scams, road conditions, traps, and ordinary advice from the trip.</p>
        </div>
        <ul className="rc-lesson-list">
          {lessons.map((l, i) => (
            <li key={i} className="rc-lesson">
              <span className="rc-lesson-icon"><AlertTriangle size={14} strokeWidth={1.8} /></span>
              <div className="rc-lesson-body">
                <div className="rc-lesson-meta">
                  D{String(l.day).padStart(2, '0')} · {fmtDate(l.date)}
                </div>
                <div className="rc-lesson-text">{l.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ────────── HOTELS · WHERE WE SLEPT ────────── */}
      <section className="recap-section" id="hotels">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Stays</span>
          <h2>Where we <span className="accent">slept</span></h2>
          <p className="muted">{stats.hotels.length} unique stays across {stats.nights} nights.</p>
        </div>
        <ol className="rc-hotel-list">
          {stats.hotels.map((h, i) => (
            <li key={i} className="rc-hotel">
              <span className="rc-hotel-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="rc-hotel-body">
                <div className="rc-hotel-name">{h.name}</div>
                <div className="rc-hotel-loc"><MapPin size={11} strokeWidth={1.8} /> {h.loc}</div>
                <div className="rc-hotel-meta">First check-in · D{String(h.firstDay).padStart(2, '0')} · {fmtDate(h.firstDate)}</div>
              </div>
              {h.map && (
                <a href={h.map} target="_blank" rel="noopener noreferrer" className="rc-hotel-map">
                  Map <ArrowRight size={11} strokeWidth={1.8} />
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ────────── WEATHER DIARY ────────── */}
      <section className="recap-section" id="weather">
        <div className="recap-section-head">
          <span className="rc-eyebrow">Weather</span>
          <h2>The <span className="accent">sky</span></h2>
          <p className="muted">Conditions logged across {stats.days} days — driven by the local cron's Open-Meteo lookup.</p>
        </div>
        <WeatherDiary entries={entries} />
      </section>

      <footer className="rc-footer">
        <p className="muted">
          The map closed on itself. <strong>{stats.totalKm.toLocaleString()} km</strong> on wheels ·
          <strong> {stats.totalWalkKm} km</strong> on foot ·
          <strong> {stats.days} days</strong> ·
          <strong> {stats.peakAlt.toLocaleString()} m</strong> peak ·
          <strong> {stats.hotels.length} hotels</strong> ·
          <strong> {people.length} named encounters</strong> ·
          <strong> {stats.eventCount} event chips</strong> logged.
        </p>
        <p className="muted">
          <Link to="/log" className="rc-footer-link">
            <RouteIcon size={11} strokeWidth={1.8} /> Open the full Field Log
          </Link>
        </p>
      </footer>
    </main>
  )
}
