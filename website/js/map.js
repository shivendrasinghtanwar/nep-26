/* Nepal route map — Leaflet + OpenStreetMap.
   Atlas-plate edition: divIcon SVG markers, elevation sidebar, day timeline,
   layer presets, tile-layer switcher, enhanced rec-banner.
   Reads window.ROUTE.waypoints, window.ITINERARY from data.js. No API key. */

(function () {
  'use strict';

  if (!window.L) {
    document.getElementById('map').innerHTML =
      '<p style="padding:20px">Leaflet failed to load. Check internet, or open <code>file://</code> with internet allowed.</p>';
    return;
  }

  const route = window.ROUTE || {};
  const waypoints = route.waypoints || [];
  const itinerary = window.ITINERARY || [];

  // Palette (mirrors --rugged.css vars; kept here for SVG fills).
  const PAL = {
    night: '#0a1424',
    cream: '#ece5d3',
    creamDim: '#b5ad99',
    dust: '#d4a574',
    dustSoft: '#b08a5d',
    rust: '#c8552a',
    flagYellow: '#e8b13a',
    flagGreen: '#3d8a5a',
    flagRed: '#a83c3c',
    glacier: '#5b9fcc',
    aurora: '#6dccaa',
    line: '#3a4a68',
  };

  const KIND_STYLE = {
    origin:   { color: PAL.rust,       label: 'Origin',           icon: 'flag' },
    halt:     { color: PAL.creamDim,   label: 'Overnight halt',   icon: 'bed' },
    border:   { color: PAL.flagYellow, label: 'Border crossing',  icon: 'milestone' },
    base:     { color: PAL.glacier,    label: 'Workation base',   icon: 'tent' },
    fuel:     { color: PAL.flagYellow, label: 'Fuel stop',        icon: 'fuel' },
    permit:   { color: PAL.aurora,     label: 'ACAP check-post',  icon: 'shield-check' },
    passthru: { color: PAL.creamDim,   label: 'Pass-through',     icon: 'circle' },
    darshan:  { color: PAL.dust,       label: 'Darshan',          icon: 'flower' },
    embassy:  { color: PAL.flagRed,    label: 'Embassy',          icon: 'crosshair' },
    hospital: { color: PAL.glacier,    label: 'Hospital',         icon: 'plus-square' },
  };

  // ── leg-type colour key (drive/border/work/etc.)
  const LEG_COLOR = {
    drive:       PAL.glacier,
    border:      PAL.flagYellow,
    work:        PAL.aurora,
    acclimatise: PAL.dust,
    offroad:     PAL.rust,
    darshan:     '#e7b6d0',
    leisure:     PAL.cream,
    reference:   PAL.creamDim,
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  // ── Custom topographic divIcon SVG markers ─────────────────────────────
  // 28x28 box, anchor centred. Each kind has a distinctive shape.
  function svgWrap(inner, opts) {
    const ring = opts && opts.ring ? `<circle class="pulse-ring" cx="14" cy="14" r="9" fill="none" stroke="${opts.ring}" stroke-width="1" opacity="0.6"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">${ring}${inner}</svg>`;
  }

  function shapeFor(kind, color) {
    const stroke = PAL.night;
    switch (kind) {
      case 'origin':
        // filled chevron (arrowhead pointing up — start flag)
        return svgWrap(
          `<path d="M14 4 L23 22 L14 17 L5 22 Z" fill="${color}" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round"/>`
        );
      case 'halt':
        // ring (hollow circle, dust outline)
        return svgWrap(
          `<circle cx="14" cy="14" r="6" fill="${PAL.night}" stroke="${color}" stroke-width="2.4"/>
           <circle cx="14" cy="14" r="2" fill="${color}"/>`
        );
      case 'border':
        // double-line boundary
        return svgWrap(
          `<rect x="4" y="10" width="20" height="3" fill="${color}" stroke="${stroke}" stroke-width="0.8"/>
           <rect x="4" y="15" width="20" height="3" fill="${color}" stroke="${stroke}" stroke-width="0.8"/>`
        );
      case 'base':
        // five-point star
        return svgWrap(
          `<path d="M14 3 L17 11 L25 11 L18.5 16 L21 24 L14 19 L7 24 L9.5 16 L3 11 L11 11 Z"
                 fill="${color}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>`,
          { ring: color }
        );
      case 'fuel':
        // teardrop / pin
        return svgWrap(
          `<path d="M14 3 C8 3 5 8 5 13 C5 19 14 25 14 25 C14 25 23 19 23 13 C23 8 20 3 14 3 Z"
                 fill="${color}" stroke="${stroke}" stroke-width="1.1"/>
           <circle cx="14" cy="13" r="3" fill="${PAL.night}"/>`
        );
      case 'permit':
        // shield
        return svgWrap(
          `<path d="M14 3 L23 6 L23 14 C23 20 14 25 14 25 C14 25 5 20 5 14 L5 6 Z"
                 fill="${color}" stroke="${stroke}" stroke-width="1.1" stroke-linejoin="round"/>
           <path d="M10 14 L13 17 L18 11" stroke="${PAL.night}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        );
      case 'passthru':
        // small dot
        return svgWrap(
          `<circle cx="14" cy="14" r="3.5" fill="${color}" stroke="${stroke}" stroke-width="1"/>`
        );
      case 'darshan':
        // lotus circle (8 petals)
        return svgWrap(
          `<g transform="translate(14 14)">
             ${[0,45,90,135,180,225,270,315].map(a =>
               `<ellipse cx="0" cy="-7" rx="2.6" ry="5" fill="${color}" stroke="${stroke}" stroke-width="0.6" transform="rotate(${a})"/>`
             ).join('')}
             <circle cx="0" cy="0" r="3" fill="${PAL.night}" stroke="${color}" stroke-width="1"/>
           </g>`
        );
      case 'embassy':
        // crosshair
        return svgWrap(
          `<circle cx="14" cy="14" r="8" fill="${PAL.night}" stroke="${color}" stroke-width="1.6"/>
           <line x1="14" y1="3"  x2="14" y2="9"  stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
           <line x1="14" y1="19" x2="14" y2="25" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
           <line x1="3"  y1="14" x2="9"  y2="14" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
           <line x1="19" y1="14" x2="25" y2="14" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
           <circle cx="14" cy="14" r="1.6" fill="${color}"/>`
        );
      case 'hospital':
        // cross
        return svgWrap(
          `<rect x="4" y="4" width="20" height="20" rx="3" fill="${PAL.night}" stroke="${color}" stroke-width="1.4"/>
           <rect x="12.2" y="7" width="3.6" height="14" fill="${color}"/>
           <rect x="7" y="12.2" width="14" height="3.6" fill="${color}"/>`
        );
      default:
        return svgWrap(
          `<circle cx="14" cy="14" r="4" fill="${color}" stroke="${stroke}" stroke-width="1"/>`
        );
    }
  }

  function divIconFor(kind, color, pulse) {
    return L.divIcon({
      className: 'topo-marker' + (pulse ? ' is-pulse' : ''),
      html: shapeFor(kind, color),
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -12],
    });
  }

  // ── Tile layers ────────────────────────────────────────────────────────
  const TILES = {
    OpenTopoMap: L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '© OpenStreetMap, SRTM | © OpenTopoMap (CC-BY-SA)',
    }),
    OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }),
    'OSM HOT': L.tileLayer('https://tile-a.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OSM France · Humanitarian style',
    }),
  };

  const map = L.map('map', { scrollWheelZoom: true, zoomControl: true });
  let activeTile = TILES.OpenTopoMap.addTo(map);

  // ── Build markers grouped by kind, also keep id→marker for timeline ────
  const layers = {};
  const markerById = {};

  for (const w of waypoints) {
    const style = KIND_STYLE[w.kind] || { color: PAL.creamDim, label: w.kind };
    const isPeak = w.id === 'muktinath';
    const marker = L.marker([w.lat, w.lng], { icon: divIconFor(w.kind, style.color, isPeak) });

    const dayMatch = (itinerary || []).find((d) => d.day === w.day);
    const dayHtml = dayMatch
      ? `<div style="font-size:12px;opacity:.85;margin-top:4px">
           <strong>Day ${dayMatch.day}</strong> · ${escapeHtml(dayMatch.date)} ${escapeHtml(dayMatch.weekday || '')}
           <br>${escapeHtml(dayMatch.leg)}
           ${dayMatch.km ? `<br><em>${dayMatch.km} km · ${escapeHtml(dayMatch.hours || '')}</em>` : ''}
         </div>`
      : '';
    const popup = `
      <div style="font-family: ui-sans-serif, system-ui; min-width:180px">
        <strong>${escapeHtml(w.name)}</strong>
        <div style="font-size:11px;opacity:.65;margin-top:2px">
          ${escapeHtml(style.label)} · ${w.lat.toFixed(3)}, ${w.lng.toFixed(3)}
        </div>
        ${dayHtml}
      </div>`;
    marker.bindPopup(popup);
    marker.bindTooltip(w.name, { direction: 'top', offset: [0, -16] });

    if (!layers[w.kind]) layers[w.kind] = L.layerGroup();
    layers[w.kind].addLayer(marker);
    markerById[w.id] = marker;
  }
  for (const k of Object.keys(layers)) layers[k].addTo(map);

  // ── Driving polyline (day-numbered waypoints, in day order) ────────────
  const tripPath = waypoints
    .filter((w) => typeof w.day === 'number')
    .sort((a, b) => a.day - b.day)
    .map((w) => [w.lat, w.lng]);
  if (tripPath.length > 1) {
    L.polyline(tripPath, {
      color: PAL.dust, weight: 3, opacity: 0.65, dashArray: '6 5', lineCap: 'round',
    }).addTo(map);
  }

  // ── Fit bounds ─────────────────────────────────────────────────────────
  const all = L.featureGroup(Object.values(layers).flatMap((g) => g.getLayers()));
  if (all.getLayers().length) map.fitBounds(all.getBounds().pad(0.12));
  else map.setView([28.2, 83.99], 7);

  // ── Layer-controls UI: presets + per-kind toggles + tile switcher ──────
  const ctl = document.getElementById('layer-controls');
  const PRESETS = {
    All:                   Object.keys(KIND_STYLE),
    'Driving':             ['origin', 'halt', 'border', 'base', 'fuel', 'passthru'],
    'Permits & paperwork': ['border', 'permit', 'embassy'],
    'Stays':               ['halt', 'base'],
  };

  function renderControls() {
    if (!ctl) return;
    const heading = `
      <div class="lyr-row heading">
        <span class="lhs">Layers</span>
        <span class="rhs">
          <span style="opacity:.7">Tiles</span>
          <select class="tile-select" id="tile-select" aria-label="Tile layer">
            ${Object.keys(TILES).map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('')}
          </select>
        </span>
      </div>`;
    const presets = `
      <div class="lyr-row">
        <span style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-dim);margin-right:4px">Presets</span>
        <span class="preset-btns">
          ${Object.keys(PRESETS).map(n => `<button type="button" class="preset-btn" data-preset="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join('')}
        </span>
      </div>`;
    const togglesHtml = Object.entries(layers).map(([kind]) => {
      const s = KIND_STYLE[kind] || { color: PAL.creamDim, label: kind, icon: 'circle' };
      return `<label class="lyr" data-kind="${escapeHtml(kind)}">
        <input type="checkbox" data-kind="${escapeHtml(kind)}" checked>
        <i data-lucide="${s.icon}" class="icon icon-sm"></i>
        <span>${escapeHtml(s.label)}</span>
        <span class="toggle-dot" style="background:${s.color}"></span>
      </label>`;
    }).join('');
    ctl.innerHTML = `${heading}${presets}<div class="lyr-row" id="layer-toggles">${togglesHtml}</div>`;

    // Lucide refresh
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
  renderControls();

  function setKind(kind, on) {
    if (!layers[kind]) return;
    if (on) layers[kind].addTo(map); else map.removeLayer(layers[kind]);
    const lbl = ctl && ctl.querySelector(`label.lyr[data-kind="${kind}"]`);
    if (lbl) lbl.classList.toggle('is-off', !on);
    const cb = ctl && ctl.querySelector(`input[data-kind="${kind}"]`);
    if (cb) cb.checked = !!on;
  }

  function applyPreset(name) {
    const want = new Set(PRESETS[name] || []);
    Object.keys(layers).forEach(k => setKind(k, want.has(k)));
    if (ctl) ctl.querySelectorAll('.preset-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === name);
    });
  }

  if (ctl) {
    ctl.addEventListener('change', (e) => {
      const cb = e.target.closest('input[type=checkbox]');
      if (cb) { setKind(cb.dataset.kind, cb.checked); return; }
      const sel = e.target.closest('#tile-select');
      if (sel) {
        const next = TILES[sel.value];
        if (next && next !== activeTile) {
          map.removeLayer(activeTile);
          activeTile = next.addTo(map);
        }
      }
    });
    ctl.addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-btn');
      if (!btn) return;
      applyPreset(btn.dataset.preset);
    });
    // Mark "All" as the initial active preset
    const allBtn = ctl.querySelector('.preset-btn[data-preset="All"]');
    if (allBtn) allBtn.classList.add('active');
  }

  // ── Recommendation banner (atlas-style) ────────────────────────────────
  const rec = route.beniJomsom?.recommendation;
  if (rec) {
    const banner = document.getElementById('rec-banner');
    if (banner) {
      banner.className = `rec rec-${rec.toLowerCase()} atlas`;
      const verifyOn = route.beniJomsom?.verifyOn || '2026-05-13 in Pokhara';
      banner.innerHTML = `
        <span class="flag-stripe" aria-hidden="true"></span>
        <span class="ico"><i data-lucide="route" class="icon"></i></span>
        <span class="line-1">
          Beni–Jomsom: <strong>${escapeHtml(rec)}</strong> · ${escapeHtml(route.beniJomsom.headline || '')}
        </span>
        <span class="line-2" style="grid-column: 3">
          Verify on ${escapeHtml(verifyOn)}
          · <a href="../docs/ROUTE_CONDITIONS.md">full report →</a>
        </span>`;
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }
  }

  // ── Day timeline strip ─────────────────────────────────────────────────
  // Map each day to its primary waypoint id (preferred halt > first matching).
  const DAY_TO_WP = {
    1: 'noida', 2: 'gorakhpur', 3: 'bhairahawa', 4: 'pokhara', 5: 'pokhara',
    6: 'beni',  7: 'jomsom',    8: 'muktinath',  9: 'pokhara', 10: 'pokhara',
    11: 'pokhara', 12: 'pokhara', 13: 'bhairahawa', 14: 'sunauli', 15: 'bikaner',
  };

  const strip = document.getElementById('day-strip');
  if (strip) {
    strip.style.gridTemplateColumns = `repeat(${itinerary.length}, minmax(0, 1fr))`;
    strip.innerHTML = itinerary.map((d) => {
      const color = LEG_COLOR[d.type] || PAL.creamDim;
      const dateShort = d.date ? d.date.slice(5) : ''; // MM-DD
      return `<div class="day-cell" data-day="${d.day}" data-wp="${escapeHtml(DAY_TO_WP[d.day] || '')}"
                style="--leg:${color}"
                title="${escapeHtml(d.leg)}">
        <span class="d-num">D${d.day}</span>
        <span class="d-date">${escapeHtml(dateShort)} ${escapeHtml(d.weekday || '')}</span>
        <span class="d-leg">${escapeHtml(d.type || '')}</span>
      </div>`;
    }).join('');

    let hoverId = null;
    strip.addEventListener('mouseover', (e) => {
      const cell = e.target.closest('.day-cell');
      if (!cell) return;
      const wpId = cell.dataset.wp;
      if (!wpId || hoverId === wpId) return;
      hoverId = wpId;
      const m = markerById[wpId];
      if (m && m._icon) m._icon.classList.add('is-pulse');
    });
    strip.addEventListener('mouseout', (e) => {
      const cell = e.target.closest('.day-cell');
      if (!cell) return;
      const wpId = cell.dataset.wp;
      hoverId = null;
      const m = markerById[wpId];
      if (m && m._icon && wpId !== 'muktinath') m._icon.classList.remove('is-pulse');
    });
    strip.addEventListener('click', (e) => {
      const cell = e.target.closest('.day-cell');
      if (!cell) return;
      strip.querySelectorAll('.day-cell.active').forEach(c => c.classList.remove('active'));
      cell.classList.add('active');
      const wpId = cell.dataset.wp;
      const m = markerById[wpId];
      if (m) {
        const ll = m.getLatLng();
        map.flyTo(ll, Math.max(map.getZoom(), 9), { duration: 0.7 });
        m.openPopup();
      }
    });
  }

  // ── Elevation profile sidebar ──────────────────────────────────────────
  // Approximate baked-in altitudes (m) along the cumulative km axis.
  const ELEV_NODES = [
    { name: 'Bikaner',     km: 0,    m: 240  },
    { name: 'Noida',       km: 610,  m: 200  },
    { name: 'Gorakhpur',   km: 1330, m: 96   },
    { name: 'Sunauli',     km: 1430, m: 105  },
    { name: 'Bhairahawa',  km: 1450, m: 105  },
    { name: 'Pokhara',     km: 1640, m: 822  },
    { name: 'Beni',        km: 1725, m: 869  },
    { name: 'Tatopani',    km: 1755, m: 1190 },
    { name: 'Ghasa',       km: 1780, m: 2010 },
    { name: 'Jomsom',      km: 1810, m: 2720 },
    { name: 'Kagbeni',     km: 1825, m: 2807 },
    { name: 'Muktinath',   km: 1850, m: 3800 },
    // mirrored back
    { name: 'Jomsom',      km: 1875, m: 2720 },
    { name: 'Pokhara',     km: 2035, m: 822  },
    { name: 'Bhairahawa',  km: 2225, m: 105  },
    { name: 'Lucknow',     km: 2695, m: 123  },
    { name: 'Bikaner',     km: 3525, m: 240  },
  ];

  function renderElevation() {
    const svg = document.getElementById('elev-svg');
    const readout = document.getElementById('elev-readout');
    if (!svg) return;

    // Use a fixed coordinate system; viewBox handles scaling.
    const W = 220, H = 220;
    const PAD_L = 28, PAD_R = 8, PAD_T = 14, PAD_B = 22;
    const innerW = W - PAD_L - PAD_R;
    const innerH = H - PAD_T - PAD_B;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const maxKm = ELEV_NODES[ELEV_NODES.length - 1].km;
    const maxM  = 4000;
    const minM  = 0;

    const xFor = (km) => PAD_L + (km / maxKm) * innerW;
    const yFor = (m)  => PAD_T + innerH - ((m - minM) / (maxM - minM)) * innerH;

    const pts = ELEV_NODES.map(n => [xFor(n.km), yFor(n.m)]);
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    const fillPath = `${linePath} L${pts[pts.length-1][0].toFixed(2)},${(PAD_T + innerH).toFixed(2)} L${pts[0][0].toFixed(2)},${(PAD_T + innerH).toFixed(2)} Z`;

    // Y-axis ticks at 0/1k/2k/3k/4k
    const yTicks = [0, 1000, 2000, 3000, 4000].map(m => {
      const y = yFor(m);
      return `<line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${(W - PAD_R).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${PAL.line}" stroke-opacity="0.35" stroke-dasharray="2 3"/>
              <text x="${PAD_L - 4}" y="${(y + 3).toFixed(1)}" text-anchor="end" fill="${PAL.creamDim}" font-family="JetBrains Mono, monospace" font-size="8">${m}</text>`;
    }).join('');
    // X-axis ticks (km)
    const xTickKm = [0, 1000, 2000, 3000];
    const xTicks = xTickKm.filter(k => k <= maxKm).map(k => {
      const x = xFor(k);
      return `<line x1="${x.toFixed(1)}" y1="${(PAD_T + innerH).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(PAD_T + innerH + 3).toFixed(1)}" stroke="${PAL.creamDim}" stroke-opacity="0.45"/>
              <text x="${x.toFixed(1)}" y="${(PAD_T + innerH + 12).toFixed(1)}" text-anchor="middle" fill="${PAL.creamDim}" font-family="JetBrains Mono, monospace" font-size="8">${k} km</text>`;
    }).join('');

    // Peak (Muktinath) coords
    const peak = ELEV_NODES.find(n => n.name === 'Muktinath');
    const px = xFor(peak.km), py = yFor(peak.m);

    svg.innerHTML = `
      <defs>
        <linearGradient id="elev-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${PAL.dust}" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="${PAL.dust}" stop-opacity="0.02"/>
        </linearGradient>
        <filter id="elev-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      ${yTicks}
      ${xTicks}
      <path d="${fillPath}" fill="url(#elev-fill)"/>
      <path d="${linePath}" fill="none" stroke="${PAL.dust}" stroke-width="1.4" filter="url(#elev-glow)" stroke-linejoin="round" stroke-linecap="round"/>
      <g transform="translate(${px.toFixed(2)} ${py.toFixed(2)})">
        <circle class="elev-peak-pulse" r="5" fill="none" stroke="${PAL.dust}" stroke-width="1" opacity="0.7"/>
        <circle r="2.4" fill="${PAL.dust}" stroke="${PAL.cream}" stroke-width="1"/>
        <text x="0" y="-8" text-anchor="middle" fill="${PAL.cream}" font-family="JetBrains Mono, monospace" font-size="8">3800m</text>
      </g>
      <line class="elev-hover-line" id="elev-hover-line" x1="-10" y1="${PAD_T}" x2="-10" y2="${PAD_T + innerH}" style="display:none"/>
      <circle class="elev-hover-dot" id="elev-hover-dot" cx="-10" cy="-10" r="3" style="display:none"/>
    `;

    // Hover tracker
    function nearestNode(km) {
      let best = ELEV_NODES[0], bestD = Infinity;
      for (const n of ELEV_NODES) {
        const d = Math.abs(n.km - km);
        if (d < bestD) { bestD = d; best = n; }
      }
      return best;
    }
    function elevAtKm(km) {
      // piecewise linear interpolation
      for (let i = 1; i < ELEV_NODES.length; i++) {
        const a = ELEV_NODES[i-1], b = ELEV_NODES[i];
        if (km >= a.km && km <= b.km) {
          const t = (km - a.km) / (b.km - a.km || 1);
          return a.m + (b.m - a.m) * t;
        }
      }
      return ELEV_NODES[0].m;
    }

    const hoverLine = svg.querySelector('#elev-hover-line');
    const hoverDot  = svg.querySelector('#elev-hover-dot');

    function onMove(e) {
      const rect = svg.getBoundingClientRect();
      // Map clientX into viewBox space.
      const xPx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const xVB = (xPx / rect.width) * W;
      if (xVB < PAD_L || xVB > W - PAD_R) return;
      const km = ((xVB - PAD_L) / innerW) * maxKm;
      const m = elevAtKm(km);
      const yVB = yFor(m);

      hoverLine.style.display = '';
      hoverLine.setAttribute('x1', xVB.toFixed(2));
      hoverLine.setAttribute('x2', xVB.toFixed(2));
      hoverDot.style.display = '';
      hoverDot.setAttribute('cx', xVB.toFixed(2));
      hoverDot.setAttribute('cy', yVB.toFixed(2));

      const nn = nearestNode(km);
      if (readout) {
        readout.innerHTML = `
          <span class="pri">${Math.round(m).toLocaleString()} m · ${Math.round(km).toLocaleString()} km</span>
          <span class="sub">Nearest: ${escapeHtml(nn.name)} (${nn.m.toLocaleString()} m)</span>`;
      }
    }
    function onLeave() {
      hoverLine.style.display = 'none';
      hoverDot.style.display = 'none';
      if (readout) readout.innerHTML = `
        <span class="pri">Hover the profile to inspect altitude.</span>
        <span class="sub">Peak · Muktinath 3,800 m</span>`;
    }

    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);
    svg.addEventListener('touchmove', (e) => { onMove(e); e.preventDefault(); }, { passive: false });
    svg.addEventListener('touchend', onLeave);
  }

  renderElevation();
})();
