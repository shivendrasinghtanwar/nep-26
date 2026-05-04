import { Link, useLocation } from 'react-router-dom'
import { CYCLE, isCycleRoute } from './PageGestures.jsx'

const LABELS = {
  '/':         'Overview',
  '/agent':    'Comms',
  '/map':      'Atlas',
  '/gallery':  'Plates',
}

/**
 * CycleDots — 4 small pagination dots showing position in the cycle.
 * Renders only when the current route is in CYCLE (so it stays
 * unobtrusive on /itinerary, /rules, etc.).
 *
 * Tap a dot to jump. Active dot is dust-coloured + slightly larger.
 */
export default function CycleDots() {
  const { pathname } = useLocation()
  if (!isCycleRoute(pathname)) return null
  return (
    <div className="cycle-dots" role="tablist" aria-label="Primary section pagination" data-no-swipe>
      {CYCLE.map((p) => {
        const active = p === pathname
        return (
          <Link
            key={p}
            to={p}
            role="tab"
            aria-selected={active ? 'true' : 'false'}
            aria-label={LABELS[p] || p}
            title={LABELS[p] || p}
            className={`cycle-dot${active ? ' is-active' : ''}`}
          >
            <span className="cd-pip" aria-hidden="true" />
          </Link>
        )
      })}
    </div>
  )
}
