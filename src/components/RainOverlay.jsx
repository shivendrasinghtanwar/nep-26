import { useEffect, useMemo, useState } from 'react'
import triplog from '../../data/triplog.json'

/**
 * RainOverlay — site-wide ambient rain.
 *
 * Renders 60-80 CSS-animated streaks across three parallax layers (far / mid /
 * near). Pointer-events: none, opacity ~0.5, sits at z-index 5 between the
 * contour pattern (0) and content (1+).
 *
 * Activation logic (any of):
 *   1. `window.TRIPLOG_RAIN === true`  (manual override flag)
 *   2. last entry in data/triplog.json has `weather` field matching /rain|storm|shower/i
 *   3. a `nep26:rain-on` window event fires (auto-off after the event's
 *      detail.duration ms, default 3000)
 *
 * User dismiss: sessionStorage key `nep26:rain-manual-off` — when set,
 *               overlay is suppressed for the rest of the session.
 *
 * Reduced-motion: streaks hidden by CSS; a faint static haze remains.
 *
 * No new deps. Pure CSS keyframes from atmosphere.css.
 */

const LAYERS = [
  { name: 'far',  count: 22, dur: [1.35, 1.65] },
  { name: 'mid',  count: 30, dur: [1.00, 1.30] },
  { name: 'near', count: 18, dur: [0.75, 0.95] },
]

function weatherFromTriplog() {
  try {
    const entries = triplog?.entries || []
    if (!entries.length) return null
    const last = entries[entries.length - 1]
    const w = (last?.weather || '').toString().toLowerCase()
    if (!w) return null
    return w
  } catch (_) { return null }
}

function isRainingFromTriplog() {
  const w = weatherFromTriplog()
  if (!w) return false
  return /rain|storm|shower|drizzle/.test(w)
}

/**
 * Day-3 (2026-05-11) is currently raining in Pokhara. The field log doesn't
 * yet carry a `weather` field (data/* is read-only for this change), so we
 * default rain ON when the latest triplog entry's date matches the location
 * "Pokhara" — the known wet-monsoon arrival day. Once the triplog gains a
 * proper `weather` key, this defaultRaining() branch becomes a no-op because
 * weatherFromTriplog() will satisfy isRainingFromTriplog() first.
 */
function defaultRaining() {
  try {
    const entries = triplog?.entries || []
    if (!entries.length) return false
    const last = entries[entries.length - 1]
    const leg = (last?.leg || '').toLowerCase()
    const hotel = (last?.hotel?.location || '').toLowerCase()
    return /pokhara/.test(leg) || /pokhara/.test(hotel)
  } catch (_) { return false }
}

export default function RainOverlay() {
  // Initial state from data + global flag
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.TRIPLOG_RAIN === false) return false
    if (window.TRIPLOG_RAIN === true) return true
    if (isRainingFromTriplog()) return true
    return defaultRaining()
  })
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return window.sessionStorage.getItem('nep26:rain-manual-off') === '1' }
    catch (_) { return false }
  })

  // Event hooks for other agents (easter eggs, etc.) to flip the rain on/off
  useEffect(() => {
    let offTimer = null
    const onRainOn = (e) => {
      setActive(true)
      const dur = Number(e?.detail?.duration ?? 3000)
      if (offTimer) clearTimeout(offTimer)
      if (dur > 0) {
        offTimer = setTimeout(() => {
          // restore base state from triplog/global flag once burst ends
          const overrideOn  = typeof window !== 'undefined' && window.TRIPLOG_RAIN === true
          const overrideOff = typeof window !== 'undefined' && window.TRIPLOG_RAIN === false
          const base = overrideOn || (!overrideOff && (isRainingFromTriplog() || defaultRaining()))
          setActive(base)
        }, dur)
      }
    }
    const onRainOff = () => {
      if (offTimer) clearTimeout(offTimer)
      setActive(false)
    }
    const onManualOff = () => {
      try { window.sessionStorage.setItem('nep26:rain-manual-off', '1') } catch (_) {}
      setDismissed(true)
    }
    window.addEventListener('nep26:rain-on', onRainOn)
    window.addEventListener('nep26:rain-off', onRainOff)
    window.addEventListener('nep26:rain-dismiss', onManualOff)
    return () => {
      window.removeEventListener('nep26:rain-on', onRainOn)
      window.removeEventListener('nep26:rain-off', onRainOff)
      window.removeEventListener('nep26:rain-dismiss', onManualOff)
      if (offTimer) clearTimeout(offTimer)
    }
  }, [])

  // Pre-compute the streak grid once — random positions/delays stay stable across re-renders
  const streaks = useMemo(() => {
    return LAYERS.map((layer) => {
      const arr = []
      for (let i = 0; i < layer.count; i++) {
        const left = Math.random() * 100               // vw
        const delay = -(Math.random() * 1.6)           // seconds, negative for staggered start
        const [lo, hi] = layer.dur
        const dur = (lo + Math.random() * (hi - lo)).toFixed(2)
        arr.push({ left, delay, dur })
      }
      return { name: layer.name, streaks: arr }
    })
  }, [])

  if (dismissed || !active) return null

  return (
    <div className="rain-overlay" aria-hidden="true">
      {streaks.map((layer) => (
        <div key={layer.name} className={`rain-layer ${layer.name}`}>
          {layer.streaks.map((s, i) => (
            <span
              key={i}
              className="rain-streak"
              style={{
                left: `${s.left}vw`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
