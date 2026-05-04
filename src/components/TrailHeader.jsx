import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/**
 * TrailHeader — eyebrow / wordmark / back-link with optional mark icon.
 *
 * Props:
 *   eyebrow:   small uppercase mono line above the headline
 *   title:     Bebas Neue h1 (string or React node — pass React for the
 *              "First <span class='accent'>Second</span>" pattern)
 *   sub:       array of strings or React nodes; pipe-separated visually
 *   icon:      React node — the SVG mark in the corner box
 *   backTo:    URL for the back link (defaults to "/")
 *   backLabel: text inside back link (defaults to "Base")
 */
export default function TrailHeader({ eyebrow, title, sub = [], icon, backTo = '/', backLabel = 'Base' }) {
  return (
    <header className="trail-header">
      {icon && <div className="mark" aria-hidden="true">{icon}</div>}
      <div className="wordmark">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {sub.length > 0 && (
          <div className="sub">
            {sub.map((s, i) => (
              <span key={i}>
                {i > 0 && <span className="sep">{i % 2 === 0 ? '·' : '//'}</span>}
                <span>{s}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      <Link className="back" to={backTo}>
        <ChevronLeft size={13} strokeWidth={1.6} />
        <span>{backLabel}</span>
      </Link>
    </header>
  )
}
