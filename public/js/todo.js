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
