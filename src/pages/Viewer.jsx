import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { marked } from 'marked'
import { BookOpen, ChevronDown } from 'lucide-react'
import HeroMtn from '../components/HeroMtn.jsx'
import StatStrip from '../components/StatStrip.jsx'
import TrailHeader from '../components/TrailHeader.jsx'

// Vite picks up every .md under docs/, plans/, and claude-code/ at
// build time as raw strings. Map keys are absolute import paths
// (e.g. "../../docs/MASTER_CHECKLIST.md").
const docs     = import.meta.glob('../../docs/**/*.md',        { as: 'raw', eager: true })
const plans    = import.meta.glob('../../plans/**/*.md',       { as: 'raw', eager: true })
const ccDocs   = import.meta.glob('../../claude-code/**/*.md', { as: 'raw', eager: true })
const rootDocs = import.meta.glob('../../README.md',           { as: 'raw', eager: true })

function buildToc() {
  const sections = [
    { label: 'README',       items: [] },
    { label: 'Docs',         items: [] },
    { label: 'Plans',        items: [] },
    { label: 'Claude Code',  items: [] },
  ]
  const all = { ...rootDocs, ...docs, ...plans, ...ccDocs }
  for (const [absPath, raw] of Object.entries(all)) {
    const rel = absPath.replace(/^(?:\.\.\/)+/, '')
    const seg = rel.split('/')
    const file = seg[seg.length - 1]
    const title = file.replace(/\.md$/, '')
    const entry = { file, title, rel, raw }
    if (rel === 'README.md') sections[0].items.push(entry)
    else if (rel.startsWith('docs/'))         sections[1].items.push(entry)
    else if (rel.startsWith('plans/'))        sections[2].items.push(entry)
    else if (rel.startsWith('claude-code/'))  sections[3].items.push(entry)
  }
  for (const s of sections) s.items.sort((a, b) => a.title.localeCompare(b.title))
  return sections.filter(s => s.items.length > 0)
}

const VIEWER_CSS = `
  .vw-shell { display: grid; grid-template-columns: 280px 1fr; gap: 18px; margin-top: 16px; }
  .vw-sidebar { position: sticky; top: 80px; align-self: start; max-height: calc(100vh - 100px); overflow-y: auto;
    border: 1px solid var(--line); border-radius: var(--r); background: linear-gradient(180deg, var(--shadow), var(--ridge));
    padding: 14px 12px; box-shadow: var(--shadow-card); scrollbar-width: thin; }
  .vw-sidebar h3 { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--cream-dim); margin: 12px 6px 6px; padding-bottom: 4px; border-bottom: 1px dashed rgba(212,165,116,0.18); }
  .vw-sidebar h3:first-child { margin-top: 2px; }
  .vw-sidebar a { display: block; padding: 6px 8px; font-size: 13px; color: var(--cream-dim);
    border-radius: 4px; transition: all 140ms ease; line-height: 1.35; word-break: break-word; cursor: pointer; }
  .vw-sidebar a:hover { background: rgba(212,165,116,0.06); color: var(--cream); }
  .vw-sidebar a.is-current { color: var(--dust); background: rgba(212,165,116,0.08);
    border-left: 2px solid var(--dust); padding-left: 6px; }
  .vw-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 8px 12px; flex-wrap: wrap;
    padding: 10px 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--line);
    border-radius: var(--r-sm); margin-bottom: 14px; font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.06em; color: var(--cream-dim); word-break: break-word; }
  .vw-meta .pri { color: var(--dust); }
  .vw-meta a { color: var(--glacier); }
  .md-rendered { background: linear-gradient(180deg, var(--shadow), var(--ridge));
    border: 1px solid var(--line); border-radius: var(--r); padding: 30px 38px; box-shadow: var(--shadow-card);
    font-size: 15px; line-height: 1.7; color: var(--cream); }
  .md-rendered h1, .md-rendered h2, .md-rendered h3, .md-rendered h4 {
    font-family: var(--font-display); font-weight: 400; letter-spacing: 0.04em; color: var(--cream);
    margin: 1.6em 0 0.5em; line-height: 1.2; }
  .md-rendered h1 { font-size: 32px; padding-bottom: 8px; border-bottom: 1px dashed rgba(212,165,116,0.25); margin-top: 0; }
  .md-rendered h2 { font-size: 24px; }
  .md-rendered h3 { font-size: 19px; color: var(--dust); }
  .md-rendered p { margin: 0.8em 0; color: rgba(236,229,211,0.92); }
  .md-rendered a { color: var(--glacier); }
  .md-rendered a:hover { color: var(--cream); }
  .md-rendered code { background: rgba(255,255,255,0.06); color: var(--dust); padding: 1px 6px;
    border-radius: 3px; font-family: var(--font-mono); font-size: 90%; }
  .md-rendered pre { background: var(--night); border: 1px solid var(--line); border-radius: var(--r-sm);
    padding: 14px 16px; overflow-x: auto; line-height: 1.5; }
  .md-rendered pre code { background: transparent; color: var(--cream); padding: 0; font-size: 12.5px; }
  .md-rendered blockquote { border-left: 3px solid var(--flag-yellow); background: rgba(232,177,58,0.05);
    padding: 10px 16px; margin: 1em 0; border-radius: 0 var(--r-sm) var(--r-sm) 0; color: rgba(236,229,211,0.85); }
  .md-rendered blockquote p { margin: 0.4em 0; }
  .md-rendered ul, .md-rendered ol { padding-left: 26px; }
  .md-rendered li { margin: 0.3em 0; }
  .md-rendered table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 13.5px; }
  .md-rendered th, .md-rendered td { padding: 8px 12px; text-align: left; border: 1px solid var(--line); }
  .md-rendered th { background: rgba(212,165,116,0.08); color: var(--dust);
    font-family: var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; font-size: 11.5px; }
  .md-rendered img { max-width: 100%; height: auto; border-radius: var(--r-sm); }
  .md-rendered hr { border: 0; height: 1px; background: var(--line); margin: 2em 0; }
  .md-rendered strong { color: var(--cream); }
  @media (max-width: 980px) {
    .vw-shell { grid-template-columns: 1fr; gap: 12px; }
    .vw-sidebar {
      position: static;
      max-height: 220px;
      padding: 12px 12px 10px;
      /* Make the TOC a true scroll container so the article below stays reachable. */
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .vw-sidebar.is-collapsed { max-height: 52px; overflow: hidden; }
    .vw-sidebar .vw-toggle {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%;
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--cream-dim);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 10px 12px;
      cursor: pointer;
      margin: -2px 0 8px;
    }
    .vw-sidebar .vw-toggle:hover { color: var(--cream); border-color: var(--dust); }
    .vw-sidebar .vw-toggle .chev { color: var(--dust); transition: transform 180ms ease; }
    .vw-sidebar.is-collapsed .vw-toggle .chev { transform: rotate(-90deg); }
    .md-rendered { padding: 22px 20px; }
  }
  /* the toggle is hidden on desktop where the sidebar is a sticky column */
  @media (min-width: 981px) {
    .vw-sidebar .vw-toggle { display: none; }
  }
`

