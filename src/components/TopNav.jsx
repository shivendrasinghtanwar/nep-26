import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/',          label: 'Overview' },
  { to: '/agent',     label: 'Comms' },
  { to: '/map',       label: 'Atlas' },
  { to: '/gallery',   label: 'Plates' },
  { sep: true },
  { to: '/itinerary', label: 'Itinerary' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/rules',     label: 'Rules' },
  { to: '/route',     label: 'Route' },
  { sep: true },
  { to: '/viewer',    label: 'Docs' },
  { to: '/folders',   label: 'Files' },
]

export default function TopNav() {
  return (
    <header className="topnav" role="banner">
      <span className="brand-tag">
        <span className="dot" />
        <span>NEP-26 · Dossier</span>
      </span>
      <nav aria-label="Site sections">
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
    </header>
  )
}
