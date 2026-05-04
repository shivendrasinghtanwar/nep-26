/* shared site logic */

// highlight active nav link
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header.site nav a").forEach(a => {
    if ((a.getAttribute("href") || "") === path) a.classList.add("active");
  });
});

// ---------------- Itinerary renderer ----------------
function renderItinerary(targetId) {
  const target = document.getElementById(targetId);
  if (!target || !window.ITINERARY) return;
  target.innerHTML = window.ITINERARY.map(d => `
    <div class="day ${d.type}">
      <div class="when">
        ${d.weekday}
        <span class="d">${d.date.slice(8,10)}</span>
        ${d.date.slice(0,7)}
      </div>
      <div>
        <div class="leg">${d.leg}</div>
        <div class="note">${d.note}</div>
      </div>
      <div class="stats-mini">
        <span class="tag">${d.type}</span>
        <span>${d.km ? d.km + " km" : "no drive"}</span>
        <span>${d.hours} h</span>
        <span>halt: ${d.halt}</span>
      </div>
    </div>
  `).join("");
}

// ---------------- Rules renderer ----------------
function renderRules(targetId, emergencyId) {
  const target = document.getElementById(targetId);
  if (target && window.RULES) {
    target.innerHTML = window.RULES.rules.map(r => `
      <div class="rule">
        <span class="cat-tag">${r.category}</span>
        <h3>${r.title}</h3>
        <p>${r.detail}</p>
      </div>
    `).join("");
  }
  const eTarget = emergencyId ? document.getElementById(emergencyId) : null;
  if (eTarget && window.RULES) {
    eTarget.innerHTML = window.RULES.emergencies.map(e => `
      <div class="rule">
        <h3>${e.label}</h3>
        <p>${e.value}</p>
      </div>
    `).join("");
  }
}

// ---------------- Checklist renderer (with localStorage) ----------------
const LS_KEY = "nepal2026:checklist:v1";

function loadChecklistState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}
function saveChecklistState(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

function renderChecklist(targetId, progressBarId, progressTextId) {
  const target = document.getElementById(targetId);
  if (!target || !window.CHECKLIST) return;

  const state = loadChecklistState();

  function totalDone() {
    let total = 0, done = 0;
    window.CHECKLIST.categories.forEach(cat =>
      cat.items.forEach(it => { total++; if (state[it.id]) done++; })
    );
    return { total, done };
  }

  function updateGlobalBar() {
    const { total, done } = totalDone();
    const pct = total ? Math.round((done / total) * 100) : 0;
    const pb = document.getElementById(progressBarId);
    if (pb) pb.style.width = pct + "%";
    const pt = document.getElementById(progressTextId);
    if (pt) pt.textContent = `${done} / ${total} (${pct}%)`;
  }

  function updateCategoryBar(cat) {
    const items = cat.items;
    const done = items.filter(i => state[i.id]).length;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    const bar = document.querySelector(`#cat-${cat.id} .bar > span`);
    const txt = document.querySelector(`#cat-${cat.id} .progress`);
    if (bar) bar.style.width = pct + "%";
    if (txt) txt.textContent = `${done} / ${items.length}`;
  }

  target.innerHTML = window.CHECKLIST.categories.map(cat => `
    <section class="cat" id="cat-${cat.id}">
      <div class="cat-head">
        <h2>${cat.title}</h2>
        <span class="progress">0 / ${cat.items.length}</span>
      </div>
      <p class="cat-note">${cat.note}</p>
      <div class="bar"><span style="width:0%"></span></div>
      <ul>
        ${cat.items.map(it => `
          <li data-id="${it.id}" class="${state[it.id] ? "done" : ""}">
            <input type="checkbox" ${state[it.id] ? "checked" : ""} />
            <span class="lbl">${it.label}</span>
          </li>
        `).join("")}
      </ul>
    </section>
  `).join("");

  // wire up clicks
  target.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", e => {
      const id = li.dataset.id;
      const checkbox = li.querySelector("input[type=checkbox]");
      // toggle (if click is on checkbox, browser already toggled — don't double)
      if (e.target.tagName !== "INPUT") checkbox.checked = !checkbox.checked;
      state[id] = checkbox.checked;
      saveChecklistState(state);
      li.classList.toggle("done", checkbox.checked);
      const cat = window.CHECKLIST.categories.find(c => c.items.some(i => i.id === id));
      if (cat) updateCategoryBar(cat);
      updateGlobalBar();
    });
  });

  window.CHECKLIST.categories.forEach(updateCategoryBar);
  updateGlobalBar();

  const reset = document.getElementById("reset-checklist");
  if (reset) reset.addEventListener("click", () => {
    if (confirm("Clear all checklist progress on this device?")) {
      localStorage.removeItem(LS_KEY);
      location.reload();
    }
  });
}

// ---------------- Today / next-day pulse for index ----------------
function renderToday(targetId) {
  const target = document.getElementById(targetId);
  if (!target || !window.ITINERARY) return;
  const today = new Date().toISOString().slice(0, 10);
  const idx = window.ITINERARY.findIndex(d => d.date >= today);
  if (idx === -1) {
    target.innerHTML = `<p class="muted">Trip complete. Welcome home.</p>`;
    return;
  }
  const day = window.ITINERARY[idx];
  const isFuture = day.date > today;
  const days = Math.max(0, Math.round((new Date(day.date) - new Date(today)) / 86400000));
  target.innerHTML = `
    <span class="pill">${isFuture ? `T-${days} day${days===1?"":"s"}` : "Today"}</span>
    <h2 style="margin-top:8px">Day ${day.day}: ${day.leg}</h2>
    <p>${day.note}</p>
    <div class="stats-mini muted" style="font-size:13px">
      ${day.weekday} ${day.date}
      <span style="margin-left:14px">·</span>
      <span style="margin-left:14px">${day.km ? day.km + " km" : "no drive"}</span>
      <span style="margin-left:14px">·</span>
      <span style="margin-left:14px">halt: ${day.halt}</span>
    </div>
  `;
}
