import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import Card from '../components/Card.jsx'
import { ITINERARY } from '../lib/data.js'
import { DAY_DETAILS } from '../lib/dayDetails.js'

const ITIN_CSS = `
  .day { position: relative; }
  .day .show-detail-btn {
    background: transparent;
    border: 1px dashed rgba(212,165,116,0.32);
    color: var(--cream-dim);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 160ms ease-out;
  }
  .day .show-detail-btn:hover {
    color: var(--cream);
    border-color: var(--dust);
    background: rgba(212,165,116,0.06);
  }
  .day .show-detail-btn .chev {
    transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  .day .show-detail-btn[aria-expanded="true"] .chev { transform: rotate(180deg); }

  .day-detail {
    grid-column: 1 / -1;
    margin-top: 10px;
    padding: 14px 16px 14px 18px;
    border-left: 2px solid var(--dust);
    background: rgba(212,165,116,0.04);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    overflow: hidden;
    animation: nep26-detail-in 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  @keyframes nep26-detail-in {
    0%   { opacity: 0; transform: translateY(-4px); max-height: 0; }
    100% { opacity: 1; transform: translateY(0);    max-height: 800px; }
  }
  .day-detail .why {
    font-size: 14px;
    line-height: 1.65;
    color: var(--cream);
    margin: 0 0 10px;
  }
  .day-detail .why strong { color: var(--dust); }
  .day-detail .why b      { color: var(--rust); font-weight: 600; }
  .day-detail .bullets {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
  }
  .day-detail .bullets li {
    font-family: var(--font-body);
    font-size: 13px;
    line-height: 1.55;
    color: rgba(236,229,211,0.85);
    padding: 4px 0 4px 18px;
    position: relative;
  }
  .day-detail .bullets li::before {
    content: '◢';
    position: absolute;
    left: 2px;
    top: 4px;
    color: var(--rust);
    font-size: 9px;
  }
  .day-detail .bullets li b { color: var(--cream); }
  .day-detail .hotel-line {
    margin-top: 8px;
    padding: 8px 12px;
    background: rgba(200,85,42,0.06);
    border: 1px solid rgba(200,85,42,0.25);
    border-radius: var(--r-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--cream);
  }
  .day-detail .hotel-line .lbl {
    color: var(--rust);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 9.5px;
    font-weight: 600;
    margin-right: 6px;
  }
  .day-detail .src-row {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .day-detail .src-row a {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--glacier);
    text-decoration: none;
    padding: 3px 8px;
    border: 1px solid rgba(91,159,204,0.4);
    border-radius: 2px;
    transition: all 160ms;
  }
  .day-detail .src-row a:hover { color: var(--cream); border-color: var(--cream); background: rgba(91,159,204,0.08); }
`

function renderWhy(text) {
  // tiny markdown — **bold-rust** and *italic*; safe because input is hard-coded
  const html = (text || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

function DayCard({ d, expanded, onToggle }) {
  const detail = DAY_DETAILS[d.day]
  const hasDetail = !!detail
  return (
    <div className={`day ${d.type}`}>
      <div className="when">
        {d.weekday}
        <span className="d">{d.date.slice(8, 10)}</span>
        {d.date.slice(0, 7)}
      </div>
      <div>
        <div className="leg">{d.leg}</div>
        <div className="note">{d.note}</div>
        {hasDetail && (
          <button
            type="button"
            className="show-detail-btn"
            aria-expanded={expanded}
            aria-controls={`detail-${d.day}`}
            onClick={onToggle}
          >
            <span>{expanded ? 'Hide reasoning' : 'Show reasoning'}</span>
            <ChevronDown size={12} className="chev" strokeWidth={2}/>
          </button>
        )}
      </div>
      <div className="stats-mini">
        <span className="tag">{d.type}</span>
        <span>{d.km ? d.km + ' km' : 'no drive'}</span>
        <span>{d.hours} h</span>
        <span>halt: {d.halt}</span>
      </div>

      {expanded && hasDetail && (
        <div id={`detail-${d.day}`} className="day-detail">
          <p className="why">{renderWhy(detail.why)}</p>
          {detail.bullets && detail.bullets.length > 0 && (
            <ul className="bullets">
              {detail.bullets.map((b, i) => <li key={i}>{renderWhy(b)}</li>)}
            </ul>
          )}
          {detail.hotel && (
            <div className="hotel-line">
              <span className="lbl">Stay</span>
              {renderWhy(detail.hotel)}
            </div>
          )}
          {detail.sources && detail.sources.length > 0 && (
            <div className="src-row">
              {detail.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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

  const [expanded, setExpanded] = useState(() => new Set([3])) // Day 3 (border) expanded by default

  const toggle = (day) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  return (
    <main className="shell">
      <style>{ITIN_CSS}</style>
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
        15 days · ~4,410 km · 14 nights. Tap <b>Show reasoning</b> on any day for the
        why-this-not-that — alternatives considered, hotel pick, sources.
      </p>

      <div className="callout" data-aos="fade-up" style={{ margin: '18px 0 24px' }}>
        <b>Buffer rule:</b> if a day slips on the Mustang side (landslide, weather), borrow from{' '}
        <b>19 May leisure</b> first, then from <b>20 May work</b>. Last resort: skip the 21 May Lumbini revisit and add it to the Sunauli buffer.
      </div>

      <h2 className="section-title">The fifteen-day trace</h2>
      <div id="days" data-aos="fade-up">
        {ITINERARY.map((d) => (
          <DayCard
            key={d.day}
            d={d}
            expanded={expanded.has(d.day)}
            onToggle={() => toggle(d.day)}
          />
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
          <p>9 May (Bikaner→Agra), 16 May (Muktinath darshan), 23 May (Lucknow→Bikaner).</p>
        </Card>
      </div>

      <h2 className="section-title">Bookings to confirm</h2>
      <div className="grid cols-2">
        <Card pill="India side" title="Three nights" data-aos="fade-up">
          <p>Agra (9 May) · Gorakhpur (10 May) · Lucknow (22 May). <Link to="/stays">Hotel shortlist →</Link></p>
        </Card>
        <Card pill="Nepal side" title="Eleven nights" data-aos="fade-up" data-aos-delay="80">
          <p>Bhairahawa / Lumbini (11, 21 May) · Pokhara — 6 nights (12, 13, 17, 18, 19, 20 May) · Beni / Tatopani (14 May) · Jomsom (15, 16 May). <Link to="/stays">Hotel shortlist →</Link></p>
        </Card>
      </div>

      <p className="footnote">
        Source: <code>data/itinerary.json</code> · per-day reasoning in <code>src/lib/dayDetails.js</code> · re-verify rules on{' '}
        <strong style={{ color: 'var(--cream)' }}>2026-05-08</strong>.
      </p>
    </main>
  )
}
