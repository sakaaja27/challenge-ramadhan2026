"use strict";

const DATA_DZIKIR = [
  { arabic: "سُبْحَانَ اللّٰهِ", latin: "Subhānallāh", target: "33×" },
  { arabic: "اَلْحَمْدُ لِلّٰهِ", latin: "Alhamdulillāh", target: "33×" },
  { arabic: "اَللّٰهُ أَكْبَرُ", latin: "Allāhu Akbar", target: "33×" },
  { arabic: "أَسْتَغْفِرُ اللّٰهَ", latin: "Astaghfirullāh", target: "100×" },
  { arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", latin: "Lā ilāha illallāh", target: "100×" },
  { arabic: "اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ", latin: "Allāhumma shalli 'alā Muhammad", target: "100×" },
];
const LIST_SHALAT = ["subuh", "dzuhur", "ashar", "maghrib", "isya"];
const TODAY_KEY = () => new Date().toISOString().slice(0, 10);
function loadData() {
  try { return JSON.parse(localStorage.getItem("ramadhan_todo") || "{}"); }
  catch (e) { return {}; }
}
function saveData(data) { localStorage.setItem("ramadhan_todo", JSON.stringify(data)); }
function getData(section) { return loadData()[section] || {}; }
function setData(section, value) {
  const all = loadData();
  all[section] = value;
  saveData(all);
}

function getHariKe() {
  const START = new Date("2026-03-08");
  const diff = Math.floor((new Date() - START) / 86400000) + 1;
  return Math.max(1, Math.min(30, diff));
}
function initDate() {
  const d = new Date();
  document.getElementById("summaryDate").textContent = d.toLocaleDateString("id-ID", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  document.getElementById("hariKe").textContent = getHariKe();
}
function showToast(msg) {
  const t = document.getElementById("saveToast");
  t.textContent = msg || "Tersimpan!";
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function updateSummary() {
  const p1 = calcShalatPct();
  const p2 = calcQuranPct();
  const p3 = calcPuasaPct();
  const p4 = calcDzikirPct();
  const avg = Math.round((p1 + p2 + p3 + p4) / 4);
  document.getElementById("summaryPct").innerHTML = avg + "<span>%</span>";
  document.getElementById("summaryBar").style.width = avg + "%";
  let s = "Mulai catat ibadahmu hari ini";
  if (avg === 100) s = "Sempurna! Semua ibadah hari ini terpenuhi. MasyaAllah!";
  else if (avg >= 80) s = "Sangat bagus! Sedikit lagi menuju hari yang sempurna.";
  else if (avg >= 60) s = "Bagus! Terus tingkatkan ibadahmu.";
  else if (avg >= 40) s = "Cukup baik, masih ada ruang untuk lebih baik.";
  else if (avg > 0) s = "Baru dimulai — semangat terus, insyaAllah!";
  document.getElementById("summaryStatus").textContent = s;
}
function calcShalatPct() {
  const today = (getData("shalat")[TODAY_KEY()] || {});
  return Math.round(LIST_SHALAT.filter(s => !!today[s]).length / 5 * 100);
}
function calcQuranPct() {
  const today = getData("quran")[TODAY_KEY()] || {};
  if (today.done) return 100;
  const t = parseFloat(today.target) || 0;
  const r = parseFloat(today.read) || 0;
  return t > 0 ? Math.min(100, Math.round(r / t * 100)) : 0;
}
function calcPuasaPct() {
  const days = getData("puasa").days || {};
  return Math.round(Object.values(days).filter(Boolean).length / 30 * 100);
}
function calcDzikirPct() {
  const today = getData("dzikir")[TODAY_KEY()] || {};
  return Math.round(Object.values(today).filter(Boolean).length / DATA_DZIKIR.length * 100);
}

//nav
function initTabNav() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected","true");
      document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
    });
  });
}

