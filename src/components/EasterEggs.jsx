import { useEffect, useState } from 'react'
import JeepIcon from './JeepIcon.jsx'

/**
 * EasterEggs — site-wide hidden delights for the Thar Roxx driver.
 *
 *   1. Konami code (↑↑↓↓←→←→BA): a tiny jeep drives across the bottom
 *      of the screen, kicks up dust, then idles.
 *   2. Brand-tag click counter: tap "NEP-26 · Dossier" 5× in a row to
 *      summon a brief jeep parade.
 *   3. Window event hook (`nep26:honk`) other components can fire to
 *      trigger the parade programmatically.
 *
 * Add inside <Layout> once; renders nothing until triggered.
 */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function EasterEggs() {
  const [driving, setDriving] = useState(false)
  const [hint, setHint] = useState(null)

  // ── Konami code listener ───────────────────────────────────────────
  useEffect(() => {
    let buf = []
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      buf.push(k)
      buf = buf.slice(-KONAMI.length)
      if (buf.join(',') === KONAMI.join(',')) {
        triggerDrive('Konami code · Thar deployed')
        buf = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── 5×-click counter on brand-tag ──────────────────────────────────
  useEffect(() => {
    let count = 0
    let timer = null
    const onBrand = () => {
      count += 1
      clearTimeout(timer)
      if (count === 3) setHint('2 more taps…')
      if (count === 4) setHint('1 more…')
      if (count >= 5) {
        triggerDrive('Brand tap · Mom signed the auth letter')
        count = 0
      }
      timer = setTimeout(() => { count = 0; setHint(null) }, 1800)
    }
    const onHonk = (e) => triggerDrive(e?.detail?.label || 'Honk')
    window.addEventListener('nep26:brand-click', onBrand)
    window.addEventListener('nep26:honk', onHonk)
    return () => {
      window.removeEventListener('nep26:brand-click', onBrand)
      window.removeEventListener('nep26:honk', onHonk)
      clearTimeout(timer)
    }
  }, [])

  function triggerDrive(label) {
    setDriving({ id: Date.now(), label })
    setHint(null)
    setTimeout(() => setDriving(false), 5200)
  }

  return (
    <>
      {hint && (
        <div style={hintStyle} role="status" aria-live="polite">{hint}</div>
      )}
      {driving && (
        <div style={trackStyle} aria-hidden="true">
          <div style={dustStyle} />
          <div style={jeepStyle}>
            <JeepIcon size={64} color="#c8552a" strokeWidth={1.6} />
          </div>
          <div style={badgeStyle}>{driving.label}</div>
        </div>
      )}
    </>
  )
}

const hintStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 9999,
  padding: '8px 14px',
  background: 'rgba(10,20,36,0.85)',
  border: '1px solid #3a4a68',
  borderRadius: 6,
  color: '#d4a574',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  pointerEvents: 'none',
  animation: 'nep26-hint-pop 220ms ease-out',
  backdropFilter: 'blur(4px)',
}

const trackStyle = {
  position: 'fixed',
  left: 0, right: 0,
  bottom: 0,
  height: 80,
  zIndex: 9999,
  pointerEvents: 'none',
  overflow: 'hidden',
}

const dustStyle = {
  position: 'absolute',
  bottom: 14,
  left: 0,
  height: 1,
  width: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent)',
  animation: 'nep26-dust 5s linear forwards',
  filter: 'blur(0.5px)',
}

const jeepStyle = {
  position: 'absolute',
  bottom: 18,
  left: '-80px',
  animation: 'nep26-drive 5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
}

const badgeStyle = {
  position: 'absolute',
  bottom: 50,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '6px 14px',
  background: 'rgba(10,20,36,0.85)',
  border: '1px solid #c8552a',
  borderRadius: 4,
  color: '#ece5d3',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  animation: 'nep26-badge 5s ease-out forwards',
}

// inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('nep26-egg-keyframes')) {
  const s = document.createElement('style')
  s.id = 'nep26-egg-keyframes'
  s.textContent = `
    @keyframes nep26-drive {
      0%   { left: -80px; }
      8%   { left: 5%; }
      14%  { left: 5%; transform: translateY(0); }
      16%  { left: 5%; transform: translateY(-3px); }
      18%  { left: 5%; transform: translateY(0); }
      30%  { left: 25%; }
      55%  { left: 55%; }
      85%  { left: 92%; }
      100% { left: 110%; }
    }
    @keyframes nep26-dust {
      0%   { opacity: 0; transform: translateX(-100%); }
      8%   { opacity: 0.85; }
      90%  { opacity: 0.85; }
      100% { opacity: 0; transform: translateX(0%); }
    }
    @keyframes nep26-badge {
      0%   { opacity: 0; transform: translate(-50%, 12px); }
      10%  { opacity: 1; transform: translate(-50%, 0); }
      85%  { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, -8px); }
    }
    @keyframes nep26-hint-pop {
      0%   { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes nep26-drive  { 0%, 100% { left: 50%; } }
      @keyframes nep26-dust   { 0%, 100% { opacity: 0; } }
      @keyframes nep26-badge  { 0%, 100% { opacity: 1; transform: translate(-50%, 0); } }
    }
  `
  document.head.appendChild(s)
}
