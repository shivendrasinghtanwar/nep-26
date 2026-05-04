import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * PageGestures — global 2-finger horizontal swipe + keyboard shortcuts.
 *
 * Cycle (the 4 "primary" routes shown in the topnav's first group):
 *   /  →  /agent  →  /map  →  /gallery  →  /  (loop)
 *
 * Touch:
 *   - exactly 2 fingers, horizontal swipe
 *   - threshold: |dx| ≥ 60 px, elapsed ≤ 700 ms
 *   - aborted if pinch detected (Δfinger-distance > 30 px during swipe)
 *   - ignored when started inside .leaflet-container, #transcript,
 *     .lightbox, or any [data-no-swipe] surface
 *   - ignored while a .lightbox.open exists in the DOM
 *
 * Keyboard (when no input/textarea/contenteditable focused):
 *   [ or ←  → previous in cycle
 *   ] or →  → next     in cycle
 *
 * Successful 2-finger swipes also dispatch `nep26:swipe-fired` so the
 * one-time SwipeCue can hide itself.
 */

export const CYCLE = ['/', '/agent', '/map', '/gallery']

export function isCycleRoute(pathname) {
  return CYCLE.includes(pathname)
}

export function neighbour(pathname, dir /* 1 or -1 */) {
  const i = CYCLE.indexOf(pathname)
  if (i === -1) return null
  const n = (i + dir + CYCLE.length) % CYCLE.length
  return CYCLE[n]
}

const SWIPE_THRESHOLD_PX = 60
const SWIPE_MAX_MS = 700
const PINCH_TOLERANCE_PX = 30
const NO_SWIPE_SELECTORS = [
  '.leaflet-container',
  '#transcript',
  '.lightbox',
  '[data-no-swipe]',
]

function lightboxOpen() {
  if (typeof document === 'undefined') return false
  return !!document.querySelector('.lightbox.open')
}

function startedInsideNoSwipe(target) {
  if (!target || !target.closest) return false
  for (const sel of NO_SWIPE_SELECTORS) {
    if (target.closest(sel)) return true
  }
  return false
}

function isTypingTarget(el) {
  if (!el) return false
  const tag = (el.tagName || '').toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if (el.isContentEditable) return true
  return false
}

export default function PageGestures() {
  const location = useLocation()
  const navigate = useNavigate()
  // Refs so listeners can read latest pathname without re-binding.
  const pathRef = useRef(location.pathname)
  pathRef.current = location.pathname

  const goRef = useRef(() => {})
  goRef.current = (dir) => {
    const here = pathRef.current
    const target = neighbour(here, dir)
    if (target) navigate(target)
  }

  // ── Touch (2-finger horizontal swipe) ─────────────────────────────
  useEffect(() => {
    let active = false
    let aborted = false
    let startX = 0      // average of the two fingers
    let startDist = 0   // initial finger-distance (for pinch rejection)
    let startedAt = 0
    let lastX = 0

    const reset = () => {
      active = false
      aborted = false
      startX = 0
      startDist = 0
      startedAt = 0
      lastX = 0
    }

    const onStart = (e) => {
      if (e.touches.length !== 2) {
        // anything other than exactly 2 fingers cancels gesture-tracking
        reset()
        return
      }
      if (lightboxOpen()) { reset(); return }
      // bail if the gesture started inside a no-swipe surface
      if (startedInsideNoSwipe(e.target)) { reset(); return }

      const [a, b] = e.touches
      active = true
      aborted = false
      startedAt = Date.now()
      startX = (a.clientX + b.clientX) / 2
      lastX = startX
      startDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }

    const onMove = (e) => {
      if (!active || aborted) return
      if (e.touches.length !== 2) { aborted = true; return }
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      if (Math.abs(dist - startDist) > PINCH_TOLERANCE_PX) {
        aborted = true   // user is pinch-zooming, not swiping
        return
      }
      lastX = (a.clientX + b.clientX) / 2
    }

    const onEnd = (e) => {
      if (!active) return
      const elapsed = Date.now() - startedAt
      const finished = active && !aborted
      // touchend fires per finger; we only act when active gesture ends
      const remaining = e.touches.length
      if (remaining > 0) return       // another finger still down

      if (finished && elapsed <= SWIPE_MAX_MS) {
        const dx = lastX - startX
        if (dx <= -SWIPE_THRESHOLD_PX) {
          // swipe left → next
          goRef.current(+1)
          window.dispatchEvent(new CustomEvent('nep26:swipe-fired'))
        } else if (dx >= SWIPE_THRESHOLD_PX) {
          // swipe right → prev
          goRef.current(-1)
          window.dispatchEvent(new CustomEvent('nep26:swipe-fired'))
        }
      }
      reset()
    }

    const onCancel = () => reset()

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onCancel, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onCancel)
    }
  }, [])

  // ── Keyboard (desktop affordance) ─────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (isTypingTarget(document.activeElement)) return
      if (lightboxOpen()) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      let dir = 0
      if (e.key === '[' || e.key === 'ArrowLeft') dir = -1
      else if (e.key === ']' || e.key === 'ArrowRight') dir = +1
      if (!dir) return
      // only act if we're actually on a cycle route — otherwise leave
      // arrow keys alone for native scroll behaviour.
      if (!isCycleRoute(pathRef.current)) return
      e.preventDefault()
      goRef.current(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