// sholat
function renderShalatProgress(count) {
  const pct = Math.round(count / 5 * 100);
  document.getElementById("shalatVal").textContent = count + "/5";
  document.getElementById("shalatBar").style.width = pct + "%";
  document.getElementById("pctShalat").textContent = pct + "%";
  let st = "Belum optimal — semangat tambah shalatnya!";
  if (pct === 100) st = "MasyaAllah! Shalat lengkap hari ini";
  else if (pct >= 40) st = "Cukup baik, jaga terus konsistensinya";
  document.getElementById("shalatStatus").textContent = st;
}
function updateShalatUI() {
  const today = getData("shalat")[TODAY_KEY()] || {};
  let count = 0;
  LIST_SHALAT.forEach(s => {
    const cb = document.getElementById(s);
    const lbl = cb ? cb.closest(".shalat-label") : null;
    if (cb) { cb.checked = !!today[s]; if (cb.checked) count++; if (lbl) lbl.classList.toggle("checked", cb.checked); }
  });
  renderShalatProgress(count);
}
function initShalatListeners() {
  LIST_SHALAT.forEach(s => {
    const cb = document.getElementById(s);
    if (cb) {
      cb.addEventListener("change", () => {
        const lbl = cb.closest(".shalat-label");
        if (lbl) lbl.classList.toggle("checked", cb.checked);
        // Hanya update UI — tidak simpan
        const count = LIST_SHALAT.filter(id => { const el = document.getElementById(id); return el && el.checked; }).length;
        renderShalatProgress(count);
      });
    }
  });
}
function saveShalat() {
  const today = {};
  LIST_SHALAT.forEach(s => { const cb = document.getElementById(s); if (cb) today[s] = cb.checked; });
  const state = getData("shalat");
  state[TODAY_KEY()] = today;
  setData("shalat", state);
  updateSummary();
  showToast("Shalat tersimpan!");
}

//quran
function renderQuranProgress(target, read, done) {
  const t = parseFloat(target) || 0;
  const r = parseFloat(read) || 0;
  let pct = 0;
  if (done) pct = 100;
  else if (t > 0) pct = Math.min(100, Math.round(r / t * 100));
  document.getElementById("quranVal").textContent = pct + "%";
  document.getElementById("quranBar").style.width = pct + "%";
  document.getElementById("pctQuran").textContent = pct + "%";
  let st = "Masukkan target dan halaman yang dibaca.";
  if (done) st = "Target hari ini sudah selesai! Alhamdulillah";
  else if (pct >= 100) st = "Target tercapai!";
  else if (pct >= 50) st = "Hampir selesai, teruskan! (" + pct + "%)";
  else if (pct > 0) st = "Masih bisa ditambah — " + pct + "% tercapai.";
  document.getElementById("quranStatus").textContent = st;
}
function updateQuranUI() {
  const today = getData("quran")[TODAY_KEY()] || {};
  const tgt = document.getElementById("quranTarget");
  const read = document.getElementById("quranRead");
  const done = document.getElementById("quranDone");
  if (tgt) tgt.value = today.target || "";
  if (read) read.value = today.read || "";
  if (done) done.checked = !!today.done;
  renderQuranProgress(today.target || "", today.read || "", !!today.done);
}
function initQuranListeners() {
  const tgtEl  = document.getElementById("quranTarget");
  const readEl = document.getElementById("quranRead");
  const doneEl = document.getElementById("quranDone");
  function onInputChange() {
    renderQuranProgress(
      tgtEl  ? tgtEl.value  : "",
      readEl ? readEl.value : "",
      doneEl ? doneEl.checked : false
    );
  }
  if (tgtEl)  tgtEl.addEventListener("input",  onInputChange);
  if (readEl) readEl.addEventListener("input",  onInputChange);
  if (doneEl) doneEl.addEventListener("change", onInputChange);
}
function saveQuran() {
  const target = document.getElementById("quranTarget").value;
  const read   = document.getElementById("quranRead").value;
  const done   = document.getElementById("quranDone").checked;
  const state  = getData("quran");
  state[TODAY_KEY()] = { target, read, done };
  setData("quran", state);
  updateSummary();
  showToast("Bacaan Qur'an tersimpan!");
}

