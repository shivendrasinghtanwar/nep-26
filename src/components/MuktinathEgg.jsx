import { useEffect, useState } from 'react'

/**
 * MuktinathEgg — type "muktinath" → 108-spout prayer wheel overlay.
 *
 * Renders 108 small dust-coloured dots on a circle (the 108 sacred
 * spouts at Muktinath Mandir, 3,800m). The whole ring rotates slowly
 * for ~4.5s with a per-dot stagger on the entrance, then fades out.
 *
 * Backdrop blurs the page behind. Mono caption beneath the ring.
 * Respects prefers-reduced-motion → no rotation, no per-dot stagger
 * (static rendering, still fades out cleanly).
 *
 * Ignored inside text inputs / contenteditable.
 */
const SEQ = ['m', 'u', 'k', 't', 'i', 'n', 'a', 't', 'h']
const DOTS = 108
const DURATION_MS = 4500
const RADIUS = 150 // px

export default function MuktinathEgg() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let buf = []
    let hideTimer = null

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
        setShow(true)
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => setShow(false), DURATION_MS)
        buf = []
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!show) return null

  // prefers-reduced-motion → flat render
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const dots = []
  for (let i = 0; i < DOTS; i++) {
    const theta = (i / DOTS) * Math.PI * 2
    const x = Math.cos(theta) * RADIUS
    const y = Math.sin(theta) * RADIUS
    dots.push(
      <span
        key={i}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: '50%',
          background: '#d4a574',
          boxShadow: '0 0 6px rgba(212,165,116,0.55)',
          transform: `translate(${x}px, ${y}px)`,
          opacity: reduced ? 0.85 : 0,
          animation: reduced
            ? 'none'
            : `nep26-mukti-pop 600ms ease-out ${i * 6}ms forwards`,
        }}
      />
    )
  }

  return (
    <div style={overlayStyle} aria-hidden="true">
      <div style={{
        position: 'relative',
        width: RADIUS * 2 + 20,
        height: RADIUS * 2 + 20,
        animation: reduced ? 'none' : 'nep26-mukti-spin 12s linear infinite',
      }}>
        {dots}
      </div>
      <div style={captionStyle}>108 SPOUTS · MUKTINATH 3,800m</div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 28,
  background: 'rgba(10,20,36,0.55)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  pointerEvents: 'none',
  animation: 'nep26-mukti-fade 4500ms ease-in-out forwards',
}

const captionStyle = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 12,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: '#ece5d3',
  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
}

if (typeof document !== 'undefined' && !document.getElementById('nep26-mukti-keyframes')) {
  const s = document.createElement('style')
  s.id = 'nep26-mukti-keyframes'
  s.textContent = `
    @keyframes nep26-mukti-pop {
      0%   { opacity: 0; }
      40%  { opacity: 1; }
      100% { opacity: 0.85; }
    }
    @keyframes nep26-mukti-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes nep26-mukti-fade {
      0%   { opacity: 0; }
      8%   { opacity: 1; }
      85%  { opacity: 1; }
      100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes nep26-mukti-spin { 0%, 100% { transform: rotate(0deg); } }
      @keyframes nep26-mukti-pop  { 0%, 100% { opacity: 0.85; } }
    }
  `
  document.head.appendChild(s)
}
