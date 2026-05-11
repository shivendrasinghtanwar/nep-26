import { Link } from 'react-router-dom'
import { ChevronLeft, MapPin, ExternalLink } from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { TRIPLOG } from '../lib/data.js'

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

function fmtDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00+05:30')
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  } catch { return iso }
}

export default function Log() {
  const entries = TRIPLOG?.entries || []
  const totalKm = entries.reduce((s, e) => s + (e.km || 0), 0)
  const lastEntry = entries[entries.length - 1]
  const currentLoc = lastEntry?.hotel?.location?.split(',')[0] || '—'

  const stats = [
    { k: 'Days logged', v: String(entries.length),     u: '' },
    { k: 'km covered',  v: totalKm.toLocaleString(),    u: '' },
    { k: 'Last stop',   v: currentLoc,                  u: '' },
    { k: 'Status',      v: 'live',                      u: '' },
  ]

  return (
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
          <article key={e.day} className={`lb-entry status-${e.status || 'done'}`}>
            <div className="lb-dateline">
              <span className="lb-day-num">DAY {String(e.day).padStart(2, '0')}</span>
              <span className="lb-date">{e.weekday} · {fmtDate(e.date)}</span>
              <span className={`lb-status ${e.status || 'done'}`}>
                {e.status === 'active' ? '● in progress' : '✓ done'}
              </span>
            </div>

            <div className="lb-leg">{e.leg}</div>

            <div className="lb-km-row">
              {e.km != null && <span className="lb-pill km">{e.km.toLocaleString()} km</span>}
              {e.hours && <span className="lb-pill">{e.hours}</span>}
              {e.route && <span className="lb-pill">{e.route}</span>}
            </div>

            <div className="lb-divider" />

            {e.notes && (
              <section className="lb-section">
                <div className="lb-section-label">Notes</div>
                <div className="lb-section-body">{e.notes}</div>
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
  )
}
