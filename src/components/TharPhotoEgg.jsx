/* TharPhotoEgg — type "thar" anywhere on the site to summon the actual
   Mahindra Thar Roxx photo as a polaroid that flashes onto the screen
   for 3 seconds. Public-domain image from Wikimedia Commons stored at
   /pics/thar-roxx.jpg.

   Distinct trigger from the existing easter eggs (Konami, 5×brand-tap)
   so all three can coexist. Respects prefers-reduced-motion. */

import { useEffect, useState } from 'react'

const TARGET = ['t', 'h', 'a', 'r']
const PHOTO = `${import.meta.env.BASE_URL}pics/thar-roxx.jpg`

export default function TharPhotoEgg() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let buf = []
    const onKey = (e) => {
      // ignore typing inside inputs / contenteditable
      const tgt = e.target
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) return
      if (e.key.length !== 1) return
      buf.push(e.key.toLowerCase())
      buf = buf.slice(-TARGET.length)
      if (buf.join('') === TARGET.join('')) {
        trigger()
        buf = []
      }
    }
    const onHonk = () => trigger()
    window.addEventListener('keydown', onKey)
    window.addEventListener('nep26:thar-photo', onHonk)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('nep26:thar-photo', onHonk)
    }
  }, [])

  function trigger() {
    setShow({ id: Date.now() })
    setTimeout(() => setShow(false), 3400)
  }

  if (!show) return null

  return (
    <div style={overlay} role="status" aria-live="polite" aria-label="Easter egg: Thar Roxx polaroid">
      <figure style={polaroid}>
        <div style={imgFrame}>
          <img
            src={PHOTO}
            alt="Mahindra Thar Roxx"
            loading="eager"
            decoding="async"
            style={img}
          />
          <span style={stamp}>NEP-26 · APPROVED</span>
        </div>
        <figcaption style={cap}>
          <span style={capTop}>FIELD VEHICLE · ROLL CALL</span>
          <span style={capBig}>THAR ROXX</span>
          <span style={capBot}>4×4 · 168 mm articulation · 230 N·m</span>
        </figcaption>
      </figure>
    </div>
  )
}

const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  animation: 'nep26-thar-bg 3.4s ease-out forwards',
}

const polaroid = {
  margin: 0,
  padding: 14,
  paddingBottom: 20,
  background: '#ece5d3',
  border: '1px solid #b08a3e',
  boxShadow: '0 22px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,165,116,0.4)',
  borderRadius: 4,
  transform: 'rotate(-2.5deg)',
  animation: 'nep26-thar-pop 3.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
  maxWidth: 'min(92vw, 480px)',
}

const imgFrame = {
  position: 'relative',
  background: '#0a1424',
  border: '1px solid #c8552a',
  overflow: 'hidden',
}

const img = {
  display: 'block',
  width: '100%',
  height: 'auto',
  filter: 'saturate(0.92) contrast(1.05)',
}

const stamp = {
  position: 'absolute',
  top: 10,
  right: 10,
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9,
  letterSpacing: '0.22em',
  color: '#c8552a',
  background: 'rgba(236, 229, 211, 0.92)',
  border: '1px solid #c8552a',
  padding: '3px 8px',
  borderRadius: 2,
  transform: 'rotate(8deg)',
  textTransform: 'uppercase',
  fontWeight: 700,
}

const cap = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  marginTop: 12,
  fontFamily: 'JetBrains Mono, monospace',
  color: '#0a1424',
}

const capTop = {
  fontSize: 9,
  letterSpacing: '0.28em',
  color: '#8a6420',
  textTransform: 'uppercase',
}

const capBig = {
  fontFamily: 'Bebas Neue, sans-serif',
  fontSize: 22,
  letterSpacing: '0.08em',
  color: '#0a1424',
}

const capBot = {
  fontSize: 9.5,
  letterSpacing: '0.14em',
  color: '#5a4a30',
  textTransform: 'uppercase',
}

if (typeof document !== 'undefined' && !document.getElementById('nep26-thar-egg-keyframes')) {
  const s = document.createElement('style')
  s.id = 'nep26-thar-egg-keyframes'
  s.textContent = `
    @keyframes nep26-thar-pop {
      0%   { opacity: 0; transform: rotate(-2.5deg) scale(0.6) translateY(40px); }
      8%   { opacity: 1; transform: rotate(-2.5deg) scale(1.08) translateY(-6px); }
      14%  { opacity: 1; transform: rotate(-2.5deg) scale(1.0)  translateY(0); }
      80%  { opacity: 1; transform: rotate(-2.5deg) scale(1.0)  translateY(0); }
      100% { opacity: 0; transform: rotate(-2.5deg) scale(0.96) translateY(-12px); }
    }
    @keyframes nep26-thar-bg {
      0%, 5%   { background: rgba(10, 20, 36, 0); backdrop-filter: blur(0px); }
      10%, 80% { background: rgba(10, 20, 36, 0.45); backdrop-filter: blur(3px); }
      100%     { background: rgba(10, 20, 36, 0); backdrop-filter: blur(0px); }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes nep26-thar-pop { 0%, 100% { opacity: 1; transform: rotate(0) scale(1); } }
      @keyframes nep26-thar-bg  { 0%, 100% { background: rgba(10, 20, 36, 0.4); } }
    }
  `
  document.head.appendChild(s)
}
