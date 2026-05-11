import { useEffect, useState } from 'react'

/**
 * RouteAsciiEgg — long-press the top-nav brand-tag for ≥1.4s to
 * surface a mono ASCII map of the NEP-26 route from Bikaner to
 * Muktinath. Long-press is gesture-independent from the existing
 * 5×-click counter (a click is mousedown+mouseup without crossing
 * the 1.4s threshold; we cancel the long-press on mouseup so a
 * normal click still falls through to the click counter).
 *
 * The overlay stays for 4.5s, dust-on-night, mono. Muktinath's
 * triangle marker is tinted rust.
 *
 * Movement tolerance during hold: 10px. Beyond that we cancel.
 */
const HOLD_MS = 1400
const SHOW_MS = 4500
const MOVE_TOL_PX = 10

// Note: the closing box border in the spec drops the right "│" on a
// couple of overflow lines (BORDER, 3800m). We preserve that — it
// makes the trace feel hand-typed and matches the brief verbatim.
const ASCII_LINES = [
  '┌─ NEP-26 · ROUTE TRACE ─────────────────┐',
  '│  BIKANER ◢                              │',
  '│      ╲                                  │',
  '│    AGRA ━━━━━━┓                         │',
  '│              ╲                          │',
  '│             LUCKNOW ━━━━━━┓             │',
  '│                          ╲              │',
  '│                   GORAKHPUR ━━━━━━┓     │',
  '│                                  ╲      │',
  '│                          SUNAULI ◆ BORDER',
  '│                                  ┃      │',
  '│                              POKHARA ◆  │',
  '│                                  ┃      │',
  '│                                BENI     │',
  '│                                  ┃      │',
  '│                              JOMSOM ◆   │',
  '│                                  ┃      │',
  '│                            MUKTINATH ▲ 3800m',
  '└────────────────────────────────────────┘',
]

export default function RouteAsciiEgg() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let brand = null
    let pressTimer = null
    let startX = 0
    let startY = 0
    let pressed = false
    let hideTimer = null
    let mo = null

    const clearPressTimer = () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    const fire = () => {
      setShow(true)
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => setShow(false), SHOW_MS)
    }

    const onDown = (e) => {
      // Only primary button on mouse
      if (e.type === 'mousedown' && e.button !== 0) return
      pressed = true
      const p = e.touches && e.touches[0] ? e.touches[0] : e
      startX = p.clientX
      startY = p.clientY
      clearPressTimer()
      pressTimer = setTimeout(() => {
        if (pressed) fire()
      }, HOLD_MS)
    }

    const onMove = (e) => {
      if (!pressed) return
      const p = e.touches && e.touches[0] ? e.touches[0] : e
      const dx = (p.clientX || 0) - startX
      const dy = (p.clientY || 0) - startY
      if (Math.hypot(dx, dy) > MOVE_TOL_PX) {
        pressed = false
        clearPressTimer()
      }
    }

    const onUp = () => {
      pressed = false
      clearPressTimer()
    }

    const attach = () => {
      if (brand) return
      brand = document.querySelector('.brand-tag')
      if (!brand) return
      brand.addEventListener('mousedown', onDown)
      brand.addEventListener('touchstart', onDown, { passive: true })
      brand.addEventListener('mousemove', onMove)
      brand.addEventListener('touchmove', onMove, { passive: true })
      brand.addEventListener('mouseup', onUp)
      brand.addEventListener('mouseleave', onUp)
      brand.addEventListener('touchend', onUp)
      brand.addEventListener('touchcancel', onUp)
    }

    const detach = () => {
      if (!brand) return
      brand.removeEventListener('mousedown', onDown)
      brand.removeEventListener('touchstart', onDown)
      brand.removeEventListener('mousemove', onMove)
      brand.removeEventListener('touchmove', onMove)
      brand.removeEventListener('mouseup', onUp)
      brand.removeEventListener('mouseleave', onUp)
      brand.removeEventListener('touchend', onUp)
      brand.removeEventListener('touchcancel', onUp)
      brand = null
    }

    // try immediately, then watch the DOM in case the nav mounts later
    attach()
    if (!brand) {
      mo = new MutationObserver(() => {
        if (!brand) attach()
        if (brand && mo) { mo.disconnect(); mo = null }
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      detach()
      clearPressTimer()
      clearTimeout(hideTimer)
      if (mo) mo.disconnect()
    }
  }, [])

  if (!show) return null

  return (
    <div style={overlayStyle} aria-hidden="true">
      <pre style={preStyle}>
        {ASCII_LINES.map((line, i) => {
          // Highlight the Muktinath triangle in rust
          if (line.includes('▲')) {
            const [before, after] = line.split('▲')
            return (
              <span key={i} style={{ display: 'block' }}>
                {before}
                <span style={{ color: '#c8552a' }}>▲</span>
                {after}
              </span>
            )
          }
          return <span key={i} style={{ display: 'block' }}>{line}</span>
        })}
      </pre>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(10,20,36,0.78)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  pointerEvents: 'none',
  padding: 16,
  animation: 'nep26-route-fade 4500ms ease-in-out forwards',
}

const preStyle = {
  margin: 0,
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 12,
  lineHeight: 1.45,
  letterSpacing: '0.02em',
  color: '#d4a574',
  whiteSpace: 'pre',
  textShadow: '0 1px 6px rgba(0,0,0,0.7)',
  background: 'rgba(10,20,36,0.55)',
  border: '1px solid #3a4a68',
  borderRadius: 6,
  padding: '16px 18px',
  maxWidth: '92vw',
  overflowX: 'auto',
}

if (typeof document !== 'undefined' && !document.getElementById('nep26-route-keyframes')) {
  const s = document.createElement('style')
  s.id = 'nep26-route-keyframes'
  s.textContent = `
    @keyframes nep26-route-fade {
      0%   { opacity: 0; }
      6%   { opacity: 1; }
      88%  { opacity: 1; }
      100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes nep26-route-fade { 0%, 100% { opacity: 1; } }
    }
  `
  document.head.appendChild(s)
}
