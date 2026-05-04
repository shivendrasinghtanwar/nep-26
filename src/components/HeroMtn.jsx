// Layered Annapurna-range mountain silhouette band. Same SVG paths as the
// vanilla pages. Each instance gets a unique gradient id to avoid
// collisions when multiple HeroMtn render on a single route.
let __HERO_MTN_ID = 0

export default function HeroMtn() {
  const gid = `sky-fade-${++__HERO_MTN_ID}`
  return (
    <svg className="hero-mtn" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0a1424" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a1424" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M0,220 L0,140 L100,90 L200,110 L300,60 L400,90 L500,40 L600,70 L700,30 L800,80 L900,50 L1000,90 L1100,60 L1200,80 L1200,220 Z" fill="#162338" opacity="0.85" />
      <path d="M0,220 L0,160 L80,130 L180,150 L260,110 L360,135 L460,100 L540,130 L640,95 L740,135 L840,110 L920,140 L1020,115 L1120,150 L1200,130 L1200,220 Z" fill="#1b2a44" opacity="0.95" />
      <path d="M0,220 L0,180 L60,160 L160,180 L240,150 L340,180 L440,160 L540,185 L640,165 L740,190 L840,170 L940,195 L1040,180 L1140,200 L1200,185 L1200,220 Z" fill="#243044" />
      <path d="M500,40 L494,52 L506,52 Z M700,30 L692,44 L708,44 Z" fill="#ece5d3" opacity="0.55" />
      <rect x="0" y="0" width="1200" height="220" fill={`url(#${gid})`} />
    </svg>
  )
}
