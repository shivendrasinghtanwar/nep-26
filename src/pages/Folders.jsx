import HeroMtn from '../components/HeroMtn.jsx'
import TrailHeader from '../components/TrailHeader.jsx'
import StatStrip from '../components/StatStrip.jsx'
import Card from '../components/Card.jsx'

/**
 * Folders — file-index card grid. Mirrors the legacy folders.html layout in
 * React, grouped into four sections: docs/, plans/, claude-code/, data/.
 *
 * Links use relative paths (../docs/..., ../data/...) so they resolve against
 * the deployed build's parent directory — same convention as the vanilla page.
 */

const SECTIONS = [
  {
    id: 'docs',
    title: '/docs — Human-readable references',
    cards: [
      {
        title: 'Master Checklist',
        file: 'MASTER_CHECKLIST.md',
        desc: 'The full 11-section list in markdown, ready for print or edit.',
        href: '../docs/MASTER_CHECKLIST.md',
      },
      {
        title: 'Nepal Rules 2026',
        file: 'NEPAL_RULES_2026.md',
        desc: 'Detailed rules reference: Bhansar, Yatayat, customs, ACAP, altitude protocol.',
        href: '../docs/NEPAL_RULES_2026.md',
      },
      {
        title: 'Authorization Letter Template',
        file: 'AUTHORIZATION_LETTER_TEMPLATE.md',
        desc: 'Print on Thar Digital Services letterhead, sign in blue, stamp with firm seal. Two copies.',
        href: '../docs/AUTHORIZATION_LETTER_TEMPLATE.md',
      },
      {
        title: 'Itinerary',
        file: 'ITINERARY.md',
        desc: 'Day-by-day table with km, hours, halts, and a workation calendar summary.',
        href: '../docs/ITINERARY.md',
      },
      {
        title: 'Crawl Plan for Claude Code',
        file: 'CLAUDE_CODE_CRAWL_PLAN.md',
        desc: 'Detailed instructions for a higher-network-privilege agent to live-scrape Nepal government sites and refresh /data/.',
        href: '../docs/CLAUDE_CODE_CRAWL_PLAN.md',
      },
      {
        title: 'Rules Change Report',
        file: 'RULES_CHANGE_REPORT.md',
        desc: 'Diff of the 2026-05-04 rules refresh — confirmed, changed, new, inferred line items.',
        href: '../docs/RULES_CHANGE_REPORT.md',
      },
    ],
  },
  {
    id: 'data',
    title: '/data — Structured data (JSON)',
    cards: [
      {
        title: 'rules.json',
        file: 'rules.json',
        desc: 'Rules & emergency contacts. Replace this file after running the Claude Code crawl plan.',
        href: '../data/rules.json',
      },
      {
        title: 'route.json',
        file: 'route.json',
        desc: 'Waypoints, segments, fuel/permit nodes — feeds the Atlas page and route renderers.',
        href: '../data/route.json',
      },
      {
        title: 'hotels.json',
        file: 'hotels.json',
        desc: 'Shortlist of stays with phones, prices, and confirmation status.',
        href: '../data/hotels.json',
      },
      {
        title: 'itinerary.json',
        file: 'itinerary.json',
        desc: 'Day-by-day data including type tags (work/drive/border/offroad/darshan/leisure).',
        href: '../data/itinerary.json',
      },
      {
        title: 'checklist.json',
        file: 'checklist.json',
        desc: 'Machine-readable version of the master checklist, used by the website.',
        href: '../data/checklist.json',
      },
    ],
  },
  {
    id: 'plans',
    title: '/plans — Your personal trip-plan space',
    cards: [
      {
        title: 'Plans index',
        file: 'plans/README.md',
        desc: 'Contingencies, work deliverables, budget, packing strategy, communication plan, wife preferences, post-trip todos.',
        href: '../plans/README.md',
      },
      {
        title: 'Browse all plans',
        file: 'viewer',
        desc: 'Open the in-site viewer and pick from the left-hand TOC under "Your trip-plan space".',
        to: '/viewer',
      },
    ],
  },
  {
    id: 'claude-code',
    title: '/claude-code — Tandem-agent briefing',
    cards: [
      {
        title: 'HANDOFF.md',
        file: 'claude-code/HANDOFF.md',
        desc: 'Live status board between this session and Claude Code in your terminal.',
        href: '../claude-code/HANDOFF.md',
      },
      {
        title: 'Playbooks',
        file: 'claude-code/playbooks/',
        desc: 'Step-by-step playbooks for crawl + refresh tasks (rules, route intel, hotels).',
        href: '../claude-code/playbooks/',
      },
      {
        title: 'Context',
        file: 'claude-code/context/',
        desc: 'Frozen context bundles the tandem agent reads before each milestone.',
        href: '../claude-code/context/',
      },
    ],
  },
]

function FolderCard({ title, file, desc, href, to }) {
  const linkLabel = to ? 'Open viewer' : `Open ${file}`
  return (
    <Card title={title} pill={file} data-aos="fade-up">
      <p>{desc}</p>
      {to
        ? (
          // Internal route — viewer lives in the React app
          <a href={to}>{linkLabel}</a>
        )
        : (
          <a href={href}>{linkLabel}</a>
        )}
    </Card>
  )
}

export default function Folders() {
  return (
    <main className="shell">
      <HeroMtn />

      <TrailHeader
        eyebrow="Section 06 · Files & folders"
        title={<>Files&nbsp;<span className="accent">index</span></>}
        sub={[
          <><b>{SECTIONS.reduce((n, s) => n + s.cards.length, 0)}</b> documents</>,
          <><b>{SECTIONS.length}</b> folders</>,
          'Markdown + JSON',
        ]}
        icon={
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8,16 L26,16 L32,22 L56,22 L56,52 L8,52 Z" />
            <path d="M8,28 L56,28" strokeOpacity="0.5" />
          </svg>
        }
      />

      <StatStrip
        stats={[
          { tminus: true },
          { k: 'Folders', v: SECTIONS.length },
          { k: 'Docs', v: SECTIONS.find(s => s.id === 'docs').cards.length },
          { k: 'Data', v: SECTIONS.find(s => s.id === 'data').cards.length },
          {
            k: 'Source',
            render: () => (
              <a href="../README.md" style={{ color: 'inherit', borderBottom: '1px dashed var(--dust)' }}>repo</a>
            ),
          },
        ]}
      />

      <p className="muted" style={{ margin: '6px 0 0' }}>
        Each card opens its source file directly. Markdown opens in your browser's default markdown viewer; JSON opens raw.
      </p>

      {SECTIONS.map(section => (
        <section key={section.id} data-aos="fade-up">
          <h2 className="section-title">{section.title}</h2>
          <div className="grid cols-2">
            {section.cards.map(c => <FolderCard key={c.file} {...c} />)}
          </div>
        </section>
      ))}

      <p className="footnote">
        Source folders live in the repo root: <code>docs/</code>, <code>data/</code>, <code>plans/</code>, <code>claude-code/</code>.
        Generated 2026-05-04 · ported to React on the <code>react-migration</code> branch.
      </p>
    </main>
  )
}
