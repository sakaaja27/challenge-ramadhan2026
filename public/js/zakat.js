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
  n.toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " gram"
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
