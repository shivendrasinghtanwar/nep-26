import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Triangle, MountainSnow, Milestone, Route as RouteIcon, Sunrise, Castle, Mountain,
  Building2, Flame, Map as MapIcon, X, ChevronLeft, ChevronRight, Hash,
} from 'lucide-react'

import HeroMtn from '../components/HeroMtn.jsx'
import TrailHeader from '../components/TrailHeader.jsx'
import StatStrip from '../components/StatStrip.jsx'

// Icon map: PLACES["icon"] string → lucide component (kept identical to gallery.js)
const ICON_MAP = {
  'mountain-snow': MountainSnow,
  'milestone':     Milestone,
  'route':         RouteIcon,
  'sunrise':       Sunrise,
  'castle':        Castle,
  'mountain':      Mountain,
  'building-2':    Building2,
  'flame':         Flame,
}

const PLACES = [
  {
    id: 'pokhara',
    name: 'Pokhara',
    subtitle: 'Phewa Lake & Annapurna II',
    day: 'Day 4 / 13 / 18 / 20',
    type: 'acclimatise',
    icon: 'mountain-snow',
    elevation: 822,
    oneLiner: 'Workation base — fibre, lake walks, Annapurna sunrise.',
    tag: 'workation base',
    aspect: '16/9',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Phewa_Lake%2C_Pokhara%2C_Nepal_%282%29.jpg/1280px-Phewa_Lake%2C_Pokhara%2C_Nepal_%282%29.jpg',
  },
  {
    id: 'sunauli',
    name: 'Sunauli',
    subtitle: 'Bhairahawa border crossing',
    day: 'Day 3 in / Day 14 out',
    type: 'border',
    icon: 'milestone',
    elevation: 110,
    oneLiner: 'Bhansar + Yatayat counters — the gate to Nepal.',
    tag: 'border crossing',
    aspect: '4/3',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Sunauli_border.jpg/1280px-Sunauli_border.jpg',
  },
  {
    id: 'beni',
    name: 'Beni',
    subtitle: 'Myagdi confluence',
    day: 'Day 7',
    type: 'drive',
    icon: 'route',
    elevation: 830,
    oneLiner: 'Last reliable diesel before the Mustang climb.',
    tag: 'last fuel before Mustang',
    aspect: '3/4',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Kali_Gandaki_River_at_Beni.jpg/1280px-Kali_Gandaki_River_at_Beni.jpg',
  },
  {
    id: 'jomsom',
    name: 'Jomsom',
    subtitle: 'Kali Gandaki valley',
    day: 'Day 7 → 9',
    type: 'acclimatise',
    icon: 'sunrise',
    elevation: 2720,
    oneLiner: 'Sleep here. Wind funnel by noon, calm by dawn.',
    tag: 'acclimatise here',
    aspect: '5/4',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Jomsom_Nepal_View.jpg/1280px-Jomsom_Nepal_View.jpg',
  },
  {
    id: 'kagbeni',
    name: 'Kagbeni',
    subtitle: 'Lower Mustang gateway',
    day: 'Day 8',
    type: 'darshan',
    icon: 'castle',
    elevation: 2810,
    oneLiner: 'Mediaeval mud walls — still the open zone.',
    tag: 'Lower Mustang gate',
    aspect: '4/3',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Kagbeni_Mustang_Nepal.jpg/1280px-Kagbeni_Mustang_Nepal.jpg',
  },
  {
    id: 'muktinath',
    name: 'Muktinath',
    subtitle: '3,800 m darshan',
    day: 'Day 8',
    type: 'darshan',
    icon: 'mountain',
    elevation: 3800,
    oneLiner: '108 spouts, eternal flame — the spiritual objective.',
    tag: 'spiritual objective',
    aspect: '3/4',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Muktinath_Temple_Mustang_Nepal.jpg/1280px-Muktinath_Temple_Mustang_Nepal.jpg',
  },
  {
    id: 'lumbini',
    name: 'Lumbini',
    subtitle: 'Buddha birthplace',
    day: 'Day 3 (optional)',
    type: 'darshan',
    icon: 'building-2',
    elevation: 105,
    oneLiner: 'UNESCO site — Mayadevi temple, Ashoka pillar, monastic park.',
    tag: 'UNESCO',
    aspect: '16/9',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Mayadevi_Temple%2C_Lumbini%2C_Nepal.jpg/1280px-Mayadevi_Temple%2C_Lumbini%2C_Nepal.jpg',
  },
  {
    id: 'tatopani',
    name: 'Tatopani',
    subtitle: 'Hot springs',
    day: 'Day 7',
    type: 'drive',
    icon: 'flame',
    elevation: 1190,
    oneLiner: 'Roadside sulphur soak — optional thaw before Ghasa.',
    tag: 'optional soak',
    aspect: '4/3',
    placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Tatopani_Nepal.jpg/1280px-Tatopani_Nepal.jpg',
  },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'drive', label: 'Drive' },
  { id: 'acclimatise', label: 'Acclimatise' },
  { id: 'darshan', label: 'Darshan' },
  { id: 'border', label: 'Border' },
]

