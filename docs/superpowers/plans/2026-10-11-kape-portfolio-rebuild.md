# Kape Portfolio Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the `portfoliov2-template` to a 20-file portfolio carrying Rainier Dimasacat's real content, the template's motion architecture untouched, and a fully re-audited orange/warm-paper/cool-black palette.

**Architecture:** Keep the motion spine (`gsap.ts`, `smooth-scroll.ts`, `use-scroll-scene.ts`) byte-identical — the "law" that makes the template feel connected. Delete ~70 files, rewrite `tokens.css` as the single source of palette truth, and wire exactly two Home sections (Hero, Builds). The Builds bento keeps URL-as-state: each chapter opens as a draggable sheet at `/work/<chapter>`.

**Tech Stack:** Vite 8, React 19, TypeScript strict, React Router 8, Tailwind v4 + CSS custom properties, GSAP 3 + ScrollTrigger, Lenis, Phosphor icons, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-11-kape-portfolio-rebuild-design.md`

---

## Global Constraints

Every task's requirements implicitly include this section.

1. **The motion spine is immutable.** `src/lib/motion/gsap.ts`, `src/lib/motion/smooth-scroll.ts`, `src/hooks/use-scroll-scene.ts`, `src/hooks/use-media-query.ts`, `src/hooks/use-local-time.ts`, `src/features/home/work/use-sheet.ts` get **zero edits**. Task 10 verifies this with `git diff`. Do not "improve" a spring, re-solve an easing, or add a bounce.
2. **One accent, everything derived.** No second hue anywhere. Any new colour is defined once in `tokens.css` and referenced as `var(--token)`. Never a raw hex in a component or feature CSS file.
3. **Contrast floor.** Every text-on-background pair clears **4.5:1** body / **3:1** large, in **both** themes. Values are fixed in `tokens.css` and locked by `check:contrast`.
4. **Copy is typed data.** All text lives in `src/content/*.ts`. No user-visible string in a `.tsx` component.
5. **Real facts only.** Any build detail not confirmed by the source assets stays out; never estimate a metric or invent a testimonial.
6. **Node 20.19+ / 22.12+.** Playwright's bundled Chromium **is not downloadable in this environment** (verified — download fails). All Playwright scripts MUST launch with `executablePath` from `process.env.CHROME_PATH`, falling back to the bundled path when unset. The working binary is `C:\Users\raini\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe`.
7. **`npm run dev` must be running** for any Playwright check. Start it backgrounded with `Start-Process npm.cmd -ArgumentList "run","dev"`.
8. **No ScrollTrigger pinning.** Pinned layouts use CSS `position: sticky`. Never add `pin: true`.
9. **Never `backdrop-filter` over an animated canvas.** (Moot — the canvas is deleted in Task 2.)

## Review Focus

The spec is a vision document; these are the inputs it implies but no requirement names. Each has a test pinned to the task that owns the code.

1. **A `cqi` headline set from a copied number rather than a measured one.** `.hero` sets `overflow-x: clip`, which *hides* an overflow instead of showing it — a mis-set value produces a silently cropped headline with no error anywhere. Pinned in Task 5. Most likely to bite, because nothing fails until a human notices.
2. **A chapter id with no `grid-template-areas` key.** The tile renders unplaced and invisible; the bento looks correct minus one card. Pinned in Task 7.
3. **Reduced-motion on the phone tier.** `MOTION_CONDITIONS.smooth` is false on phones, so `hero-scene.ts` returns early and the CSS scroll-timeline path takes over. If the `@supports (animation-timeline: view())` block is dropped in the re-skin, phones lose their exit entirely with no test failing. Pinned in Task 5.
4. **Sheet closed by unmount while open** (visitor clicks a sidebar link mid-sheet). `use-sheet.ts:60` handles it, but only if the component stays mounted — a routing change that unmounts Home first leaves `data-scroll-locked="true"` and a permanently frozen page. Pinned in Task 8.
5. **Theme switch mid-sheet.** `data-theme` flips while a modal `<dialog>` is in the top layer; the sheet's own surface tokens must re-read or it renders light-on-light. Pinned in Task 8.

---

## File Structure

**Created:** `scripts/check-contrast.mjs`, `scripts/check-bento.mjs`

**Modified:** `src/styles/tokens.css`, `src/styles/index.css`, `src/app/AppShell.tsx`, `src/app/router.tsx`, `src/app/routes.ts`, `src/app/RouteStage.tsx`, `src/features/home/HomePage.tsx`, `src/features/home/sections.ts`, `src/features/home/hero/*`, `src/features/home/work/*`, `src/content/{site,home,work,schema}.ts`, `src/components/sidebar/SidebarPanel.tsx`, `package.json`, `index.html`, `scripts/check-work-sheet.mjs`

**Deleted:** `src/components/{background,search,page}/`, `src/features/home/{manifesto,automation,services,about}/`, `src/features/{showcase,proof,legal,contact}/`, `src/app/{PageMeta.tsx,sitemap.ts}`, `src/lib/{seo,mail}.ts`, `src/hooks/use-hash-landing.ts`, `src/content/{about,automation,contact,faqs,legal,method,proof,services,showcase,tools}.ts`, 10 `scripts/check-*.mjs`, `scripts/make-placeholders.mjs` + `scripts/placeholders/`, `scripts/csp-hash.mjs` + `scripts/audit/`, `scripts/write-version.mjs`, `deploy/`, `public/demos/`

**Dependency order:** Task 1 (measure — done, verify) → Task 2 (delete) → Task 3 (palette) → Task 4 (shell) → Task 5 (hero) → Task 6 (assets+content) → Task 7 (bento) → Task 8 (sheet) → Task 9 (checks) → Task 10 (verify).

Tasks 1–2 are destructive; both commit, so both are revertible.

---

## Task 1: Baseline the measurement tool

The spec's single named failure mode is the hero `cqi` calibration. It is already resolved in `HEAD` (commit `2b11253`) by `scripts/measure-headline.mjs` + `scripts/HEADLINE-MEASUREMENTS.md`. This task confirms that state and removes the temp harness.

**Files:**
- Delete: `scripts/measure-headline.mjs` is **kept** — it is a permanent tool. Verify it runs.
- Test: the script's own output

**Interfaces:**
- Consumes: `public/fonts/geist-var.woff2`
- Produces: The measured table `| DIMASACAT JR | 700 | 6.4511 | 14.571 |`, consumed by Task 5.

- [ ] **Step 1: Run the measurement and confirm the recorded numbers**

Run:
```powershell
$env:CHROME_PATH="C:\Users\raini\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe"
node scripts/measure-headline.mjs
```
Expected: JSON with `"text": "DIMASACAT JR"`, `"widthEm": 6.4511`, `"cqiFor94": 14.571`.

If it prints different numbers, use **those** numbers in Task 5 and update `HEADLINE-MEASUREMENTS.md` — font rendering is version-sensitive and the file is a record, not an authority.

- [ ] **Step 2: Confirm the script tolerates a missing `CHROME_PATH`**

Run: `$env:CHROME_PATH=""; node scripts/measure-headline.mjs`
Expected: fails with a Playwright "Executable doesn't exist" error naming `chromium_headless_shell`, **not** a syntax error. This proves the `launch` spread is conditional and the script has no other defect. Unset the variable afterwards.

- [ ] **Step 3: Commit**

Nothing has changed on disk, so there is nothing to commit. Do not create an empty commit. Record instead that Task 1 confirmed the existing `2b11253`.

---

## Task 2: Delete the unused surface

~70 files. This must come **before** the palette work so that contrast comments in deleted CSS never get re-audited.

**Files:**
- Delete: everything in the manifest's delete list
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: A tree where the only remaining importers are the ones Tasks 4-8 rewrite.

- [ ] **Step 1: Delete the files**

```powershell
git rm -r --quiet `
  src/components/background src/components/search src/components/page `
  src/features/home/manifesto src/features/home/automation src/features/home/services src/features/home/about `
  src/features/showcase src/features/proof src/features/legal src/features/contact `
  src/app/PageMeta.tsx src/app/sitemap.ts `
  src/lib/seo.ts src/lib/mail.ts `
  src/hooks/use-hash-landing.ts `
  src/content/about.ts src/content/automation.ts src/content/contact.ts src/content/faqs.ts `
  src/content/legal.ts src/content/method.ts src/content/proof.ts src/content/services.ts `
  src/content/showcase.ts src/content/tools.ts `
  scripts/check-background.mjs scripts/check-sidebar.mjs scripts/check-home.mjs `
  scripts/check-manifesto.mjs scripts/check-automation.mjs scripts/check-services.mjs `
  scripts/check-about.mjs scripts/check-showcase.mjs scripts/check-proof.mjs scripts/check-contact.mjs `
  scripts/make-placeholders.mjs scripts/placeholders scripts/csp-hash.mjs scripts/audit `
  scripts/write-version.mjs deploy public/demos
```

- [ ] **Step 2: Prune the deleted scripts from `package.json`**

Remove every `check:*` entry except `check:work-sheet`, and remove `postbuild`, `csp:check`, `placeholders`. Leave `dev`, `build`, `preview`, `lint` untouched.

- [ ] **Step 3: Verify the delete landed and the tree still parses**

Run: `git status --short | Measure-Object -Line`
Expected: roughly 70 deletions staged, and **no** unexpected modifications.

The tree is *expected* not to compile yet — `AppShell`, `router`, `HomePage` and `sections.ts` still import deleted modules. That is Task 4's work. Confirm the failures are **only** unresolved-import errors:

Run: `npx tsc -b --pretty false 2>&1 | Select-String "error TS" | Measure-Object -Line`
Expected: every error line matches `Cannot find module './(PageMeta|sitemap|seo|mail)'` or a named deleted component. **Any error that is not a missing-module error means a delete was wrong — stop and restore that file.**

**`src/lib/storage.ts` and `src/lib/theme.ts` are NOT deleted.** An earlier draft of this plan listed them for removal, which was wrong. `shell-context.tsx` reads `STORAGE_KEYS` from storage; `use-theme.ts` and `SidebarNav.tsx` import `getInitialTheme`/`setTheme`/`isThemeSwitching` from theme. The theme toggle is a shipped feature (spec keeps it; Task 9 verifies it), and `index.css` points at `lib/theme.ts` in a comment. Deleting them would break the one control the palette exists to demonstrate.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "refactor: delete the sections and systems pass 1 does not ship

Removes the three.js signal-flow background, the search palette, and the
manifesto, automation, showcase, proof, about, legal and contact features,
plus seo/mail/storage/theme libs and 10 of the 11 Playwright checks.
Two sections remain: Hero and Builds."
```

---

## Task 3: Rewrite the palette

The only genuinely new design work. Everything else is wiring.

**Files:**
- Modify: `src/styles/tokens.css:11-34` (light), `91-119` (dark), `44-47`, `56-62` (derived)
- Modify: `src/styles/index.css:43-73` (`@theme inline` — same token names, so **no utility class in any feature file changes**)

**Interfaces:**
- Consumes: nothing
- Produces: The token names every later task relies on — `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--ink`, `--ink-2`, `--ink-3`, `--accent`, `--on-accent`, plus derived `--line`, `--line-strong`, `--accent-soft`, `--shadow-{sm,md,float}`, `--band`, `--grid-line`.

- [ ] **Step 1: Write the failing contrast check before changing any colour**

Create `scripts/check-contrast.mjs`. It parses `tokens.css` for the `:root` and `:root[data-theme='dark']` blocks, resolves each colour's `--name: #hex`, computes WCAG 2.1 relative luminance per pair, and prints PASS/FAIL lines, exiting non-zero on any failure.

Required pairs, and their thresholds:

| Pair | Threshold |
|---|---|
| `ink` / `bg` | 4.5 |
| `ink` / `surface` | 4.5 |
| `ink` / `surface-2` | 4.5 |
| `ink` / `surface-3` | 4.5 |
| `ink-2` / `bg` | 4.5 |
| `ink-2` / `surface-3` | 4.5 |
| `ink-3` / `bg` | 4.5 |
| `ink-3` / `surface-3` | 4.5 |
| `accent` / `bg` | 4.5 |
| `accent` / `surface` | 4.5 |
| `on-accent` / `accent` | 4.5 |

Follow `check-work-sheet.mjs` for house style: `const check = (ok, message) => {...}` printing `PASS`/`FAIL`, a `failures` array, `process.exitCode = 1` at the end.

Relative luminance, standard formula:
```js
const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05) }
```

Handle the `rgb(r g b / a)` form too — several derived tokens use it (`--accent-soft`, `--line`). For those, take the first three channels and ignore alpha.

- [ ] **Step 2: Run it against the template's current palette to prove it detects failure**

Run: `node scripts/check-contrast.mjs`
Expected: **FAIL.** The template's `--ink-3: #566779` scores 4.47 on `--surface-2: #e6f0fa` (the audit note at `tokens.css:19` records exactly this). If it passes, the check is wrong — go back to Step 1.

- [ ] **Step 3: Rewrite the light palette**

Replace lines 11-47 with the spec's §4 values. The two values that are **not** the first thing you'd write:

- `--ink-3: #566170` — **not** `#5a6675`, which scores 4.45 on `--surface-3` and fails AA by 0.05.
- `--bg: #f7f5f2` (warm) against `--ink: #14181d`.

Derived tokens, warm-shifted to sit on warm paper:
```
--accent-soft: rgb(194 65 12 / 0.1);
--band: var(--accent-soft);
--grid-line: rgb(20 24 29 / 0.035);
--line: rgb(20 24 29 / 0.08);
--line-strong: rgb(20 24 29 / 0.14);
--scrim: rgb(20 24 29 / 0.32);
--shadow-sm: 0 1px 2px rgb(20 24 29 / 0.05);
--shadow-md: 0 1px 2px rgb(20 24 29 / 0.04), 0 10px 28px -12px rgb(20 24 29 / 0.14);
--shadow-float: 0 2px 6px rgb(20 24 29 / 0.05), 0 24px 56px -20px rgb(20 24 29 / 0.22);
```
Leave `--paper*` tokens and `--media-scrim`/`--on-media`/`--cutout-rim` alone in light; they exist for the Work sheet's media and are theme-independent by design.

Update the header comment (lines 1-5) to name the new brand and restate the verified ratios.

- [ ] **Step 4: Rewrite the dark palette**

Replace the `:root[data-theme='dark']` values with the spec's §4 dark column. The asymmetry is deliberate: **light is warm paper, dark is cool black.**

```
--bg: #0b0d10;  --surface: #14181d;  --surface-2: #1d2229;  --surface-3: #272d36;
--ink: #e8eaed;  --ink-2: #a7afb9;  --ink-3: #8b94a0;
--accent: #f97316;  --on-accent: #1a0d05;
--accent-soft: rgb(249 115 22 / 0.18);
--band: rgb(255 255 255 / 0.05);
--grid-line: rgb(255 255 255 / 0.03);
--line: rgb(255 255 255 / 0.08);
--line-strong: rgb(255 255 255 / 0.14);
--scrim: rgb(2 6 12 / 0.6);
```
Dark shadows are neutral-black as in the original.

- [ ] **Step 5: Do not touch the motion block**

Lines 64-87 — `--radius-*`, `--sidebar-w`, `--rail-w`, `--content-max`, `--ease-spring`, `--ease-spring-bouncy`, `--ease-out`, `--dur-*` — stay **byte-identical**. Also leave the `prefers-contrast` and `prefers-reduced-motion` blocks structurally as they are, only re-pointing their colour values at the new inks (`#44505e`→`#3a4552`, `#566170`→`#3f4a58`, dark equivalents `#c8ccd1`/`#b6bbc2`).

- [ ] **Step 6: Run the contrast check**

Run: `node scripts/check-contrast.mjs`
Expected: **all PASS.** Verified targets: `ink-3`/`surface-3` = 4.78 light and 4.52 dark; `accent`/`bg` = 4.76 light and 6.94 dark.

- [ ] **Step 7: Wire the npm script and commit**

```json
"check:contrast": "node scripts/check-contrast.mjs"
```

```powershell
git add src/styles/tokens.css src/styles/index.css scripts/check-contrast.mjs package.json
git commit -m "feat: warm-paper / cool-black palette with an orange accent

Replaces French blue #2D78C2 with #c2410c light / #f97316 dark. Light is
warm paper, dark is cool black, so the theme toggle reads as a switch
rather than an inversion.

--ink-3 is #566170, not #5a6675: the latter scores 4.45:1 on --surface-3
and fails AA by 0.05. Adds check-contrast, which asserts all 11 pairs in
both themes, so a future surface change cannot silently regress them.

Motion block is untouched."
```

---

## Task 4: Re-point the shell at two sections

Makes the tree compile again with the deletions in place.

**Files:**
- Modify: `src/app/AppShell.tsx:3,6,44`
- Modify: `src/app/router.tsx:3-8,13-20`
- Modify: `src/app/routes.ts`
- Modify: `src/features/home/HomePage.tsx:1-3,22`
- Modify: `src/features/home/sections.ts:1-30`
- Modify: `src/app/RouteStage.tsx` (drop the PageMeta render if it has one)

**Interfaces:**
- Consumes: `tokens.css` from Task 3
- Produces: `homeSectionList: { id: string; Component: ComponentType }[]` with exactly `hero` and `work`; `router` exposing `/` and `/work/:chapter`.

- [ ] **Step 1: Drop the background from `AppShell`**

Delete the `import { SignalFlowBackground }` line and the `<SignalFlowBackground layout={...} />` element. Delete the now-unused `layout` expression. Nothing else in the shell changes.

- [ ] **Step 2: Trim `routes.ts` to Home**

Keep only the `home` page entry, with `title` set to Rainier's name and the `sections` array reduced to `['hero', 'work']`. Delete `notFoundTitle` if nothing imports it after; otherwise keep it.

- [ ] **Step 3: Trim `router.tsx`**

`PAGE_COMPONENTS` becomes `{ home: HomePage }` only. Delete the imports of `ShowcasePage`, `LegalPage`, `ContactPage`, `ProofPage`. The `routeFor` special case at `router.tsx:34-40` — Home as a layout over `/work/:chapter` — **stays**, because it is the mechanism that makes the sheet open over Home rather than replacing it.

- [ ] **Step 4: Trim `HomePage.tsx`**

Remove the `PageMeta` import and its render at line 22. `useHashLanding` goes too — `src/hooks/use-hash-landing.ts` is deleted in Task 2, and with no non-Home sections the sidebar only needs `/#hero` and `/#work`, which the router's `anchors: true` handles. Keep `findChapter`, the `Navigate` redirect for an unknown chapter, and the `<WorkSheet>`.

- [ ] **Step 5: Trim `sections.ts` to two entries**

```ts
export const homeSectionList: HomeSection[] = [
  { id: 'hero', Component: HeroSection },
  { id: 'work', Component: WorkSection },
]
```
Delete the other seven imports.

- [ ] **Step 6: Verify it compiles and renders**

Run: `npx tsc -b --pretty false`
Expected: **zero errors.** This is the task's whole test — Task 2 deliberately left the tree broken and Task 4 repairs it.

Run: `npm run lint`
Expected: zero errors.

Then start the dev server and load `http://localhost:5190/`:
Expected: a page with the new palette, the **template's placeholder copy still in place**, and both `hero` and `work` sections present. Wrong copy is fine — Tasks 5-7 fix it. A missing section is not.

- [ ] **Step 7: Commit**

```powershell
git add -A
git commit -m "refactor: shell serves two sections, no 3D background

AppShell drops SignalFlowBackground, router keeps only home, HomePage
drops PageMeta and the hash-landing hook, and sections.ts lists hero and
work. Home stays a layout over /work/:chapter so the sheet opens over it."
```

---

## Task 5: Hero with real copy and a measured headline

**Files:**
- Modify: `src/content/home.ts:24-29` (`homeHero`)
- Modify: `src/features/home/hero/HeroSection.tsx`
- Modify: `src/features/home/hero/hero.css:29` and the comment at `24-28`

**Interfaces:**
- Consumes: `homeHero` object shape `{ headlineThin, headlineBold, subhead, cta }` — **keep the shape**, change the values, so `HeroSection.tsx` needs no signature change.
- Produces: The hero's rendered copy, and the pinned `cqi` value.

- [ ] **Step 1: Write the real copy into `homeHero`**

```ts
export const homeHero = {
  headlineThin: 'Rainier',
  headlineBold: 'Dimasacat Jr',
  subhead: 'GHL SPECIALIST / FUNNEL BUILDER',
  cta: { label: 'Hire me', to: '/#contact' },
}
```

The lede — *"I build GoHighLevel systems that turn inquiries into booked conversations..."* — is longer than the template's `subhead` slot and belongs in a separate field rendered under the eyebrow. Add `lede: string` to `homeHero` and render it in `HeroSection.tsx` below the eyebrow as the body paragraph. The eyebrow keeps the mono/uppercase treatment the template gives `subhead`.

- [ ] **Step 2: Set the measured `cqi`**

`hero.css:29`, replace the template's `13.05cqi` with:

```css
font-size: clamp(2.3rem, 14.571cqi, 10rem);
```

**If Task 1 Step 1 printed different numbers, use those.** `94 / widthEm`, not the template's value and not a guess.

- [ ] **Step 3: Rewrite the calibration comment**

Replace `hero.css:24-28` with a comment recording the real measurement:

```
/* "DIMASACAT JR" in Geist 700 at -0.05em measures 6.4511em wide: 14.571cqi
   fills ~94% of the column (6.4511 x 14.571 = 94). The 2.3rem floor keeps the
   smallest phones' line readable (~290px at 320).

   To re-measure after changing the words: npm run measure:headline
   (scripts/measure-headline.mjs), read widthEm, then cqi = 94 / widthEm.

   Do NOT copy a cqi from another line: .hero sets overflow-x: clip, which
   hides an overflow instead of showing it. A wrong value crops the headline
   silently, with no error anywhere. */
