# Copilot instructions

## Project at a glance

This repository is a tiny, dependency-free static progressive web app (PWA) for converting between a Sports Engine charge and the amount a swimming club receives after fees. It has no backend. The implementation is vanilla HTML, CSS, and JavaScript, plus a JSON web-app manifest and image assets; there is no framework, compiler, package manager manifest, or generated build output.

The conversion is `received = charge * 0.9705 - 0.20`; the inverse is `charge = (received + 0.20) / 0.9705`. Keep both directions consistent.

## Where to make changes

- `index.html` — page structure, labels, inputs, manifest/style/script links.
- `app.js` — input event handlers and both conversion calculations; registers `sw.js`.
- `styles.css` — responsive layout and visual styling.
- `manifest.json` — installable app metadata and icon declaration.
- `sw.js` — service-worker lifecycle and offline cache list.
- `images/` — app and conversion icons. Avoid changing binary assets unless needed.
- `README.md` — project purpose, formulas, local usage, and license; `LICENSE` is MIT.

The repository also includes a GitHub Actions Lighthouse CI workflow in `.github/workflows/lighthouse.yml`, configured by `lighthouserc.json`. There is no `CONTRIBUTING.md`, package manifest, build system, or unit-test/lint configuration.

## Bootstrap, run, and validate

The app itself has no bootstrap or dependency-install step, build command, or lint command. Do not add dependencies for routine changes. CI installs Lighthouse CI globally as part of its workflow.

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

There is no unit-test suite. For JavaScript changes, run the optional syntax and manifest checks:

```bash
node --check app.js && node --check sw.js
python3 -m json.tool manifest.json >/dev/null
```

Then smoke-test the page in a browser: entering `100` in “Club receives” should show `103.25` for “SE charge”; entering `100` in “SE charge” should show `96.85` received; clearing either input should clear the other. Confirm both inputs remain usable at narrow viewport widths if changing layout.

If port 8000 is occupied, choose another port and use that port in the browser URL and Lighthouse configuration.

## Existing caveat

`sw.js` lists `./icon.svg` in its precache, but that file is absent (the available icons are under `images/`). `cache.addAll()` can therefore reject service-worker installation, so do not assume offline/PWA caching works. If changing the precache, ensure every listed path exists and verify install/offline behavior in a browser.

## Working guidance

Prefer small changes to the existing plain web stack. Preserve the current no-build setup unless the requested feature genuinely requires otherwise. Run the Lighthouse CI check for CI-relevant changes; use the syntax/manifest checks and browser smoke test above as appropriate. Trust these instructions to avoid repeat exploration; search the repository only when a needed detail is missing here or an instruction proves incorrect.
