import { useEffect, useState } from 'react'

/**
 * RainEgg — type "r","a","i","n" to summon 10s of monsoon.
 *
 * Dispatches `nep26:rain-on` (with detail.duration = 10000) for the
 * existing rain renderer to listen to. Auto-fires `nep26:rain-off`
 * after 10s as a safety net so the rain layer always clears even if
 * a listener forgets to count down on its own.
 *
 * Also shows a tiny mono toast "RAIN · 10s" bottom-right for ~2s.
 * Ignored when focus is inside an input / textarea / contenteditable.
 *
 * Independent gesture: doesn't collide with Konami, brand-tap, or the
 * "thar" typed-word egg (separate buffers).
 */
const SEQ = ['r', 'a', 'i', 'n']
const DURATION_MS = 10000

export default function RainEgg() {
  const [toast, setToast] = useState(false)

  useEffect(() => {
    let buf = []
    let offTimer = null
    let toastTimer = null

    const isTypingTarget = (t) => {
      if (!t) return false
      const tag = (t.tagName || '').toUpperCase()
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
      if (t.isContentEditable) return true
      return false
    }

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return
      if (!e.key || e.key.length !== 1) return
      const k = e.key.toLowerCase()
      buf.push(k)
      buf = buf.slice(-SEQ.length)
      if (buf.join('') === SEQ.join('')) {
        // fire rain-on
        window.dispatchEvent(new CustomEvent('nep26:rain-on', {
          detail: { duration: DURATION_MS },
        }))
        // safety auto-off
        clearTimeout(offTimer)
        offTimer = setTimeout(() => {
          window.dispatchEvent(new CustomEvent('nep26:rain-off'))
        }, DURATION_MS)
        // toast
        setToast(true)
        clearTimeout(toastTimer)
        toastTimer = setTimeout(() => setToast(false), 2000)
        buf = []
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(offTimer)
      clearTimeout(toastTimer)
    }
  }, [])

  if (!toast) return null
  return (
    <div style={toastStyle} role="status" aria-live="polite" aria-hidden="false">
      RAIN · 10s
    </div>
  )
}

const toastStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 9999,
  padding: '8px 14px',
  background: 'rgba(10,20,36,0.85)',
  border: '1px solid #5b9fcc',
  borderRadius: 6,
  color: '#5b9fcc',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  pointerEvents: 'none',
  backdropFilter: 'blur(4px)',
  animation: 'nep26-rain-toast 220ms ease-out',
}

if (typeof document !== 'undefined' && !document.getElementById('nep26-rain-egg-keyframes')) {
  const s = document.createElement('style')
  s.id = 'nep26-rain-egg-keyframes'
  s.textContent = `
    @keyframes nep26-rain-toast {
      0%   { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(s)
}