```

Add `"measure:headline": "node scripts/measure-headline.mjs"` to `package.json`.

- [ ] **Step 4: Add the phone scroll-timeline assertion to the check suite**

The `@supports (animation-timeline: view())` block at `hero.css:109-126` is **load-bearing** and easy to lose in a re-skin. Assert it survives:

```js
// in check-contrast.mjs's sibling, or a new scripts/check-hero.mjs
const hasTimeline = await page.evaluate(() =>
  CSS.supports('animation-timeline', 'view()') &&
  [...document.styleSheets].some((s) => { try { return [...s.cssRules].some(r => r.cssText.includes('animation-timeline')) } catch { return false } })
)
check(hasTimeline, 'phone scroll-timeline fallback is present')
```

- [ ] **Step 5: Pin the headline is not cropped**

```js
const clipped = await page.evaluate(() => {
  const t = document.querySelector('.hero__title')
  const r = t.getBoundingClientRect()
  const hero = document.querySelector('.hero').getBoundingClientRect()
  return r.width > hero.width || r.right > hero.right + 1
})
check(!clipped, 'hero headline fits its column at 1440')
```
Repeat at 1280 and 1920.

- [ ] **Step 6: Verify visually and commit**

Load `/` at 1440. Expected: `RAINIER` thin over `DIMASACAT JR` bold, both uncropped, the eyebrow above, the lede below, the `Hire me` CTA in orange.

```powershell
git add src/content/home.ts src/features/home/hero package.json scripts
git commit -m "feat: real hero copy and a headline sized from measurement

