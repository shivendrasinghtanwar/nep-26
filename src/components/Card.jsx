/**
 * Card — generic dossier card with optional eyebrow pill.
 * Use <Card pill="Day 1" title="..."><p>body…</p></Card>.
 */
export default function Card({ pill, title, accent = false, className = '', children, ...rest }) {
  return (
    <div className={`card${accent ? ' accent' : ''} ${className}`.trim()} {...rest}>
      {pill && <span className="pill">{pill}</span>}
      {title && <h2>{title}</h2>}
      {children}
    </div>
  )
}
