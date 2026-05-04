/* Nepal Travel Manager — vanilla rules-engine chat (no API).
   Reads window.TRIP / RULES / ITINERARY / CHECKLIST / ROUTE from data.js.
   Designed to work offline at Pokhara — useful when bars are weak.

   1970s field-radio dispatch flavour:
   - assistant bubbles get [KP->TM] callsign + typewriter reveal
   - user bubbles get [YOU->TM]
   - system bubbles get [SYS]
   - rack-strip uptime ticker (T+HH:MM:SS) + status-band fill on boot
*/

(function () {
  'use strict';

  // ---------- intent registry (unchanged: 19 intents) ----------
  const intents = [
    {
      id: 'bhansar',
      keys: ['bhansar', 'customs fee', 'border fee', 'daily fee', 'how much fee'],
      title: 'Bhansar (customs) daily fee',
      respond: () => answerForRules(['Vehicle', 'Bhansar']),
    },
    {
      id: 'yatayat',
      keys: ['yatayat', 'transport permit'],
      title: 'Yatayat (transport) permit',
      respond: () => answerForRules(['Vehicle', 'Yatayat']),
    },
    {
      id: 'cap',
      keys: ['30 day', 'cap', 'overstay', 'impound', 'cumulative', 'annual'],
      title: '30-day cumulative cap',
      respond: () => answerForRules(['Vehicle', 'cumulative']),
    },
    {
      id: 'acap',
      keys: ['acap', 'annapurna', 'conservation'],
      title: 'ACAP permit',
      respond: () => answerForRules(['Permits', 'ACAP']),
    },
    {
      id: 'mustang',
      keys: ['mustang', 'upper mustang', 'kagbeni', 'muktinath', 'lower mustang'],
      title: 'Mustang permit boundary',
      respond: () => answerForRules(['Permits', 'Mustang']),
    },
    {
      id: 'tims',
      keys: ['tims'],
      title: 'TIMS card',
      respond: () => answerForRules(['Permits', 'TIMS']),
    },
    {
      id: 'embassy',
      keys: ['embassy', 'consulate', 'mea'],
      title: 'Indian Embassy contacts',
      respond: () => emergencyAnswer(['embassy']),
    },
    {
      id: 'emergency',
      keys: ['emergency', 'police', 'ambulance', 'hospital', 'ams'],
      title: 'Emergency contacts',
      respond: () => emergencyAnswer([]),
    },
    {
      id: 'cash',
      keys: ['cash', 'money', 'inr', 'npr', 'rupees', '2000', 'budget'],
      title: 'Cash & money',
      respond: () => answerForRules(['Money']),
    },
    {
      id: 'fuel',
      keys: ['fuel', 'petrol', 'diesel', 'pump'],
      title: 'Fuel availability',
      respond: () => answerForRules(['Fuel']),
    },
    {
      id: 'altitude',
      keys: ['altitude', 'ams', 'diamox', 'breath', 'sick'],
      title: 'Altitude / AMS',
      respond: () => answerForRules(['Altitude']),
    },
    {
      id: 'restricted',
      keys: ['drone', 'sat phone', 'satellite'],
      title: 'Drones & sat phones',
      respond: () => answerForRules(['Restricted']),
    },
    {
      id: 'sim',
      keys: ['ntc', 'ncell', 'sim', 'connectivity', 'data', 'wifi', 'internet'],
      title: 'SIM / connectivity',
      respond: () => answerForRules(['Connectivity']),
    },
    {
      id: 'insurance',
      keys: ['insurance', 'third party', 'policy'],
      title: 'Insurance',
      respond: () => answerForRules(['Insurance']),
    },
    {
      id: 'visa',
      keys: ['visa', 'identity', 'passport', 'aadhaar', 'voter id', 'pan card'],
      title: 'Visa / acceptable IDs',
      respond: () => answerForRules(['Identity']),
    },
    {
      id: 'driving',
      keys: ['driving', 'speed limit', 'license', 'alcohol'],
      title: 'Driving rules',
      respond: () => answerForRules(['Driving']),
    },
    {
      id: 'road',
      keys: ['road', 'beni', 'jomsom', 'landslide', 'condition', 'drive or postpone'],
      title: 'Beni–Jomsom road condition',
      respond: routeAnswer,
    },
    {
      id: 'itinerary',
      keys: ['itinerary', 'schedule', 'day ', 'plan ', 'when do we'],
      title: 'Day-by-day itinerary',
      respond: itineraryAnswer,
    },
    {
      id: 'checklist',
      keys: ['checklist', 'pack', 'packing', 'list', 'documents'],
      title: 'Packing checklist',
      respond: checklistAnswer,
    },
    {
      id: 'firm',
      keys: ['firm', 'authorization', 'letter', 'tds', 'thar digital', 'mom', 'proprietor'],
      title: 'Firm-registered SUV / authorization letter',
      respond: () => answerForRules(['Vehicle', 'Firm']),
    },
  ];

  // suggested-question chips, ordered by trip-day relevance
  const suggestions = [
    'How much Bhansar will I pay at Sunauli?',
    "What's the embassy emergency phone?",
    'Is the Beni–Jomsom road open right now?',
    'How many INR should I carry as cash?',
    'Is Aadhaar accepted at the border?',
    'Do I need a TIMS card for Muktinath?',
    'What is the ACAP fee for SAARC?',
    'When am I in Pokhara?',
    'What documents do I need for a firm-registered SUV?',
    'AMS warning signs at Muktinath?',
  ];

  // ---------- dom helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const create = (tag, cls, html) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  // HH:MM, in IST-ish local — purely cosmetic, not a real timestamp
  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // dispatch callsigns
  const TAGS = {
    system:    '[SYS]',
    user:      '[YOU→TM]',
    assistant: '[KP→TM]',
  };

  function appendBubble(role, contentHtml, opts) {
    const wrap = create('div', `bubble bubble-${role}`);
    const meta = create('div', 'kp-meta');
    meta.innerHTML =
      `<span class="kp-tag">${TAGS[role] || '[?]'}</span>` +
      `<span class="kp-time">${nowStamp()}</span>`;
    wrap.appendChild(meta);

    const body = create('div', 'kp-body');
    body.innerHTML = contentHtml;
    wrap.appendChild(body);

    const t = $('#transcript');
    t.appendChild(wrap);
    t.scrollTop = t.scrollHeight;

    // re-init Lucide for any icons inside the new content
    if (window.lucide?.createIcons) window.lucide.createIcons();
    return { wrap, body, meta };
  }

  // typewriter reveal — used for assistant bubbles.
  // We render the full HTML hidden, then reveal it character-by-character
  // using a leading "kp-stream" plain-text overlay, then swap to the rich
  // HTML once typing finishes. Falls back to instant if reduced-motion.
  function appendAssistantBubble(intentTitle, htmlBody, plainText) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const titleHtml = intentTitle
      ? `<div class="intent-h">${escapeHtml(intentTitle)}</div>`
      : '';
    const { wrap, body } = appendBubble('assistant', titleHtml, {});

    // streaming pane sits below the intent title
    const stream = create('pre', 'kp-stream');
    body.appendChild(stream);

    if (reduced) {
      stream.classList.add('kp-done');
      stream.style.display = 'none';
      const rich = create('div', 'kp-rich');
      rich.innerHTML = htmlBody;
      body.appendChild(rich);
      if (window.lucide?.createIcons) window.lucide.createIcons();
      return;
    }

    // animate plain text first (40-60ms/char with light jitter)
    let i = 0;
    const text = plainText || '';
    let last = performance.now();
    function step(now) {
      // ~22 chars/sec — roughly 45ms/char, jittered
      const target = last + 35 + Math.random() * 25;
      if (now >= target && i < text.length) {
        // chunk a couple of chars per frame on long answers so we don't
        // sit there for 30 seconds — reads as "fast typist"
        const burst = text.length > 240 ? 3 : 1;
        stream.textContent += text.slice(i, i + burst);
        i += burst;
        last = now;
        // keep the transcript pinned while typing
        const t = $('#transcript');
        t.scrollTop = t.scrollHeight;
      }
      if (i < text.length) {
        requestAnimationFrame(step);
      } else {
        // swap to rich HTML once the typewriter pass is done
        stream.classList.add('kp-done');
        const rich = create('div', 'kp-rich');
        rich.innerHTML = htmlBody;
        // tiny crossfade — replace the pre with the rich block
        stream.style.display = 'none';
        body.appendChild(rich);
        if (window.lucide?.createIcons) window.lucide.createIcons();
        const t = $('#transcript');
        t.scrollTop = t.scrollHeight;
      }
    }
    requestAnimationFrame(step);
  }

  // strip HTML tags + collapse whitespace — used to drive the typewriter.
  function htmlToPlain(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // give list items / blocks line breaks for readability
    tmp.querySelectorAll('li, p, div, ol, ul, h1, h2, h3, h4').forEach((el) => {
      el.appendChild(document.createTextNode('\n'));
    });
    return (tmp.textContent || '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // ---------- answer builders (unchanged HTML output) ----------
  function ruleHtml(r) {
    const conf = `<span class="conf conf-${r.confidence}">${r.confidence}</span>`;
    const src = r.source ? `<a href="${escapeHtml(r.source)}" target="_blank" rel="noopener">source</a>` : '';
    return `<div class="rule"><div class="rule-h"><strong>${escapeHtml(r.title)}</strong> ${conf}</div>
      <div class="rule-d">${escapeHtml(r.detail)}</div>
      <div class="rule-meta"><span class="cat">${escapeHtml(r.category)}</span> · ${src} · fetched ${escapeHtml(r.fetchedAt || '')}</div>
    </div>`;
  }

  function answerForRules(filterTerms) {
    const matches = (window.RULES?.rules || []).filter((r) => {
      const blob = `${r.category} ${r.title} ${r.detail}`.toLowerCase();
      return filterTerms.every((t) => blob.includes(String(t).toLowerCase()));
    });
    if (!matches.length) {
      return `<p>I have no specific rule for that — try one of the chips below, or check <code>data/rules.json</code>.</p>`;
    }
    return matches.slice(0, 4).map(ruleHtml).join('');
  }

  function emergencyAnswer(filterTerms) {
    const list = (window.RULES?.emergencies || []).filter((e) => {
      if (!filterTerms.length) return true;
      const blob = (e.label + ' ' + (e.phone || e.email || e.note || '')).toLowerCase();
      return filterTerms.some((t) => blob.includes(t));
    });
    if (!list.length) return '<p>No matching emergency contact.</p>';
    return `<ul class="emerg">${list.map((e) => {
      const v = e.phone ? `<a href="tel:${escapeHtml(e.phone.replace(/\s+/g, ''))}">${escapeHtml(e.phone)}</a>`
        : e.email ? `<a href="mailto:${escapeHtml(e.email)}">${escapeHtml(e.email)}</a>`
        : escapeHtml(e.note || '');
      return `<li><strong>${escapeHtml(e.label)}</strong> — ${v}</li>`;
    }).join('')}</ul>`;
  }

  function routeAnswer() {
    const r = window.ROUTE?.beniJomsom;
    if (!r) return '<p>Route intel not loaded.</p>';
    const concerns = (r.concerns || []).map((c) => `
      <li><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.detail)} <em>(${escapeHtml(c.source)})</em></li>
    `).join('');
    return `
      <div class="rec rec-${r.recommendation.toLowerCase()}">${escapeHtml(r.recommendation)}</div>
      <p>${escapeHtml(r.headline)}</p>
      <p><strong>Top concerns:</strong></p>
      <ol class="concerns">${concerns}</ol>
      <p><strong>Re-verify on ${escapeHtml(r.verifyOn)}:</strong> ${(r.verifyChecks || []).map((c) => escapeHtml(c)).join(' · ')}</p>
      <p><a href="../docs/ROUTE_CONDITIONS.md" target="_blank">Full report</a></p>
    `;
  }

  function itineraryAnswer(query) {
    const days = window.ITINERARY || [];
    if (!days.length) return '<p>Itinerary not loaded.</p>';
    const q = (query || '').toLowerCase();
    const dayMatch = q.match(/day\s*(\d+)/) || q.match(/^(\d+)\s*$/);
    const dateMatch = q.match(/(\d{4}-\d{2}-\d{2})/) || q.match(/may\s*(\d+)/);
    let filtered = days;
    if (dayMatch) {
      const n = +dayMatch[1];
      filtered = days.filter((d) => d.day === n);
    } else if (dateMatch) {
      filtered = days.filter((d) => (d.date || '').endsWith(dateMatch[1] || dateMatch[0]));
    } else {
      const tokens = ['pokhara', 'jomsom', 'muktinath', 'sunauli', 'bhairahawa', 'kagbeni', 'noida', 'gorakhpur', 'bikaner'];
      const hit = tokens.find((t) => q.includes(t));
      if (hit) filtered = days.filter((d) => (d.leg + ' ' + (d.halt || '')).toLowerCase().includes(hit));
    }
    if (!filtered.length) return '<p>No matching day. Try "Day 5" or "Pokhara" or "May 15".</p>';
    return `<ol class="days">${filtered.map((d) => `
      <li>
        <div class="day-h"><strong>Day ${d.day}</strong> · ${escapeHtml(d.date)} ${escapeHtml(d.weekday || '')}
          <span class="day-type type-${d.type}">${escapeHtml(d.type || '')}</span>
        </div>
        <div class="day-leg">${escapeHtml(d.leg)} ${d.km ? `(${d.km} km · ${escapeHtml(d.hours || '')})` : ''}</div>
        ${d.halt ? `<div class="day-halt">Halt: ${escapeHtml(d.halt)}</div>` : ''}
        ${d.note ? `<div class="day-note">${escapeHtml(d.note)}</div>` : ''}
      </li>`).join('')}</ol>`;
  }

  function checklistAnswer(query) {
    const cl = window.CHECKLIST?.categories || [];
    if (!cl.length) return '<p>Checklist not loaded.</p>';
    const q = (query || '').toLowerCase();
    const filtered = q.length > 6
      ? cl.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      : cl;
    return filtered.map((c) => `
      <div class="cat">
        <strong>${escapeHtml(c.title)}</strong> ${c.note ? `<em>— ${escapeHtml(c.note)}</em>` : ''}
        <ul>${(c.items || []).map((i) => `<li>${escapeHtml(i.label)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  // ---------- intent matcher ----------
  function classify(query) {
    const q = ' ' + query.toLowerCase().replace(/[^\w\s']/g, ' ') + ' ';
    let best = null, bestScore = 0;
    for (const it of intents) {
      let score = 0;
      for (const k of it.keys) if (q.includes(' ' + k.toLowerCase()) || q.includes(k.toLowerCase() + ' ') || q.includes(' ' + k.toLowerCase() + ' ')) score++;
      if (score > bestScore) { best = it; bestScore = score; }
    }
    return bestScore ? best : null;
  }

  // returns { title, html }
  function answer(query) {
    const intent = classify(query);
    if (!intent) {
      return {
        title: 'Unmatched · suggesting channels',
        html: `<p>I'm not sure which rule that maps to — try one of these:</p>
          ${suggestions.slice(0, 6).map((s) => `<button class="chip" data-q="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join(' ')}`,
      };
    }
    return { title: intent.title, html: intent.respond(query) };
  }

  // ---------- bootstrap ----------
  function welcome() {
    const t = window.TRIP || {};
    appendBubble('system', `
      <p><strong>Namaste, Shive 🇳🇵</strong> — radio check, you are loud and clear on Channel 1.</p>
      <p>Trip: <strong>${escapeHtml(t.name || '')}</strong> · ${escapeHtml(t.depart || '')} → ${escapeHtml(t['return'] || '')} · ${t.nights || ''} nights · ${t.totalKm || ''} km RT.</p>
      <p>Vehicle: <strong>${escapeHtml(t.vehicle || '')}</strong>. Permit days planned: ${t.permitDaysUsed} of ${t.capDays}-day cap.</p>
      <p>Ask me anything — fees, IDs, road, embassy, day-by-day. I read from <code>data/*.json</code> (offline-friendly). Press <kbd>/</kbd> to focus.</p>
    `);
    renderChips();
  }

  function renderChips() {
    const wrap = $('#chips');
    wrap.innerHTML = suggestions.map((s) => `<button class="chip" data-q="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join(' ');
  }

  function send(query) {
    const q = (query || '').trim();
    if (!q) return;
    appendBubble('user', `<p>${escapeHtml(q)}</p>`);
    $('#input').value = '';

    // small "keying-up" pause, then assistant reply
    setTimeout(() => {
      const a = answer(q);
      const plain = htmlToPlain(a.html);
      appendAssistantBubble(a.title, a.html, plain);
    }, 90);
  }

  // ---------- rack-strip uptime + status-band ----------
  function pad(n) { return String(n).padStart(2, '0'); }

  function startUptime() {
    const el = document.getElementById('kp-uptime');
    if (!el) return;
    const t0 = Date.now();
    function tick() {
      const s = Math.floor((Date.now() - t0) / 1000);
      const hh = pad(Math.floor(s / 3600));
      const mm = pad(Math.floor((s % 3600) / 60));
      const ss = pad(s % 60);
      el.textContent = `T+${hh}:${mm}:${ss}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  function fillStatusBand() {
    const rules = window.RULES || {};
    const list = rules.rules || [];
    let ofc = 0, cor = 0, inf = 0;
    for (const r of list) {
      if (r.confidence === 'official') ofc++;
      else if (r.confidence === 'corroborated') cor++;
      else if (r.confidence === 'inferred') inf++;
    }
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('kp-ofc', `${ofc} ofc`);
    set('kp-cor', `${cor} cor`);
    set('kp-inf', `${inf} inf`);
    set('kp-last', rules.lastUpdated || '—');
    const srcCount = (rules.officialSources || []).length || list.filter(r => r.source).length;
    set('kp-srcs', `${srcCount} cited`);

    // freq readout in the rack-strip — locked to lastUpdated for whimsy
    const freq = document.getElementById('kp-freq');
    if (freq && rules.lastUpdated) {
      const dotted = rules.lastUpdated.replace(/-/g, '.');
      freq.textContent = `${dotted} · 145.500 MHz`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    welcome();
    startUptime();
    fillStatusBand();

    $('#input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send($('#input').value);
      }
    });
    $('#send').addEventListener('click', () => send($('#input').value));
    document.body.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) send(chip.dataset.q);
    });
  });
})();