'DIMASACAT JR' measures 6.4511em in Geist 700 at -0.05em, so the column-
filling size is 14.571cqi, not the template's 13.05cqi (calibrated to a
different string). Adds scripts/measure-headline.mjs as the documented way
to re-derive it, since overflow-x: clip turns a wrong value into silent
cropping rather than a visible error."
```

---

## Task 6: Identity and real builds

**Files:**
- Modify: `src/content/site.ts`
- Modify: `src/content/schema.ts` (trim to ~40 lines)
- Modify: `src/content/work.ts` (replace entirely)
- Create: `public/images/work/*.webp` (copied)
- Modify: `src/features/home/work/WorkSection.tsx`, `ChapterFace.tsx`

**Interfaces:**
- Consumes: `SiteMeta` shape from `site.ts` — every field the sidebar reads
- Produces: `workChapters: WorkChapter[]` with exactly 6 entries; ids and titles that **Task 7 keys the grid on**.

- [ ] **Step 1: Write `site.ts`**

Real values, from the live site:

```ts
export const site = {
  name: 'Rainier Dimasacat Jr',
  brand: 'Rainier D.',
  brandParts: ['Rainier', 'D.'],
  role: 'GHL Specialist / Funnel Builder',
  email: 'techva.rain@gmail.com',
  emailSubject: 'Project inquiry',
  location: 'Cavite, PH',
  countryCode: 'PH',
  timeZone: 'Asia/Manila',
  timePlace: 'in Cavite',
  avatarSmall: '/images/profile/avatar-224.webp',
} as const
```

`socials` becomes one real entry: LinkedIn `https://www.linkedin.com/in/rainier-dimasacat-a740a6176`. Delete the Facebook, GitHub, X and Discord stubs — **do not ship dead links** (Review Focus: a `#` href that renders as a working-looking button is worse than no button).

Delete the placeholder `certification` export and `externalLinks.resource/showcase/company`, whose targets no longer exist.

- [ ] **Step 2: Copy the real build images**

```powershell
New-Item -ItemType Directory -Force -Path public/images/work
Copy-Item "C:\Users\raini\Desktop\Opencode New Designs\Portfolio\variant-E\assets\work\*.png" public/images/work/
```

Six builds have real imagery (verified present):
`rubio` (from `assets/funnel/rubio/thumb.webp`), `flowfix-intake.png`, `torqueworks-1.png`, `haven-emergency.png`, `legal-nurture.png`, `fitcoach-auto01.webp`.

Convert the `.png` files to `.webp` and resize to the tile aspect, since `work.css` crops with `object-fit: cover`. If no converter is available, ship the `.png` unchanged and set the correct `width`/`height` in the content — correctness first, bytes second.

- [ ] **Step 3: Trim `schema.ts`**

Keep `Image`, `LinkRef`, `SocialLink`, `WorkChapter`, `WorkItem`. Delete `Faq`, `ToolMark`, `Credential`, `Service`, `MethodStep`, `BuildStatus`, `Demo`, `AppBuild`, `AiBuild`, `AiGroup`, `ClientAccount`, `VideoTestimonial`.

`WorkChapter` keeps `id`, `title`, `line`, `count`, `unit`, `description`, `tile?`, `marks?`, `items`, `lead?`, `gallery?`, `link?`. **`count` must be derived from `items.length` or `gallery.length`, never typed** — the template's own comment says so, and a hand-typed count is a number that lies.

`WorkItem` drops `group?`, `stack?`, `status?` — nothing in the six builds uses them, and `WorkSheet`'s `Showcase` groups on `group`.

- [ ] **Step 3b: Strip the dead section-copy exports from `home.ts`**

Task 2 deleted `src/content/method.ts` and `src/content/tools.ts`, but `home.ts:3-4` still imports both and `home.ts:39` still reads `method.eyebrow`. Tasks 5 and 7 only touch `homeHero` and `workChapters`, so nothing else removes them. Delete the dead section-copy exports — `homeManifesto`, the `ManifestoPart` type, `homeSections`, and every `tools`/`ToolMark` reference — along with those two imports. This is the last surviving TS2307 in a file this task owns, and Task 10 Step 2 asserts `tsc -b` is clean.

- [ ] **Step 4: Write the six chapters**

Real summaries, taken from the live site — no invented metrics:

| id | title | items |
|---|---|---|
| `rubio` | Rubio Roofing and Trusses | 1 build, `lead` + `gallery` (the 5-tab gallery) |
| `legal` | Legal Intake & Nurture | capture, booking, nurture, win-back, cancel screens |
| `flowfix` | FlowFix Plumbing | triage, missed-call, reactivation, review |
| `torqueworks` | TorqueWorks Auto Care | dormant win-back screens |
| `haven` | Haven Animal Clinic | emergency detection, CA I-config |
| `fitcoach` | FitCoach | onboarding, payment-failed, abandoned-cart |

Every `image` gets a real `alt` naming the screen it shows, not "Screenshot 1".

- [ ] **Step 5: Verify and commit**

Run: `npx tsc -b --pretty false` → zero errors.

```powershell
git add -A
git commit -m "feat: Rainier's identity and six real GHL builds

site.ts carries the real name, role, Cavite clock and one real LinkedIn
link; the four dead # socials are deleted rather than shipped as buttons
that look live. work.ts replaces the placeholders with six builds drawn
from the existing site assets, each with a named alt.

schema.ts drops the 13 types whose sections are gone."
```

---

## Task 7: Bento grid keyed to the new chapters

**Files:**
- Modify: `src/features/home/work/work.css:56-77`
- Modify: `src/content/home.ts` (`workChapters`)
- Create: `scripts/check-bento.mjs`

**Interfaces:**
- Consumes: `workChapters` ids from Task 6
- Produces: A CSS grid where every chapter id resolves to an area.

- [ ] **Step 1: Write the failing check first**

`scripts/check-bento.mjs` — static, no browser needed:

```js
// Every chapter id must have a [data-area='<id>'] key and a grid-area.
// Reads src/content/home.ts and src/features/home/work/work.css as text.
const home = readFileSync('src/content/home.ts', 'utf8')
const css = readFileSync('src/features/home/work/work.css', 'utf8')
const ids = [...home.matchAll(/^\s{4}id: '([^']+)',$/gm)].map((m) => m[1])
const keys = [...css.matchAll(/data-area='([^']+)'/g)].map((m) => m[1])
for (const id of ids) check(keys.includes(id), `chapter '${id}' has a bento grid area`)
const areas = css.match(/grid-template-areas:([\s\S]*?);/g) ?? []
check(areas.length > 0, 'work.css declares grid-template-areas')
// Every area name used in the grid must be claimed by some data-area rule.
```

Run it. Expected: **FAIL** — the CSS still keys `websites`, `apps`, `featured`, `screens`, `case-studies`, `process`, `side-projects`, `experiments`, none of which match the new ids.

The id regex must read only the `workChapters` array, not every `id:` in `home.ts` — the file also carries `homeHero` and section-copy objects. Slice from `export const workChapters` to its closing `]` before matching, otherwise the check reports false failures for ids that were never chapters.

- [ ] **Step 2: Re-key `grid-template-areas`**

Replace `work.css:56-77` with a layout for six cells. A 12-column grid, four rows:

```css
grid-template-columns: repeat(12, minmax(0, 1fr));
grid-template-rows: repeat(4, clamp(150px, 14.5cqi, 210px));
grid-template-areas:
  'rubio rubio rubio rubio rubio rubio flowfix flowfix flowfix flowfix torq torq'
  'rubio rubio rubio rubio rubio rubio flowfix flowfix flowfix flowfix torq torq'
  'legal legal legal legal legal haver haver haver fitc fitc fitc fitc'
  'legal legal legal legal legal haver haver haver fitc fitc fitc fitc';
gap: 12px;
```
```css
.wb__cell[data-area='rubio'] { grid-area: rubio; }
.wb__cell[data-area='flowfix'] { grid-area: flowfix; }
.wb__cell[data-area='torq'] { grid-area: torq; }
.wb__cell[data-area='legal'] { grid-area: legal; }
.wb__cell[data-area='haver'] { grid-area: haver; }
.wb__cell[data-area='fitc'] { grid-area: fitc; }
```

**Grid names and `data-area` values are the SAME string, both equal to the chapter id** — that is what makes the check mechanical. Do not alias them: `grid-area: flow` with `data-area='flowfix'` would render correctly and pass a visual check, while `check-bento` fails on the mismatch. Keep the sheet's own `grid-template-areas` (the responsive block at `work.css:180`) in sync.

**Chapter ids are fixed by Task 6 and must not be shortened to fit a grid.** If `torqueworks` and `haven` and `fitcoach` are too long for a readable grid name, that is a reason to keep the long names and let the `grid-template-areas` block be wide — not to rename the chapters, since the chapter id is also the URL (`/work/torqueworks`) and the link a visitor shares.

- [ ] **Step 3: Run the check**

Expected: **all PASS**, six chapters, no orphan areas.

- [ ] **Step 4: Verify visually and commit**

Load `/`, scroll to Builds. Expected: six tiles, no empty cell, no sideways scroll.

```powershell
git add src/features/home/work/work.css src/content/home.ts scripts/check-bento.mjs package.json
git commit -m "feat: bento keyed to the six real chapters

grid-template-areas re-keyed from the template's eight placeholder areas to
rubio/flow/torq/legal/haver/fitc. Adds check-bento: a chapter id with no
area renders unplaced and invisible, so the bento looks correct minus one
card and nothing fails."
```

---

## Task 8: Make the sheet work without SEO

**Files:**
- Modify: `src/features/home/work/WorkSheet.tsx:4,8,79-81`
- Modify: `scripts/check-work-sheet.mjs`

**Interfaces:**
- Consumes: `workChapters`, `useSheet`
- Produces: A sheet that opens at `/work/<chapter>`, drags closed, and releases the scroll lock.

**This task exists because the template's own check does not survive the deletion.** `check-work-sheet.mjs:24-34` reads `link[rel="canonical"]`, `meta[name="description"]` and the `CollectionPage` JSON-LD — all produced by `lib/seo.ts` and `PageMeta.tsx`, both deleted in Task 2. The spec called this check "kept"; it must actually be **rewritten**.

- [ ] **Step 1: Strip SEO from `WorkSheet`**

Delete the `HeadMeta` import (line 4) and the `chapterJsonLd`/`chapterTitle` import (line 8). Replace lines 79-81 — the `<HeadMeta>` and `<script type="application/ld+json">` elements — with nothing. If `document.title` should still change per chapter, set it directly in a `useEffect` using the chapter's own title; do not reintroduce a meta component.

- [ ] **Step 2: Rewrite the check's assertions**

Delete every assertion reading canonicals, descriptions or `ldItems`. Keep and re-point these:

```js
// tile -> URL
check(b.count === 6 && new Set(b.hrefs).size === 6 && b.hrefs.every(h => h.startsWith('/work/')), '6 tiles, each a link to its chapter')
check(b.broken === 0 && !b.overflowX, 'pictures load, no sideways scroll')

// open, lock
await page.click('#work a[href="/work/rubio"]')
check(s.path === '/work/rubio' && s.open, 'the Rubio tile opens /work/rubio as an open sheet')
check(s.locked && Math.abs(s.scrollY - homeY) < 4, 'page behind is locked and did not move')

// Escape, Back, direct visit
check(s.path === '/' && !s.open && !s.locked, 'Escape closes back to Home')
await page.goBack(); check(s.path === '/' && !s.open, 'browser Back closes the sheet')
await page.goto(`${BASE}/work/haven`); check(s.open, 'direct /work/haven opens its sheet')
check(s.path === '/' && !s.open, 'closing a direct visit leaves Home')
```

Also remove the `NAME` read at line 8 if `site.ts` no longer exports `name` in the same quoted form — it does, so that line can stay.

- [ ] **Step 3: Add the two unmount/theme assertions (Review Focus 4 and 5)**

```js
// Sheet open, then navigate away by other means: the lock must not survive.
// (use-sheet.ts:60 reverts it on unmount; this proves the component stayed mounted.)
await page.click('#work a[href="/work/rubio"]')
await page.waitForTimeout(900)
await page.click('[data-nav-id="hero"]')       // sidebar link, not Back
await page.waitForTimeout(1200)
s = await read(page)
check(!s.locked, 'navigating away with a sheet open does not freeze the page')

// Theme switch while the sheet is in the top layer.
await page.click('#work a[href="/work/rubio"]')
await page.waitForTimeout(900)
const before = await page.evaluate(() => getComputedStyle(document.querySelector('.sh__panel')).backgroundColor)
await page.evaluate(() => document.querySelector('[data-theme-toggle]')?.click()
  || document.documentElement.setAttribute('data-theme',
     document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'))
await page.waitForTimeout(600)
const after = await page.evaluate(() => getComputedStyle(document.querySelector('.sh__panel')).backgroundColor)
check(before !== after || true, 'theme switch with a sheet open does not error')
```

The second check is weak as written — assert `after` resolves to a token-derived colour rather than `rgba(0, 0, 0, 0)`. If the panel has no background of its own, drop the assertion and note it; do not leave a check that cannot fail.

- [ ] **Step 4: Add the chrome path to both scripts**

Both `check-work-sheet.mjs` and any new browser script need the `CHROME_PATH` fallback from Global Constraint 6:

```js
const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
const browser = await chromium.launch(launch)
```

- [ ] **Step 5: Run and commit**

Run with the dev server up:
```powershell
$env:CHROME_PATH="C:\Users\raini\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe"
$env:BASE="http://localhost:5190"
node scripts/check-work-sheet.mjs
```
Expected: **all PASS.**

```powershell
git add src/features/home/work/WorkSheet.tsx scripts/check-work-sheet.mjs
git commit -m "refactor: sheet without the SEO layer, check rewritten to match

WorkSheet drops HeadMeta and the chapter JSON-LD, which lib/seo.ts and
PageMeta.tsx used to provide. check-work-sheet is rewritten rather than
kept: its canonical/description/ldItems assertions tested a system pass 1
does not ship, and would have failed on code that no longer exists.

Adds two assertions the template lacked - unmounting with a sheet open
must not leave the page scroll-locked, and a theme switch with the sheet
in the top layer must not error."
```

---

## Task 9: Palette across the shell

`check:contrast` proves the tokens are correct; it does not prove every CSS file still *reads* them. A feature CSS file with a hardcoded `#fff` passes the token check and still renders wrong.

**Files:**
- Modify: `src/components/sidebar/sidebar.css`, `src/components/drawer/drawer.css`, `src/features/home/work/work.css`, `work-sheet.css`, `hero/hero.css`
- Test: `scripts/check-palette.mjs`

**Interfaces:**
- Consumes: `tokens.css` from Task 3
- Produces: A check that fails on any raw hex outside `tokens.css`.

- [ ] **Step 1: Write the check**

Scan every `.css` under `src/` for a hex literal or `rgb(` outside an allowed context, and fail on any hit:

```js
// Allowed: tokens.css only (it defines them), plus focus rings using currentColor.
const offenders = []
for (const file of globSync('src/**/*.css')) {
  if (file.includes('tokens.css')) continue
  const text = readFileSync(file, 'utf8')
  text.split('\n').forEach((line, i) => {
    // Skip pure-black/white used for the media scrim over video, and transparent.
    if (/#[0-9a-f]{3,8}\b/i.test(line)) offenders.push(`${file}:${i + 1} ${line.trim()}`)
  })
}
for (const o of offenders) check(false, `raw colour outside tokens: ${o}`)
check(offenders.length === 0, 'every colour comes from a token')
```

Expect the **first** run to fail — this is the point.

- [ ] **Step 2: Replace each offender with its token**

The recurring ones and their tokens:

| Found | Becomes |
|---|---|
| `#fff`, `#ffffff` as text | `var(--ink)` — or `--on-accent` on an accent ground |
| `#000`, `#0a0a0a` | `var(--bg)` in dark; a `rgb(0 0 0 / a)` scrim for overlays |
| Any theme-specific hardcoded dark | `var(--surface)` / `--surface-2` |
| Colour comments citing old ratios | Re-audit against §4.1 and update |

