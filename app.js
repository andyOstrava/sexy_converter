const RATE = 7;
const seInput = document.querySelector("#se-value");
const gbpInput = document.querySelector("#gbp-value");

function updateGrossValue() {
  if (gbpInput.value === "") {
    seInput.value = "";
    return;
  }

  const value = Number(gbpInput.value);
  seInput.value = Number.isFinite(value) && value >= 0
    ? ((value + 0.2) / 0.9705).toFixed(2)
    : "";
}

function updateNetValue() {
  if (seInput.value === "") {
    gbpInput.value = "";
    return;
  }

  const value = Number(seInput.value);
  gbpInput.value = Number.isFinite(value) && value >= 0
    ? ((value * 0.9705) - 0.2).toFixed(2)
    : "";
}

seInput.addEventListener("input", () => {
  updateNetValue();
});

gbpInput.addEventListener("input", () => {
  updateGrossValue();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
