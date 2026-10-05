const DEFAULTS = { rate: 30, currency: "EUR" };
const rate = document.getElementById("rate");
const currency = document.getElementById("currency");
const saved = document.getElementById("saved");

chrome.storage.sync.get(DEFAULTS).then((v) => {
  rate.value = v.rate;
  currency.value = v.currency;
});

function save() {
  chrome.storage.sync.set({ rate: +rate.value || 0, currency: currency.value });
  saved.textContent = "Saved ✓";
  setTimeout(() => (saved.textContent = ""), 1200);
}

rate.addEventListener("change", save);
currency.addEventListener("change", save);

function step(delta) {
  rate.value = Math.max(0, (+rate.value || 0) + delta);
  save();
}
document.getElementById("inc").addEventListener("click", () => step(1));
document.getElementById("dec").addEventListener("click", () => step(-1));
