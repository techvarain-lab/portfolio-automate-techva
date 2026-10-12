# GitHub Pages

Portfolio URL: https://techvarain-lab.github.io/portfolio-automate-techva/

In the repository's Settings → Pages, choose **GitHub Actions** as the source.
Pushing to `main` runs `.github/workflows/pages.yml`, builds the site, and deploys it.
No custom domain is configured; the existing portfolio domain is unchanged.

Local development: `npm ci`, then `npm run dev`.
Production check in PowerShell:

```powershell
$env:PAGES_BASE = '/portfolio-automate-techva/'
npm run build
Remove-Item Env:PAGES_BASE
```

The router and public asset paths use this base. The deployed `404.html` renders
the app for direct work-detail links (GitHub Pages returns HTTP 404 for these
client-side routes, but the app still opens the requested detail).

Keep the original template's LICENSE and copyright notice. The deployment
includes a copy at `LICENSE.txt`.
