import HeroMtn from '../components/HeroMtn.jsx'
import TrailHeader from '../components/TrailHeader.jsx'
import StatStrip from '../components/StatStrip.jsx'
import StencilStamp from '../components/StencilStamp.jsx'
import { RULES } from '../lib/data.js'

const EMBASSY_24x7 = '+977-9851316807'

export default function Rules() {
  const rules = RULES?.rules || []
  const emergencies = RULES?.emergencies || []

  return (
    <main className="shell">
      <HeroMtn />

      <TrailHeader
        eyebrow="Section 03 · Border + permits + emergencies"
        title={<>Nepal&nbsp;<span className="accent">rules</span></>}
        sub={[
          <><b>{rules.length}</b> rules</>,
          <><b>{emergencies.length}</b> emergencies</>,
          <>Re-verify <b>{RULES?.verifyBefore || '2026-05-08'}</b></>,
        ]}
        icon={
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M32,8 L52,18 L52,34 C52,46 32,56 32,56 C32,56 12,46 12,34 L12,18 Z" />
            <path d="M22,32 L30,40 L42,24" strokeWidth="3" />
          </svg>
        }
      />

      <StatStrip
        stats={[
          { tminus: true },
          { k: 'Bhansar SUV', v: '600', u: 'NPR/d' },
          { k: 'Cap', v: '30', u: 'd/yr' },
          { k: 'ACAP SAARC', v: '1,000', u: 'NPR' },
          {
            k: 'Embassy 24×7',
            render: () => (
              <a href={`tel:${EMBASSY_24x7.replace(/\s+/g, '')}`} style={{ color: 'inherit', fontSize: 14 }}>
                {EMBASSY_24x7}
              </a>
            ),
          },
        ]}
      />

      <p className="muted" style={{ margin: '6px 0 0' }}>
        Re-verify the line items below on 8 May at the official sources before crossing.
      </p>

      <div className="callout" data-aos="fade-up" style={{ margin: '18px 0 24px' }}>
        <b>Official sources:</b>{' '}
        <a href="https://www.dotm.gov.np/" target="_blank" rel="noopener noreferrer">dotm.gov.np</a> (Transport / Yatayat) ·{' '}
        <a href="https://www.customs.gov.np/" target="_blank" rel="noopener noreferrer">customs.gov.np</a> (Bhansar) ·{' '}
        <a href="https://www.immigration.gov.np/" target="_blank" rel="noopener noreferrer">immigration.gov.np</a> ·{' '}
        <a href="https://epermit.ntnc.org.np/" target="_blank" rel="noopener noreferrer">epermit.ntnc.org.np</a> (ACAP) ·{' '}
        <a href="https://ntb.gov.np/" target="_blank" rel="noopener noreferrer">ntb.gov.np</a> (NTB) ·{' '}
        <a href="https://www.indembkathmandu.gov.in/" target="_blank" rel="noopener noreferrer">indembkathmandu.gov.in</a>.
        {' '}Full diff: <a href="../docs/RULES_CHANGE_REPORT.md">docs/RULES_CHANGE_REPORT.md</a>.
      </div>

      <h2 className="section-title">Rules &amp; protocol</h2>
      <div className="grid cols-3" id="rules" data-aos="fade-up">
        {rules.map((r, i) => (
          <div key={i} className="rule">
            {r.confidence && (
              <StencilStamp kind={r.confidence} size="sm" />
            )}
            <span className="cat-tag">{r.category}</span>
            <h3>{r.title}</h3>
            <p>{r.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Emergency contacts</h2>
      <div className="grid cols-3" id="emerg" data-aos="fade-up">
        {emergencies.map((e, i) => {
          const body = e.value || e.phone || e.email || e.note || ''
          return (
            <div key={i} className="rule">
              <h3>{e.label}</h3>
              <p>
                {e.phone
                  ? <a href={`tel:${e.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit' }}>{e.phone}</a>
                  : e.email
                    ? <a href={`mailto:${e.email}`} style={{ color: 'inherit' }}>{e.email}</a>
                    : body}
              </p>
            </div>
          )
        })}
      </div>

      <p className="footnote">
        Source: <code>data/rules.json</code> ({rules.length} rules, {emergencies.length} emergencies — refreshed {RULES?.lastUpdated || '2026-05-04'}).
        Confidence flags &amp; per-rule sourcing live in the JSON; full audit at <code>data/rules.fetch_log.json</code>.
        Narrative form: <a href="../docs/NEPAL_RULES_2026.md">docs/NEPAL_RULES_2026.md</a>.
      </p>
    </main>
  )
}