`work.css:143` (`filter: brightness(0.86)` for white captures on dark) has no token — it is a media treatment, not a colour. Leave it, and add a comment saying so, or the check must allow it.

- [ ] **Step 3: Run all three checks**

```powershell
$env:CHROME_PATH="C:\Users\raini\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe"
node scripts/check-contrast.mjs    # all PASS
node scripts/check-bento.mjs       # all PASS
node scripts/check-work-sheet.mjs  # all PASS
```

- [ ] **Step 4: Verify both themes by eye and commit**

Load `/`, toggle the theme. Expected: light is warm paper with orange accents; dark is cool black with a lighter orange. No light-on-light or dark-on-dark text anywhere.

```powershell
git add src package.json
git commit -m "refactor: every colour resolves to a token

Adds check-palette, which fails on any raw hex outside tokens.css. The
template's own comments cite contrast ratios audited against the old blue
palette; those are re-derived from the new values and the numbers in the
comments match scripts/check-contrast.mjs."
```

---

## Task 10: Verify the whole thing

**Files:** none modified. This task only proves the acceptance criteria.

**Interfaces:**
- Consumes: everything
- Produces: A clean verification record.

- [ ] **Step 1: Assert the motion spine is byte-identical**

```powershell
git diff 2b11253~1 HEAD --stat -- src/lib/motion src/hooks/use-scroll-scene.ts src/hooks/use-media-query.ts src/hooks/use-local-time.ts src/features/home/work/use-sheet.ts
```
Expected: **empty.** No output means not one line of the law changed. Any output means a task violated Global Constraint 1 — restore that file.

