# Standalone funnel pages

These are static pages in `public/funnels/`. Vite copies them unchanged into
`dist/funnels/`; GitHub Pages serves them separately from the React portfolio.
Portfolio links use explicit `index.html` URLs, which work in both Vite's local
preview and GitHub Pages. Relative assets resolve within each funnel folder.

| Funnel | URL |
| --- | --- |
| Rubio | `/funnels/rubio/` |
| Mountain Hiking | `/funnels/mountain-hiking/` |
| ClearView | `/funnels/clearview/` |
| Legal Intake | `/funnels/legal-intake/` |
| FitCoach | `/funnels/fitcoach/` |
| Haven Animal | `/funnels/haven-animal/` |
| Bright Minds | `/funnels/bright-minds/` |
| Executive Coaching | `/funnels/executive-coaching/` |

Original sibling projects and their separate hosting are not modified. To refresh
the copies, run `node scripts/import-funnels.mjs` while the original folders are
available. This overwrites imported files, so make funnel edits in the originals
first. It does not delete stale assets. Run this importer after the older
`import-concept-builds.mjs` if using that script, because it restores hosted URLs.
Normal CI builds do not require any sibling folders.

Included follow-up pages: Rubio and Mountain Hiking thank-you pages, FitCoach
coaching page, and Bright Minds booking and thank-you pages.

## Existing demo limitations

Designs and behavior were preserved from the supplied sources. FitCoach contains
`STRIPE_PAYMENT_LINK_PLACEHOLDER` links and an image `src="..."`; these need real
values before accepting payments or presenting the page as production-ready.
Some pages use external image/font/script services and demo or unconfigured form
destinations. Moving the files does not validate their lead/payment integrations.
The portfolio's GHL tracker is not injected into these separate documents.
