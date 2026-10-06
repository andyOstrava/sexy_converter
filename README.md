# Sports Engine x:y converter

This personal project is a somewhat tongue-in-cheek progressive web app built to achieve real-world aims and also to explore the use of AI agents in software development.

## Main features

The app itself is intended to solve a real-world problem for a local swimming club: calculating how much the club will receive from a payment after third-party (**S**ports **E**ngine) processing fees are deducted.

The calculation used is based on the current fee model:

- Net club amount = (gross amount x 0.9705) - 0.20
- Equivalent gross amount = (net amount + 0.20) / 0.9705

This lets members and volunteers quickly estimate how much money the club will actually receive from a given payment.

## Progressive Web App

This project is designed as a lightweight Progressive Web App (PWA), so it can be installed on supported devices and behave like an app rather than a simple website.

Features include:

- fast, lightweight static front-end
- converter and settings pages with shared navigation
- light, dark, and crazy colour themes selectable in Settings
- theme choice is saved in the browser and shared between pages
- mobile-friendly layout
- service worker support for offline-capable behaviour
- simple browser-based interaction with no backend required

Themes are defined with CSS custom properties in `styles.css`. To add a theme,
add a `[data-theme="name"]` palette there, add its browser theme colour to the
`themes` object in `app.js`, and add an option to the theme selector in
`settings.html`.

## Local usage

Because this is a static app, you can open the project directly in a browser or serve it locally with any simple static file server.

Example using Python 3:

```bash
cd /path/to/sexy_converter
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Browser tests

Playwright end-to-end tests cover the Settings page, shared navigation, theme
selection and persistence, converter calculations, and offline navigation.
Install the test dependency and Chromium browser once:

```bash
npm install
npx playwright install chromium
```

Run the suite with:

```bash
npm run test:e2e
```

The Playwright config starts a local Python server on port 4173. Each test uses
an isolated browser context to avoid inheriting stale service-worker or cache
state from manual testing.

## Lighthouse CI

GitHub Actions runs a Lighthouse audit for pushes, pull requests, and manual
dispatches. It audits three runs and fails if any Performance, Accessibility,
Best Practices, or SEO score is below 90%. The Actions run summary displays the
scores, and the `lighthouse-reports` artifact contains the full HTML and JSON
reports for 14 days.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for  details.
