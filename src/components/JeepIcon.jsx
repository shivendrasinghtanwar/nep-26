/* The Thar Roxx silhouette — same SVG used in the agent-page mark.
   Treat it as a Lucide-style stroke icon: pass size, color, strokeWidth. */

export default function JeepIcon({
  size = 22,
  color = 'currentColor',
  strokeWidth = 1.5,
  title,
  ...rest
}) {
  const h = Math.round(size * (36 / 64))
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 64 36"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      {...rest}
    >
      {title && <title>{title}</title>}
      {/* chassis */}
      <path d="M3,26 L3,18 L9,18 L13,10 L25,10 L27,15 L46,15 L49,10 L57,10 L60,18 L61,18 L61,26 Z" />
      {/* wheel wells (subtle fill) */}
      <circle cx="14" cy="26" r="4" fill={color} fillOpacity="0.15" />
      <circle cx="50" cy="26" r="4" fill={color} fillOpacity="0.15" />
      {/* hubs */}
      <circle cx="14" cy="26" r="2" fill={color} />
      <circle cx="50" cy="26" r="2" fill={color} />
      {/* a-pillar / b-pillar */}
      <path d="M27,15 L27,10" strokeOpacity="0.5" />
      <path d="M46,15 L46,10" strokeOpacity="0.5" />
    </svg>
  )
}
