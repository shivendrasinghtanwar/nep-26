import { useCallback, useEffect, useMemo, useState } from 'react'
import HeroMtn from '../components/HeroMtn.jsx'
import TrailHeader from '../components/TrailHeader.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { CHECKLIST } from '../lib/data.js'

const LS_KEY = 'nepal2026:checklist:v1'

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') }
  catch { return {} }
}

function saveState(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) }
  catch { /* quota or private mode — silent */ }
}

export default function Checklist() {
  const categories = CHECKLIST?.categories || []

  const [state, setState] = useState(() => loadState())

  useEffect(() => { saveState(state) }, [state])

  const totals = useMemo(() => {
    let total = 0, done = 0
    categories.forEach(cat => cat.items.forEach(it => {
      total++
      if (state[it.id]) done++
    }))
    return { total, done }
  }, [categories, state])

  const totalCount = categories.length
  const itemCount = totals.total
  const globalPct = totals.total ? Math.round((totals.done / totals.total) * 100) : 0

  const toggleItem = useCallback((id) => {
    setState(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }, [])

  const onItemClick = useCallback((id) => () => {
    // Click anywhere on the li toggles the item — including the checkbox.
    // The checkbox is fully controlled by React state, so the browser's own
    // toggle is overwritten on rerender. Net result: one toggle per click,
    // regardless of where in the li the click lands. Matches legacy app.js.
    toggleItem(id)
  }, [toggleItem])

  const resetProgress = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm('Clear all checklist progress on this device?')) {
      try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ }
      setState({})
    }
  }, [])

  return (
    <main className="shell">
      <HeroMtn />

      <TrailHeader
        eyebrow="Section 04 · Pre-flight checklist"
        title={<>Master&nbsp;<span className="accent">checklist</span></>}
        sub={[
          <><b>{totalCount}</b> categories</>,
          <><b>~{itemCount}</b> items</>,
          'Saves to this device',
        ]}
        icon={
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14,32 L26,44 L50,18" strokeWidth="3" />
            <rect x="6" y="6" width="52" height="52" rx="2" strokeOpacity="0.4" />
          </svg>
        }
      />

      <StatStrip
        stats={[
          { tminus: true },
          { k: 'Categories', v: totalCount },
          { k: 'Storage', v: 'localStorage' },
          {
            k: 'Doc',
            render: () => (
              <a href="../docs/MASTER_CHECKLIST.md" style={{ color: 'inherit', borderBottom: '1px dashed var(--dust)' }}>.md</a>
            ),
          },
        ]}
      />

      <p className="muted" style={{ margin: '6px 0 0' }}>
        Tap an item to tick it. Progress saves to this browser only — no cloud, no account, no telemetry.
      </p>

      <div className="global-progress" data-aos="fade-up">
        <div>
          <div className="num" id="pt">{totals.done} / {totals.total} ({globalPct}%)</div>
          <div className="bar"><span id="pb" style={{ width: globalPct + '%' }} /></div>
        </div>
        <div style={{ flex: 1 }} />
        <button id="reset-checklist" onClick={resetProgress}>Reset progress</button>
      </div>

      <div id="checklist" data-aos="fade-up" data-aos-delay="80">
        {categories.map(cat => {
          const total = cat.items.length
          const doneCount = cat.items.filter(it => state[it.id]).length
          const pct = total ? Math.round((doneCount / total) * 100) : 0
          return (
            <section key={cat.id} className="cat" id={`cat-${cat.id}`}>
              <div className="cat-head">
                <h2>{cat.title}</h2>
                <span className="progress">{doneCount} / {total}</span>
              </div>
              {cat.note && <p className="cat-note">{cat.note}</p>}
              <div className="bar"><span style={{ width: pct + '%' }} /></div>
              <ul>
                {cat.items.map(it => (
                  <li
                    key={it.id}
                    data-id={it.id}
                    className={state[it.id] ? 'done' : ''}
                    onClick={onItemClick(it.id)}
                  >
                    <input
                      type="checkbox"
                      checked={!!state[it.id]}
                      onChange={() => { /* toggled via li onClick */ }}
                    />
                    <span className="lbl">{it.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <p className="footnote">
        Source: <code>data/checklist.json</code> · rendered by <code>src/pages/Checklist.jsx</code> ·
        narrative form lives in <a href="../docs/MASTER_CHECKLIST.md">docs/MASTER_CHECKLIST.md</a>.
      </p>
    </main>
  )
}