//puasa
function renderPuasaProgress() {
  const days = getData("puasa").days || {};
  const count = Object.values(days).filter(Boolean).length;
  const pct   = Math.round(count / 30 * 100);
  const hariKe = getHariKe();
  document.getElementById("puasaVal").textContent = count + " / 30 hari";
  document.getElementById("puasaBar").style.width  = pct + "%";
  document.getElementById("pctPuasa").textContent  = pct + "%";
  document.getElementById("puasaToday").checked    = !!days[hariKe];
  let st = "Klik tanggal untuk menandai hari puasa.";
  if (pct === 100) st = "MasyaAllah! Puasa 30 hari penuh!";
  else if (pct >= 80) st = "Hampir selesai! Pertahankan!";
  else if (pct >= 40) st = "Bagus! Terus jaga puasamu.";
  else if (count > 0) st = count + " hari tercatat, semangat!";
  document.getElementById("puasaStatus").textContent = st;
}
function buildCalendar() {
  const cal    = document.getElementById("puasaCalendar");
  const days   = getData("puasa").days || {};
  const hariKe = getHariKe();
  cal.innerHTML = "";
  for (let d = 1; d <= 30; d++) {
    const el = document.createElement("div");
    el.className = "cal-day";
    el.setAttribute("data-day", d);
    el.setAttribute("aria-label", "Hari ke-" + d + " Ramadhan");
    if (days[d])    el.classList.add("puasa-done");
    if (d === hariKe) el.classList.add("today-marker");
    if (d > hariKe) el.classList.add("future");
    if (!days[d])   el.textContent = d;
    el.addEventListener("click", () => {
      if (d > hariKe) return;
      const s = getData("puasa");
      if (!s.days) s.days = {};
      s.days[d] = !s.days[d];
      setData("puasa", s);
      buildCalendar();
      renderPuasaProgress();
    });
    cal.appendChild(el);
  }
}
function toggleToday(cb) {
  const hariKe = getHariKe();
  const s = getData("puasa");
  if (!s.days) s.days = {};
  s.days[hariKe] = cb.checked;
  setData("puasa", s);
  buildCalendar();
  renderPuasaProgress();
}
function savePuasa() {
  updateSummary();
  showToast("Data puasa tersimpan!");
}

// dzikier
function renderDzikirProgress() {
  const today = getData("dzikir")[TODAY_KEY()] || {};
  const count = Object.values(today).filter(Boolean).length;
  const total = DATA_DZIKIR.length;
  const pct   = Math.round(count / total * 100);
  document.getElementById("dzikirVal").textContent = count + " / " + total;
  document.getElementById("dzikirBar").style.width  = pct + "%";
  document.getElementById("pctDzikir").textContent  = pct + "%";
  let st = "Mulai berdzikir dan centang yang sudah selesai.";
  if (pct === 100) st = "MasyaAllah! Semua dzikir selesai!";
  else if (pct >= 60) st = "Hampir semua! Teruskan dzikirmu.";
  else if (count > 0) st = count + " dzikir selesai, tambah lagi!";
  document.getElementById("dzikirStatus").textContent = st;
}
function buildDzikirList() {
  const list  = document.getElementById("dzikirList");
  const today = getData("dzikir")[TODAY_KEY()] || {};
  list.innerHTML = "";
  DATA_DZIKIR.forEach((z, i) => {
    const done = !!today[i];
    const item = document.createElement("div");
    item.className = "dzikir-item" + (done ? " done" : "");
    item.innerHTML =
      '<div class="dzikir-left"><div>' +
        '<div class="dzikir-arabic">' + z.arabic + '</div>' +
        '<div class="dzikir-latin">'  + z.latin  + '</div>' +
      '</div></div>' +
      '<span class="dzikir-target">' + z.target + '</span>' +
      '<button class="dzikir-check-btn" aria-label="' + (done ? "Batal" : "Selesai") + '" data-idx="' + i + '">' +
        (done ? "✓" : "○") +
      '</button>';
    item.querySelector(".dzikir-check-btn").addEventListener("click", () => {
      const s = getData("dzikir");
      if (!s[TODAY_KEY()]) s[TODAY_KEY()] = {};
      s[TODAY_KEY()][i] = !s[TODAY_KEY()][i];
      setData("dzikir", s);
      buildDzikirList();
      renderDzikirProgress();
    });
    list.appendChild(item);
  });
}
function saveDzikir() {
  updateSummary();
  showToast("Dzikir tersimpan!");
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTabNav();
  initDate();
  updateShalatUI();
  initShalatListeners();
  updateQuranUI();
  initQuranListeners();
  buildCalendar();
  renderPuasaProgress();
  buildDzikirList();
  renderDzikirProgress();
  updateSummary();
});