- [ ] **Step 2: Typecheck and lint**

```powershell
npx tsc -b --pretty false
npm run lint
```
Expected: zero errors from each.

- [ ] **Step 3: Production build**

```powershell
npm run build
```
Expected: exit 0, `dist/` written. (`postbuild` was removed in Task 2, so `version.json`/`sitemap.xml` are not emitted — that is intended.)

- [ ] **Step 4: Run all checks against the production build**

```powershell
npm run preview
$env:BASE="http://localhost:5191"
node scripts/check-contrast.mjs; node scripts/check-bento.mjs; node scripts/check-work-sheet.mjs
```
Expected: all PASS.

- [ ] **Step 5: Confirm the file count**

```powershell
(Get-ChildItem -Recurse -File src).Count
```
Expected: **~20**, from ~90.

- [ ] **Step 6: Final commit if anything changed**

If any fix was needed during verification, commit it with a message naming what was wrong. If nothing changed, do not create an empty commit.

### Step 7: Assert the spec's acceptance criteria verbatim

The spec §9 list. Each line is a claim that either holds or does not — record the result of each, not just the overall exit code.

- [ ] Real content renders in **both themes** at `/` — `RAINIER` / `DIMASACAT JR`, orange accents, warm paper light / cool black dark
- [ ] `check-work-sheet` — all PASS
- [ ] `check-contrast` — all PASS, all 11 pairs in both themes
- [ ] `check-bento` — all PASS, six chapters resolve to a grid area
- [ ] `check-palette` — all PASS, no raw hex outside `tokens.css`
- [ ] `npx tsc -b` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] Hero headline **uncropped at 1280, 1440 and 1920** — measured, not eyeballed
- [ ] `git diff` on the motion spine — **empty**
- [ ] Source file count ~20, from ~90

If any line fails, the task is not done. Fix it in the task that owns that code, then re-run.

---

## Out of Scope

Deferred to pass 2, each additive under the unchanged law: Services (the five from the live site), Contact, three.js background, search palette, showcase, proof, SEO/sitemap/`llms.txt`/JSON-LD, nginx deploy and CSP.

`src/content/` has room for the other 14 builds; each is one `WorkChapter` entry plus a `grid-template-areas` cell, with no structural change.
