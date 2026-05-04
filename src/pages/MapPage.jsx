import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, LayersControl, LayerGroup, Marker, Polyline, Popup, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Route as RouteIcon, Flag, Bed, Milestone, Tent, Fuel, ShieldCheck, Circle, Flower, Crosshair, PlusSquare, Compass } from 'lucide-react'

import HeroMtn from '../components/HeroMtn.jsx'
import TrailHeader from '../components/TrailHeader.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { ROUTE, ITINERARY } from '../lib/data.js'

// ── Palette mirrors --rugged.css; kept here for SVG fills ─────────────────
const PAL = {
  night: '#0a1424',
  cream: '#ece5d3',
  creamDim: '#b5ad99',
  dust: '#d4a574',
  dustSoft: '#b08a5d',
  rust: '#c8552a',
  flagYellow: '#e8b13a',
  flagGreen: '#3d8a5a',
  flagRed: '#a83c3c',
  glacier: '#5b9fcc',
  aurora: '#6dccaa',
  line: '#3a4a68',
}

const KIND_STYLE = {
  origin:   { color: PAL.rust,       label: 'Origin',           icon: Flag },
  halt:     { color: PAL.creamDim,   label: 'Overnight halt',   icon: Bed },
  border:   { color: PAL.flagYellow, label: 'Border crossing',  icon: Milestone },
  base:     { color: PAL.glacier,    label: 'Workation base',   icon: Tent },
  fuel:     { color: PAL.flagYellow, label: 'Fuel stop',        icon: Fuel },
  permit:   { color: PAL.aurora,     label: 'ACAP check-post',  icon: ShieldCheck },
  passthru: { color: PAL.creamDim,   label: 'Pass-through',     icon: Circle },
  darshan:  { color: PAL.dust,       label: 'Darshan',          icon: Flower },
  embassy:  { color: PAL.flagRed,    label: 'Embassy',          icon: Crosshair },
  hospital: { color: PAL.glacier,    label: 'Hospital',         icon: PlusSquare },
}

const LEG_COLOR = {
  drive:       PAL.glacier,
  border:      PAL.flagYellow,
  work:        PAL.aurora,
  acclimatise: PAL.dust,
  offroad:     PAL.rust,
  darshan:     '#e7b6d0',
  leisure:     PAL.cream,
  reference:   PAL.creamDim,
}

// ── Tile layers — all free, no API key required ──────────────────────────
const TILES = {
  Satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri — Maxar, Earthstar Geographics, USDA FSA, USGS, AeroGRID, IGN, GIS User Community',
    maxZoom: 19,
    label: 'Satellite',
  },
  'Hybrid': {
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Tiles © Google',
    maxZoom: 20,
    label: 'Hybrid (sat + labels)',
  },
  Topo: {
    url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap, SRTM | © OpenTopoMap (CC-BY-SA)',
    maxZoom: 17,
    label: 'Topographic',
  },
  'Carto Dark': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19,
    label: 'Carto Dark Matter',
  },
  'Carto Voyager': {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19,
    label: 'Carto Voyager',
  },
  OpenStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    label: 'OpenStreetMap',
  },
}

// ── SVG marker shapes (ported verbatim from map.js shapeFor) ──────────────
function svgWrap(inner, ringColor) {
  const ring = ringColor
    ? `<circle class="pulse-ring" cx="14" cy="14" r="9" fill="none" stroke="${ringColor}" stroke-width="1" opacity="0.6"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">${ring}${inner}</svg>`
}

