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
- mobile-friendly layout
- service worker support for offline-capable behaviour
- simple browser-based interaction with no backend required

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

## Lighthouse CI

GitHub Actions runs a Lighthouse audit for pushes, pull requests, and manual
dispatches. It audits three runs and fails if any Performance, Accessibility,
Best Practices, or SEO score is below 90%. The Actions run summary displays the
scores, and the `lighthouse-reports` artifact contains the full HTML and JSON
reports for 14 days.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for  details.
