/* Shared progressive-enhancement layer for the rugged pages.
   Initialises AOS scroll reveals, computes the T-minus countdown, and
   wires keyboard shortcuts. Loads after data.js + route-data.js but
   before page-specific JS so page code can rely on init order. */

(function () {
  'use strict';

  // 1. AOS — scroll reveal
  if (window.AOS) {
    window.AOS.init({
      duration: 550,
      easing: 'ease-out-cubic',
      once: true,
      offset: 30,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }

  // 1b. Lucide — render any <i data-lucide="..."> as inline SVG
  if (window.lucide?.createIcons) window.lucide.createIcons();

  // 2. T-minus countdown to depart date (from window.TRIP)
  function updateCountdown() {
    const els = document.querySelectorAll('[data-countdown]');
    if (!els.length) return;
    const trip = window.TRIP || {};
    const dep = trip.depart ? new Date(trip.depart + 'T00:00:00+05:30').getTime() : NaN;
    if (isNaN(dep)) return;
    const days = Math.max(0, Math.ceil((dep - Date.now()) / 86400000));
    els.forEach((el) => { el.textContent = days; });
  }
  updateCountdown();
  // refresh once a minute in case the page is left open across midnight
  setInterval(updateCountdown, 60000);

  // 3. Tiny keyboard shortcut: press "/" to focus the chat input on agent page
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      const input = document.getElementById('input');
      if (input) { e.preventDefault(); input.focus(); }
    }
  });
})();
