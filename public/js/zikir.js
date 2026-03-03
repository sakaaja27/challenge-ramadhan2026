const ZIKIRDATA = [
  {
    arabic: "سُبْحَانَ اللّٰهِ",
    latin: "Subhānallāh",
    meaning: "Maha Suci Allah",
  },
  {
    arabic: "اَلْحَمْدُ لِلّٰهِ",
    latin: "Alhamdulillāh",
    meaning: "Segala puji bagi Allah",
  },
  {
    arabic: "اَللّٰهُ أَكْبَرُ",
    latin: "Allāhu Akbar",
    meaning: "Allah Maha Besar",
  },
  {
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
    latin: "Astaghfirullāh",
    meaning: "Aku memohon ampun kepada Allah",
  },
  {
    arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ",
    latin: "Lā ilāha illallāh",
    meaning: "Tiada Tuhan selain Allah",
  },
];

// state
let count = 0;
let target = 100;
let zikirIdx = 0;
let notified = false;
let history = [];

const CIRCUMFERENCE = 2 * Math.PI * 105;

// dom elements
const counterNum = document.getElementById("counterNumber");
const ringProgress = document.getElementById("ringProgress");
const targetDisplay = document.getElementById("targetDisplay");
const notifBadge = document.getElementById("notifBadge");
const btnTap = document.getElementById("btnTap");
const btnReset = document.getElementById("btnReset");
const historyList = document.getElementById("historyList");
const zikirArabic = document.getElementById("zikirArabic");
const zikirLatin = document.getElementById("zikirLatin");
const zikirMeaning = document.getElementById("zikirMeaning");
const counterRing = document.getElementById("counterRingWrap");

// helper
function updateRing() {
  const pct = Math.min(count / target, 1);
  const offset = CIRCUMFERENCE * (1 - pct);
  ringProgress.style.strokeDashoffset = offset;
  ringProgress.style.strokeDasharray = CIRCUMFERENCE;
  counterRing.setAttribute("aria-valuenow", count);
  counterRing.setAttribute("aria-valuemax", target);
  if (pct >= 1) {
    ringProgress.classList.add("complete");
  } else {
    ringProgress.classList.remove("complete");
  }
}
function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML =
      '<li class="empty-history">Belum ada riwayat. Mulai berdzikir!</li>';
    return;
  }
  historyList.innerHTML = history
    .map(
      (h) => `
          <li class="history-item">
            <span class="h-name">${h.name}</span>
            <span class="h-count">${h.count}×</span>
            <span class="h-time">${h.time}</span>
          </li>
        `,
    )
    .join("");
}

function setZikir(idx) {
  zikirIdx = idx;
  const z = ZIKIRDATA[idx];
  zikirArabic.textContent = z.arabic;
  zikirLatin.textContent = z.latin;
  zikirMeaning.textContent = z.meaning;
  document.querySelectorAll(".zikir-pill").forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });
}

function saveHistory() {
  if (count === 0) return;
  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  history.unshift({
    name: ZIKIRDATA[zikirIdx].latin,
    count: count,
    time: time,
  });
  if (history.length > 8) history.pop();
  renderHistory();
}

// tap handler
btnTap.addEventListener("click", () => {
  count++;
  counterNum.textContent = count;
  counterNum.classList.remove("bump");
  void counterNum.offsetWidth;
  counterNum.classList.add("bump");
  setTimeout(() => counterNum.classList.remove("bump"), 150);
  btnTap.classList.remove("pressed");
  void btnTap.offsetWidth;
  btnTap.classList.add("pressed");
  updateRing();

  if (count === target && !notified) {
    notified = true;
    notifBadge.classList.add("show");
    setTimeout(() => notifBadge.classList.remove("show"), 5000);
  }
});

// btn reset
btnReset.addEventListener("click", () => {
  if (count === 0) return;
  saveHistory();
  count = 0;
  notified = false;
  counterNum.textContent = 0;
  notifBadge.classList.remove("show");
  updateRing();
});

// target button
document.querySelectorAll(".target-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    target = parseInt(btn.dataset.target);
    notified = false;
    notifBadge.classList.remove("show");
    targetDisplay.textContent = "/ " + target;
    document
      .querySelectorAll(".target-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updateRing();
  });
});

// zikir pills
document.querySelectorAll(".zikir-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    if (count > 0) saveHistory();
    count = 0;
    notified = false;
    notifBadge.classList.remove("show");
    counterNum.textContent = 0;
    setZikir(parseInt(pill.dataset.idx));
    updateRing();
  });
});

// keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault();
    btnTap.click();
  }
  if (e.code === "KeyR") btnReset.click();
});
updateRing();
renderHistory();
