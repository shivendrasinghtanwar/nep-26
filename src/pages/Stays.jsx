import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft, BedDouble, Wifi, WifiOff, IndianRupee, ParkingCircle,
  Star, Flame, ExternalLink, MapPin,
} from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { HOTELS } from '../lib/data.js'

const STAYS_CSS = `
  .stays-shell { display: flex; flex-direction: column; gap: 28px; margin-top: 18px; }

  .city-block {
    border: 1px solid var(--line);
    border-radius: var(--r);
    background: linear-gradient(180deg, var(--shadow), var(--ridge));
    box-shadow: var(--shadow-card);
    overflow: hidden;
    position: relative;
  }
  .city-block::before, .city-block::after {
    content: '';
    position: absolute;
    width: 12px; height: 12px;
    border: 1px solid var(--dust);
    opacity: .45;
    pointer-events: none;
  }
  .city-block::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
  .city-block::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

  .city-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding: 18px 22px 14px;
    border-bottom: 1px dashed rgba(212,165,116,0.22);
  }
  .city-head .name {
    font-family: var(--font-display);
    font-size: 26px;
    letter-spacing: 0.04em;
    color: var(--cream);
    margin: 0;
    min-width: 0;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .city-head .name .accent { color: var(--rust); }
  .city-head .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    color: var(--cream-dim);
    text-transform: uppercase;
    /* allow the meta line (dates · options · price-range · /night) to break
       at the · separators rather than overflow when it doesn't fit one row */
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 0;
    row-gap: 4px;
    min-width: 0;
    max-width: 100%;
  }
  .city-head .meta > * { white-space: nowrap; }
  .city-head .meta b { color: var(--dust); font-weight: 600; }
  .city-head .meta .meta-cell {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }
  .city-head .meta .sep { margin: 0 8px; opacity: 0.35; }

  .candidates {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1px;
    background: var(--line-soft);
  }
  .hotel-card {
    background: var(--shadow);
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    transition: background 200ms ease-out;
  }
  .hotel-card:hover { background: var(--ridge); }
  .hotel-card.is-top {
    background: linear-gradient(180deg, rgba(200,85,42,.06), rgba(200,85,42,.02));
  }
  .hotel-card.is-top:hover {
    background: linear-gradient(180deg, rgba(200,85,42,.10), rgba(200,85,42,.04));
  }

  .hotel-card .top-pill {
    position: absolute;
    top: 12px; right: 14px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--rust);
    border: 1px solid var(--rust);
    padding: 2px 7px;
    border-radius: 2px;
    background: rgba(10,20,36,.6);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .hotel-name {
    font-family: var(--font-display);
    font-size: 19px;
    letter-spacing: 0.03em;
    color: var(--cream);
    line-height: 1.2;
    margin-right: 70px; /* leave room for the top-pill */
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--dust);
  }
  .price-row .rating {
    margin-left: auto;
    color: var(--flag-yellow);
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
  }

  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .badge {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    padding: 3px 7px 3px 6px;
    border-radius: 2px;
    border: 1px solid var(--line-soft);
    background: rgba(255,255,255,.02);
    color: var(--cream-dim);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .badge.ok    { color: var(--aurora);     border-color: rgba(109,204,170,.4); background: rgba(109,204,170,.06); }
  .badge.warn  { color: var(--flag-yellow); border-color: rgba(232,177,58,.4);   background: rgba(232,177,58,.06); }
  .badge.bad   { color: var(--flag-red);   border-color: rgba(168,60,60,.4);   background: rgba(168,60,60,.06); }
  .badge.muted { opacity: 0.7; }

  .hotel-notes {
    font-size: 13px;
    line-height: 1.5;
    color: rgba(236,229,211,.82);
    margin: 4px 0 0;
  }

  .hotel-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .hotel-actions a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--glacier);
    text-decoration: none;
    padding: 4px 0;
    border-bottom: 1px dashed rgba(91,159,204,.4);
    transition: color 160ms;
  }
  .hotel-actions a:hover { color: var(--cream); border-color: var(--cream); }

  .city-flags {
    padding: 12px 22px;
    background: rgba(232,177,58,.04);
    border-top: 1px dashed rgba(212,165,116,0.18);
    font-family: var(--font-mono);
    font-size: 11.5px;
    line-height: 1.6;
    color: var(--cream-dim);
  }
  .city-flags strong { color: var(--flag-yellow); margin-right: 6px; }
  .city-flags ul { margin: 4px 0 0 16px; padding: 0; }
  .city-flags li { margin: 4px 0; }

  @media (max-width: 640px) {
    .candidates { grid-template-columns: 1fr; }
    .city-head {
      padding: 14px 16px 10px;
      /* stack the name above the meta so the meta has the full row width
         to wrap into when the price range pushes the content past 1 line */
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .city-head .name { font-size: 22px; }
    .city-head .meta { font-size: 10.5px; letter-spacing: 0.10em; }
    .city-head .meta .sep { margin: 0 6px; }
    .hotel-card { padding: 14px 16px; }
    .hotel-name { font-size: 17px; margin-right: 64px; word-break: break-word; }
    .hotel-notes { font-size: 13px; }
    .price-row { flex-wrap: wrap; row-gap: 4px; }
    .price-row .rating { margin-left: auto; }
    /* bump action-link tap targets to ≥36px and gap so a thumb can land */
    .hotel-actions { gap: 8px 14px; }
    .hotel-actions a {
      padding: 10px 0;
      font-size: 12px;
      min-height: 36px;
      letter-spacing: 0.12em;
    }
    .city-flags { padding: 10px 16px; font-size: 11px; }
    .city-flags ul { margin: 4px 0 0 14px; }
  }
  @media (max-width: 380px) {
    .city-head .name { font-size: 20px; }
    .city-head .meta { font-size: 10px; letter-spacing: 0.08em; }
    .hotel-name { font-size: 16px; margin-right: 60px; }
    .hotel-card .top-pill { font-size: 8.5px; padding: 2px 5px; }
  }
`

function StaysIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M8,38 L8,52 L56,52 L56,38" />
      <path d="M8,38 L20,28 L44,28 L56,38" />
      <rect x="22" y="36" width="20" height="14" rx="1" strokeOpacity="0.55" />
      <line x1="32" y1="36" x2="32" y2="50" strokeOpacity="0.4" />
    </svg>
  )
}

// Parse an INR price band like "INR 5,500–6,500 / night" or
// "INR 70,000+ / night" into [min, max] numbers (or null if unparseable).
function parsePriceBand(s) {
  if (!s) return null
  const nums = String(s).match(/\d{1,3}(?:,\d{3})*|\d+/g)
  if (!nums || nums.length === 0) return null
  const vals = nums.map((n) => parseInt(n.replace(/,/g, ''), 10)).filter((v) => !isNaN(v) && v > 100)
  if (!vals.length) return null
  return [Math.min(...vals), Math.max(...vals)]
}

function cityPriceRange(city) {
  const ranges = (city.candidates || [])
    .map((h) => parsePriceBand(h.priceBand))
    .filter(Boolean)
  if (!ranges.length) return null
  const lo = Math.min(...ranges.map((r) => r[0]))
  const hi = Math.max(...ranges.map((r) => r[1]))
  if (lo === hi) return `₹${lo.toLocaleString('en-IN')}`
  return `₹${lo.toLocaleString('en-IN')}–${hi.toLocaleString('en-IN')}`
}

function flagsFor(hotel) {
  const f = []
  if (hotel.fibre === true)  f.push({ k: 'wifi-ok', label: 'Fibre',         icon: Wifi,    cls: 'ok' })
  if (hotel.fibre === false) f.push({ k: 'wifi-no', label: 'No fibre',      icon: WifiOff, cls: 'warn' })
  if (hotel.parking)         f.push({ k: 'parking', label: 'Parking',       icon: ParkingCircle, cls: 'ok' })
  if (hotel.heater)          f.push({ k: 'heater',  label: 'Heater',        icon: Flame,   cls: 'ok' })
  if (hotel.heater === false) f.push({ k: 'no-heater', label: 'No heater',  icon: Flame,   cls: 'warn' })
  if (hotel.priceFlag === 'over')   f.push({ k: 'budget', label: 'Over budget', icon: IndianRupee, cls: 'warn' })
  if (hotel.priceFlag === 'splurge') f.push({ k: 'splurge', label: 'Splurge',  icon: IndianRupee, cls: 'warn' })
  return f
}

function HotelCard({ hotel, isTop }) {
  const Icon = BedDouble
  const flags = flagsFor(hotel)
  return (
    <article className={`hotel-card${isTop ? ' is-top' : ''}`}>
      {isTop && (
        <span className="top-pill">
          <Star size={10} strokeWidth={2.2} />
          Top pick
        </span>
      )}
      <h3 className="hotel-name">
        <Icon size={16} strokeWidth={1.6} style={{ verticalAlign: '-3px', marginRight: 6, color: 'var(--dust)' }} />
        {hotel.name}
      </h3>
      <div className="price-row">
        <IndianRupee size={13} strokeWidth={1.8} />
        <span>{hotel.priceBand || '—'}</span>
        {typeof hotel.rating === 'number' && (
          <span className="rating">
            <Star size={12} strokeWidth={1.8} fill="currentColor" />
            {hotel.rating.toFixed(1)}
          </span>
        )}
      </div>
      {flags.length > 0 && (
        <div className="badge-row">
          {flags.map((f) => {
            const I = f.icon
            return (
              <span key={f.k} className={`badge ${f.cls}`}>
                <I size={10} strokeWidth={1.8} />
                {f.label}
              </span>
            )
          })}
        </div>
      )}
      {hotel.notes && <p className="hotel-notes">{hotel.notes}</p>}
      <div className="hotel-actions">
        {hotel.url && (
          <a href={hotel.url} target="_blank" rel="noopener noreferrer">
            Hotel <ExternalLink size={11} strokeWidth={1.8} />
          </a>
        )}
        {hotel.bookingUrl && (
          <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
            Booking <ExternalLink size={11} strokeWidth={1.8} />
          </a>
        )}
      </div>
    </article>
  )
}

