import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronDown, MapPin, ExternalLink, Mountain, Route as RouteIcon, Footprints, Car, Link2, Check } from 'lucide-react'
import { marked } from 'marked'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { TRIPLOG, ITINERARY } from '../lib/data.js'

// Configure marked: open links in new tab, no auto-heading-ids, GFM
marked.setOptions({ gfm: true, breaks: true })

function renderNotes(md) {
  if (!md) return ''
  // Force every <a> to target="_blank" rel="noopener" so map links don't
  // navigate away from the dossier.
  return marked.parse(md).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
}

// ── Altitude lookup (metres above sea level) ─────────────────────────────
const ALT_LOOKUP = {
  bikaner: 224, lucknow: 123, agra: 171, gorakhpur: 84, noida: 200,
  sunauli: 90, bhairahawa: 109, butwal: 205, lumbini: 150,
  pokhara: 827, sarangkot: 1592, beni: 835, tatopani: 1190, jomsom: 2720,
  muktinath: 3760, home: 224,
}

// ── Helpers ──────────────────────────────────────────────────────────────
function fmtDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00+05:30')
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  } catch { return iso }
}

function locAlt(text) {
  if (!text) return null
  const lower = text.toLowerCase()
  // Order matters: peaks first so multi-word strings resolve correctly.
  const keys = [
    'muktinath', 'jomsom', 'tatopani', 'beni', 'pokhara',
    'butwal', 'bhairahawa', 'lumbini', 'sunauli', 'gorakhpur',
    'lucknow', 'agra', 'noida', 'bikaner', 'home',
  ]
  for (const k of keys) {
    if (lower.includes(k)) {
      const name = k === 'home' ? 'Bikaner' : k.charAt(0).toUpperCase() + k.slice(1)
      return { name, alt: ALT_LOOKUP[k] }
    }
  }
  return null
}

function buildProfile(entries, itinerary) {
  let cum = 0
  return itinerary.map((d, i) => {
    const done = i < entries.length
    const log = done ? entries[i] : null
    const km = done ? (log.km || 0) : (d.km || 0)
    cum += km

    // Use peak altitude if the day includes a Muktinath darshan
    let info
    if (d.leg && d.leg.toLowerCase().includes('muktinath')) {
      info = { name: 'Muktinath', alt: 3760, isPeak: true }
    } else {
      const halt = done ? (log.hotel?.location || log.leg) : d.halt
      info = locAlt(halt)
    }

    return {
      day: d.day,
      date: d.date,
      done,
      km,
      cumKm: cum,
      halt: info?.name || (d.halt || '—'),
      alt: info?.alt ?? 0,
      isPeak: info?.isPeak || false,
    }
  })
}

// ── SVG mark ─────────────────────────────────────────────────────────────
function LogMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8h24l8 8v40H16z" />
      <path d="M40 8v8h8" />
      <path d="M22 24h20M22 32h20M22 40h14" strokeOpacity="0.6" />
      <circle cx="48" cy="50" r="4" fill="currentColor" stroke="none" opacity=".8" />
    </svg>
  )
}

// ── Side rail: altitude profile (left) ───────────────────────────────────
function AltRail({ profile, currentDay }) {
  const maxAlt = Math.max(...profile.map(d => d.alt), 1)
  const current = profile.find(p => p.day === currentDay) || profile[0]
  const peak = profile.reduce((p, c) => (c.alt > p.alt ? c : p), profile[0])

  return (
    <aside className="log-rail log-rail-left" aria-label="Altitude profile by day">
      <div className="rail-header">
        <div className="rail-label">
          <Mountain size={11} strokeWidth={1.8} /> Altitude
        </div>
        <div className="rail-value">
          <span className="big">{current.alt.toLocaleString()}</span>
          <span className="unit">m</span>
        </div>
        <div className="rail-sub">{current.halt}</div>
      </div>

      <div className="rail-bars">
        {profile.map(d => {
          const w = Math.max((d.alt / maxAlt) * 100, 3)
          const cls = [
            'rail-row',
            d.done ? 'done' : 'upcoming',
            d.day === currentDay ? 'current' : '',
            d.isPeak ? 'peak' : '',
          ].filter(Boolean).join(' ')
          return (
            <div key={d.day} className={cls}>
              <span className="row-day">D{String(d.day).padStart(2, '0')}</span>
              <span className="row-track"><span className="row-bar" style={{ width: `${w}%` }} /></span>
              <span className="row-val">{d.alt}<span className="row-u">m</span></span>
            </div>
          )
        })}
      </div>

      <div className="rail-footer">
        <span className="rail-foot-label">Peak</span>
        <strong>{peak.alt.toLocaleString()} m</strong>
        <span className="rail-foot-sub">{peak.halt} · D{String(peak.day).padStart(2, '0')}</span>
      </div>
    </aside>
  )
}

