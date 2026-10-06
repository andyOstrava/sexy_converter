# Copilot instructions

## Project at a glance

This repository is a tiny static progressive web app (PWA) for converting between a Sports Engine charge and the amount a swimming club receives after fees. It has no backend. Runtime implementation is vanilla HTML, CSS, and JavaScript, plus a JSON web-app manifest and image assets. Playwright is a development-only dependency for end-to-end tests; there is no runtime framework or generated build output.

The conversion is `received = charge * 0.9705 - 0.20`; the inverse is `charge = (received + 0.20) / 0.9705`. Keep both directions consistent.

## Where to make changes

- `index.html` — page structure, labels, inputs, manifest/style/script links.
- `settings.html` — theme settings page.
- `app.js` — input event handlers and both conversion calculations; registers `sw.js`.
- `styles.css` — responsive layout and visual styling, including light, dark, and crazy theme palettes as custom properties.
- `manifest.json` — installable app metadata and icon declaration.
- `sw.js` — service-worker lifecycle and offline cache list.
- `tests/` and `playwright.config.js` — browser end-to-end tests and runner configuration.
- `images/` — app and conversion icons. Avoid changing binary assets unless needed.
- `README.md` — project purpose, formulas, local usage, and license; `LICENSE` is MIT.

The repository also includes a GitHub Actions Lighthouse CI workflow in `.github/workflows/lighthouse.yml`, configured by `lighthouserc.json`. Playwright end-to-end coverage lives in `tests/app.spec.js` and is configured by `playwright.config.js`; there is no app build system or unit-test/lint configuration.

## Bootstrap, run, and validate

The app itself has no runtime bootstrap or build step. Playwright is used only for end-to-end development/testing; do not add runtime dependencies.

From the repository root, start the static server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/` in a browser and stop the foreground server with Ctrl-C. Use `python3` for Python commands. Serving over localhost is preferable to opening the file directly, especially for service-worker behavior.

The automated CI check runs Lighthouse CI on pushes, pull requests, and manual dispatches. It audits three runs and fails if any Performance, Accessibility, Best Practices, or SEO score is below 90%. To run the same check locally, install Lighthouse CI and run:

```bash
npm install --global @lhci/cli@0.15.1
lhci autorun --config=./lighthouserc.json
```

CI adds audit scores to the Actions job summary and uploads the HTML and JSON reports as the `lighthouse-reports` artifact for 14 days.

Install development dependencies and the Playwright Chromium browser once:

```bash
npm install
npx playwright install chromium
```

Run browser tests with:

```bash
npm run test:e2e
```

The Playwright config starts a local Python static server. Each test uses an isolated browser context so it does not inherit another test's local storage, service worker, or Cache Storage.

For JavaScript changes, run the syntax and manifest checks:

```bash
node --check app.js && node --check sw.js
python3 -m json.tool manifest.json >/dev/null
```

The Playwright suite covers the Settings page, the shared navbar, theme selection and persistence, conversion calculations, and offline navigation using the service-worker app shell. It can supplement manual checks: entering `100` in “Club receives” should show `103.25` for “SE charge”; entering `100` in “SE charge” should show `96.85` received; clearing either input should clear the other.

If port 8000 is occupied, choose another port and use that port in the browser URL and Lighthouse configuration.

If changing the precache in `sw.js`, ensure every listed path exists and run the Playwright offline-navigation test.

## Features and service-worker testing notes

- Both pages share a top navigation bar with the app logo/name on the left and a Settings cog on the right.
- `settings.html` offers Light, Dark, and Crazy themes. Theme palettes are CSS custom properties in `styles.css`, and `app.js` persists the selection in `localStorage` and updates the browser `theme-color`.
- The Crazy theme uses `#FF00FF` as its main page color. To add themes, update the CSS palette, the `themes` map in `app.js`, and the Settings selector.
- The app-shell cache is versioned in `sw.js` (`sexy-converter-v1.4` at the time of this update). Change `CACHE_NAME` when changing the cached app shell; activation removes older named caches.

During manual theme testing, an existing localhost browser profile continued to run a stale cached `app.js` after source changes. The old script assumed converter inputs existed on every page and threw `Cannot read properties of null (reading 'addEventListener')` on `settings.html`, preventing theme initialization. The same browser context also showed stale UI/assets even after attempting service-worker unregister and Cache Storage deletion. Incrementing the service-worker cache version is necessary for app-shell updates, but an already-open tab can remain controlled by an older worker until a navigation/reload and a clean activation. We completed reliable verification on a fresh localhost origin/port (`8001`), where the updated script loaded and theme persistence worked across pages.

When debugging stale local PWA assets, use a fresh Playwright context or a different localhost port/origin. Otherwise unregister the service worker, clear that origin's Cache Storage and browser cache, then close/reload all tabs for that origin. In DevTools, confirm the active worker and cache version before interpreting results. The Playwright suite uses isolated contexts and includes an offline app-shell check to reduce interference from stale state.
 
## Working guidance

Prefer small changes to the existing plain web stack. Preserve the no-build runtime setup unless the requested feature genuinely requires otherwise. Run the Lighthouse CI check for CI-relevant changes; run `npm run test:e2e` and the syntax/manifest checks for relevant changes. Trust these instructions to avoid repeat exploration; search the repository only when a needed detail is missing here or an instruction proves incorrect.