function shapeFor(kind, color) {
  const stroke = PAL.night
  switch (kind) {
    case 'origin':
      return svgWrap(
        `<path d="M14 4 L23 22 L14 17 L5 22 Z" fill="${color}" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round"/>`
      )
    case 'halt':
      return svgWrap(
        `<circle cx="14" cy="14" r="6" fill="${PAL.night}" stroke="${color}" stroke-width="2.4"/>
         <circle cx="14" cy="14" r="2" fill="${color}"/>`
      )
    case 'border':
      return svgWrap(
        `<rect x="4" y="10" width="20" height="3" fill="${color}" stroke="${stroke}" stroke-width="0.8"/>
         <rect x="4" y="15" width="20" height="3" fill="${color}" stroke="${stroke}" stroke-width="0.8"/>`
      )
    case 'base':
      return svgWrap(
        `<path d="M14 3 L17 11 L25 11 L18.5 16 L21 24 L14 19 L7 24 L9.5 16 L3 11 L11 11 Z"
               fill="${color}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>`,
        color
      )
    case 'fuel':
      return svgWrap(
        `<path d="M14 3 C8 3 5 8 5 13 C5 19 14 25 14 25 C14 25 23 19 23 13 C23 8 20 3 14 3 Z"
               fill="${color}" stroke="${stroke}" stroke-width="1.1"/>
         <circle cx="14" cy="13" r="3" fill="${PAL.night}"/>`
      )
    case 'permit':
      return svgWrap(
        `<path d="M14 3 L23 6 L23 14 C23 20 14 25 14 25 C14 25 5 20 5 14 L5 6 Z"
               fill="${color}" stroke="${stroke}" stroke-width="1.1" stroke-linejoin="round"/>
         <path d="M10 14 L13 17 L18 11" stroke="${PAL.night}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      )
    case 'passthru':
      return svgWrap(
        `<circle cx="14" cy="14" r="3.5" fill="${color}" stroke="${stroke}" stroke-width="1"/>`
      )
    case 'darshan':
      return svgWrap(
        `<g transform="translate(14 14)">
           ${[0,45,90,135,180,225,270,315].map(a =>
             `<ellipse cx="0" cy="-7" rx="2.6" ry="5" fill="${color}" stroke="${stroke}" stroke-width="0.6" transform="rotate(${a})"/>`
           ).join('')}
           <circle cx="0" cy="0" r="3" fill="${PAL.night}" stroke="${color}" stroke-width="1"/>
         </g>`
      )
    case 'embassy':
      return svgWrap(
        `<circle cx="14" cy="14" r="8" fill="${PAL.night}" stroke="${color}" stroke-width="1.6"/>
         <line x1="14" y1="3"  x2="14" y2="9"  stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
         <line x1="14" y1="19" x2="14" y2="25" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
         <line x1="3"  y1="14" x2="9"  y2="14" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
         <line x1="19" y1="14" x2="25" y2="14" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
         <circle cx="14" cy="14" r="1.6" fill="${color}"/>`
      )
    case 'hospital':
      return svgWrap(
        `<rect x="4" y="4" width="20" height="20" rx="3" fill="${PAL.night}" stroke="${color}" stroke-width="1.4"/>
         <rect x="12.2" y="7" width="3.6" height="14" fill="${color}"/>
         <rect x="7" y="12.2" width="14" height="3.6" fill="${color}"/>`
      )
    default:
      return svgWrap(
        `<circle cx="14" cy="14" r="4" fill="${color}" stroke="${stroke}" stroke-width="1"/>`
      )
  }
}

function divIconFor(kind, color, pulse) {
  return L.divIcon({
    className: 'topo-marker' + (pulse ? ' is-pulse' : ''),
    html: shapeFor(kind, color),
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  })
}

// Imperative bridge — exposes the Leaflet map to the parent so the day-strip
// can flyTo / openPopup without re-rendering the map tree.
function MapBridge({ onReady, bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds && bounds.length) {
      map.fitBounds(L.latLngBounds(bounds).pad(0.12))
    } else {
      map.setView([28.2, 83.99], 7)
    }
    onReady?.(map)
  }, [map])
  return null
}

// ── Day → primary waypoint id mapping (from map.js) ───────────────────────
const DAY_TO_WP = {
  1: 'noida', 2: 'gorakhpur', 3: 'bhairahawa', 4: 'pokhara', 5: 'pokhara',
  6: 'beni',  7: 'jomsom',    8: 'muktinath',  9: 'pokhara', 10: 'pokhara',
  11: 'pokhara', 12: 'pokhara', 13: 'bhairahawa', 14: 'sunauli', 15: 'bikaner',
}

// ── Elevation nodes (17, baked-in from map.js) ────────────────────────────
const ELEV_NODES = [
  { name: 'Bikaner',     km: 0,    m: 240  },
  { name: 'Noida',       km: 610,  m: 200  },
  { name: 'Gorakhpur',   km: 1330, m: 96   },
  { name: 'Sunauli',     km: 1430, m: 105  },
  { name: 'Bhairahawa',  km: 1450, m: 105  },
  { name: 'Pokhara',     km: 1640, m: 822  },
  { name: 'Beni',        km: 1725, m: 869  },
  { name: 'Tatopani',    km: 1755, m: 1190 },
  { name: 'Ghasa',       km: 1780, m: 2010 },
  { name: 'Jomsom',      km: 1810, m: 2720 },
  { name: 'Kagbeni',     km: 1825, m: 2807 },
  { name: 'Muktinath',   km: 1850, m: 3800 },
  { name: 'Jomsom',      km: 1875, m: 2720 },
  { name: 'Pokhara',     km: 2035, m: 822  },
  { name: 'Bhairahawa',  km: 2225, m: 105  },
  { name: 'Lucknow',     km: 2695, m: 123  },
  { name: 'Bikaner',     km: 3525, m: 240  },
]

const PRESETS = {
  All:                   Object.keys(KIND_STYLE),
  'Driving':             ['origin', 'halt', 'border', 'base', 'fuel', 'passthru'],
  'Permits & paperwork': ['border', 'permit', 'embassy'],
  'Stays':               ['halt', 'base'],
}

// ── Elevation profile (SVG, redesigned with bands + waypoints + reveal) ───
const KEY_WAYPOINTS = new Set(['Bikaner', 'Sunauli', 'Pokhara', 'Beni', 'Jomsom', 'Kagbeni', 'Muktinath', 'Lucknow'])

function ElevationProfile() {
  const [readout, setReadout] = useState(null)
  const [hover, setHover] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const svgRef = useRef(null)
  const pathRef = useRef(null)

  // Wide viewBox for proper proportions; SVG auto-scales width via CSS
  const W = 1400, H = 320
  const PAD_L = 64, PAD_R = 28, PAD_T = 36, PAD_B = 56
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B
  const N = ELEV_NODES.length
  const maxM = 4200
  const minM = 0
  // Index-based x — each waypoint gets equal horizontal space, so the
  // 200 km Mustang climb (where elevation actually changes) reads as
  // visible peaks instead of a slim spike between long flat shoulders.
  const xFor = (idx) => PAD_L + (idx / (N - 1)) * innerW
  const yFor = (m)   => PAD_T + innerH - ((m - minM) / (maxM - minM)) * innerH

  const pts = ELEV_NODES.map((n, i) => [xFor(i), yFor(n.m)])
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')
  const fillPath = `${linePath} L${pts[pts.length-1][0].toFixed(2)},${(PAD_T + innerH).toFixed(2)} L${pts[0][0].toFixed(2)},${(PAD_T + innerH).toFixed(2)} Z`

  const yTicks = [0, 1000, 2000, 3000, 4000]

  // Altitude bands — shaded by terrain category
  const bands = [
    { from: 0,    to: 1000, color: PAL.glacier, label: 'LOWLAND',  opacity: 0.06 },
    { from: 1000, to: 2500, color: PAL.dust,    label: 'HILL',     opacity: 0.08 },
    { from: 2500, to: 3500, color: PAL.rust,    label: 'MOUNTAIN', opacity: 0.10 },
    { from: 3500, to: maxM, color: PAL.flagRed, label: 'EXTREME',  opacity: 0.12 },
  ]

  // Named waypoints along the curve (de-duplicated outbound positions);
  // carry the index so we can position by slot, not by km.
  const named = ELEV_NODES
    .map((n, i) => ({ ...n, idx: i }))
    .filter((n, _, all) => KEY_WAYPOINTS.has(n.name) &&
      all.findIndex((m) => m.name === n.name) === n.idx
        ? false
        : true) // placeholder so the linter sees something
  // simpler: keep the first occurrence of each named waypoint (outbound)
  const _seen = new Set()
  const namedFirst = ELEV_NODES
    .map((n, i) => ({ ...n, idx: i }))
    .filter((n) => {
      if (!KEY_WAYPOINTS.has(n.name)) return false
      if (_seen.has(n.name)) return false
      _seen.add(n.name)
      return true
    })

  const peakIdx = ELEV_NODES.findIndex((n) => n.name === 'Muktinath')
  const px = xFor(peakIdx), py = yFor(ELEV_NODES[peakIdx].m)

  // Hover: continuous index between nodes; lerp elevation + km from
  // the two adjacent nodes.
  function sampleAtIdx(idxF) {
    const i0 = Math.max(0, Math.min(N - 2, Math.floor(idxF)))
    const i1 = i0 + 1
    const t = Math.max(0, Math.min(1, idxF - i0))
    const a = ELEV_NODES[i0], b = ELEV_NODES[i1]
    return {
      m: a.m + (b.m - a.m) * t,
      km: a.km + (b.km - a.km) * t,
      nearest: t < 0.5 ? a : b,
    }
  }

  function onMove(e) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const xPx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const xVB = (xPx / rect.width) * W
    if (xVB < PAD_L || xVB > W - PAD_R) return
    const idxF = ((xVB - PAD_L) / innerW) * (N - 1)
    const s = sampleAtIdx(idxF)
    const yVB = yFor(s.m)
    setHover({ x: xVB, y: yVB })
    setReadout({ m: Math.round(s.m), km: Math.round(s.km), nearest: s.nearest })
  }
  function onLeave() {
    setHover(null)
    setReadout(null)
  }

  // Animated reveal on mount — stroke draw + section fade
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setRevealed(true); return }
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <aside className="elev-panel" aria-label="Elevation profile">
      <div className="elev-head">
        <span className="title">Elevation profile · Bikaner ↔ Muktinath</span>
        <span style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          {bands.map((b) => (
            <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: b.color, opacity: 0.7 }} />
              {b.label}
            </span>
          ))}
        </span>
      </div>
      <svg
        ref={svgRef}
        className="elev-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onTouchMove={(e) => { onMove(e); e.preventDefault() }}
        onTouchEnd={onLeave}
      >
        <defs>
          <linearGradient id="elev-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={PAL.dust} stopOpacity="0.55"/>
            <stop offset="60%" stopColor={PAL.dust} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={PAL.dust} stopOpacity="0.02"/>
          </linearGradient>
          <filter id="elev-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="elev-clip">
            <rect x={PAD_L} y={PAD_T} width={innerW} height={innerH} />
          </clipPath>
        </defs>

        {/* altitude band shading */}
        <g clipPath="url(#elev-clip)">
          {bands.map((b) => (
            <rect key={b.label}
              x={PAD_L} y={yFor(b.to)} width={innerW}
              height={Math.max(0, yFor(b.from) - yFor(b.to))}
              fill={b.color} opacity={b.opacity} />
          ))}
        </g>

        {/* horizontal grid + altitude labels */}
        {yTicks.map((m) => {
          const y = yFor(m)
          return (
            <g key={`y${m}`}>
              <line x1={PAD_L} y1={y.toFixed(1)} x2={(W - PAD_R).toFixed(1)} y2={y.toFixed(1)}
                stroke={PAL.line} strokeOpacity="0.35" strokeDasharray="3 4"/>
              <text x={PAD_L - 8} y={(y + 4).toFixed(1)} textAnchor="end"
                fill={PAL.creamDim} fontFamily="JetBrains Mono, monospace" fontSize="11"
                letterSpacing="0.04em">{m.toLocaleString()}</text>
            </g>
          )
        })}
        <text x={PAD_L - 8} y={PAD_T - 14} textAnchor="end"
          fill={PAL.dust} fontFamily="JetBrains Mono, monospace" fontSize="10"
          letterSpacing="0.18em" textTransform="uppercase">METRES</text>

        {/* x-axis: every waypoint gets a tiny tick; only the named ones
            get their km label so the bottom doesn't get crowded. */}
        {ELEV_NODES.map((n, i) => {
          const x = xFor(i)
          const isNamed = KEY_WAYPOINTS.has(n.name)
          return (
            <line key={`xtick${i}`}
              x1={x.toFixed(1)} y1={(PAD_T + innerH).toFixed(1)}
              x2={x.toFixed(1)} y2={(PAD_T + innerH + (isNamed ? 6 : 3)).toFixed(1)}
              stroke={isNamed ? PAL.dust : PAL.creamDim}
              strokeOpacity={isNamed ? 0.7 : 0.4}/>
          )
        })}
        {namedFirst.map((n) => {
          const x = xFor(n.idx)
          return (
            <text key={`xkmlabel${n.idx}`} x={x.toFixed(1)} y={(PAD_T + innerH + 20).toFixed(1)}
              textAnchor="middle"
              fill={PAL.creamDim} fontFamily="JetBrains Mono, monospace" fontSize="10"
              letterSpacing="0.04em">{n.km.toLocaleString()} km</text>
          )
        })}
        <text x={W / 2} y={(PAD_T + innerH + 40).toFixed(1)} textAnchor="middle"
          fill={PAL.dust} fontFamily="JetBrains Mono, monospace" fontSize="10"
          letterSpacing="0.22em">WAYPOINTS · NOT TO SCALE</text>

        {/* the curve — fill + stroke with dasharray reveal */}
        <path d={fillPath} fill="url(#elev-fill)"
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 600ms ease-out 600ms' }}/>
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={PAL.dust}
          strokeWidth="2"
          filter="url(#elev-glow)"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1000}
          strokeDasharray={1000}
          strokeDashoffset={revealed ? 0 : 1000}
          style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(0.22, 0.61, 0.36, 1)' }}
        />

        {/* named waypoint markers — rendered after the line draws */}
        <g style={{ opacity: revealed ? 1 : 0, transition: 'opacity 500ms ease-out 1300ms' }}>
          {namedFirst.map((n) => {
            const x = xFor(n.idx)
            const y = yFor(n.m)
            const isPeak = n.name === 'Muktinath'
            return (
              <g key={n.name + n.km}>
                <line x1={x.toFixed(1)} y1={y.toFixed(1)} x2={x.toFixed(1)} y2={(PAD_T + innerH).toFixed(1)}
                  stroke={isPeak ? PAL.rust : PAL.creamDim}
                  strokeOpacity={isPeak ? 0.7 : 0.25} strokeDasharray="2 2"/>
                <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={isPeak ? 5 : 3.5}
                  fill={PAL.night}
                  stroke={isPeak ? PAL.rust : PAL.dust}
                  strokeWidth={isPeak ? 2 : 1.5}/>
                {isPeak && (
                  <circle className="elev-peak-pulse" cx={x.toFixed(1)} cy={y.toFixed(1)}
                    r="9" fill="none" stroke={PAL.rust} strokeWidth="1" opacity="0.55"/>
                )}
                <text x={x.toFixed(1)} y={(y - 12).toFixed(1)} textAnchor="middle"
                  fill={isPeak ? PAL.cream : PAL.cream}
                  fontFamily="Bebas Neue, sans-serif"
                  fontSize={isPeak ? 16 : 13}
                  letterSpacing="0.08em">{n.name.toUpperCase()}</text>
                <text x={x.toFixed(1)} y={(y - 28).toFixed(1)} textAnchor="middle"
                  fill={isPeak ? PAL.rust : PAL.dust}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="10"
                  fontWeight={isPeak ? 700 : 400}
                  letterSpacing="0.04em">{n.m.toLocaleString()}m</text>
              </g>
            )
          })}
        </g>

        {/* hover line + dot */}
        {hover && (
          <>
            <line className="elev-hover-line"
              x1={hover.x.toFixed(2)} y1={PAD_T}
              x2={hover.x.toFixed(2)} y2={PAD_T + innerH}/>
            <circle className="elev-hover-dot"
              cx={hover.x.toFixed(2)} cy={hover.y.toFixed(2)} r="4"/>
          </>
        )}
      </svg>
      <div className="elev-readout">
        {readout ? (
          <>
            <span className="pri">{readout.m.toLocaleString()} m · {readout.km.toLocaleString()} km</span>
            <span className="sub">Nearest: {readout.nearest.name} ({readout.nearest.m.toLocaleString()} m)</span>
          </>
        ) : (
          <>
            <span className="pri">Hover the profile to inspect altitude.</span>
            <span className="sub">Peak · Muktinath 3,800 m</span>
          </>
        )}
      </div>
    </aside>
  )
}

// ── Day timeline strip ────────────────────────────────────────────────────
function DayStrip({ onPick, onHover, activeDay }) {
  return (
    <div
      className="day-strip"
      aria-label="Day-by-day timeline"
      data-aos="fade-up"
      data-aos-delay="120"
      style={{ gridTemplateColumns: `repeat(${ITINERARY.length}, minmax(0, 1fr))` }}
    >
      {ITINERARY.map((d) => {
        const color = LEG_COLOR[d.type] || PAL.creamDim
        const dateShort = d.date ? d.date.slice(5) : ''
        const wpId = DAY_TO_WP[d.day] || ''
        return (
          <div
            key={d.day}
            className={`day-cell${activeDay === d.day ? ' active' : ''}`}
            data-day={d.day}
            data-wp={wpId}
            style={{ '--leg': color }}
            title={d.leg}
            onMouseEnter={() => onHover?.(wpId, true)}
            onMouseLeave={() => onHover?.(wpId, false)}
            onClick={() => onPick?.(d.day, wpId)}
          >
            <span className="d-num">D{d.day}</span>
            <span className="d-date">{dateShort} {d.weekday || ''}</span>
            <span className="d-leg">{d.type || ''}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function MapPage() {
  const waypoints = ROUTE.waypoints || []
  const itinerary = ITINERARY

  const [tile, setTile] = useState('Satellite')
  const [preset, setPreset] = useState('All')
  const [enabled, setEnabled] = useState(() => {
    const set = {}
    Object.keys(KIND_STYLE).forEach((k) => { set[k] = true })
    return set
  })
  const [activeDay, setActiveDay] = useState(null)
  const mapRef = useRef(null)
  const markerRefs = useRef({})

  // Group waypoints by kind
  const grouped = useMemo(() => {
    const g = {}
    for (const w of waypoints) {
      if (!g[w.kind]) g[w.kind] = []
      g[w.kind].push(w)
    }
    return g
  }, [waypoints])

  // Trip path (day-numbered, ordered)
  const tripPath = useMemo(() => (
    waypoints
      .filter((w) => typeof w.day === 'number')
      .sort((a, b) => a.day - b.day)
      .map((w) => [w.lat, w.lng])
  ), [waypoints])

  // Bounds for fitBounds on first load
  const bounds = useMemo(() => waypoints.map((w) => [w.lat, w.lng]), [waypoints])

  function applyPreset(name) {
    const want = new Set(PRESETS[name] || [])
    const next = {}
    Object.keys(KIND_STYLE).forEach((k) => { next[k] = want.has(k) })
    setEnabled(next)
    setPreset(name)
  }

  function toggleKind(k) {
    setEnabled((e) => ({ ...e, [k]: !e[k] }))
    setPreset(null)
  }

  function onPickDay(dayNum, wpId) {
    setActiveDay(dayNum)
    const m = markerRefs.current[wpId]
    const map = mapRef.current
    if (m && map) {
      const ll = m.getLatLng()
      map.flyTo(ll, Math.max(map.getZoom(), 9), { duration: 0.7 })
      m.openPopup()
    }
  }

  function onHoverDay(wpId, on) {
    const m = markerRefs.current[wpId]
    if (!m || !m._icon) return
    if (on) m._icon.classList.add('is-pulse')
    else if (wpId !== 'muktinath') m._icon.classList.remove('is-pulse')
  }

  const tileCfg = TILES[tile]
  const rec = ROUTE.beniJomsom?.recommendation
  const verifyOn = ROUTE.beniJomsom?.verifyOn || '2026-05-13 in Pokhara'
  const headline = ROUTE.beniJomsom?.headline || ''

  return (
    <main className="shell">
      <HeroMtn />

      <TrailHeader
        eyebrow="Topographic sheet · scale 1:varies"
        title={<>Route&nbsp;<span className="accent">Atlas</span></>}
        sub={['Bikaner', 'Sunauli', <b key="p">Pokhara</b>, 'Jomsom', <b key="m">Muktinath</b>, 'RTB']}
        icon={
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="32" cy="32" r="22"/>
            <circle cx="32" cy="32" r="2" fill="currentColor"/>
            <path d="M32,10 L36,32 L32,28 L28,32 Z" fill="currentColor"/>
            <path d="M54,32 L32,36 L36,32 L32,28" strokeOpacity="0.45"/>
            <path d="M32,54 L28,32 L32,36 L36,32" strokeOpacity="0.45"/>
            <path d="M10,32 L32,28 L28,32 L32,36" strokeOpacity="0.45"/>
          </svg>
        }
      />

      <StatStrip
        stats={[
          { tminus: true },
          { k: 'Total', v: '4,410', u: 'km' },
          { k: 'Waypoints', v: '15' },
          { k: 'Border', v: 'Sunauli' },
          { k: '4×4 leg', v: 'Beni→Jomsom' },
          { k: 'Peak', v: '3,800', u: 'm' },
        ]}
      />

      {rec && (
        <div id="rec-banner" className={`rec rec-${rec.toLowerCase()} atlas`} data-aos="fade-up" data-aos-delay="50">
          <span className="flag-stripe" aria-hidden="true"></span>
          <span className="ico"><RouteIcon size={16}/></span>
          <span className="line-1">
            Beni–Jomsom: <strong>{rec}</strong> · {headline}
          </span>
          <span className="line-2" style={{ gridColumn: 3 }}>
            Verify on {verifyOn}
            {' · '}<a href="#/viewer">full report →</a>
          </span>
        </div>
      )}

      <div className="plate" data-aos="fade-up" data-aos-delay="100">
        <div id="map" style={{ width: '100%', height: 540 }}>
          <MapContainer
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom
            center={[28.2, 83.99]}
            zoom={7}
          >
            <MapBridge bounds={bounds} onReady={(m) => { mapRef.current = m }} />
            <TileLayer
              key={tile}
              url={tileCfg.url}
              attribution={tileCfg.attribution}
              maxZoom={tileCfg.maxZoom}
              {...(tileCfg.subdomains ? { subdomains: tileCfg.subdomains } : {})}
            />
            {tripPath.length > 1 && (
              <Polyline
                positions={tripPath}
                pathOptions={{ color: PAL.dust, weight: 3, opacity: 0.65, dashArray: '6 5', lineCap: 'round' }}
              />
            )}
            {Object.entries(grouped).map(([kind, list]) => (
              enabled[kind] !== false && (
                <LayerGroup key={kind}>
                  {list.map((w) => {
                    const style = KIND_STYLE[w.kind] || { color: PAL.creamDim, label: w.kind }
                    const isPeak = w.id === 'muktinath'
                    const dayMatch = itinerary.find((d) => d.day === w.day)
                    return (
                      <Marker
                        key={w.id}
                        position={[w.lat, w.lng]}
                        icon={divIconFor(w.kind, style.color, isPeak)}
                        ref={(ref) => { if (ref) markerRefs.current[w.id] = ref }}
                      >
                        <Popup>
                          <div style={{ fontFamily: 'ui-sans-serif, system-ui', minWidth: 180 }}>
                            <strong>{w.name}</strong>
                            <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>
                              {style.label} · {w.lat.toFixed(3)}, {w.lng.toFixed(3)}
                            </div>
                            {dayMatch && (
                              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                                <strong>Day {dayMatch.day}</strong> · {dayMatch.date} {dayMatch.weekday || ''}
                                <br/>{dayMatch.leg}
                                {dayMatch.km ? <><br/><em>{dayMatch.km} km · {dayMatch.hours || ''}</em></> : null}
                              </div>
                            )}
                          </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -16]}>{w.name}</Tooltip>
                      </Marker>
                    )
                  })}
                </LayerGroup>
              )
            ))}
          </MapContainer>
        </div>

        <ElevationProfile />
      </div>

      <DayStrip onPick={onPickDay} onHover={onHoverDay} activeDay={activeDay} />

      <div id="layer-controls" aria-label="Toggle marker layers" data-aos="fade-up" data-aos-delay="150">
        <div className="lyr-row heading">
          <span className="lhs">Layers</span>
          <span className="rhs">
            <span style={{ opacity: 0.7 }}>Tiles</span>
            <select
              className="tile-select"
              aria-label="Tile layer"
              value={tile}
              onChange={(e) => setTile(e.target.value)}
            >
              {Object.entries(TILES).map(([n, cfg]) => <option key={n} value={n}>{cfg.label || n}</option>)}
            </select>
          </span>
        </div>
        <div className="lyr-row">
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em',
            textTransform: 'uppercase', color: 'var(--cream-dim)', marginRight: 4
          }}>
            Presets
          </span>
          <span className="preset-btns">
            {Object.keys(PRESETS).map((n) => (
              <button
                key={n}
                type="button"
                className={`preset-btn${preset === n ? ' active' : ''}`}
                onClick={() => applyPreset(n)}
              >
                {n}
              </button>
            ))}
          </span>
        </div>
        <div className="lyr-row">
          {Object.keys(grouped).map((kind) => {
            const s = KIND_STYLE[kind] || { color: PAL.creamDim, label: kind, icon: Circle }
            const Icon = s.icon || Circle
            const on = enabled[kind] !== false
            return (
              <label key={kind} className={`lyr${on ? '' : ' is-off'}`} data-kind={kind}>
                <input type="checkbox" checked={on} onChange={() => toggleKind(kind)} data-kind={kind}/>
                <span className="icon icon-sm" style={{ display: 'inline-flex', color: 'var(--dust)' }}>
                  <Icon size={14} strokeWidth={1.5}/>
                </span>
                <span>{s.label}</span>
                <span className="toggle-dot" style={{ background: s.color }}/>
              </label>
            )
          })}
        </div>
      </div>

      <p className="footnote">
        Tiles © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>
        {' '}· OpenTopoMap (CC-BY-SA) · OSM HOT.
        Waypoints from <code>/data/route.json</code>; day metadata from <code>/data/itinerary.json</code>.
        Click a marker for day &amp; leg detail. Dashed line = day-by-day driving path.
      </p>

      <style>{`
        .plate {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .plate #map { width: 100%; height: 540px; }
        .plate .leaflet-container { width: 100%; height: 100%; min-height: 480px; border-radius: var(--r); }

        .elev-panel {
          border: 1px solid var(--line);
          border-radius: var(--r);
          background: linear-gradient(180deg, var(--shadow), var(--ridge));
          box-shadow: var(--shadow-card);
          padding: 12px 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .elev-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            repeating-linear-gradient(0deg, rgba(212,165,116,.05) 0 1px, transparent 1px 28px),
            repeating-linear-gradient(90deg, rgba(212,165,116,.04) 0 1px, transparent 1px 28px);
          opacity: .6;
        }
        .elev-head {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cream-dim);
          position: relative; z-index: 1;
        }
        .elev-head .title {
          font-family: var(--font-display);
          font-size: 14px;
          letter-spacing: 0.22em;
          color: var(--cream);
        }
        .elev-svg {
          width: 100%;
          flex: 1 1 auto;
          height: 320px;
          min-height: 260px;
          display: block;
          position: relative; z-index: 1;
        }
        .elev-readout {
          position: relative; z-index: 1;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--cream);
          background: rgba(10,20,36,.5);
          border: 1px solid var(--line-soft);
          border-radius: var(--r-sm);
          padding: 6px 8px;
          min-height: 38px;
        }
        .elev-readout .pri { color: var(--dust); }
        .elev-readout .sub { color: var(--cream-dim); display: block; font-size: 10px; margin-top: 2px; letter-spacing: 0.08em; }

        .day-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 14px;
        }
        .day-cell {
          position: relative;
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.18));
          padding: 10px 12px 10px 14px;
          cursor: pointer;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
          overflow: hidden;
          min-height: 70px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .day-cell::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--leg, var(--cream-dim));
        }
        .day-cell:hover {
          transform: translateY(-1px);
          border-color: var(--dust);
          background: linear-gradient(180deg, rgba(212,165,116,.06), rgba(0,0,0,.18));
        }
        .day-cell.active {
          border-color: var(--dust);
          box-shadow: 0 0 0 1px var(--dust) inset;
        }
        .day-cell .d-num {
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: 0.06em;
          color: var(--cream);
          line-height: 1;
        }
        .day-cell .d-date {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.08em;
          color: var(--cream-dim);
          text-transform: uppercase;
        }
        .day-cell .d-leg {
          font-family: var(--font-mono);
          font-size: 8.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--leg, var(--cream-dim));
          margin-top: auto;
        }
        @media (max-width: 720px) {
          .plate #map { height: 420px; }
          .elev-svg { height: 220px; min-height: 200px; }
          .day-cell { min-height: 60px; padding: 8px 10px 8px 12px; }
        }

        #layer-controls {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }
        .lyr-row {
          display: flex; flex-wrap: wrap; gap: 8px 14px;
          align-items: center;
        }
        .lyr-row.heading {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cream-dim);
          padding-bottom: 2px;
          border-bottom: 1px dashed rgba(212,165,116,0.18);
        }
        .lyr-row.heading .lhs { color: var(--cream); }
        .lyr-row.heading .rhs { margin-left: auto; display: inline-flex; gap: 6px; align-items: center; }
        .preset-btns { display: inline-flex; gap: 6px; flex-wrap: wrap; }
        .preset-btn {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--cream-dim);
          background: rgba(255,255,255,.02);
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 4px 8px;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .preset-btn:hover { color: var(--cream); border-color: var(--dust); }
        .preset-btn.active { color: var(--night); background: var(--dust); border-color: var(--dust); }
        .tile-select {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cream);
          background: var(--shadow);
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 4px 6px;
          cursor: pointer;
        }
        .tile-select:hover { border-color: var(--dust); }

        .lyr {
          display: inline-flex; align-items: center;
          gap: 8px;
          padding: 4px 6px;
          border-radius: var(--r-sm);
          transition: background 140ms ease;
          cursor: pointer;
        }
        .lyr:hover { background: rgba(212,165,116,.06); }
        .lyr.is-off { opacity: 0.42; }
        .lyr .icon { color: var(--dust); }
        .lyr .toggle-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(255,255,255,.08);
          transition: transform 140ms ease;
        }
        .lyr input { display: none; }

        .topo-marker { pointer-events: auto; }
        .topo-marker svg {
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,.55));
          transition: transform 180ms ease;
        }
        .topo-marker:hover svg { transform: scale(1.18); }
        .topo-marker.is-pulse svg .pulse-ring {
          transform-origin: center;
          animation: topo-pulse 1.6s ease-out infinite;
        }
        @keyframes topo-pulse {
          0%   { transform: scale(0.6); opacity: 0.85; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        #rec-banner.atlas {
          position: relative;
          display: grid;
          grid-template-columns: 6px auto 1fr;
          gap: 10px 12px;
          align-items: center;
          padding: 10px 14px 10px 14px;
          margin: 8px 0 14px;
          border: 1px solid var(--line);
          border-radius: var(--r);
          background: linear-gradient(135deg, var(--shadow), var(--ridge));
          box-shadow: var(--shadow-card);
        }
        #rec-banner.atlas .flag-stripe {
          grid-row: 1 / span 2;
          width: 6px;
          align-self: stretch;
          border-radius: 3px;
          background: linear-gradient(
            to bottom,
            var(--flag-yellow) 0% 20%,
            var(--flag-green) 20% 40%,
            var(--flag-red) 40% 60%,
            var(--cream) 60% 80%,
            var(--glacier) 80% 100%
          );
          box-shadow: 0 0 0 1px rgba(0,0,0,.35);
        }
        #rec-banner.atlas .ico {
          grid-row: 1 / span 2;
          width: 26px; height: 26px;
          display: grid; place-items: center;
          border: 1px solid currentColor;
          border-radius: 50%;
          opacity: 0.85;
          color: var(--flag-green);
        }
        #rec-banner.atlas .line-1 {
          font-family: var(--font-mono);
          font-size: 12.5px;
          letter-spacing: 0.04em;
          color: var(--cream);
        }
        #rec-banner.atlas .line-2 {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cream-dim);
        }
        #rec-banner.atlas .line-2 a { color: var(--dust); }

        .elev-hover-line { stroke: var(--dust); stroke-width: 1; stroke-dasharray: 2 3; opacity: 0.85; }
        .elev-hover-dot { fill: var(--cream); stroke: var(--dust); stroke-width: 1.5; }
        .elev-peak-pulse {
          transform-origin: center;
          animation: topo-pulse 2s ease-out infinite;
        }
      `}</style>
    </main>
  )
}