const ICON = (
  <BookOpen size={32} strokeWidth={1.5} />
)

export default function Viewer() {
  const sections = useMemo(buildToc, [])
  const flat = useMemo(() => sections.flatMap(s => s.items), [sections])
  const [params, setParams] = useSearchParams()
  const wantedFile = params.get('f')
  const initial = flat.find(e => e.rel === wantedFile)
    || flat.find(e => e.rel === 'docs/MASTER_CHECKLIST.md')
    || flat[0]
  const [current, setCurrent] = useState(initial)
  // Sidebar collapse state — defaults to collapsed on mobile so the article
  // below the TOC is reachable without scrolling past 200px of links.
  const [tocOpen, setTocOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 981px)').matches
  })

  useEffect(() => {
    if (current && wantedFile !== current.rel) {
      setParams({ f: current.rel }, { replace: true })
    }
  }, [current])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (wantedFile) {
      const next = flat.find(e => e.rel === wantedFile)
      if (next && next.rel !== current?.rel) setCurrent(next)
    }
  }, [wantedFile, flat])  // eslint-disable-line react-hooks/exhaustive-deps

  const html = useMemo(() => {
    if (!current?.raw) return ''
    try { return marked.parse(current.raw, { gfm: true, breaks: false }) }
    catch (e) { return `<pre>${String(e)}</pre>` }
  }, [current])

  return (
    <main className="shell">
      <style>{VIEWER_CSS}</style>
      <HeroMtn />

      <TrailHeader
        eyebrow="Section 07 · Markdown viewer"
        title={<>Docs <span className="accent">viewer</span></>}
        sub={[
          <span key="n"><b>{flat.length}</b> docs</span>,
          <span key="g">grouped by folder</span>,
          <span key="o">offline</span>,
        ]}
        icon={ICON}
      />

      <StatStrip stats={[
        { tminus: true },
        { k: 'Documents', v: flat.length },
        { k: 'Renderer',  v: 'marked' },
        { k: 'Source',    v: 'docs / plans / cc' },
      ]} />

      <div className="vw-meta" data-aos="fade-up">
        <div>Showing <span className="pri">{current?.rel || '—'}</span></div>
        <div>Browse below or pass <code>?f=docs/RULES_CHANGE_REPORT.md</code>.</div>
      </div>

      <div className="vw-shell" data-aos="fade-up" data-aos-delay="80">
        <aside className={`vw-sidebar${tocOpen ? '' : ' is-collapsed'}`} aria-label="Table of contents">
          <button
            type="button"
            className="vw-toggle"
            aria-expanded={tocOpen ? 'true' : 'false'}
            onClick={() => setTocOpen(o => !o)}
          >
            <span>Index · {flat.length} docs</span>
            <ChevronDown size={14} strokeWidth={1.6} className="chev" />
          </button>
          {sections.map(s => (
            <div key={s.label}>
              <h3>{s.label}</h3>
              {s.items.map(e => (
                <a
                  key={e.rel}
                  href="#"
                  className={current?.rel === e.rel ? 'is-current' : undefined}
                  onClick={(ev) => { ev.preventDefault(); setCurrent(e); setTocOpen(false) }}
                >
                  {e.title}
                </a>
              ))}
            </div>
          ))}
        </aside>
        <article className="md-rendered" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <p className="footnote">
        Plain-text source: <code>{current?.rel}</code>. Re-verify rules on <strong style={{color:'var(--cream)'}}>2026-05-08</strong>.
      </p>
    </main>
  )
}