// ── Side rail: cumulative km (right) ─────────────────────────────────────
function KmRail({ profile, currentDay }) {
  const total = profile[profile.length - 1].cumKm
  const current = profile.find(p => p.day === currentDay) || profile[0]

  return (
    <aside className="log-rail log-rail-right" aria-label="Cumulative distance by day">
      <div className="rail-header">
        <div className="rail-label">
          <RouteIcon size={11} strokeWidth={1.8} /> Distance
        </div>
        <div className="rail-value">
          <span className="big">{current.cumKm.toLocaleString()}</span>
          <span className="unit">km</span>
        </div>
        <div className="rail-sub">of {total.toLocaleString()} km</div>
      </div>

      <div className="rail-bars">
        {profile.map(d => {
          const w = Math.max((d.cumKm / total) * 100, 3)
          const cls = [
            'rail-row',
            d.done ? 'done' : 'upcoming',
            d.day === currentDay ? 'current' : '',
          ].filter(Boolean).join(' ')
          return (
            <div key={d.day} className={cls}>
              <span className="row-day">D{String(d.day).padStart(2, '0')}</span>
              <span className="row-track"><span className="row-bar" style={{ width: `${w}%` }} /></span>
              <span className="row-val">{d.cumKm.toLocaleString()}</span>
            </div>
          )
        })}
      </div>

      <div className="rail-footer">
        <span className="rail-foot-label">Total</span>
        <strong>{total.toLocaleString()} km</strong>
        <span className="rail-foot-sub">round-trip</span>
      </div>
    </aside>
  )
}

