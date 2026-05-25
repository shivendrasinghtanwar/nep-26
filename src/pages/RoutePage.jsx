import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import Card from '../components/Card.jsx'

// Page-scoped CSS for the phase banner — identical to route.html's <style>.
const PHASE_CSS = `
.phase-banner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--dust);
  margin-top: 24px;
  margin-bottom: -4px;
}
.phase-banner .ph-num { color: var(--rust); font-weight: 700; }
`

// Route mark icon — peaks-with-dots glyph from the vanilla page
function RouteMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8,52 L20,40 L28,46 L40,28 L48,34 L56,18" strokeWidth="2.5" />
      <circle cx="20" cy="40" r="2.5" fill="currentColor" />
      <circle cx="40" cy="28" r="2.5" fill="currentColor" />
      <circle cx="56" cy="18" r="2.5" fill="currentColor" />
    </svg>
  )
}

function PhaseBanner({ num, label }) {
  return (
    <div className="phase-banner">
      <span className="ph-num">§ {num}</span>
      <span>{label}</span>
    </div>
  )
}

export default function RoutePage() {
  const stats = [
    { tminus: true },
    { k: 'Total',  v: '3,649', u: 'km' },
    { k: '4×4 leg', v: '~75',   u: 'km' },
    {
      k: 'Recommendation',
      render: () => <span style={{ color: 'var(--flag-green)' }}>DRIVE</span>,
    },
    {
      k: 'Live atlas',
      render: () => (
        <Link to="/map" style={{ color: 'inherit', borderBottom: '1px dashed var(--dust)' }}>
          /map
        </Link>
      ),
    },
  ]

  return (
    <main className="shell">
      <style>{PHASE_CSS}</style>
      <HeroMtn />

      <header className="trail-header">
        <div className="mark" aria-hidden="true"><RouteMark /></div>
        <div className="wordmark">
          <span className="eyebrow">Section 05 · Three terrains, three driving modes</span>
          <h1>Route &amp; <span className="accent">driving</span></h1>
          <div className="sub">
            <span>Expressway</span><span className="sep">→</span>
            <span>Mahendra Hwy</span><span className="sep">→</span>
            <span><b>Mustang 4×4</b></span><span className="sep">→</span>
            <span>RTB</span>
          </div>
        </div>
        <Link className="back" to="/">
          <ChevronLeft size={13} strokeWidth={1.6} />
          <span>Base</span>
        </Link>
      </header>

      <StatStrip stats={stats} />

      <p className="muted" style={{ margin: '6px 0 0' }}>
        Three terrains, three driving modes — the expressway chain, the Mahendra Highway, the Mustang 4×4. Route condition recommendation:{' '}
        <strong style={{ color: 'var(--flag-green)' }}>DRIVE</strong> (compiled 2026-05-04 ·{' '}
        <a href="../docs/ROUTE_CONDITIONS.md">full report</a>).
      </p>

      <PhaseBanner num="01" label="Phase 1 · The Expressway Chain (India)" />
      <div className="grid cols-2">
        <Card pill="Day 1 · drive" title="Bikaner → Noida — ~610 km, 9–10 h" data-aos="fade-up">
          <p>NH11 to Sikar / Behror, then Western Peripheral Expressway around Delhi to Noida. Heavy on tolls. Plan two long fuel stops, no more.</p>
        </Card>
        <Card pill="Day 2 · drive" title="Noida → Gorakhpur — ~720 km, 10–11 h" data-aos="fade-up" data-aos-delay="80">
          <p>Yamuna Expressway → Agra–Lucknow Expressway → Purvanchal Expressway → Gorakhpur Link. Almost continuous expressway. Aim Gorakhpur by 7 PM.</p>
        </Card>
      </div>

      <PhaseBanner num="02" label="Phase 2 · Border + Mahendra Highway (Nepal)" />
      <div className="grid cols-2">
        <Card pill="Day 3 · border" title="Gorakhpur → Sunauli → Bhairahawa — ~120 km" data-aos="fade-up">
          <p>Reach Sunauli around mid-morning. Process: Indian customs exit → walk-distance to Nepal side → Bhansar (customs) → Yatayat (transport) → tourist SIM → exchange counter. Allow 3 hours minimum at the border.</p>
        </Card>
        <Card pill="Day 4 · drive" title="Bhairahawa → Pokhara — ~190 km, 6–7 h" data-aos="fade-up" data-aos-delay="80">
          <p>Mahendra Highway via Butwal → Mugling → Pokhara. Smooth tar, scenic. Buy ACAP next day at the NTB office in Pokhara — never at the Ghasa check-post (double fee).</p>
        </Card>
      </div>

      <PhaseBanner num="03" label="Phase 3 · The Mustang 4×4 leg" />
      <div className="grid cols-2">
        <Card pill="Day 6 · acclimatise" title="Pokhara → Beni / Tatopani — ~85 km" data-aos="fade-up">
          <p>Tar road via Naya Pul. Tatopani hot springs are the reward. Sleep at ~1,200 m to start the altitude curve.</p>
        </Card>
        <Card pill="Day 7 · 4WD" title="Beni → Jomsom — ~75 km, 5–6 h" data-aos="fade-up" data-aos-delay="80">
          <p>The road becomes gravel, narrow, with multiple river crossings. Engage 4WD-Low. Slow pace through Tatopani → Ghasa → Lete → Tukuche → Marpha → Jomsom (~2,720 m). Acclimatise overnight.</p>
        </Card>
        <Card pill="Day 8 · darshan" title="Jomsom → Muktinath → Jomsom — ~40 km round" data-aos="fade-up" data-aos-delay="160">
          <p>Pre-dawn start. Climb past Kagbeni to Muktinath (~3,800 m). Allow 90 minutes for darshan + 108-spout bath. Back to Jomsom for lunch.</p>
        </Card>
        <Card pill="Day 9 · descend" title="Jomsom → Pokhara — ~160 km, 7–8 h" data-aos="fade-up" data-aos-delay="240">
          <p>Reverse the gravel descent. Easy pace. Pokhara recovery night with fibre + lakeside dinner.</p>
        </Card>
      </div>

      <h2 className="section-title">Fuel strategy</h2>
      <div className="grid cols-3">
        <div className="card" data-aos="fade-up">
          <span className="pill">India leg</span>
          <h3>Tank-up rhythm</h3>
          <p>Every state-border pump — toll plazas have HP/IOC nearby. Final India fill at Gorakhpur before border.</p>
        </div>
        <div className="card" data-aos="fade-up" data-aos-delay="80">
          <span className="pill">Nepal lowland</span>
          <h3>Reliable</h3>
          <p>Bhairahawa, Butwal, Mugling, Pokhara — multi-pump stations. Quality fine for the Thar Roxx.</p>
        </div>
        <div className="card" data-aos="fade-up" data-aos-delay="160">
          <span className="pill">Mustang</span>
          <h3>Two pumps only</h3>
          <p><b>Reliable pumps only at Beni and Jomsom.</b> Top up at both. The 10 L jerrycan is your insurance — fill it at Beni, never carry full across the border.</p>
        </div>
      </div>

      <h2 className="section-title">Where to slow down</h2>
      <div className="grid cols-2">
        <div className="card" data-aos="fade-up">
          <h3>Mugling–Pokhara curves</h3>
          <p>Frequent overtaking accidents. Stay behind buses; don't overtake into blind curves.</p>
        </div>
        <div className="card" data-aos="fade-up" data-aos-delay="80">
          <h3>Tatopani–Ghasa landslide zones</h3>
          <p>Geologically active. Fresh debris is common. Don't stop under loose slopes; move quickly past flagged zones.</p>
        </div>
        <div className="card" data-aos="fade-up">
          <h3>Kagbeni → Muktinath switchbacks</h3>
          <p>Hairpins at altitude. Engine power drops 25–30%. Use 2nd gear; don't lug. Diamox 24 h prior.</p>
        </div>
        <div className="card" data-aos="fade-up" data-aos-delay="80">
          <h3>Sunauli border vicinity</h3>
          <p>Mixed traffic, no lane discipline, slow trucks. Crawl through the bazaar; respect the traffic constable.</p>
        </div>
      </div>

      <p className="footnote">
        Live route map &amp; elevation profile: <Link to="/map">Atlas</Link> · waypoint photos:{' '}
        <Link to="/gallery">Plates</Link> · narrative:{' '}
        <a href="../docs/ROUTE_CONDITIONS.md">docs/ROUTE_CONDITIONS.md</a>.
      </p>
    </main>
  )
}
