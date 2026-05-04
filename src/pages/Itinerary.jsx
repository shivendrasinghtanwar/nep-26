import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import Card from '../components/Card.jsx'
import { ITINERARY } from '../lib/data.js'

// Itinerary mark icon — same SVG glyph as the vanilla page
function ItinMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="10" width="44" height="44" rx="2" />
      <path d="M10,22 L54,22 M10,32 L54,32 M10,42 L54,42" strokeOpacity="0.5" />
      <circle cx="20" cy="16" r="1.5" fill="currentColor" />
      <circle cx="32" cy="16" r="1.5" fill="currentColor" />
      <circle cx="44" cy="16" r="1.5" fill="currentColor" />
    </svg>
  )
}

export default function Itinerary() {
  const stats = [
    { tminus: true },
    { k: 'Full work',    v: '5',     u: 'd' },
    { k: 'Async',        v: '5',     u: 'd' },
    { k: 'Hard offline', v: '3',     u: 'd' },
    { k: 'Drives',       v: '~4,410', u: 'km' },
  ]

  return (
    <main className="shell">
      <HeroMtn />

      <header className="trail-header">
        <div className="mark" aria-hidden="true"><ItinMark /></div>
        <div className="wordmark">
          <span className="eyebrow">Section 02 · Day-by-day trace</span>
          <h1>Day-by-<span className="accent">day</span></h1>
          <div className="sub">
            <span><b>15</b> days</span><span className="sep">//</span>
            <span><b>14</b> nights</span><span className="sep">//</span>
            <span><b>4,410</b> km</span><span className="sep">//</span>
            <span>9–23 May 2026</span>
          </div>
        </div>
        <Link className="back" to="/">
          <ChevronLeft size={13} strokeWidth={1.6} />
          <span>Base</span>
        </Link>
      </header>

      <StatStrip stats={stats} />

      <p className="muted" style={{ margin: '6px 0 0' }}>
        15 days · ~4,410 km · 14 nights. Five full work days, three "no-work" days, the rest async-only.
      </p>

      <div className="callout" data-aos="fade-up" style={{ margin: '18px 0 24px' }}>
        <b>Buffer rule:</b> if a day slips on the Mustang side (landslide, weather), borrow from{' '}
        <b>19 May leisure</b> first, then from <b>20 May work</b>. Last resort: skip the 21 May Lumbini revisit and add it to the Sunauli buffer.
      </div>

      <h2 className="section-title">The fifteen-day trace</h2>
      <div id="days" data-aos="fade-up">
        {ITINERARY.map((d) => (
          <div key={d.day} className={`day ${d.type}`}>
            <div className="when">
              {d.weekday}
              <span className="d">{d.date.slice(8, 10)}</span>
              {d.date.slice(0, 7)}
            </div>
            <div>
              <div className="leg">{d.leg}</div>
              <div className="note">{d.note}</div>
            </div>
            <div className="stats-mini">
              <span className="tag">{d.type}</span>
              <span>{d.km ? d.km + ' km' : 'no drive'}</span>
              <span>{d.hours} h</span>
              <span>halt: {d.halt}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Workation calendar</h2>
      <div className="grid cols-3">
        <Card pill="Work · 3 + 4 partials" title="Full work days" data-aos="fade-up">
          <p>13, 18, 20 May (in Pokhara) + partial: 11 May evening, 12 May afternoon, 14 May morning, 19 May morning.</p>
        </Card>
        <Card pill="Async · 5" title="Reduced output days" data-aos="fade-up" data-aos-delay="80">
          <p>14, 15, 17, 21, 22 May — driving, 4×4, acclimatisation. Async DM only; no calls, no commits.</p>
        </Card>
        <Card pill="Hard offline · 3" title="No work" data-aos="fade-up" data-aos-delay="160">
          <p>9 May (Bikaner→Noida), 16 May (Muktinath darshan), 23 May (Lucknow→Bikaner).</p>
        </Card>
      </div>

      <h2 className="section-title">Bookings to confirm</h2>
      <div className="grid cols-2">
        <Card pill="India side" title="Three nights" data-aos="fade-up">
          <p>Noida (9 May) · Gorakhpur (10 May) · Lucknow (22 May).</p>
        </Card>
        <Card pill="Nepal side" title="Eleven nights" data-aos="fade-up" data-aos-delay="80">
          <p>Bhairahawa / Lumbini (11, 21 May) · Pokhara — 6 nights (12, 13, 17, 18, 19, 20 May) · Beni / Tatopani (14 May) · Jomsom (15, 16 May).</p>
        </Card>
      </div>

      <p className="footnote">
        Source: <code>data/itinerary.json</code> · rendered by <code>src/pages/Itinerary.jsx</code> · re-verify rules on{' '}
        <strong style={{ color: 'var(--cream)' }}>2026-05-08</strong>.
      </p>
    </main>
  )
}
