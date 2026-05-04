/* Landing page · Nepal 2026
   Renders the day-by-day timeline + rules snapshot from the static data
   bundles already loaded by data.js / route-data.js, runs the hero parallax,
   and re-asserts Lucide icons after dynamic insertion.

   Load order in landing.html: rugged.css + landing.css + Lucide + AOS +
   data.js + route-data.js + enhance.js + this file. enhance.js already
   handled AOS.init(), Lucide.createIcons() and the [data-countdown] pass —
   we re-call createIcons after we inject more <i data-lucide> nodes. */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Hero image: mark as loaded once it actually paints (controls fade-in)
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => heroImg.classList.add('loaded'), { once: true });
      heroImg.addEventListener('error', () => heroImg.classList.add('broken'), { once: true });
    }
  }

  // ── Hero parallax: translate the bg image vertically with scroll.
  // Cheap, rAF-throttled, disabled under reduced-motion.
  if (heroImg && !reduceMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        // gentle: 1 px per 4 px scrolled, up to ~120 px
        const off = Math.round(y * 0.18);
        heroImg.style.setProperty('--parallax', off + 'px');
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Smooth scroll for the in-page scroll-cue anchor (CSS scroll-behavior
  //    isn't always set; this keeps reduced-motion users on instant jumps).
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ── TIMELINE — render every day from window.ITINERARY, alternating sides.
  function fmtDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso + 'T00:00:00+05:30');
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    } catch { return iso; }
  }

  function renderTimeline() {
    const root = document.getElementById('timeline');
    if (!root || !Array.isArray(window.ITINERARY)) return;

    const html = window.ITINERARY.map((d, i) => {
      const side = i % 2 === 0 ? 'left' : 'right';
      const type = (d.type || 'drive').toLowerCase();
      const km = d.km ? `${d.km} km` : 'rest';
      const date = `${d.weekday || ''} ${fmtDate(d.date)}`.trim();
      return `
        <li class="tl-row ${side} type-${type}"
            data-aos="fade-${side === 'left' ? 'right' : 'left'}"
            data-aos-delay="${Math.min(i * 40, 400)}">
          <div class="tl-card">
            <div class="tl-day">Day ${d.day} · ${date}</div>
            <div class="tl-leg">${escapeHtml(d.leg || '')}</div>
            <div class="tl-meta">
              <span class="badge type-${type}">${type}</span>
              <span>${km}</span>
              ${d.halt ? `<span>· halt: ${escapeHtml(d.halt)}</span>` : ''}
            </div>
          </div>
          <div class="marker" aria-hidden="true"></div>
          <div></div>
        </li>`;
    }).join('');

    root.innerHTML = html;
  }

  // ── RULES SNAPSHOT — pick 6 most "load-bearing" rules.
  // Strategy: prefer official, then corroborated, then inferred — first 6.
  function renderRules() {
    const root = document.getElementById('rules-grid');
    if (!root || !window.RULES?.rules) return;

    const all = window.RULES.rules.slice();
    const order = { official: 0, corroborated: 1, inferred: 2 };
    const picks = all
      .filter(r => r.confidence === 'official' || r.confidence === 'corroborated')
      .sort((a, b) => (order[a.confidence] ?? 9) - (order[b.confidence] ?? 9))
      .slice(0, 6);

    // If we somehow got fewer than 6 (e.g. data slimmed down), top up from
    // whatever's left so the grid still feels intentional.
    if (picks.length < 6) {
      const extra = all.filter(r => !picks.includes(r)).slice(0, 6 - picks.length);
      picks.push(...extra);
    }

    root.innerHTML = picks.map((r, i) => `
      <article class="rule-tile" data-aos="fade-up" data-aos-delay="${Math.min(i * 60, 360)}">
        <span class="cat">${escapeHtml(r.category || 'Rule')}</span>
        <h4>${escapeHtml(r.title || '')}</h4>
        <p>${shorten(escapeHtml(r.detail || ''), 200)}</p>
        ${r.source ? `<a class="src" href="${encodeURI(r.source)}" target="_blank" rel="noopener">
          source ↗
        </a>` : ''}
      </article>
    `).join('');
  }

  function shorten(s, n) {
    if (!s) return '';
    if (s.length <= n) return s;
    const cut = s.slice(0, n);
    const sp = cut.lastIndexOf(' ');
    return (sp > 60 ? cut.slice(0, sp) : cut) + '…';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── render
  renderTimeline();
  renderRules();

  // ── re-init Lucide for any icons we just injected, then refresh AOS so
  //    new rows are picked up by the observer.
  if (window.lucide?.createIcons) window.lucide.createIcons();
  if (window.AOS?.refreshHard) window.AOS.refreshHard();
  else if (window.AOS?.refresh) window.AOS.refresh();
})();