// ── Main page ────────────────────────────────────────────────────────────
export default function Log() {
  const entries = TRIPLOG?.entries || []
  const totalKm = entries.reduce((s, e) => s + (e.km || 0), 0)
  const lastEntry = entries[entries.length - 1]
  const currentLoc = lastEntry?.hotel?.location?.split(',')[0] || '—'
  const profile = buildProfile(entries, ITINERARY?.length ? ITINERARY : [])
  const currentDay = lastEntry?.day || 1

  // Page-flip scroll-snap: the field log reads as one long page, but each
  // .lb-entry should land at the top of the viewport so the dossier feels
  // like flipping through bound pages instead of doomscrolling. Toggle a
  // class on <html> only while this page is mounted; other routes get
  // their regular free scroll back.
  useEffect(() => {
    document.documentElement.classList.add('snap-log')
    return () => document.documentElement.classList.remove('snap-log')
  }, [])

  // Deep-link to a specific day: /log#day-NN scrolls to that article on
  // mount. With BrowserRouter the URL hash is FREE — it's a real anchor,
  // not router internal state — so we can use the native id-anchor form.
  // Browser will try to auto-scroll on direct load too, but our manual
  // scrollIntoView gives the scroll-margin-top behaviour for the sticky
  // topnav (and waits for AOS reveal first).
  const location = useLocation()
  const [copiedDay, setCopiedDay] = useState(null)
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1) // strip leading "#"
    if (!/^day-\d+$/.test(id)) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }, [location.hash])

  // Per-day notes expand/collapse state (mobile only; on desktop the
   // notes are always visible regardless of this set).
  const [openNotes, setOpenNotes] = useState(() => new Set())
  function toggleNotes(day) {
    setOpenNotes((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  function copyDeepLink(day) {
    const padded = String(day).padStart(2, '0')
    // Native anchor form — clean and shareable. BrowserRouter ignores the
    // hash for routing so it round-trips through the URL without surgery.
    const base = `${window.location.origin}${window.location.pathname}`
    const url = `${base}#day-${padded}`
    const fallback = () => {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch (_) {}
      document.body.removeChild(ta)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(fallback)
    } else {
      fallback()
    }
    setCopiedDay(day)
    setTimeout(() => setCopiedDay(null), 1500)
  }

  const stats = [
    { k: 'Days logged', v: String(entries.length),     u: '' },
    { k: 'km covered',  v: totalKm.toLocaleString(),    u: '' },
    { k: 'Last stop',   v: currentLoc,                  u: '' },
    { k: 'Status',      v: 'live',                      u: '' },
  ]

  return (
    <>
      {profile.length > 0 && <AltRail profile={profile} currentDay={currentDay} />}
      {profile.length > 0 && <KmRail profile={profile} currentDay={currentDay} />}

      <main className="shell">
        <HeroMtn />

        <header className="trail-header">
          <div className="mark" aria-hidden="true"><LogMark /></div>
          <div className="wordmark">
            <span className="eyebrow">Section 09 · NEP-26 · On the ground</span>
            <h1>Field <span className="accent">Log</span></h1>
            <div className="sub">
              <span>What actually happened</span><span className="sep">//</span>
              <span><b>{entries.length}</b> days logged</span><span className="sep">//</span>
              <span><b>{totalKm.toLocaleString()}</b> km covered</span><span className="sep">//</span>
              <span>Trip ongoing</span>
            </div>
          </div>
          <Link className="back" to="/">
            <ChevronLeft size={13} strokeWidth={1.6} />
            <span>Base</span>
          </Link>
        </header>

        <StatStrip stats={stats} />

        <div className="lb-masthead">
          <span>NEP-26 · {TRIPLOG?.meta?.vehicle || 'Thar Roxx'}</span>
          <span>Bikaner → Nepal → Bikaner</span>
        </div>

        <div className="lb-feed" data-aos="fade-up">
          {entries.map((e) => (
            <article
              key={e.day}
              id={`day-${String(e.day).padStart(2, '0')}`}
              className={`lb-entry status-${e.status || 'done'}`}
            >
              <div className="lb-dateline">
                <span className="lb-day-num">DAY {String(e.day).padStart(2, '0')}</span>
                <span className="lb-date">{e.weekday} · {fmtDate(e.date)}</span>
                <button
                  type="button"
                  className="lb-share"
                  onClick={() => copyDeepLink(e.day)}
                  title={`Copy share link · Day ${e.day}`}
                  aria-label={`Copy share link for day ${e.day}`}
                >
                  {copiedDay === e.day
                    ? <Check size={11} strokeWidth={2} />
                    : <Link2 size={11} strokeWidth={1.8} />
                  }
                  <span className="lb-share-label">
                    {copiedDay === e.day ? 'Copied' : 'Link'}
                  </span>
                </button>
                <span className={`lb-status ${e.status || 'done'}`}>
                  {e.status === 'active' ? '● in progress' : '✓ done'}
                </span>
              </div>

              <div className="lb-leg">{e.leg}</div>

              <div className="lb-km-row">
                {(e.km > 0 || e.hours) && (
                  <span className="lb-pill km" title="Thar Roxx · drive">
                    <Car size={12} strokeWidth={1.8} />
                    {[
                      e.km > 0 ? `${e.km.toLocaleString()} km` : null,
                      e.hours || null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
                {e.walkKm > 0 && (
                  <span
                    className="lb-pill lb-pill-walk"
                    title={`${e.walkKm} km on foot — not counted in trip total`}
                  >
                    <Footprints size={11} strokeWidth={1.8} />
                    {e.walkKm} km
                  </span>
                )}
                {e.route && <span className="lb-pill">{e.route}</span>}
              </div>

              <div className="lb-divider" />

              {e.notes && (
                <section
                  className={`lb-section lb-section-notes${openNotes.has(e.day) ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="lb-notes-toggle"
                    onClick={() => toggleNotes(e.day)}
                    aria-expanded={openNotes.has(e.day)}
                    aria-label={openNotes.has(e.day) ? 'Hide notes' : 'Show notes'}
                  >
                    <ChevronDown size={12} strokeWidth={2} className="chev" />
                    <span>Notes</span>
                  </button>
                  <div className="lb-section-label">Notes</div>
                  <div
                    className="lb-section-body lb-notes-md"
                    dangerouslySetInnerHTML={{ __html: renderNotes(e.notes) }}
                  />
                </section>
              )}

              {e.events && e.events.length > 0 && (
                <section className="lb-section">
                  <div className="lb-section-label">Events</div>
                  {e.events.map((ev, i) => (
                    <div key={i} className={`lb-event ${ev.tone || ''}`}>
                      <span className="lb-event-icon">{ev.icon || '●'}</span>
                      <span>{ev.text}</span>
                    </div>
                  ))}
                </section>
              )}

              {e.hotel && e.hotel.name && (
                <section className="lb-section">
                  <div className="lb-section-label">Slept at</div>
                  <div className="lb-hotel">
                    <MapPin size={16} aria-hidden />
                    <div className="lb-hotel-body">
                      <div className="lb-hotel-name">{e.hotel.name}</div>
                      <div className="lb-hotel-loc">
                        {e.hotel.location}
                        {e.hotel.map && (
                          <>
                            {' · '}
                            <a href={e.hotel.map} target="_blank" rel="noopener noreferrer">
                              map <ExternalLink size={10} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {e.delta && (
                <section className="lb-section">
                  <div className="lb-section-label">Vs plan</div>
                  <div className="lb-delta">{e.delta}</div>
                </section>
              )}
            </article>
          ))}
        </div>

        <p className="footnote">
          Source: <code>data/triplog.json</code> · rendered by <code>src/pages/Log.jsx</code> · last updated{' '}
          <strong style={{ color: 'var(--cream)' }}>{TRIPLOG?.meta?.lastUpdated || ''}</strong>.
        </p>
      </main>
    </>
  )
}