export default function Stays() {
  const cities = HOTELS?.shortlist || []
  const totalCandidates = cities.reduce((acc, c) => acc + (c.candidates?.length || 0), 0)
  const totalNights = cities.reduce((acc, c) => {
    if (!c.checkIn || !c.checkOut) return acc
    return acc + Math.max(1, Math.round((new Date(c.checkOut) - new Date(c.checkIn)) / 86400000))
  }, 0)

  const stats = [
    { tminus: true },
    { k: 'Cities',      v: cities.length },
    { k: 'Candidates',  v: totalCandidates },
    { k: 'Nights',      v: totalNights },
    { k: 'Compiled',    v: HOTELS?.fetchedAt?.slice(0, 10) || '—' },
  ]

  return (
    <main className="shell">
      <style>{STAYS_CSS}</style>
      <HeroMtn />

      <header className="trail-header">
        <div className="mark" aria-hidden="true"><StaysIcon /></div>
        <div className="wordmark">
          <span className="eyebrow">Section 08 · Stays shortlist</span>
          <h1>Where to <span className="accent">sleep</span></h1>
          <div className="sub">
            <span><b>{cities.length}</b> cities</span><span className="sep">//</span>
            <span><b>{totalCandidates}</b> candidates</span><span className="sep">//</span>
            <span><b>{totalNights}</b> nights</span><span className="sep">//</span>
            <span>research 2026-05-04</span>
          </div>
        </div>
        <Link className="back" to="/">
          <ChevronLeft size={13} strokeWidth={1.6} />
          <span>Base</span>
        </Link>
      </header>

      <StatStrip stats={stats} />

      <p className="muted" style={{ margin: '6px 0 0' }}>
        Top pick + 2–3 backups per overnight stop. Fibre / heater / parking flags surface what
        matters for the workation block, the cold Jomsom nights, and the firm-registered SUV.
        Re-verify live before booking — aggregator prices drift weekly.
      </p>

      <div className="callout" data-aos="fade-up" style={{ margin: '18px 0 8px' }}>
        <b>Booking sequence:</b> lock the <b>Pokhara 6-night block</b> first
        (Waterfront or Atithi by 2026-05-07). Then Jomsom (phone-confirm Om's Home heater,
        not blanket — wife on trip, May nights drop to 5 °C). Then Bhairahawa and the India side.
      </div>

      <div className="stays-shell">
        {cities.map((c, idx) => {
          // mark first candidate as top pick by convention from playbook 03
          const flagged = (HOTELS?.redFlags || []).filter(
            (f) => (f.city || '').toLowerCase() === c.city.toLowerCase()
          )
          return (
            <section className="city-block" key={c.city} data-aos="fade-up" data-aos-delay={idx * 40}>
              <header className="city-head">
                <h2 className="name">
                  <MapPin size={18} strokeWidth={1.8} style={{ verticalAlign: '-3px', marginRight: 6, color: 'var(--rust)' }} />
                  {c.city}
                </h2>
                <div className="meta">
                  <span className="meta-cell">
                    <b>{c.checkIn}</b>{c.checkOut !== c.checkIn ? ` → ${c.checkOut}` : ''}
                  </span>
                  <span className="sep" aria-hidden="true">·</span>
                  <span className="meta-cell">
                    <b>{c.candidates?.length || 0}</b> options
                  </span>
                  {cityPriceRange(c) && (
                    <>
                      <span className="sep" aria-hidden="true">·</span>
                      <span className="meta-cell meta-price">
                        <b style={{ color: 'var(--rust)' }}>{cityPriceRange(c)}</b>
                        <span style={{ marginLeft: 4, opacity: .65 }}>/ night</span>
                      </span>
                    </>
                  )}
                </div>
              </header>
              <div className="candidates">
                {(c.candidates || []).map((h, i) => (
                  <HotelCard key={h.name} hotel={h} isTop={i === 0} />
                ))}
              </div>
              {flagged.length > 0 && (
                <div className="city-flags">
                  <strong>⚑ Flags:</strong>
                  <ul>
                    {flagged.map((f, j) => <li key={j}>{f.note || f.summary || JSON.stringify(f)}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )
        })}
      </div>

      <p className="footnote" style={{ marginTop: 24 }}>
        Source: <code>data/hotels.json</code> (compiled 2026-05-04 · 23 candidates · 7 cities).
        Narrative form: <a href="../docs/HOTELS_SHORTLIST.md">docs/HOTELS_SHORTLIST.md</a>.
        Border-night logic: <a href="../docs/DAY_3_BORDER_DECISION.md">DAY_3_BORDER_DECISION.md</a>.
        Per-day reasoning: <Link to="/itinerary">Itinerary</Link>.
      </p>
    </main>
  )
}
