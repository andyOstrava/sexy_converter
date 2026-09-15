const RATE = 7;
const seInput = document.querySelector("#se-value");
const gbpInput = document.querySelector("#gbp-value");

function updateValue(source, target, multiplier) {
  if (source.value === "") {
    target.value = "";
    return;
  }

  const value = Number(source.value);
  target.value = Number.isFinite(value) && value >= 0
    ? (value * multiplier).toFixed(2)
    : "";
}

seInput.addEventListener("input", () => {
  updateValue(seInput, gbpInput, 1 / RATE);
});

gbpInput.addEventListener("input", () => {
  updateValue(gbpInput, seInput, RATE);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
