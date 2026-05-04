import { useEffect, useMemo, useRef, useState } from 'react'
import { Radio, RadioTower, Signal, SendHorizontal, ChevronLeft } from 'lucide-react'

import HeroMtn from '../components/HeroMtn.jsx'
import TrailHeader from '../components/TrailHeader.jsx'
import StatStrip from '../components/StatStrip.jsx'
import { TRIP, RULES, ROUTE, ITINERARY, CHECKLIST } from '../lib/data.js'

/* =========================================================================
   Trail Comms · Field Dispatch — React port of /website/agent.html.

   Design contract (must match the vanilla page pixel-for-pixel):
   - rack-mount strip (brushed metal, LED, channel, freq, uptime)
   - voice-radio bubbles ([SYS] / [YOU→TM] / [KP→TM] + scan-lines)
   - typewriter assistant reveal (35-60ms/char, jittered, instant when
     prefers-reduced-motion is set)
   - stencil rocker chips (dashed border, ◉ glyph, hover lift)
   - status band (4 tiles) at the bottom

   The 19 intents and the suggestion list are copied VERBATIM from agent.js.
   Rendered HTML uses the same .rule / .conf-* / .day-h / .type-* / .emerg
   classes so rugged.css can style them — that's why rich bodies are
   injected with dangerouslySetInnerHTML.
   ====================================================================== */

// ---------- helpers (escapeHtml, plain-text extraction) ----------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

function nowStamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// strip HTML tags + collapse whitespace so the typewriter has clean prose
function htmlToPlain(html) {
  if (typeof document === 'undefined') return html
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  tmp.querySelectorAll('li, p, div, ol, ul, h1, h2, h3, h4').forEach((el) => {
    el.appendChild(document.createTextNode('\n'))
  })
  return (tmp.textContent || '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ---------- answer builders (HTML output preserved verbatim) ----------

function ruleHtml(r) {
  const conf = `<span class="conf conf-${r.confidence}">${r.confidence}</span>`
  const src = r.source
    ? `<a href="${escapeHtml(r.source)}" target="_blank" rel="noopener">source</a>`
    : ''
  return `<div class="rule"><div class="rule-h"><strong>${escapeHtml(r.title)}</strong> ${conf}</div>
    <div class="rule-d">${escapeHtml(r.detail)}</div>
    <div class="rule-meta"><span class="cat">${escapeHtml(r.category)}</span> · ${src} · fetched ${escapeHtml(r.fetchedAt || '')}</div>
  </div>`
}

function answerForRules(filterTerms) {
  const matches = (RULES?.rules || []).filter((r) => {
    const blob = `${r.category} ${r.title} ${r.detail}`.toLowerCase()
    return filterTerms.every((t) => blob.includes(String(t).toLowerCase()))
  })
  if (!matches.length) {
    return `<p>I have no specific rule for that — try one of the chips below, or check <code>data/rules.json</code>.</p>`
  }
  return matches.slice(0, 4).map(ruleHtml).join('')
}

function emergencyAnswer(filterTerms) {
  const list = (RULES?.emergencies || []).filter((e) => {
    if (!filterTerms.length) return true
    const blob = (e.label + ' ' + (e.phone || e.email || e.note || '')).toLowerCase()
    return filterTerms.some((t) => blob.includes(t))
  })
  if (!list.length) return '<p>No matching emergency contact.</p>'
  return `<ul class="emerg">${list.map((e) => {
    const v = e.phone
      ? `<a href="tel:${escapeHtml(e.phone.replace(/\s+/g, ''))}">${escapeHtml(e.phone)}</a>`
      : e.email
      ? `<a href="mailto:${escapeHtml(e.email)}">${escapeHtml(e.email)}</a>`
      : escapeHtml(e.note || '')
    return `<li><strong>${escapeHtml(e.label)}</strong> — ${v}</li>`
  }).join('')}</ul>`
}

function routeAnswer() {
  const r = ROUTE?.beniJomsom
  if (!r) return '<p>Route intel not loaded.</p>'
  const concerns = (r.concerns || []).map((c) => `
    <li><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.detail)} <em>(${escapeHtml(c.source)})</em></li>
  `).join('')
  return `
    <div class="rec rec-${r.recommendation.toLowerCase()}">${escapeHtml(r.recommendation)}</div>
    <p>${escapeHtml(r.headline)}</p>
    <p><strong>Top concerns:</strong></p>
    <ol class="concerns">${concerns}</ol>
    <p><strong>Re-verify on ${escapeHtml(r.verifyOn)}:</strong> ${(r.verifyChecks || []).map((c) => escapeHtml(c)).join(' · ')}</p>
    <p><a href="../docs/ROUTE_CONDITIONS.md" target="_blank">Full report</a></p>
  `
}

function itineraryAnswer(query) {
  const days = ITINERARY || []
  if (!days.length) return '<p>Itinerary not loaded.</p>'
  const q = (query || '').toLowerCase()
  const dayMatch = q.match(/day\s*(\d+)/) || q.match(/^(\d+)\s*$/)
  const dateMatch = q.match(/(\d{4}-\d{2}-\d{2})/) || q.match(/may\s*(\d+)/)
  let filtered = days
  if (dayMatch) {
    const n = +dayMatch[1]
    filtered = days.filter((d) => d.day === n)
  } else if (dateMatch) {
    filtered = days.filter((d) => (d.date || '').endsWith(dateMatch[1] || dateMatch[0]))
  } else {
    const tokens = ['pokhara', 'jomsom', 'muktinath', 'sunauli', 'bhairahawa', 'kagbeni', 'noida', 'gorakhpur', 'bikaner']
    const hit = tokens.find((t) => q.includes(t))
    if (hit) filtered = days.filter((d) => (d.leg + ' ' + (d.halt || '')).toLowerCase().includes(hit))
  }
  if (!filtered.length) return '<p>No matching day. Try "Day 5" or "Pokhara" or "May 15".</p>'
  return `<ol class="days">${filtered.map((d) => `
    <li>
      <div class="day-h"><strong>Day ${d.day}</strong> · ${escapeHtml(d.date)} ${escapeHtml(d.weekday || '')}
        <span class="day-type type-${d.type}">${escapeHtml(d.type || '')}</span>
      </div>
      <div class="day-leg">${escapeHtml(d.leg)} ${d.km ? `(${d.km} km · ${escapeHtml(d.hours || '')})` : ''}</div>
      ${d.halt ? `<div class="day-halt">Halt: ${escapeHtml(d.halt)}</div>` : ''}
      ${d.note ? `<div class="day-note">${escapeHtml(d.note)}</div>` : ''}
    </li>`).join('')}</ol>`
}

function checklistAnswer(query) {
  const cl = CHECKLIST?.categories || []
  if (!cl.length) return '<p>Checklist not loaded.</p>'
  const q = (query || '').toLowerCase()
  const filtered = q.length > 6
    ? cl.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    : cl
  return filtered.map((c) => `
    <div class="cat">
      <strong>${escapeHtml(c.title)}</strong> ${c.note ? `<em>— ${escapeHtml(c.note)}</em>` : ''}
      <ul>${(c.items || []).map((i) => `<li>${escapeHtml(i.label)}</li>`).join('')}</ul>
    </div>
  `).join('')
}

// ---------- 19 intents (verbatim from /website/js/agent.js) ----------

const INTENTS = [
  { id: 'bhansar',    keys: ['bhansar', 'customs fee', 'border fee', 'daily fee', 'how much fee'], title: 'Bhansar (customs) daily fee',                    respond: () => answerForRules(['Vehicle', 'Bhansar']) },
  { id: 'yatayat',    keys: ['yatayat', 'transport permit'],                                       title: 'Yatayat (transport) permit',                    respond: () => answerForRules(['Vehicle', 'Yatayat']) },
  { id: 'cap',        keys: ['30 day', 'cap', 'overstay', 'impound', 'cumulative', 'annual'],     title: '30-day cumulative cap',                          respond: () => answerForRules(['Vehicle', 'cumulative']) },
  { id: 'acap',       keys: ['acap', 'annapurna', 'conservation'],                                title: 'ACAP permit',                                    respond: () => answerForRules(['Permits', 'ACAP']) },
  { id: 'mustang',    keys: ['mustang', 'upper mustang', 'kagbeni', 'muktinath', 'lower mustang'],title: 'Mustang permit boundary',                        respond: () => answerForRules(['Permits', 'Mustang']) },
  { id: 'tims',       keys: ['tims'],                                                              title: 'TIMS card',                                      respond: () => answerForRules(['Permits', 'TIMS']) },
  { id: 'embassy',    keys: ['embassy', 'consulate', 'mea'],                                       title: 'Indian Embassy contacts',                        respond: () => emergencyAnswer(['embassy']) },
  { id: 'emergency',  keys: ['emergency', 'police', 'ambulance', 'hospital', 'ams'],              title: 'Emergency contacts',                             respond: () => emergencyAnswer([]) },
  { id: 'cash',       keys: ['cash', 'money', 'inr', 'npr', 'rupees', '2000', 'budget'],          title: 'Cash & money',                                   respond: () => answerForRules(['Money']) },
  { id: 'fuel',       keys: ['fuel', 'petrol', 'diesel', 'pump'],                                 title: 'Fuel availability',                              respond: () => answerForRules(['Fuel']) },
  { id: 'altitude',   keys: ['altitude', 'ams', 'diamox', 'breath', 'sick'],                      title: 'Altitude / AMS',                                 respond: () => answerForRules(['Altitude']) },
  { id: 'restricted', keys: ['drone', 'sat phone', 'satellite'],                                  title: 'Drones & sat phones',                            respond: () => answerForRules(['Restricted']) },
  { id: 'sim',        keys: ['ntc', 'ncell', 'sim', 'connectivity', 'data', 'wifi', 'internet'],  title: 'SIM / connectivity',                             respond: () => answerForRules(['Connectivity']) },
  { id: 'insurance',  keys: ['insurance', 'third party', 'policy'],                               title: 'Insurance',                                      respond: () => answerForRules(['Insurance']) },
  { id: 'visa',       keys: ['visa', 'identity', 'passport', 'aadhaar', 'voter id', 'pan card'],  title: 'Visa / acceptable IDs',                          respond: () => answerForRules(['Identity']) },
  { id: 'driving',    keys: ['driving', 'speed limit', 'license', 'alcohol'],                     title: 'Driving rules',                                  respond: () => answerForRules(['Driving']) },
  { id: 'road',       keys: ['road', 'beni', 'jomsom', 'landslide', 'condition', 'drive or postpone'], title: 'Beni–Jomsom road condition',                 respond: routeAnswer },
  { id: 'itinerary',  keys: ['itinerary', 'schedule', 'day ', 'plan ', 'when do we'],             title: 'Day-by-day itinerary',                           respond: itineraryAnswer },
  { id: 'checklist',  keys: ['checklist', 'pack', 'packing', 'list', 'documents'],                title: 'Packing checklist',                              respond: checklistAnswer },
  { id: 'firm',       keys: ['firm', 'authorization', 'letter', 'tds', 'thar digital', 'mom', 'proprietor'], title: 'Firm-registered SUV / authorization letter', respond: () => answerForRules(['Vehicle', 'Firm']) },
]

// suggested-question chips (verbatim, ordered by trip-day relevance)
const SUGGESTIONS = [
  'How much Bhansar will I pay at Sunauli?',
  "What's the embassy emergency phone?",
  'Is the Beni–Jomsom road open right now?',
  'How many INR should I carry as cash?',
  'Is Aadhaar accepted at the border?',
  'Do I need a TIMS card for Muktinath?',
  'What is the ACAP fee for SAARC?',
  'When am I in Pokhara?',
  'What documents do I need for a firm-registered SUV?',
  'AMS warning signs at Muktinath?',
]

function classify(query) {
  const q = ' ' + query.toLowerCase().replace(/[^\w\s']/g, ' ') + ' '
  let best = null
  let bestScore = 0
  for (const it of INTENTS) {
    let score = 0
    for (const k of it.keys) {
      const lk = k.toLowerCase()
      if (q.includes(' ' + lk) || q.includes(lk + ' ') || q.includes(' ' + lk + ' ')) score++
    }
    if (score > bestScore) { best = it; bestScore = score }
  }
  return bestScore ? best : null
}

function answer(query) {
  const intent = classify(query)
  if (!intent) {
    return {
      title: 'Unmatched · suggesting channels',
      html: `<p>I'm not sure which rule that maps to — try one of these:</p>
        ${SUGGESTIONS.slice(0, 6).map((s) => `<button class="chip" data-q="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join(' ')}`,
    }
  }
  return { title: intent.title, html: intent.respond(query) }
}

// ---------- typewriter hook (rAF, jittered, reduced-motion-aware) ----------

function useTypewriter(plainText, { enabled = true } = {}) {
  const [revealed, setRevealed] = useState(enabled ? '' : plainText)
  const [done, setDone] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setRevealed(plainText)
      setDone(true)
      return undefined
    }
    let cancelled = false
    let i = 0
    let rafId = 0
    let last = performance.now()
    setRevealed('')
    setDone(false)

    const burst = (plainText?.length || 0) > 240 ? 3 : 1

    const step = (now) => {
      if (cancelled) return
      const target = last + 35 + Math.random() * 25
      if (now >= target && i < plainText.length) {
        i = Math.min(plainText.length, i + burst)
        setRevealed(plainText.slice(0, i))
        last = now
      }
      if (i < plainText.length) {
        rafId = requestAnimationFrame(step)
      } else {
        setDone(true)
      }
    }
    rafId = requestAnimationFrame(step)
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [plainText, enabled])

  return { revealed, done }
}

// ---------- Bubble components ----------

function Meta({ tag, time, role }) {
  return (
    <div className="kp-meta">
      <span className="kp-tag">{tag}</span>
      <span className="kp-time">{time}</span>
    </div>
  )
}

function SystemBubble({ html, time }) {
  return (
    <div className="bubble bubble-system">
      <Meta tag="[SYS]" time={time} role="system" />
      <div className="kp-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function UserBubble({ text, time }) {
  return (
    <div className="bubble bubble-user">
      <Meta tag="[YOU→TM]" time={time} role="user" />
      <div className="kp-body"><p>{text}</p></div>
    </div>
  )
}

function AssistantBubble({ title, html, plain, time, onChip, reduced }) {
  const { revealed, done } = useTypewriter(plain, { enabled: !reduced })

  return (
    <div className="bubble bubble-assistant">
      <Meta tag="[KP→TM]" time={time} role="assistant" />
      <div className="kp-body">
        {title && <div className="intent-h">{title}</div>}
        {!done && !reduced && (
          <pre className="kp-stream">{revealed}</pre>
        )}
        {(done || reduced) && (
          <div
            className="kp-rich"
            dangerouslySetInnerHTML={{ __html: html }}
            onClick={(e) => {
              const chip = e.target.closest && e.target.closest('.chip')
              if (chip && chip.dataset && chip.dataset.q) onChip(chip.dataset.q)
            }}
          />
        )}
      </div>
    </div>
  )
}

// ---------- Status-band tile ----------

function StatusBand() {
  const list = RULES?.rules || []
  let ofc = 0, cor = 0, inf = 0
  for (const r of list) {
    if (r.confidence === 'official') ofc++
    else if (r.confidence === 'corroborated') cor++
    else if (r.confidence === 'inferred') inf++
  }
  const last = RULES?.lastUpdated || '—'
  const srcCount = (RULES?.officialSources || []).length || list.filter((r) => r.source).length

  return (
    <section className="status-band" aria-label="Source confidence">
      <div className="tile">
        <div className="tk">Confidence</div>
        <div className="tv">
          <span className="ofc">{ofc} ofc</span><span className="sep">/</span>
          <span className="cor">{cor} cor</span><span className="sep">/</span>
          <span className="inf">{inf} inf</span>
        </div>
      </div>
      <div className="tile">
        <div className="tk">Last update</div>
        <div className="tv">{last}</div>
      </div>
      <div className="tile">
        <div className="tk">Sources</div>
        <div className="tv">{srcCount} cited</div>
      </div>
      <div className="tile">
        <div className="tk">Shortcut</div>
        <div className="tv">Press <kbd>/</kbd> to focus</div>
      </div>
    </section>
  )
}

// ---------- Rack header (LED + freq + uptime) ----------

function RackHeader() {
  const [uptime, setUptime] = useState('T+00:00:00')
  useEffect(() => {
    const t0 = Date.now()
    const pad = (n) => String(n).padStart(2, '0')
    const tick = () => {
      const s = Math.floor((Date.now() - t0) / 1000)
      const hh = pad(Math.floor(s / 3600))
      const mm = pad(Math.floor((s % 3600) / 60))
      const ss = pad(s % 60)
      setUptime(`T+${hh}:${mm}:${ss}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // freq locked to RULES.lastUpdated (whimsy) · 145.500 MHz
  const freq = RULES?.lastUpdated
    ? `${RULES.lastUpdated.replace(/-/g, '.')} · 145.500 MHz`
    : '— · 145.500 MHz'

  return (
    <div className="rack-strip">
      <span className="led" aria-hidden="true" />
      <span>
        <RadioTower size={14} strokeWidth={1.6} className="icon" style={{ verticalAlign: -2, marginRight: 6 }} />
        <span className="ch">Channel 1 · Open · Offline-safe</span>
      </span>
      <span className="freq">{freq}</span>
      <span className="uptime" title="Session uptime">{uptime}</span>
    </div>
  )
}

// ---------- The page ----------

export default function Agent() {
  const reduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // initial system bubble — trip vitals + greeting
  const initialSystem = useMemo(() => {
    const t = TRIP || {}
    return `
      <p><strong>Namaste, Shive 🇳🇵</strong> — radio check, you are loud and clear on Channel 1.</p>
      <p>Trip: <strong>${escapeHtml(t.name || '')}</strong> · ${escapeHtml(t.depart || '')} → ${escapeHtml(t['return'] || '')} · ${t.nights || ''} nights · ${t.totalKm || ''} km RT.</p>
      <p>Vehicle: <strong>${escapeHtml(t.vehicle || '')}</strong>. Permit days planned: ${t.permitDaysUsed} of ${t.capDays}-day cap.</p>
      <p>Ask me anything — fees, IDs, road, embassy, day-by-day. I read from <code>data/*.json</code> (offline-friendly). Press <kbd>/</kbd> to focus.</p>
    `
  }, [])

  const [transcript, setTranscript] = useState(() => [
    { role: 'system', html: initialSystem, time: nowStamp() },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const transcriptRef = useRef(null)

  // "/" focuses the input when not already focused (vanilla parity)
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== '/') return
      const ae = document.activeElement
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // pin transcript to bottom on each append
  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [transcript])

  function send(query) {
    const q = (query || '').trim()
    if (!q) return
    const userTime = nowStamp()
    setTranscript((prev) => [...prev, { role: 'user', text: q, time: userTime }])
    setInput('')

    // small "keying-up" pause, then assistant reply
    setTimeout(() => {
      const a = answer(q)
      const plain = htmlToPlain(a.html)
      setTranscript((prev) => [
        ...prev,
        {
          role: 'assistant',
          title: a.title,
          html: a.html,
          plain,
          time: nowStamp(),
        },
      ])
    }, 90)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <main className="shell">
      {/* page-scoped CSS port from /website/agent.html <style> block */}
      <style>{AGENT_CSS}</style>

      <HeroMtn />

      <TrailHeader
        eyebrow={
          <>
            <Radio size={12} strokeWidth={1.6} style={{ display: 'inline-block', verticalAlign: -2, marginRight: 6 }} />
            Field channel · Dispatch console · 24×7
          </>
        }
        title={<>Trail&nbsp;<span className="accent">Comms</span></>}
        sub={[
          <><b>Nepal</b> 2026</>,
          <><b>14</b> nights</>,
          <><b>4,410</b> km RT</>,
          <>Bikaner ↔ Muktinath</>,
        ]}
        icon={
          <svg viewBox="0 0 64 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3,26 L3,18 L9,18 L13,10 L25,10 L27,15 L46,15 L49,10 L57,10 L60,18 L61,18 L61,26 Z" />
            <circle cx="14" cy="26" r="4" fill="currentColor" fillOpacity="0.15" />
            <circle cx="50" cy="26" r="4" fill="currentColor" fillOpacity="0.15" />
            <circle cx="14" cy="26" r="2" />
            <circle cx="50" cy="26" r="2" />
            <path d="M27,15 L27,10" strokeOpacity="0.5" />
            <path d="M46,15 L46,10" strokeOpacity="0.5" />
          </svg>
        }
      />

      <StatStrip
        stats={[
          { tminus: true, accent: true },
          { k: 'Depart', v: 'May 09' },
          { k: 'Return', v: 'May 23' },
          { k: 'Rig', v: 'Thar Roxx', accent: true },
          { k: 'Permit days', v: '18', u: '/30' },
          { k: 'Peak', v: '3,800', u: 'm' },
        ]}
      />

      <section className="rack" aria-label="Travel manager · radio dispatch" data-aos="fade-up" data-aos-delay="100">
        <span className="rivet-bl" /><span className="rivet-br" />

        <RackHeader />

        <div className="panel" role="group">
          <header className="panel-h">
            <Signal size={14} strokeWidth={1.6} className="icon" />
            <span className="dot" />
            <span>Trail manager · Kathmandu Post relay</span>
          </header>

          <div id="transcript" ref={transcriptRef} role="log" aria-live="polite">
            {transcript.map((b, i) => {
              if (b.role === 'system')    return <SystemBubble    key={i} html={b.html} time={b.time} />
              if (b.role === 'user')      return <UserBubble      key={i} text={b.text} time={b.time} />
              if (b.role === 'assistant') return <AssistantBubble key={i} title={b.title} html={b.html} plain={b.plain} time={b.time} reduced={reduced} onChip={send} />
              return null
            })}
          </div>

          <div className="kp-composer-wrap">
            <div className="composer">
              <input
                id="input"
                ref={inputRef}
                type="text"
                placeholder='Press / · ask anything — "How much cash?" "Embassy phone?" "Day 8 plan?"'
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button id="send" type="button" onClick={() => send(input)}>
                <SendHorizontal size={14} strokeWidth={1.6} className="icon" />
                <span>Send</span>
              </button>
            </div>
            <div id="chips" aria-label="Suggested questions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chip" data-q={s} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatusBand />

      <p className="footnote">
        Answers come from <code>/data/rules.json</code>, <code>/data/route.json</code>, <code>/data/itinerary.json</code>, <code>/data/checklist.json</code>.
        All sourced; confidence per fact (
        <span style={{ color: 'var(--aurora)' }}>official</span> ·{' '}
        <span style={{ color: 'var(--flag-yellow)' }}>corroborated</span> ·{' '}
        <span style={{ color: 'var(--flag-red)' }}>inferred</span>
        ). No network call from this page. Re-verify on{' '}
        <strong style={{ color: 'var(--cream)' }}>{RULES?.verifyBefore || '2026-05-08'}</strong>.{' '}
        Embassy 24×7: <a href="tel:+9779851316807">+977-98513-16807</a>.{' '}
        <a href="../docs/RULES_CHANGE_REPORT.md">Change report</a> · <a href="/map">Map</a> · <a href="/gallery">Gallery</a>.
      </p>
    </main>
  )
}

// ---------- Page-scoped CSS, ported from /website/agent.html ----------
//
// Selectors are bespoke (.rack, .rack-strip, .kp-*, .bubble, .chip overrides
// inside .kp-composer-wrap, .status-band) so they don't bleed into other
// pages. The .chip / .panel / .composer / .stat-strip / .trail-header /
// .footnote / .accent classes are owned by rugged.css; we only LAYER on top.
const AGENT_CSS = `
  /* ---------- Rack-mount unit (wraps the existing .panel) ---------- */
  .rack {
    position: relative;
    border-radius: 12px;
    padding: 0;
    margin-bottom: 18px;
    background:
      linear-gradient(180deg, #2d3545 0%, #1c2334 6%, #1c2334 94%, #0f1623 100%);
    border: 1px solid #0a0f1a;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 18px 38px rgba(0,0,0,0.55),
      0 1px 0 rgba(255,255,255,0.06) inset;
  }
  .rack::before, .rack::after,
  .rack > .rivet-bl, .rack > .rivet-br {
    content: '';
    position: absolute;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #6a7588 0%, #2a313e 60%, #0a0f1a 100%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 1px rgba(0,0,0,0.6);
    z-index: 4;
  }
  .rack::before { top: 8px;  left: 10px; }
  .rack::after  { top: 8px;  right: 10px; }
  .rack > .rivet-bl { bottom: 8px; left: 10px; }
  .rack > .rivet-br { bottom: 8px; right: 10px; }

  /* brushed-metal header strip */
  .rack-strip {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 14px;
    padding: 10px 36px;
    background:
      repeating-linear-gradient(90deg,
        rgba(255,255,255,0.045) 0 1px,
        transparent 1px 3px),
      linear-gradient(180deg, #3a4458 0%, #2a323f 50%, #1d2433 100%);
    border-bottom: 1px solid #0a0f1a;
    box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset;
    font-family: var(--font-mono);
    color: var(--cream);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 10.5px;
  }
  .rack-strip .led {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #6dccaa;
    box-shadow: 0 0 8px #6dccaa, 0 0 14px rgba(109,204,170,0.5), inset 0 -1px 1px rgba(0,0,0,0.4);
    animation: kp-blink 1.6s steps(2,end) infinite;
  }
  @keyframes kp-blink {
    0%, 70%   { opacity: 1; }
    75%, 100% { opacity: 0.35; }
  }
  .rack-strip .ch {
    color: #e8b13a;
    text-shadow: 0 0 8px rgba(232,177,58,0.55);
  }
  .rack-strip .freq, .rack-strip .uptime {
    font-weight: 600;
    color: var(--cream);
    letter-spacing: 0.16em;
    font-size: 10.5px;
    padding: 3px 8px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 3px;
    background: linear-gradient(180deg, #0e1726 0%, #0a1322 100%);
    box-shadow: inset 0 0 6px rgba(232,177,58,0.18);
    color: #e8b13a;
    text-shadow: 0 0 6px rgba(232,177,58,0.55);
  }
  .rack-strip .icon {
    color: #e8b13a;
    filter: drop-shadow(0 0 4px rgba(232,177,58,0.55));
  }
  @media (max-width: 720px) {
    .rack-strip {
      grid-template-columns: auto 1fr auto;
      gap: 8px;
      padding: 9px 24px;
      font-size: 9.5px;
    }
    .rack-strip .freq { display: none; }
  }
  @media (max-width: 480px) {
    /* drop the uptime readout too — at 375px the channel label needs the space */
    .rack-strip {
      grid-template-columns: auto 1fr;
      padding: 9px 22px 9px 22px;
      letter-spacing: 0.14em;
    }
    .rack-strip .uptime { display: none; }
    .rack-strip .ch { font-size: 9px; }
  }

  .rack .panel {
    border-radius: 0 0 11px 11px;
    border-color: transparent;
    box-shadow: none;
    background: linear-gradient(180deg, #0d1726 0%, #0a1322 100%);
  }
  .rack .panel::before, .rack .panel::after { display: none; }

  /* ---------- Voice-radio chat bubbles ---------- */
  .bubble {
    position: relative;
    overflow: hidden;
  }
  .bubble::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      repeating-linear-gradient(0deg,
        rgba(255,255,255,0.022) 0 1px,
        transparent 1px 3px);
    mix-blend-mode: screen;
    opacity: 0.5;
  }
  .kp-tag {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 2px;
    margin-bottom: 8px;
    border: 1px solid currentColor;
    background: rgba(0,0,0,0.25);
  }
  .bubble-system    .kp-tag { color: #e8b13a; }
  .bubble-assistant .kp-tag { color: #e8b13a; text-shadow: 0 0 6px rgba(232,177,58,0.55); }
  .bubble-user      .kp-tag { color: var(--rust); }

  .kp-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .kp-meta .kp-time {
    font-family: var(--font-mono);
    font-size: 9.5px;
    color: var(--cream-dim);
    letter-spacing: 0.14em;
  }

  /* assistant body uses mono "typewriter" face for the live-typed text */
  .kp-stream {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.55;
    color: var(--cream);
    letter-spacing: 0.01em;
    white-space: pre-wrap;
    min-height: 1.2em;
    margin: 0;
  }
  .kp-stream::after {
    content: '▍';
    color: #e8b13a;
    animation: kp-caret 1s steps(2,end) infinite;
    margin-left: 1px;
  }
  .kp-stream.kp-done::after { content: ''; }
  @keyframes kp-caret { 50% { opacity: 0; } }

  /* ---------- Stencil rocker-switch chips (override base .chip look) ---------- */
  #chips { gap: 8px; }
  #chips .chip {
    border-style: dashed !important;
    border-color: rgba(232,177,58,0.45) !important;
    color: #e8b13a !important;
    background:
      linear-gradient(180deg, rgba(232,177,58,0.05), rgba(232,177,58,0.0)) !important;
    box-shadow:
      0 2px 0 rgba(0,0,0,0.55),
      inset 0 1px 0 rgba(255,255,255,0.04) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.14em !important;
    font-size: 10px !important;
    padding: 7px 11px !important;
    transition: transform 140ms ease-out, box-shadow 160ms, border-color 160ms, color 160ms !important;
  }
  #chips .chip::before {
    content: '◉';
    margin-right: 6px;
    color: #e8b13a;
    opacity: 0.55;
    font-size: 9px;
  }
  #chips .chip:hover {
    transform: translateY(-2px) !important;
    color: var(--cream) !important;
    border-color: #e8b13a !important;
    background:
      linear-gradient(180deg, rgba(232,177,58,0.14), rgba(232,177,58,0.04)) !important;
    box-shadow:
      0 4px 0 rgba(0,0,0,0.6),
      0 0 12px rgba(232,177,58,0.25),
      inset 0 1px 0 rgba(255,255,255,0.06) !important;
  }
  #chips .chip:active {
    transform: translateY(0) !important;
    box-shadow:
      0 1px 0 rgba(0,0,0,0.6),
      inset 0 1px 2px rgba(0,0,0,0.5) !important;
  }
  /* fallback chips embedded inside an unmatched assistant body */
  .kp-rich .chip {
    border-style: dashed;
    border-color: rgba(232,177,58,0.45);
    color: #e8b13a;
    background: linear-gradient(180deg, rgba(232,177,58,0.05), rgba(232,177,58,0.0));
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 10px;
    padding: 7px 11px;
    margin: 4px 4px 0 0;
    border-radius: 3px;
    cursor: pointer;
  }

  /* ---------- Sticky composer w/ top fade ---------- */
  .kp-composer-wrap {
    position: sticky;
    bottom: 0;
    padding: 18px 14px 14px;
    background: linear-gradient(180deg,
      rgba(13,23,38,0) 0%,
      rgba(13,23,38,0.85) 30%,
      rgba(10,19,34,1) 70%);
    border-top: 1px dashed rgba(232,177,58,0.18);
    z-index: 2;
  }
  @media (max-width: 640px) {
    .kp-composer-wrap { padding: 14px 10px 12px; }
    .bubble { max-width: 100%; padding: 10px 12px; }
    .kp-stream { font-size: 12.5px; }
    /* assistant body content — keep code blocks from forcing horizontal scroll on the page */
    .kp-rich pre { font-size: 11.5px; padding: 10px 12px; }
    /* status band — single-row 2x2 grid already; ensure values don't crowd */
    .status-band .tile { padding: 9px 10px; }
    .status-band .tile .tv { font-size: 12px; gap: 4px; }
  }
  .kp-composer-wrap::before {
    content: '';
    position: absolute;
    left: 0; right: 0;
    top: -22px; height: 22px;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(13,23,38,0), rgba(13,23,38,0.95));
  }

  #send {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  #send .icon { width: 14px; height: 14px; }

  /* ---------- Footer STATUS BAND ---------- */
  .status-band {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    margin-top: 18px;
    background: var(--line-soft);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    overflow: hidden;
    font-family: var(--font-mono);
  }
  .status-band .tile {
    background: linear-gradient(180deg, #0e1726 0%, #0a1322 100%);
    padding: 10px 12px;
    position: relative;
  }
  .status-band .tile .tk {
    font-size: 9px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--cream-dim);
    margin-bottom: 4px;
  }
  .status-band .tile .tv {
    font-size: 13px;
    letter-spacing: 0.12em;
    color: #e8b13a;
    text-shadow: 0 0 6px rgba(232,177,58,0.55);
    font-weight: 600;
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
  }
  .status-band .tile .tv .sep { color: var(--cream-dim); opacity: 0.4; }
  .status-band .tile .tv .ofc { color: var(--aurora); }
  .status-band .tile .tv .cor { color: var(--flag-yellow); }
  .status-band .tile .tv .inf { color: var(--flag-red); }
  .status-band .tile .tv kbd {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 1px 5px;
    border: 1px solid var(--line);
    background: rgba(255,255,255,0.04);
    border-radius: 2px;
    color: var(--cream);
  }
  @media (max-width: 720px) {
    .status-band { grid-template-columns: repeat(2, 1fr); }
  }

  /* ---------- Make user bubbles align right and stay readable ---------- */
  .bubble-user .kp-tag { background: rgba(200,85,42,0.12); }

  #transcript {
    padding-bottom: 4px;
  }
`
