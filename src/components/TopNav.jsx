import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import FieldStatus from './FieldStatus.jsx'

const LINKS = [
  { to: '/',          label: 'Overview' },
  { to: '/agent',     label: 'Comms' },
  { to: '/map',       label: 'Atlas' },
  { to: '/gallery',   label: 'Plates' },
  { to: '/log',       label: 'Log' },
  { sep: true },
  { to: '/itinerary', label: 'Itinerary' },
  { to: '/stays',     label: 'Stays' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/rules',     label: 'Rules' },
  { to: '/route',     label: 'Route' },
  { sep: true },
  { to: '/viewer',    label: 'Docs' },
  { to: '/folders',   label: 'Files' },
]

export default function TopNav() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  // Close drawer when route changes (so navigation feels right on mobile)
  useEffect(() => { setOpen(false) }, [loc.pathname])

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <header className={`topnav${open ? ' is-open' : ''}`} role="banner">
      <Link
        to="/"
        className="brand-tag"
        aria-label="Back to dossier home"
        onClick={() => window.dispatchEvent(new CustomEvent('nep26:brand-click'))}
      >
        <span className="dot" />
        <span>NEP-26 · Dossier</span>
      </Link>

      <FieldStatus />

      <button
        type="button"
        className="topnav-burger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="topnav-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
      </button>

      <nav id="topnav-nav" aria-label="Site sections" className={open ? 'is-open' : undefined}>
        {LINKS.map((l, i) => (
          l.sep
            ? <span key={`s${i}`} className="group-sep" aria-hidden />
            : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? 'is-current' : undefined}
              >
                {l.label}
              </NavLink>
            )
        ))}
      </nav>

      {open && (
        <button
          type="button"
          className="topnav-scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          tabIndex={-1}
        />
      )}
    </header>
  )
}
