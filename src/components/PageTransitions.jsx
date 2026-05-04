import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CYCLE, isCycleRoute } from './PageGestures.jsx'

/**
 * PageTransitions — wraps <Routes> in a keyed div that animates on
 * route change. Direction is inferred from cycle-index delta so a
 * forward step (e.g. /agent → /map) slides in from the right and a
 * backward step slides in from the left. Non-cycle routes (e.g.
 * /itinerary, /checklist) get a quick fade — they don't slide.
 *
 * First mount does NOT animate (no FOUC slide on landing).
 *
 * Honours prefers-reduced-motion via CSS — see global.css.
 */

function classifyDirection(prev, next) {
  if (!isCycleRoute(prev) || !isCycleRoute(next)) return 'fade'
  const a = CYCLE.indexOf(prev)
  const b = CYCLE.indexOf(next)
  if (a === b) return 'fade'
  // shortest-direction around the cycle
  const fwd = (b - a + CYCLE.length) % CYCLE.length
  const back = (a - b + CYCLE.length) % CYCLE.length
  if (fwd <= back) return 'right'   // moved forward → slide-in-from-right
  return 'left'                      // moved backward → slide-in-from-left
}

export default function PageTransitions({ children }) {
  const location = useLocation()
  const firstRef = useRef(true)
  const prevPathRef = useRef(location.pathname)
  const [direction, setDirection] = useState('none')

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      prevPathRef.current = location.pathname
      return
    }
    setDirection(classifyDirection(prevPathRef.current, location.pathname))
    prevPathRef.current = location.pathname
  }, [location.pathname])

  const cls =
    direction === 'right' ? 'page-anim slide-in-r' :
    direction === 'left'  ? 'page-anim slide-in-l' :
    direction === 'fade'  ? 'page-anim fade-in'    :
                            'page-anim'             // first mount: no animation

  return (
    <div className="page-stage">
      <div key={location.pathname} className={cls}>
        {children}
      </div>
    </div>
  )
}