const fmtElev = (m) => m.toLocaleString('en-IN') + ' m'

// Local-first image. Try /pics/<id>.jpg, fall back to Wikimedia, hide on 2nd error.
function PlaceImg({ place, alt, className }) {
  const local = `${import.meta.env.BASE_URL}pics/${place.id}.jpg`
  const [src, setSrc] = useState(local)
  const triedFallback = useRef(false)
  const triedHide = useRef(false)

  // Reset src whenever we change place (used inside lightbox)
  useEffect(() => {
    setSrc(`${import.meta.env.BASE_URL}pics/${place.id}.jpg`)
    triedFallback.current = false
    triedHide.current = false
  }, [place.id])

  return (
    <img
      className={className}
      loading="lazy"
      decoding="async"
      src={src}
      alt={alt}
      onError={(e) => {
        if (!triedFallback.current) {
          triedFallback.current = true
          setSrc(place.placeholder)
        } else if (!triedHide.current) {
          triedHide.current = true
          e.currentTarget.style.visibility = 'hidden'
        }
      }}
    />
  )
}

function Card({ place, idx, onOpen }) {
  const Icon = ICON_MAP[place.icon] || RouteIcon
  return (
    <figure
      className="card"
      data-id={place.id}
      data-type={place.type}
      data-aspect={place.aspect}
      data-aos="fade-up"
      data-aos-delay={(idx % 6) * 60}
      tabIndex={0}
      role="button"
      aria-label={`Open ${place.name} lightbox`}
      onClick={() => onOpen(place.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(place.id)
        }
      }}
    >
      <div className="img-wrap" style={{ aspectRatio: place.aspect }}>
        <PlaceImg place={place} alt={`${place.name} — ${place.subtitle}`} />
        <span className="card-badge">
          <Icon size={11} className="icon-sm" />
          <span>{place.type}</span>
        </span>
      </div>
      <figcaption>
        <strong>{place.name}</strong>
        <span className="card-sub">{place.subtitle}</span>
        <span className="day">{place.day || ''}</span>
        <div className="card-stats">
          <span className="stat-pill"><Triangle size={11} className="icon-sm"/>{fmtElev(place.elevation)}</span>
          <span className="stat-pill"><Icon size={11} className="icon-sm"/>{place.tag}</span>
        </div>
        <span className="card-why">{place.oneLiner}</span>
      </figcaption>
    </figure>
  )
}

