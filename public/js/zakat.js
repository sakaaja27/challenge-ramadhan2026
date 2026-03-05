"use strict";
let jenisZakat = "penghasilan";
const jenisBtns = document.querySelectorAll(".jenis-btn");
const formPenghasilan = document.getElementById("formPenghasilan");
const formEmas = document.getElementById("formEmas");
const inpGaji = document.getElementById("gaji");
const inpPendapatan = document.getElementById("pendapatanLain");
const inpJumlahEmas = document.getElementById("jumlahEmas");
const inpHargaEmas = document.getElementById("hargaEmas");
const btnHitung = document.getElementById("btnHitung");
const errorMsg = document.getElementById("errorMsg");
const resultCard = document.getElementById("resultCard");
const resultSubtitle = document.getElementById("resultSubtitle");
const resultIcon = document.getElementById("resultIcon");
const rTotal = document.getElementById("rTotal");
const rNisab = document.getElementById("rNisab");
const rStatus = document.getElementById("rStatus");
const rZakat = document.getElementById("rZakat");
const zakatRow = document.getElementById("zakatRow");
const formulaList = document.getElementById("formulaList");

const fmt = (n) =>
  "Rp " + Math.round(n).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const fmtGram = (n) =>
  n.toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " gram";
function showError(msg) {
  errorMsg.textContent = msg || "⚠️ Mohon isi semua kolom yang diperlukan.";
  errorMsg.classList.remove("hidden");
}
function hideError() {
  errorMsg.classList.add("hidden");
}
jenisBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    jenisZakat = btn.dataset.jenis;

    jenisBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    if (jenisZakat === "penghasilan") {
      formPenghasilan.classList.remove("hidden");
      formEmas.classList.add("hidden");
    } else {
      formEmas.classList.remove("hidden");
      formPenghasilan.classList.add("hidden");
    }
    resultCard.classList.add("hidden");
    hideError();
  });
});

btnHitung.addEventListener("click", () => {
  hideError();

  const hargaEmas = parseFloat(inpHargaEmas.value);
  if (!hargaEmas || hargaEmas <= 0) {
    showError("⚠️ Masukkan harga emas per gram yang valid.");
    return;
  }

  const nisab = hargaEmas * 85;

  let total = 0;
  const steps = [];

  if (jenisZakat === "penghasilan") {
    const gaji = parseFloat(inpGaji.value) || 0;
    const lain = parseFloat(inpPendapatan.value) || 0;

    if (gaji <= 0 && lain <= 0) {
      showError("⚠️ Masukkan minimal satu sumber penghasilan.");
      return;
    }

    total = gaji + lain;

    if (gaji > 0) steps.push(`Gaji bulanan: ${fmt(gaji)}`);
    if (lain > 0) steps.push(`Penghasilan lain: ${fmt(lain)}`);
    steps.push(
      `Total penghasilan: ${fmt(gaji)} + ${fmt(lain)} = ${fmt(total)}`,
    );
    steps.push(`Nisab: ${fmt(hargaEmas)} × 85 gram = ${fmt(nisab)}`);

    resultSubtitle.textContent = "Zakat Penghasilan";
    resultIcon.textContent = "💼";
  } else {
    const jumlahEmas = parseFloat(inpJumlahEmas.value);

    if (!jumlahEmas || jumlahEmas <= 0) {
      showError("⚠️ Masukkan jumlah emas yang valid (dalam gram).");
      return;
    }

    total = jumlahEmas * hargaEmas;

    steps.push(`Jumlah emas: ${fmtGram(jumlahEmas)}`);
    steps.push(
      `Nilai emas: ${fmtGram(jumlahEmas)} × ${fmt(hargaEmas)} = ${fmt(total)}`,
    );
    steps.push(`Nisab: ${fmt(hargaEmas)} × 85 gram = ${fmt(nisab)}`);

    resultSubtitle.textContent = "Zakat Emas";
    resultIcon.textContent = "🥇";
  }
  const wajib = total >= nisab;
  const zakat = wajib ? total * 0.025 : 0;

  steps.push(
    wajib
      ? `${fmt(total)} ≥ ${fmt(nisab)} → WAJIB ZAKAT`
      : `${fmt(total)} < ${fmt(nisab)} → Belum wajib zakat`,
  );

  if (wajib) {
    steps.push(`Zakat = 2,5% × ${fmt(total)} = ${fmt(zakat)}`);
  }
  rTotal.textContent = fmt(total);
  rNisab.textContent = fmt(nisab);

  rStatus.textContent = wajib ? "✅ Wajib Zakat" : "❌ Belum Wajib";
  rStatus.className = "status-badge " + (wajib ? "wajib" : "tidak");

  if (wajib) {
    rZakat.textContent = fmt(zakat);
    zakatRow.style.display = "";
  } else {
    rZakat.textContent = "Rp 0";
    zakatRow.style.display = "";
  }

  formulaList.innerHTML = steps.map((s) => `<li>${s}</li>`).join("");
  resultCard.classList.remove("hidden");
  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
});
[inpGaji, inpPendapatan, inpHargaEmas, inpJumlahEmas].forEach((inp) => {
  if (!inp) return;
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnHitung.click();
  });
});
