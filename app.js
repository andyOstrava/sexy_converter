const themes = {
  light: "#8f006f",
  dark: "#30102d",
  crazy: "#30002d"
};

const themeSelect = document.querySelector("#theme-select");

function applyTheme(theme, persist = true) {
  const selectedTheme = Object.hasOwn(themes, theme) ? theme : "light";
  document.documentElement.dataset.theme = selectedTheme;
  document.querySelector('meta[name="theme-color"]').content = themes[selectedTheme];
  if (persist) {
    localStorage.setItem("theme", selectedTheme);
  }
  if (themeSelect) {
    themeSelect.value = selectedTheme;
  }
}

applyTheme(localStorage.getItem("theme") || "light");
themeSelect?.addEventListener("change", () => applyTheme(themeSelect.value));

window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    applyTheme(event.newValue || "light", false);
  }
});

const seInput = document.querySelector("#se-value");
const gbpInput = document.querySelector("#gbp-value");

if (seInput && gbpInput) {
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
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
