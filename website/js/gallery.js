/* Photo gallery — magazine-style masonry with hero plate, filter chips,
   and click-to-expand lightbox. Lazy-loads from pics/<id>.jpg first,
   falls back to public-domain Wikimedia Commons. No API keys, no build. */

(function () {
  'use strict';

  // Curated public-domain placeholders from Wikimedia Commons (stable URLs).
  // Replace by dropping pics/<id>.jpg; the local file will take precedence.
  // type ∈ {drive, acclimatise, darshan, border} — drives the chip filter.
  // aspect ∈ {4/3, 3/4, 16/9, 5/4} — varied for editorial-spread feel.
  const PLACES = [
    {
      id: 'pokhara',
      name: 'Pokhara',
      subtitle: 'Phewa Lake & Annapurna II',
      day: 'Day 4 / 13 / 18 / 20',
      type: 'acclimatise',
      icon: 'mountain-snow',
      elevation: 822,
      oneLiner: 'Workation base — fibre, lake walks, Annapurna sunrise.',
      tag: 'workation base',
      aspect: '16/9',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Phewa_Lake%2C_Pokhara%2C_Nepal_%282%29.jpg/1280px-Phewa_Lake%2C_Pokhara%2C_Nepal_%282%29.jpg',
    },
    {
      id: 'sunauli',
      name: 'Sunauli',
      subtitle: 'Bhairahawa border crossing',
      day: 'Day 3 in / Day 14 out',
      type: 'border',
      icon: 'milestone',
      elevation: 110,
      oneLiner: 'Bhansar + Yatayat counters — the gate to Nepal.',
      tag: 'border crossing',
      aspect: '4/3',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Sunauli_border.jpg/1280px-Sunauli_border.jpg',
    },
    {
      id: 'beni',
      name: 'Beni',
      subtitle: 'Myagdi confluence',
      day: 'Day 7',
      type: 'drive',
      icon: 'route',
      elevation: 830,
      oneLiner: 'Last reliable diesel before the Mustang climb.',
      tag: 'last fuel before Mustang',
      aspect: '3/4',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Kali_Gandaki_River_at_Beni.jpg/1280px-Kali_Gandaki_River_at_Beni.jpg',
    },
    {
      id: 'jomsom',
      name: 'Jomsom',
      subtitle: 'Kali Gandaki valley',
      day: 'Day 7 → 9',
      type: 'acclimatise',
      icon: 'sunrise',
      elevation: 2720,
      oneLiner: 'Sleep here. Wind funnel by noon, calm by dawn.',
      tag: 'acclimatise here',
      aspect: '5/4',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Jomsom_Nepal_View.jpg/1280px-Jomsom_Nepal_View.jpg',
    },
    {
      id: 'kagbeni',
      name: 'Kagbeni',
      subtitle: 'Lower Mustang gateway',
      day: 'Day 8',
      type: 'darshan',
      icon: 'castle',
      elevation: 2810,
      oneLiner: 'Mediaeval mud walls — still the open zone.',
      tag: 'Lower Mustang gate',
      aspect: '4/3',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Kagbeni_Mustang_Nepal.jpg/1280px-Kagbeni_Mustang_Nepal.jpg',
    },
    {
      id: 'muktinath',
      name: 'Muktinath',
      subtitle: '3,800 m darshan',
      day: 'Day 8',
      type: 'darshan',
      icon: 'mountain',
      elevation: 3800,
      oneLiner: '108 spouts, eternal flame — the spiritual objective.',
      tag: 'spiritual objective',
      aspect: '3/4',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Muktinath_Temple_Mustang_Nepal.jpg/1280px-Muktinath_Temple_Mustang_Nepal.jpg',
    },
    {
      id: 'lumbini',
      name: 'Lumbini',
      subtitle: 'Buddha birthplace',
      day: 'Day 3 (optional)',
      type: 'darshan',
      icon: 'building-2',
      elevation: 105,
      oneLiner: 'UNESCO site — Mayadevi temple, Ashoka pillar, monastic park.',
      tag: 'UNESCO',
      aspect: '16/9',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Mayadevi_Temple%2C_Lumbini%2C_Nepal.jpg/1280px-Mayadevi_Temple%2C_Lumbini%2C_Nepal.jpg',
    },
    {
      id: 'tatopani',
      name: 'Tatopani',
      subtitle: 'Hot springs',
      day: 'Day 7',
      type: 'drive',
      icon: 'flame',
      elevation: 1190,
      oneLiner: 'Roadside sulphur soak — optional thaw before Ghasa.',
      tag: 'optional soak',
      aspect: '4/3',
      placeholder: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Tatopani_Nepal.jpg/1280px-Tatopani_Nepal.jpg',
    },
  ];

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'drive', label: 'Drive' },
    { id: 'acclimatise', label: 'Acclimatise' },
    { id: 'darshan', label: 'Darshan' },
    { id: 'border', label: 'Border' },
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function fmtElev(m) {
    return m.toLocaleString('en-IN') + ' m';
  }

  function makeCard(p, idx) {
    // Try local file first; fall back to Commons placeholder on error.
    const localUrl = `../pics/${p.id}.jpg`;
    return `
      <figure class="card" data-id="${escapeHtml(p.id)}" data-type="${escapeHtml(p.type)}" data-aspect="${escapeHtml(p.aspect)}" data-aos="fade-up" data-aos-delay="${(idx % 6) * 60}" tabindex="0" role="button" aria-label="Open ${escapeHtml(p.name)} lightbox">
        <div class="img-wrap" style="aspect-ratio:${escapeHtml(p.aspect)}">
          <img loading="lazy" decoding="async"
            src="${escapeHtml(localUrl)}"
            data-fallback="${escapeHtml(p.placeholder)}"
            alt="${escapeHtml(p.name)} — ${escapeHtml(p.subtitle)}"
            onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried=1; this.src=this.dataset.fallback;} else { this.classList.add('broken'); this.replaceWith(document.createTextNode('')); }">
          <span class="card-badge"><i data-lucide="${escapeHtml(p.icon)}" class="icon-sm"></i><span>${escapeHtml(p.type)}</span></span>
        </div>
        <figcaption>
          <strong>${escapeHtml(p.name)}</strong>
          <span class="card-sub">${escapeHtml(p.subtitle)}</span>
          <span class="day">${escapeHtml(p.day || '')}</span>
          <div class="card-stats">
            <span class="stat-pill"><i data-lucide="triangle" class="icon-sm"></i>${escapeHtml(fmtElev(p.elevation))}</span>
            <span class="stat-pill"><i data-lucide="${escapeHtml(p.icon)}" class="icon-sm"></i>${escapeHtml(p.tag)}</span>
          </div>
          <span class="card-why">${escapeHtml(p.oneLiner)}</span>
        </figcaption>
      </figure>`;
  }

  // ── Lightbox ─────────────────────────────────────────────────────────────
  let lbState = { idx: 0, list: [] };

  function ensureLightbox() {
    let lb = document.getElementById('lightbox');
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <button class="lb-close" aria-label="Close">
        <i data-lucide="x" class="icon"></i>
      </button>
      <button class="lb-nav lb-prev" aria-label="Previous">
        <i data-lucide="chevron-left" class="icon-lg"></i>
      </button>
      <button class="lb-nav lb-next" aria-label="Next">
        <i data-lucide="chevron-right" class="icon-lg"></i>
      </button>
      <figure class="lb-frame">
        <div class="lb-img-wrap"><img class="lb-img" alt=""></div>
        <figcaption class="lb-meta">
          <div class="lb-head">
            <h2 class="lb-name"></h2>
            <span class="lb-day"></span>
          </div>
          <p class="lb-why"></p>
          <div class="lb-stats"></div>
          <div class="lb-actions">
            <a class="lb-map-btn" href="#" target="_self">
              <i data-lucide="map" class="icon-sm"></i><span>View on map</span>
            </a>
            <span class="lb-counter"></span>
          </div>
        </figcaption>
      </figure>
    `;
    document.body.appendChild(lb);

    // wire dismiss
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
    lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });

    return lb;
  }

  function openLightbox(id) {
    lbState.list = PLACES.filter((p) => isVisible(p));
    if (!lbState.list.length) lbState.list = PLACES.slice();
    lbState.idx = Math.max(0, lbState.list.findIndex((p) => p.id === id));
    if (lbState.idx < 0) lbState.idx = 0;
    const lb = ensureLightbox();
    paintLightbox();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function paintLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const p = lbState.list[lbState.idx];
    if (!p) return;
    const img = lb.querySelector('.lb-img');
    const localUrl = `../pics/${p.id}.jpg`;
    img.src = localUrl;
    img.dataset.fallbackTried = '';
    img.onerror = function () {
      if (!this.dataset.fallbackTried) {
        this.dataset.fallbackTried = '1';
        this.src = p.placeholder;
      }
    };
    img.alt = `${p.name} — ${p.subtitle}`;
    lb.querySelector('.lb-name').textContent = `${p.name} · ${p.subtitle}`;
    lb.querySelector('.lb-day').textContent = p.day;
    lb.querySelector('.lb-why').textContent = p.oneLiner;
    lb.querySelector('.lb-stats').innerHTML = `
      <span class="stat-pill"><i data-lucide="triangle" class="icon-sm"></i>${escapeHtml(fmtElev(p.elevation))}</span>
      <span class="stat-pill"><i data-lucide="${escapeHtml(p.icon)}" class="icon-sm"></i>${escapeHtml(p.type)}</span>
      <span class="stat-pill"><i data-lucide="hash" class="icon-sm"></i>${escapeHtml(p.id)}</span>
    `;
    lb.querySelector('.lb-map-btn').setAttribute('href', `map.html#waypoint=${encodeURIComponent(p.id)}`);
    lb.querySelector('.lb-counter').textContent = `${String(lbState.idx + 1).padStart(2, '0')} / ${String(lbState.list.length).padStart(2, '0')}`;
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function stepLightbox(dir) {
    if (!lbState.list.length) return;
    lbState.idx = (lbState.idx + dir + lbState.list.length) % lbState.list.length;
    paintLightbox();
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Filtering ────────────────────────────────────────────────────────────
  let activeFilter = 'all';

  function isVisible(p) {
    return activeFilter === 'all' || p.type === activeFilter;
  }

  function applyFilter() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.card');
    cards.forEach((c) => {
      const t = c.getAttribute('data-type');
      const show = activeFilter === 'all' || t === activeFilter;
      c.classList.toggle('hidden', !show);
    });
    document.querySelectorAll('.chip').forEach((ch) => {
      ch.classList.toggle('active', ch.dataset.filter === activeFilter);
      ch.setAttribute('aria-pressed', ch.dataset.filter === activeFilter ? 'true' : 'false');
    });
    const visible = Array.from(cards).filter((c) => !c.classList.contains('hidden')).length;
    const hint = document.getElementById('hint');
    if (hint) {
      const total = cards.length;
      hint.textContent = activeFilter === 'all'
        ? `${total} plates · drop JPGs into /pics/<id>.jpg to override placeholders.`
        : `Showing ${visible} of ${total} · filter: ${activeFilter}`;
    }
  }

  function buildChips() {
    const wrap = document.getElementById('chips');
    if (!wrap) return;
    wrap.innerHTML = FILTERS.map((f) => `
      <button class="chip${f.id === 'all' ? ' active' : ''}" data-filter="${escapeHtml(f.id)}" aria-pressed="${f.id === 'all' ? 'true' : 'false'}">
        ${escapeHtml(f.label)}
      </button>
    `).join('');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    grid.innerHTML = PLACES.map((p, i) => makeCard(p, i)).join('');

    buildChips();

    // card click → lightbox
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      openLightbox(card.dataset.id);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.card');
      if (!card) return;
      e.preventDefault();
      openLightbox(card.dataset.id);
    });

    // global keyboard shortcuts for lightbox
    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('lightbox');
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stepLightbox(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); }
    });

    applyFilter();

    // count loaded after a beat
    setTimeout(() => {
      const hint = document.getElementById('hint');
      if (!hint) return;
      const cards = grid.querySelectorAll('.card img');
      let local = 0;
      cards.forEach((img) => { if (img.complete && !img.dataset.fallbackTried) local++; });
      if (activeFilter === 'all') {
        hint.textContent = local > 0
          ? `${local} of ${cards.length} loaded from /pics/. Drop more JPGs to override placeholders.`
          : `${cards.length} plates · drop JPGs into /pics/<id>.jpg to override placeholders.`;
      }
    }, 1500);

    // re-render lucide icons inside cards
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  });
})();