function Lightbox({ list, idx, onClose, onStep }) {
  const place = list[idx]
  const Icon = place ? (ICON_MAP[place.icon] || RouteIcon) : null
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); onStep(-1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); onStep(1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  if (!place) return null

  return (
    <div
      className="lightbox open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button className="lb-close" aria-label="Close" onClick={onClose}>
        <X size={18} />
      </button>
      <button className="lb-nav lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onStep(-1) }}>
        <ChevronLeft size={22}/>
      </button>
      <button className="lb-nav lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); onStep(1) }}>
        <ChevronRight size={22}/>
      </button>
      <figure className="lb-frame">
        <div className="lb-img-wrap">
          <PlaceImg key={place.id} place={place} alt={`${place.name} — ${place.subtitle}`} className="lb-img"/>
        </div>
        <figcaption className="lb-meta">
          <div className="lb-head">
            <h2 className="lb-name">{place.name} · {place.subtitle}</h2>
            <span className="lb-day">{place.day}</span>
          </div>
          <p className="lb-why">{place.oneLiner}</p>
          <div className="lb-stats">
            <span className="stat-pill"><Triangle size={11} className="icon-sm"/>{fmtElev(place.elevation)}</span>
            <span className="stat-pill">{Icon && <Icon size={11} className="icon-sm"/>}{place.type}</span>
            <span className="stat-pill"><Hash size={11} className="icon-sm"/>{place.id}</span>
          </div>
          <div className="lb-actions">
            <Link className="lb-map-btn" to="/map">
              <MapIcon size={13} className="icon-sm"/><span>View on map</span>
            </Link>
            <span className="lb-counter">
              {String(idx + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </span>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [lbId, setLbId] = useState(null)

  const visible = useMemo(
    () => PLACES.filter((p) => filter === 'all' || p.type === filter),
    [filter]
  )
  const lbList = useMemo(
    () => (visible.length ? visible : PLACES.slice()),
    [visible]
  )
  const lbIdx = useMemo(() => {
    if (!lbId) return 0
    const i = lbList.findIndex((p) => p.id === lbId)
    return i < 0 ? 0 : i
  }, [lbList, lbId])

  const open = useCallback((id) => setLbId(id), [])
  const close = useCallback(() => setLbId(null), [])
  const step = useCallback((dir) => {
    if (!lbList.length) return
    const next = (lbIdx + dir + lbList.length) % lbList.length
    setLbId(lbList[next].id)
  }, [lbIdx, lbList])

  const hint = filter === 'all'
    ? `${PLACES.length} plates · drop JPGs into /pics/<id>.jpg to override placeholders.`
    : `Showing ${visible.length} of ${PLACES.length} · filter: ${filter}`

  return (
    <main className="shell">
      <HeroMtn />

      <TrailHeader
        eyebrow="Field plates · public domain"
        title={<>Way&nbsp;<span className="accent">points</span></>}
        sub={[<><b>8</b> stops</>, 'Pokhara', 'Muktinath', 'Kagbeni', 'Lumbini']}
        icon={
          <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3,42 L18,18 L26,30 L34,12 L46,32 L52,24 L61,42 Z"/>
            <path d="M30,18 L34,12 L38,18" strokeOpacity="0.5" strokeDasharray="2 2"/>
          </svg>
        }
      />

      <StatStrip
        stats={[
          { tminus: true },
          { k: 'Plates', v: '8' },
          { k: 'Source', v: 'Wikimedia' },
          { k: 'Override', v: '/pics/' },
        ]}
      />

      <section className="hero-plate" data-aos="fade-up" data-aos-delay="80" aria-label="Hero plate: Muktinath darshan">
        <img
          src={`${import.meta.env.BASE_URL}pics/muktinath.jpg`}
          alt="Muktinath temple, Lower Mustang"
          loading="eager"
          decoding="async"
        />
        <div className="hp-grain" aria-hidden="true"></div>
        <div className="hp-corners" aria-hidden="true"></div>
        <div className="hp-meta">
          <div className="hp-eyebrow"><span className="dot" aria-hidden="true"></span><span>Hero plate · spiritual objective</span></div>
          <h2 className="hp-title">Elevations <span className="alt">·</span> 3,800<span className="alt">m</span></h2>
          <div className="hp-caption">
            <span>08 of 14</span><span className="sep">·</span>
            <span>Muktinath darshan</span><span className="sep">·</span>
            <span>Lower Mustang</span>
          </div>
        </div>
      </section>

      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--cream-dim)',
        letterSpacing: '0.04em', margin: '14px 0 4px',
      }} data-aos="fade-up" data-aos-delay="50">
        Plates load from <code>/pics/&lt;id&gt;.jpg</code> when you drop them in;
        otherwise rendered from public-domain Wikimedia field photography.
        The grid is the same set of waypoints the map uses.
      </p>

      <div className="chip-row" id="chips" role="toolbar" aria-label="Filter waypoints" data-aos="fade-up" data-aos-delay="100">
        <span className="chip-label">Filter //</span>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip${filter === f.id ? ' active' : ''}`}
            data-filter={f.id}
            aria-pressed={filter === f.id ? 'true' : 'false'}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div id="grid" data-aos="fade-up" data-aos-delay="120">
        {visible.map((p, i) => (
          <Card key={p.id} place={p} idx={i} onOpen={open} />
        ))}
      </div>
      <p id="hint">{hint}</p>

      <p className="footnote">
        <Link to="/agent">Trail comms</Link> · <Link to="/map">Atlas</Link> · <Link to="/viewer">Route report</Link>.
      </p>

      {lbId && <Lightbox list={lbList} idx={lbIdx} onClose={close} onStep={step} />}

      <style>{`
        .hero-plate {
          position: relative;
          margin: 18px 0 22px;
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
          background: linear-gradient(180deg, var(--shadow), var(--ridge));
          height: clamp(320px, 42vw, 400px);
        }
        .hero-plate img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: saturate(0.95) contrast(1.05);
          display: block;
          z-index: 0;
        }
        .hero-plate::after {
          content: '';
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(10,20,36,0.05) 0%, rgba(10,20,36,0.55) 60%, rgba(10,20,36,0.92) 100%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(200,85,42,0.18), transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        .hero-plate .hp-grain {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(135deg, transparent 0 22px, rgba(212,165,116,0.05) 22px 23px);
          pointer-events: none;
          z-index: 2;
        }
        .hero-plate .hp-corners::before,
        .hero-plate .hp-corners::after {
          content: '';
          position: absolute;
          width: 22px; height: 22px;
          border: 1px solid var(--dust);
          opacity: .55;
          z-index: 3;
        }
        .hero-plate .hp-corners::before { top: 14px; left: 14px; border-right: 0; border-bottom: 0; }
        .hero-plate .hp-corners::after  { bottom: 14px; right: 14px; border-left: 0; border-top: 0; }
        .hero-plate .hp-meta {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 22px 26px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hero-plate .hp-eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--cream-dim);
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .hero-plate .hp-eyebrow .dot {
          width: 6px; height: 6px;
          background: var(--rust);
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(200,85,42,0.18);
        }
        .hero-plate .hp-title {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(40px, 7vw, 76px);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--cream);
          line-height: 0.96;
          margin: 0;
          text-shadow: 0 2px 18px rgba(0,0,0,.55);
        }
        .hero-plate .hp-title .alt { color: var(--dust); }
        .hero-plate .hp-caption {
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.16em;
          color: var(--cream);
          text-transform: uppercase;
          opacity: 0.92;
        }
        .hero-plate .hp-caption .sep { opacity: 0.4; margin: 0 8px; }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 8px 0 16px;
          padding: 10px 12px;
          border: 1px dashed rgba(212,165,116,0.22);
          border-radius: var(--r-sm);
          background: rgba(20,30,50,0.35);
          align-items: center;
        }
        .chip-row .chip-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--cream-dim);
          margin-right: 4px;
        }
        .chip {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cream-dim);
          background: transparent;
          border: 1px solid var(--line);
          padding: 6px 12px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 160ms ease-out;
        }
        .chip:hover { color: var(--cream); border-color: var(--dust); }
        .chip.active {
          color: var(--night);
          background: var(--dust);
          border-color: var(--dust);
          font-weight: 600;
        }

        #grid {
          display: block;
          column-count: 1;
          column-gap: 16px;
          margin-top: 6px;
        }
        @media (min-width: 640px)  { #grid { column-count: 2; } }
        @media (min-width: 1024px) { #grid { column-count: 3; } }
        #grid .card {
          display: inline-block;
          width: 100%;
          margin: 0 0 16px;
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-column-break-inside: avoid;
        }
        #grid .img-wrap { aspect-ratio: auto; position: relative; overflow: hidden; }
        #grid .img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .card-badge {
          position: absolute;
          top: 10px; left: 10px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cream);
          background: rgba(10,20,36,0.78);
          border: 1px solid var(--line);
          backdrop-filter: blur(4px);
          padding: 4px 8px;
          border-radius: 3px;
        }
        .card-badge .icon-sm { color: var(--dust); }

        figcaption .card-sub {
          display: block;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--cream-dim);
          margin-top: 2px;
          letter-spacing: 0.01em;
        }
        figcaption .card-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        figcaption .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cream-dim);
          background: rgba(212,165,116,0.06);
          border: 1px solid var(--line-soft);
          padding: 3px 7px;
          border-radius: 3px;
        }
        figcaption .stat-pill .icon-sm { color: var(--dust); width: 11px; height: 11px; }
        figcaption .card-why {
          display: block;
          font-family: var(--font-body);
          font-size: 12.5px;
          color: rgba(236,229,211,0.78);
          margin-top: 10px;
          line-height: 1.45;
          font-style: italic;
        }
        .card { cursor: zoom-in; }
        .card:focus-visible { outline: 2px solid var(--dust); outline-offset: 2px; }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(8, 14, 26, 0.78);
          backdrop-filter: blur(14px) saturate(1.05);
          -webkit-backdrop-filter: blur(14px) saturate(1.05);
          padding: 28px;
          animation: lb-fade 220ms ease-out;
        }
        .lightbox.open { display: flex; }
        @keyframes lb-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .lb-frame {
          position: relative;
          max-width: 1100px;
          width: 100%;
          max-height: 92vh;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 1fr);
          gap: 0;
          background: linear-gradient(180deg, var(--shadow), var(--ridge));
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: 0 30px 90px rgba(0,0,0,0.7);
          animation: lb-pop 260ms cubic-bezier(.2,.7,.3,1);
          margin: 0;
        }
        @keyframes lb-pop {
          from { transform: translateY(14px) scale(0.985); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        .lb-img-wrap {
          background: #06101e;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 360px;
          max-height: 90vh;
          overflow: hidden;
        }
        .lb-img {
          max-width: 100%;
          max-height: 90vh;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }
        .lb-meta {
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-left: 1px solid var(--line-soft);
          overflow-y: auto;
        }
        .lb-head { display: flex; flex-direction: column; gap: 6px; }
        .lb-name {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(24px, 2.4vw, 32px);
          letter-spacing: 0.05em;
          color: var(--cream);
          margin: 0;
          line-height: 1.05;
          text-transform: uppercase;
        }
        .lb-day {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--dust);
        }
        .lb-why {
          font-family: var(--font-body);
          font-size: 14px;
          color: rgba(236,229,211,0.85);
          line-height: 1.55;
          margin: 0;
        }
        .lb-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .lb-stats .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cream-dim);
          background: rgba(212,165,116,0.06);
          border: 1px solid var(--line-soft);
          padding: 3px 7px;
          border-radius: 3px;
        }
        .lb-stats .stat-pill .icon-sm { color: var(--dust); }
        .lb-actions {
          margin-top: auto;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px dashed rgba(212,165,116,0.2);
        }
        .lb-map-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--night);
          background: var(--dust);
          border: 1px solid var(--dust);
          padding: 8px 14px;
          border-radius: var(--r-sm);
          transition: all 160ms ease-out;
        }
        .lb-map-btn:hover {
          background: var(--cream);
          border-color: var(--cream);
          color: var(--night);
        }
        .lb-counter {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          color: var(--cream-dim);
        }
        .lb-close, .lb-nav {
          position: absolute;
          z-index: 2;
          background: rgba(10,20,36,0.7);
          color: var(--cream);
          border: 1px solid var(--line);
          backdrop-filter: blur(6px);
          width: 40px; height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 160ms ease-out;
        }
        .lb-close:hover, .lb-nav:hover {
          background: var(--rust);
          border-color: var(--rust);
          color: var(--cream);
        }
        .lb-close { top: 14px; right: 14px; }
        .lb-prev { left: 14px; top: 50%; transform: translateY(-50%); }
        .lb-next { right: 14px; top: 50%; transform: translateY(-50%); }

        @media (max-width: 760px) {
          .lb-frame { grid-template-columns: 1fr; max-height: 96vh; }
          .lb-img-wrap { max-height: 55vh; min-height: 240px; }
          .lb-meta { border-left: 0; border-top: 1px solid var(--line-soft); }
          .lb-prev { left: 6px; }
          .lb-next { right: 6px; }
          .hero-plate .hp-meta { padding: 16px 18px; }
        }

        #hint {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--cream-dim);
          letter-spacing: 0.04em;
          margin: 18px 0 4px;
        }
      `}</style>
    </main>
  )
}
