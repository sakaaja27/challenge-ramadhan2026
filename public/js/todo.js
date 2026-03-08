"use strict";

const DATA_DZIKIR = [
  { arabic: "سُبْحَانَ اللّٰهِ", latin: "Subhānallāh", target: "33×" },
  { arabic: "اَلْحَمْدُ لِلّٰهِ", latin: "Alhamdulillāh", target: "33×" },
  { arabic: "اَللّٰهُ أَكْبَرُ", latin: "Allāhu Akbar", target: "33×" },
  { arabic: "أَسْتَغْفِرُ اللّٰهَ", latin: "Astaghfirullāh", target: "100×" },
  {
    arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ",
    latin: "Lā ilāha illallāh",
    target: "100×",
  },
  {
    arabic: "اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    latin: "Allāhumma shalli 'alā Muhammad",
    target: "100×",
  },
];
const LIST_SHALAT = ["subuh", "dzuhur", "ashar", "maghrib", "isya"];

const TODAY_KEY = () => new Date().toISOString().slice(0, 10);
function loadData() {
  try {
    return JSON.parse(localStorage.getItem("ramadhan_todo") || "{}");
  } catch (error) {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem("ramadhan_todo", JSON.stringify(data));
}
function getData(section) {
  const all = loadData();
  return all[section] || {};
}
function setData(section, value) {
  const all = loadData();
  all[section] = value;
  saveData(all);
}

function getHariKe() {
  const START = new Date("2026-03-08");
  const now = new Date();
  const diff = Math.floor((now - START) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(30, diff));
}
function initDate() {
  const d = new Date();
  const opts = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("summaryDate").textContent = d.toLocaleDateString(
    "id-ID",
    opts,
  );
  document.getElementById("hariKe").textContent = getHariKe();
}
function showToast(msg = "✅ Tersimpan!") {
  const t = document.getElementById("saveToast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
function updateSummary() {
  const p1 = updateShalatUI();
  const p2 = updateQuranUI();
  const p3 = updatePuasaUI();
  const p4 = updateDzikirUI();
  const avg = Math.round((p1 + p2 + p3 + p4) / 4);
  document.getElementById("summaryPct").innerHTML = avg + "<span>%</span>";
  document.getElementById("summaryBar").style.width = avg + "%";
  let status = "Mulai catat ibadahmu hari ini 🌙";
  if (avg === 100)
    status = "🌟 Sempurna! Semua ibadah hari ini terpenuhi. MasyaAllah!";
  else if (avg >= 80)
    status = "💪 Sangat bagus! Sedikit lagi menuju hari yang sempurna.";
  else if (avg >= 60) status = "✨ Bagus! Terus tingkatkan ibadahmu.";
  else if (avg >= 40)
    status = "📈 Cukup baik, masih ada ruang untuk lebih baik.";
  else if (avg > 0) status = "🌱 Baru dimulai — semangat terus, insyaAllah! ";
  document.getElementById("summaryStatus").textContent = status;
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
  });
});

// shalat
function updateShalatUI() {
  const data = getData("shalat");
  const today = data[TODAY_KEY()] || {};
  let count = 0;

  LIST_SHALAT.forEach((s) => {
    const cb = document.getElementById(s);
    if (cb) {
      cb.checked = !!today[s];
      if (cb.checked) count++;
    }
  });
  const pct = Math.round((count / 5) * 100);
  document.getElementById("shalatVal").textContent = `${count}/5`;
  document.getElementById("shalatBar").style.width = pct + "%";
  document.getElementById("pctShalat").textContent = pct + "%";
  let status = "Belum optimal — semangat tambah shalatnya! 💪";
  if (pct === 100) status = "MasyaAllah! Shalat lengkap hari ini 🌟";
  else if (pct >= 40) status = "Cukup baik, jaga terus konsistensinya ✨";
  document.getElementById("shalatStatus").textContent = status;

  return pct;
}
function saveShalat() {
  const today = {};
  LIST_SHALAT.forEach((s) => {
    const cb = document.getElementById(s);
    if (cb) today[s] = cb.checked;
  });
  const state = getData("shalat");
  state[TODAY_KEY()] = today;
  setData("shalat", state);
  updateShalatUI();
  updateSummary();
  showToast("✅ Shalat tersimpan!");
}

LIST_SHALAT.forEach((s) => {
  const cb = document.getElementById(s);
  if (cb)
    cb.addEventListener("change", () => {
      updateShalatUI();
      updateSummary();
    });
});

// quran
function updateQuranUI() {
  const state = getData("quran");
  const today = state[TODAY_KEY()] || {};

  const tgt = document.getElementById("quranTarget");
  const read = document.getElementById("quranRead");
  const done = document.getElementById("quranDone");

  if (tgt) tgt.value = today.target || "";
  if (read) read.value = today.read || "";
  if (done) done.checked = !!today.done;

  return calcQuranPct(today);
}

function calcQuranPct(today) {
  const target = parseFloat(today.target) || 0;
  const read = parseFloat(today.read) || 0;

  let pct = 0;
  if (today.done) {
    pct = 100;
  } else if (target > 0) {
    pct = Math.min(100, Math.round((read / target) * 100));
  }

  document.getElementById("quranVal").textContent = pct + "%";
  document.getElementById("quranBar").style.width = pct + "%";
  document.getElementById("pctQuran").textContent = pct + "%";

  let status = "Masukkan target dan halaman yang dibaca.";
  if (today.done) status = "🎉 Target hari ini sudah selesai! Alhamdulillah";
  else if (pct >= 100) status = "✅ Target tercapai!";
  else if (pct >= 50) status = "📖 Hampir selesai, teruskan! (" + pct + "%)";
  else if (pct > 0) status = "📗 Masih bisa ditambah — " + pct + "% tercapai.";
  document.getElementById("quranStatus").textContent = status;

  return pct;
}

