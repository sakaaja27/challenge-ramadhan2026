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
const LIST_SHALAT = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

const TODAY_KEY = () => new Date().toISOString().slice(0, 10);
function loadData() {
    try {
        return JSON.parse(localStorage.getItem("ramadhan_todo") || "{}")
    } catch (error) {
        return {};
    }
}

function saveData(data) {
    localStorage.setItem("ramadhan_todo", JSON.stringify(data))
}
function getData(section) {
    const all = loadData()
    return all[section] || {}
}
function setData(section, value) {
    const all = loadData()
    all[section] = value
    saveData(all)
}