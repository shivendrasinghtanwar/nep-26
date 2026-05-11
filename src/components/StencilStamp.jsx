import React from 'react'

/*
 * StencilStamp — military-stencil / dispatch-console rubber-stamp glyph.
 *
 * Sits next to dossier line items as a hand-applied confidence/leg mark.
 * Renders an SVG donut with stencil-cut Bebas Neue type + MGRS-style coord
 * decoration. Tilt is deterministic per `kind` so the same rule always
 * gets the same stamp pose between renders.
 *
 * Props:
 *   kind: 'official' | 'corroborated' | 'inferred' | 'verified'
 *       | 'classified' | 'legNN'  (e.g. 'leg01', 'leg14')
 *   size: 'sm' | 'md' | 'lg'  — default 'md'
 *   coord:  optional override for the MGRS cell text. Defaults derived
 *           per kind, all anchored on the Nepal '26 dispatch grid.
 *   title:  optional aria/tooltip label.
 */

const KIND_META = {
  official:     { cls: 'is-official',     label: 'OFFICIAL',     code: 'M-NEP-26-A' },
  verified:     { cls: 'is-official',     label: 'VERIFIED',     code: 'M-NEP-26-V' },
  corroborated: { cls: 'is-corroborated', label: 'CORROBOR.',    code: 'M-NEP-26-B' },
  inferred:     { cls: 'is-inferred',     label: 'INFERRED',     code: 'M-NEP-26-C' },
  classified:   { cls: 'is-inferred',     label: 'CLASSIFIED',   code: 'M-NEP-26-X' },
}

const SIZE_PX = { sm: 58, md: 76, lg: 96 }

// Cheap deterministic hash so tilt + dash offsets don't shift between renders.
function seedFromKind(kind) {
  let h = 2166136261
  for (let i = 0; i < kind.length; i += 1) {
    h ^= kind.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function tiltFor(kind) {
  // -3deg .. +3deg, snapped to .5deg so it reads as "stamped" not "wobbly".
  const s = seedFromKind(kind)
  const slot = s % 13              // 13 discrete tilt slots
  return ((slot - 6) / 2)          // -3 .. +3 in 0.5 steps
}

function legNumber(kind) {
  const m = /^leg(\d+)$/i.exec(kind)
  return m ? String(parseInt(m[1], 10)).padStart(2, '0') : null
}

export default function StencilStamp({
  kind = 'official',
  size = 'md',
  coord,
  title,
}) {
  const leg = legNumber(kind)
  const meta = leg
    ? { cls: 'is-leg', label: `LEG ${leg}`, code: `M-NEP-26-L${leg}` }
    : (KIND_META[kind] || KIND_META.official)

  const px = SIZE_PX[size] || SIZE_PX.md
  const tilt = tiltFor(kind)

  // The donut-text path id has to be unique per stamp so multiple stamps
  // on one page don't share the same textPath anchor.
  const uid = React.useId().replace(/:/g, '')
  const ringId = `stencil-ring-${uid}`

  // outer dashed orbit text — MGRS-style coordinate decoration.
  const coordText = coord || '28°N · 83°E · M-NEP-26 · DISPATCH'

  // Centre label is the punchy stencil word; sub-label is the section code.
  const label = meta.label
  const sub = meta.code

  return (
    <span
      className={`stencil-stamp ${meta.cls}`}
      style={{
        width: px,
        height: px,
        // CSS picks this up to apply the per-stamp jiggle.
        ['--stamp-tilt']: `${tilt}deg`,
      }}
      role="img"
      aria-label={title || `${label} stamp`}
      title={title || label}
    >
      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        aria-hidden="true"
        focusable="false"
      >
        {/* MGRS coord ring path — slightly inset so text rides the outer band */}
        <defs>
          <path
            id={ringId}
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            fill="none"
          />
        </defs>

        {/* outer dashed border */}
        <circle
          cx="50" cy="50" r="46"
          className="stencil-outer"
          fill="none"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        {/* mid solid ring */}
        <circle
          cx="50" cy="50" r="40"
          className="stencil-ring"
          fill="none"
          strokeWidth="1.4"
        />
        {/* inner solid ring */}
        <circle
          cx="50" cy="50" r="26"
          className="stencil-ring-inner"
          fill="none"
          strokeWidth="0.9"
        />

        {/* MGRS-style coord text running along the outer band */}
        <text
          className="stencil-coord"
          fontSize="6.2"
          letterSpacing="1.8"
        >
          <textPath href={`#${ringId}`} startOffset="0%">
            {coordText}
          </textPath>
        </text>

        {/* tick marks at NSEW for that compass-stamp vibe */}
        <g className="stencil-ticks">
          <line x1="50" y1="6"  x2="50" y2="11" />
          <line x1="50" y1="89" x2="50" y2="94" />
          <line x1="6"  y1="50" x2="11" y2="50" />
          <line x1="89" y1="50" x2="94" y2="50" />
        </g>

        {/* centre stencil-cut label */}
        <text
          className="stencil-label"
          x="50" y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={leg ? 18 : Math.max(10, 18 - label.length * 0.6)}
        >
          {label}
        </text>

        {/* sub code — three-letter style section ref */}
        <text
          className="stencil-sub"
          x="50" y="68"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="5.2"
          letterSpacing="0.8"
        >
          {sub}
        </text>
      </svg>
    </span>
  )
}
