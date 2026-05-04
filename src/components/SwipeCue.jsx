import { useEffect, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'

/**
 * SwipeCue — first-visit-only hint toast for the 2-finger swipe.
 *
 * Trigger conditions:
 *   - touch-capable device (`'ontouchstart' in window`)
 *   - sessionStorage flag `nep26:swipe-cue-seen` is NOT set
 *   - 2 s after mount
 *
 * Auto-dismiss: 4 s after appear, OR on first `nep26:swipe-fired` event.
 * Once dismissed it sets the sessionStorage flag and never re-appears
 * during the same session.
 */
const KEY = 'nep26:swipe-cue-seen'
const APPEAR_DELAY_MS = 2000
const AUTO_DISMISS_MS = 4000

export default function SwipeCue() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('ontouchstart' in window)) return
    let seen = false
    try { seen = sessionStorage.getItem(KEY) === '1' } catch { /* private mode etc. */ }
    if (seen) return

    const tShow = setTimeout(() => setVisible(true), APPEAR_DELAY_MS)
    let tHide
    const dismiss = () => {
      setVisible(false)
      try { sessionStorage.setItem(KEY, '1') } catch { /* noop */ }
      clearTimeout(tShow)
      clearTimeout(tHide)
      window.removeEventListener('nep26:swipe-fired', dismiss)
    }

    // schedule auto-dismiss after the cue actually appears
    tHide = setTimeout(dismiss, APPEAR_DELAY_MS + AUTO_DISMISS_MS)
    window.addEventListener('nep26:swipe-fired', dismiss)

    return () => {
      clearTimeout(tShow)
      clearTimeout(tHide)
      window.removeEventListener('nep26:swipe-fired', dismiss)
    }
  }, [])

  if (!visible) return null
  return (
    <div className="swipe-cue" role="status" aria-live="polite">
      <span className="cue-arrow">←</span>
      <MoveHorizontal size={14} aria-hidden="true" />
      <span className="cue-label">Two-finger swipe</span>
      <span className="cue-arrow">→</span>
    </div>
  )
}
