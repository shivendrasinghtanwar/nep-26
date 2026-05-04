import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RadioTower, Map, Image, ArrowRight, ChevronDown,
  CalendarDays, ListChecks, ScrollText, Route as RouteIcon,
  BookOpen, FolderTree, Phone, Cross, Stethoscope,
} from 'lucide-react'
import { useTMinus } from '../lib/useTMinus.js'
import { ITINERARY, RULES } from '../lib/data.js'

const HERO_IMG = `${import.meta.env.BASE_URL}pics/hero-kaligandaki.jpg`

function fmtDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso + 'T00:00:00+05:30')
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch { return iso }
}

function shorten(s, n) {
  if (!s) return ''
  if (s.length <= n) return s
  const cut = s.slice(0, n)
  const sp = cut.lastIndexOf(' ')
  return (sp > 60 ? cut.slice(0, sp) : cut) + '…'
}

export default function Home() {
  const tminus = useTMinus()
  const heroImgRef = useRef(null)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [heroBroken, setHeroBroken] = useState(false)

  // Hero parallax — same behaviour as landing.js
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const img = heroImgRef.current
    if (!img) return
    if (img.complete && img.naturalWidth > 0) setHeroLoaded(true)
    if (reduce) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight)
        const off = Math.round(y * 0.18)
        if (heroImgRef.current) heroImgRef.current.style.setProperty('--parallax', off + 'px')
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Top-6 load-bearing rules: official > corroborated, fallback to top-up.
  const topRules = useMemo(() => {
    const all = (RULES?.rules || []).slice()
    const order = { official: 0, corroborated: 1, inferred: 2 }
    let picks = all
      .filter(r => r.confidence === 'official' || r.confidence === 'corroborated')
      .sort((a, b) => (order[a.confidence] ?? 9) - (order[b.confidence] ?? 9))
      .slice(0, 6)
    if (picks.length < 6) {
      const extra = all.filter(r => !picks.includes(r)).slice(0, 6 - picks.length)
      picks = picks.concat(extra)
    }
    return picks
  }, [])

  return (
    <main className="landing">

      {/* ─────────── HERO ─────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true">
          <img
            ref={heroImgRef}
            id="hero-img"
            src={HERO_IMG}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className={`${heroLoaded ? 'loaded' : ''} ${heroBroken ? 'broken' : ''}`.trim()}
            onLoad={() => setHeroLoaded(true)}
            onError={() => setHeroBroken(true)}
          />
        </div>

        <div className="hero-top">
          <span className="eyebrow">An expedition dossier · Nepal · May 2026</span>
          <span className="hero-bezel">DOSSIER · <b>NEP-26</b> · REV-04</span>
        </div>

        <div className="hero-body">
          <h1 id="hero-title" className="hero-headline">
            Bikaner to <span className="accent">Muktinath</span>
          </h1>
          <p
            className="hero-sub"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-dim)', lineHeight: 1.5 }}
          >
            4×4 Thar Roxx · 168 mm articulation · 230 N·m · 14 nights · 4,410 km · 3,800 m peak
          </p>
          <p
            className="hero-toc"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--dust)', margin: '10px 0 0', lineHeight: 1.5 }}
          >
            Sunauli &nbsp;|&nbsp; Beni–Jomsom &nbsp;|&nbsp; Muktinath &nbsp;|&nbsp; Kagbeni &nbsp;|&nbsp; Pokhara
          </p>

          <div className="hero-tminus" aria-label="Days until departure">
            <span className="num">{tminus}</span>
            <span className="lbl">days to depart<br /><span style={{ color: 'var(--cream)' }}>2026-05-09</span></span>
          </div>

          <nav className="ctas" aria-label="Primary navigation">
            <Link className="cta primary" to="/agent">
              <RadioTower size={18} strokeWidth={1.6} className="icon" />
              <span>Trail Comms</span>
              <ArrowRight size={14} strokeWidth={1.6} className="arrow" />
            </Link>
            <Link className="cta" to="/map">
              <Map size={18} strokeWidth={1.6} className="icon" />
              <span>Route Atlas</span>
              <ArrowRight size={14} strokeWidth={1.6} className="arrow" />
            </Link>
            <Link className="cta" to="/gallery">
              <Image size={18} strokeWidth={1.6} className="icon" />
              <span>Waypoints</span>
              <ArrowRight size={14} strokeWidth={1.6} className="arrow" />
            </Link>
          </nav>
        </div>

        <a href="#stat-band" className="scroll-cue" aria-label="Scroll to dossier">
          <span>Swipe to dossier</span>
          <ChevronDown size={16} strokeWidth={1.6} className="icon" />
        </a>
      </section>

      {/* ─────────── STAT BAND ─────────── */}
      <section id="stat-band" className="stat-band" aria-label="Trip vitals">
        <div className="accent">
          <div className="k">T-minus</div>
          <div className="v">{tminus}<span className="u">d</span></div>
        </div>
        <div>
          <div className="k">Total</div>
          <div className="v">4,410<span className="u">km</span></div>
        </div>
        <div>
          <div className="k">Permit</div>
          <div className="v">18<span className="u">/30 d</span></div>
        </div>
        <div>
          <div className="k">Borders</div>
          <div className="v">2<span className="u">×</span></div>
        </div>
        <div>
          <div className="k">High pass</div>
          <div className="v">3,800<span className="u">m</span></div>
        </div>
      </section>

      {/* ─────────── DOSSIER STRIP ─────────── */}
      <section className="section" aria-labelledby="dossier-h">
        <header className="section-h">
          <span className="badge">01 · Channels</span>
          <h2 id="dossier-h">Three ways into the <span className="accent">dossier</span></h2>
          <p>Pick a lane. Each one talks to the same source-of-truth — /data/rules.json, /data/route.json, /data/itinerary.json.</p>
        </header>

        <div className="dossier">
          <Link className="dossier-card" to="/agent" data-aos="fade-up">
            <div className="icon-box"><RadioTower size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Trail Comms</h3>
            <p>Ask anything — embassy phone, ACAP cost, Day-8 plan, INR-2000 rule. Offline-safe travel manager that quotes only sourced facts with confidence flags.</p>
            <span className="open">Open channel <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>

          <Link className="dossier-card" to="/map" data-aos="fade-up" data-aos-delay="80">
            <div className="icon-box"><Map size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Route Atlas</h3>
            <p>Topographic Leaflet sheet of the 4,410 km loop. Day-by-day waypoints, the 4×4 Beni–Jomsom leg, fuel stops, and the live DRIVE/HOLD/POSTPONE banner.</p>
            <span className="open">Open atlas <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>

          <Link className="dossier-card" to="/gallery" data-aos="fade-up" data-aos-delay="160">
            <div className="icon-box"><Image size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Waypoints</h3>
            <p>Field plates of every halt — Pokhara, Muktinath, Kagbeni, Lumbini. Public-domain Wikimedia stock now; your own /pics overrides them when dropped in.</p>
            <span className="open">Open gallery <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
        </div>
      </section>

      {/* ─────────── REFERENCE STRIP ─────────── */}
      <section className="section" aria-labelledby="ref-h">
        <header className="section-h">
          <span className="badge">02 · Reference</span>
          <h2 id="ref-h">The <span className="accent">paper</span> behind the trip</h2>
          <p>Master checklist, day-by-day, rules and route — the same content, in tabular form.</p>
        </header>
        <div className="dossier">
          <Link className="dossier-card" to="/itinerary" data-aos="fade-up">
            <div className="icon-box"><CalendarDays size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Itinerary</h3>
            <p>15 days · distances · drive times · halts · day-type (drive / work / acclimatise / darshan).</p>
            <span className="open">Open itinerary <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
          <Link className="dossier-card" to="/checklist" data-aos="fade-up" data-aos-delay="80">
            <div className="icon-box"><ListChecks size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Master Checklist</h3>
            <p>11 categories — vehicle docs, IDs, permits, money, hardware, spares, medical, clothing, pre-depart, daily discipline, return.</p>
            <span className="open">Open checklist <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
          <Link className="dossier-card" to="/rules" data-aos="fade-up" data-aos-delay="160">
            <div className="icon-box"><ScrollText size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Nepal Rules 2026</h3>
            <p>Bhansar (NPR 600/d four-wheelers) · Yatayat · 30-day cap · ACAP NPR 1,000 SAARC · Mustang boundary · embassy.</p>
            <span className="open">Open rules <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
          <Link className="dossier-card" to="/route" data-aos="fade-up" data-aos-delay="240">
            <div className="icon-box"><RouteIcon size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Route &amp; Driving</h3>
            <p>Expressway chain India-side · Mustang 4×4 leg · fuel strategy · where to slow down.</p>
            <span className="open">Open route <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
          <Link className="dossier-card" to="/viewer" data-aos="fade-up">
            <div className="icon-box"><BookOpen size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Docs viewer</h3>
            <p>Markdown viewer with TOC sidebar — every doc, plan, and HANDOFF rendered in-browser.</p>
            <span className="open">Open docs <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
          <Link className="dossier-card" to="/folders" data-aos="fade-up" data-aos-delay="80">
            <div className="icon-box"><FolderTree size={20} strokeWidth={1.6} className="icon" /></div>
            <h3>Files index</h3>
            <p>Direct links to <code>docs/</code>, <code>data/</code>, <code>pics/</code>, <code>repos/</code> — the underlying source files.</p>
            <span className="open">Open files <ArrowRight size={13} strokeWidth={1.6} className="icon icon-sm" /></span>
          </Link>
        </div>
      </section>

      {/* ─────────── TIMELINE ─────────── */}
      <section className="section timeline-wrap" aria-labelledby="timeline-h">
        <header className="section-h">
          <span className="badge">03 · Day-by-day</span>
          <h2 id="timeline-h">The <span className="accent">fifteen-day</span> trace</h2>
          <p>Bikaner out · Sunauli in · Pokhara base · Jomsom up · Muktinath darshan · Sunauli out · Bikaner home.</p>
        </header>
        <ol id="timeline" className="timeline" aria-label="Day-by-day itinerary">
          {ITINERARY.map((d, i) => {
            const side = i % 2 === 0 ? 'left' : 'right'
            const type = (d.type || 'drive').toLowerCase()
            const km = d.km ? `${d.km} km` : 'rest'
            const date = `${d.weekday || ''} ${fmtDate(d.date)}`.trim()
            return (
              <li
                key={d.day}
                className={`tl-row ${side} type-${type}`}
                data-aos={`fade-${side === 'left' ? 'right' : 'left'}`}
                data-aos-delay={Math.min(i * 40, 400)}
              >
                <div className="tl-card">
                  <div className="tl-day">Day {d.day} · {date}</div>
                  <div className="tl-leg">{d.leg || ''}</div>
                  <div className="tl-meta">
                    <span className={`badge type-${type}`}>{type}</span>
                    <span>{km}</span>
                    {d.halt && <span>· halt: {d.halt}</span>}
                  </div>
                </div>
                <div className="marker" aria-hidden="true" />
                <div />
              </li>
            )
          })}
        </ol>
      </section>

      {/* ─────────── RULES SNAPSHOT ─────────── */}
      <section className="section" aria-labelledby="rules-h">
        <header className="section-h">
          <span className="badge">04 · Load-bearing rules</span>
          <h2 id="rules-h">What's <span className="accent">verified</span></h2>
          <p>Six official / corroborated rules pulled from the latest refresh. Re-verify on 2026-05-08.</p>
        </header>
        <div id="rules-grid" className="rules-grid">
          {topRules.map((r, i) => (
            <article
              key={(r.title || '') + i}
              className="rule-tile"
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 60, 360)}
            >
              <span className="cat">{r.category || 'Rule'}</span>
              <h4>{r.title || ''}</h4>
              <p>{shorten(r.detail || '', 200)}</p>
              {r.source && (
                <a className="src" href={r.source} target="_blank" rel="noopener noreferrer">
                  source ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ─────────── EMERGENCY STRIP ─────────── */}
      <section className="emerg-strip" aria-labelledby="emerg-h">
        <div className="emerg-inner">
          <div>
            <h2 id="emerg-h">If it goes <span style={{ color: 'var(--cream)' }}>sideways</span><small>Tap any number to call</small></h2>
          </div>
          <ul className="emerg-list">
            <li>
              <div className="lbl">Indian Embassy KTM · 24×7</div>
              <a href="tel:+9779851316807">
                <Phone size={16} strokeWidth={1.6} className="icon" />+977 9851 316807
              </a>
            </li>
            <li>
              <div className="lbl">Manipal Pokhara</div>
              <span className="num">
                <Cross size={16} strokeWidth={1.6} className="icon" />Altitude care
              </span>
              <div className="note">Large, English-speaking, altitude-aware.</div>
            </li>
            <li>
              <div className="lbl">CIWEC Hospital</div>
              <span className="num">
                <Stethoscope size={16} strokeWidth={1.6} className="icon" />Travel medicine
              </span>
              <div className="note">Travel-med specialist; Pokhara branch.</div>
            </li>
          </ul>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="landing-footer">
        <div>
          Sources: <a href="https://www.immigration.gov.np/">Dept. of Immigration</a> ·{' '}
          <a href="https://www.customs.gov.np/">Dept. of Customs</a> ·{' '}
          <a href="https://epermit.ntnc.org.np/">NTNC e-permit</a> ·{' '}
          <a href="https://www.indembkathmandu.gov.in/">Indian Embassy KTM</a>.
          {' '}Re-verify before <span className="verify">2026-05-08</span>.{' '}
          <a href="../docs/RULES_CHANGE_REPORT.md">Change report</a> ·{' '}
          <a href="../docs/ROUTE_CONDITIONS.md">Route report</a>.
        </div>
        <div className="credit">
          Bikaner ↔ Muktinath · <strong>Nep-26</strong> · Cowork × Claude Code
        </div>
      </footer>

    </main>
  )
}