function saveQuran() {
  const target = document.getElementById("quranTarget").value;
  const read = document.getElementById("quranRead").value;
  const done = document.getElementById("quranDone").checked;

  const state = getData("quran");
  state[TODAY_KEY()] = { target, read, done };
  setData("quran", state);
  updateQuranUI();
  updateSummary();
  showToast("✅ Bacaan Qur'an tersimpan!");
}
["quranTarget", "quranRead"].forEach((id) => {
  const el = document.getElementById(id);
  if (el)
    el.addEventListener("input", () => {
      const t = document.getElementById("quranTarget").value;
      const r = document.getElementById("quranRead").value;
      calcQuranPct({ target: t, read: r });
      updateSummary();
    });
});

// puasa
function buildCalendar() {
  const cal = document.getElementById("puasaCalendar");
  const state = getData("puasa").days || {};
  const hariKe = getHariKe();
  cal.innerHTML = "";

  for (let d = 1; d <= 30; d++) {
    const el = document.createElement("div");
    el.className = "cal-day";
    el.setAttribute("data-day", d);
    el.setAttribute("aria-label", `Hari ke-${d} Ramadhan`);

    if (state[d]) el.classList.add("puasa-done");
    if (d === hariKe) el.classList.add("today-marker");
    if (d > hariKe) el.classList.add("future");

    if (!el.classList.contains("puasa-done")) {
      el.textContent = d;
    }

    el.addEventListener("click", () => {
      if (d > hariKe) return;
      const s = getData("puasa");
      if (!s.days) s.days = {};
      s.days[d] = !s.days[d];
      setData("puasa", s);
      buildCalendar();
      updatePuasaUI();
      updateSummary();

      // sync today checkbox
      if (d === hariKe) {
        document.getElementById("puasaToday").checked = !!s.days[d];
      }
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
  updatePuasaUI();
  updateSummary();
}

function updatePuasaUI() {
  const state = getData("puasa");
  const days = state.days || {};
  const count = Object.values(days).filter(Boolean).length;
  const pct = Math.round((count / 30) * 100);
  const hariKe = getHariKe();

  document.getElementById("puasaVal").textContent = `${count} / 30 hari`;
  document.getElementById("puasaBar").style.width = pct + "%";
  document.getElementById("pctPuasa").textContent = pct + "%";
  document.getElementById("puasaToday").checked = !!days[hariKe];

  let status = "Klik tanggal untuk menandai hari puasa. 🌙";
  if (pct === 100) status = "🌟 MasyaAllah! Puasa 30 hari penuh!";
  else if (pct >= 80) status = "💪 Hampir selesai! Pertahankan!";
  else if (pct >= 40) status = "📅 Bagus! Terus jaga puasamu.";
  else if (count > 0) status = `✨ ${count} hari tercatat, semangat!`;
  document.getElementById("puasaStatus").textContent = status;

  return pct;
}

function savePuasa() {
  updateSummary();
  showToast("✅ Data puasa tersimpan!");
}
// dzikir
function buildDzikirList() {
  const list = document.getElementById("dzikirList");
  const state = getData("dzikir");
  const today = state[TODAY_KEY()] || {};
  list.innerHTML = "";

  DATA_DZIKIR.forEach((z, i) => {
    const done = !!today[i];
    const item = document.createElement("div");
    item.className = "dzikir-item" + (done ? " done" : "");
    item.innerHTML = `
      <div class="dzikir-left">
        <div>
          <div class="dzikir-arabic">${z.arabic}</div>
          <div class="dzikir-latin">${z.latin}</div>
        </div>
      </div>
      <span class="dzikir-target">${z.target}</span>
      <button class="dzikir-check-btn" aria-label="${done ? "Batal" : "Selesai"}" data-idx="${i}">
        ${done ? "✓" : "○"}
      </button>
    `;
    item.querySelector(".dzikir-check-btn").addEventListener("click", () => {
      const s = getData("dzikir");
      if (!s[TODAY_KEY()]) s[TODAY_KEY()] = {};
      s[TODAY_KEY()][i] = !s[TODAY_KEY()][i];
      setData("dzikir", s);
      buildDzikirList();
      updateDzikirUI();
      updateSummary();
    });
    list.appendChild(item);
  });
}

function updateDzikirUI() {
  const state = getData("dzikir");
  const today = state[TODAY_KEY()] || {};
  const count = Object.values(today).filter(Boolean).length;
  const total = DATA_DZIKIR.length;
  const pct = Math.round((count / total) * 100);

  document.getElementById("dzikirVal").textContent = `${count} / ${total}`;
  document.getElementById("dzikirBar").style.width = pct + "%";
  document.getElementById("pctDzikir").textContent = pct + "%";

  let status = "Mulai berdzikir dan centang yang sudah selesai.";
  if (pct === 100) status = "🎉 MasyaAllah! Semua dzikir selesai!";
  else if (pct >= 60) status = "📿 Hampir semua! Teruskan dzikirmu.";
  else if (count > 0) status = `✨ ${count} dzikir selesai, tambah lagi!`;
  document.getElementById("dzikirStatus").textContent = status;

  return pct;
}

function saveDzikir() {
  updateSummary();
  showToast("✅ Dzikir tersimpan!");
}

initDate();
buildCalendar();
buildDzikirList();
updateSummary();
