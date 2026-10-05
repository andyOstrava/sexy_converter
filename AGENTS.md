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

The repository root otherwise contains only those app files and assets. There is no `CONTRIBUTING.md`, other documentation, dependency/build/test/lint configuration, or checked-in GitHub Actions workflow. No CI checks are configured here.

## Bootstrap, run, and validate

No bootstrap or dependency-install step is needed (and there is no `npm install` or equivalent). There is no build or lint command. Do not add dependencies for routine changes.

From the repository root, start the static server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/` in a browser and stop the foreground server with Ctrl-C. This command was verified with Python 3.14.4; Node.js 26.8.2 was used for the optional syntax checks below. The README uses `python -m http.server 8000`, but `python` is not installed in the verified environment; use `python3`. No runtime version manager or environment setup was required. Serving over localhost is preferable to opening the file directly, especially for service-worker behavior.

There is no automated test suite. For JavaScript changes, run:

```bash
node --check app.js && node --check sw.js
python3 -m json.tool manifest.json >/dev/null
```

Both commands pass in the verified environment. Then smoke-test the page in a browser: entering `100` in “Club receives” should show `103.25` for “SE charge”; entering `100` in “SE charge” should show `96.85` received; clearing either input should clear the other. Confirm both inputs remain usable at narrow viewport widths if changing layout. These conversion checks were also run against the input handlers with Node and passed.

The local server was verified to serve the page and its linked app files/assets successfully on port 8000. No build artifacts or temporary repository files are produced, so there is no clean step; avoid deleting user files to simulate a clean environment. No validation command timed out. If port 8000 is occupied, choose another port and use that port in the browser URL.

## Existing caveat

`sw.js` lists `./icon.svg` in its precache, but that file is absent (the available icons are under `images/`). `cache.addAll()` can therefore reject service-worker installation, so do not assume offline/PWA caching works. If changing the precache, ensure every listed path exists and verify install/offline behavior in a browser.

## Working guidance

Prefer small changes to the existing plain web stack. Preserve the current no-build setup unless the requested feature genuinely requires otherwise. There are no repository-specific pre-commit checks beyond the syntax/JSON checks and browser smoke test above. Trust these instructions to avoid repeat exploration; search the repository only when a needed detail is missing here or an instruction proves incorrect.
