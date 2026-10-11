# Kape — Portfolio Rebuild Design

**Date:** 2026-10-11
**Status:** Draft for review
**Target:** `variant-kape/portfoliov2-template/`
**Owner:** Rainier Dimasacat Jr — GHL Specialist / Funnel Builder

---

## 1. Purpose

The `portfoliov2-template` repo is a technically excellent portfolio whose visual identity is not ours. The goal is a **minimal, real portfolio** that keeps the template's engineering and motion architecture exactly, replaces its identity wholesale, and ships only the sections that earn their place.

This is explicitly **not** a reskin and **not** a full IA redesign. It is a gut-and-refit: keep the spine, delete the rest, rewrite the palette, wire two real sections.

### Success criteria

1. The site carries Rainier's real name, role, lede, contact details and six real builds, on a structure sized for twenty.
2. The template's motion law is byte-identical to the source — no re-solving of springs, no new easing.
3. Every text/background pair in both themes clears WCAG AA (4.5:1 for body, 3:1 for large).
4. The two kept Playwright checks pass, and the contrast check is executable.
5. Adding a third section later requires writing one component + one scene + one content entry, and nothing else.

### Constraints

- Licence: PolyForm Noncommercial 1.0.0 plus the author's permission for own-portfolio use. Covered — this is Rainier's own portfolio.
- Stack unchanged: Vite 8, React 19, TypeScript strict, React Router 8, Tailwind v4, GSAP, Lenis, three.js (removable), Phosphor.
- `src/content/*.ts` stays typed data. Copy never enters a component.

---

## 2. The law

The template does not feel connected because of its palette or its layout. It feels connected because **one physical law is applied at every layer**. This is the concept we are preserving; every later decision is measured against it.

| Layer | Law | Source |
|---|---|---|
| Colour | One accent. Everything else derives from it. Theme switch recolours all. | `src/styles/tokens.css:22` |
| Type | One variable family for display, one mono for labels. Weights pair 100 with 700. | `src/styles/index.css:70-72` |
| Motion | Apple's spring solved to `linear()`, damping 1.0 (no overshoot). Same curve **shape** at every response time; only duration scales. | `src/lib/motion/gsap.ts:30` |
| Device tiers | Three tiers, one intent. Desktop = Lenis + JS scrub; phone = CSS scroll timelines on the compositor; reduced-motion = still. | `src/lib/motion/gsap.ts:16` |
| Scene | A section's animation is a pure function `(root, conditions) => void`, mounted by one hook. | `src/hooks/use-scroll-scene.ts:10` |
| Interruptibility | Every tween starts from the live position. Gestures use momentum projection and rubberband resistance, never a canned duration. | `src/features/home/work/use-sheet.ts:6-8, 71` |
| State | Anything openable lives at a URL. Back works, links are shareable. | `work.ts` + routes |
| Content | Typed data in `src/content/`. A component is never edited to change a word. | `src/content/schema.ts:1` |
| Invariants | Design rules are executable checks that print PASS/FAIL. | `scripts/check-*.mjs` |
| Performance | Heavy things are lazy chunks. No `backdrop-filter` over the canvas. Pinning is CSS `sticky`, never a ScrollTrigger pin. | `README.md:96-98` |

**We keep rows 1, 3, 4, 5, 6, 7, 8, 9, 10 verbatim.** Rows 2 (type) and 1's palette are the deliberate replacements.

---

## 3. File manifest

### 3.1 Kept verbatim

| File | Note |
|---|---|
| `src/lib/motion/gsap.ts` | Spring solver + `MOTION_CONDITIONS`. Untouched. |
| `src/lib/motion/smooth-scroll.ts` | Lenis tiering, `setScrollLock`. Untouched. |
| `src/hooks/use-scroll-scene.ts` | Scene hook. Untouched. |
| `src/hooks/use-media-query.ts` | Desktop split. Untouched. |
| `src/hooks/use-local-time.ts` | Sidebar Cavite clock (§5.4). Untouched. |
| `src/features/home/work/use-sheet.ts` | Drag physics. Untouched. |
| `src/features/home/work/ChapterFace.tsx` | Untouched. |

### 3.2 Kept, edited

| File | Change |
|---|---|
| `src/styles/tokens.css` | **Palette rewritten** (§4). Motion block untouched. |
| `src/styles/index.css` | Token → utility map re-pointed; font stack re-pointed; everything else untouched. |
| `src/app/AppShell.tsx` | Drop `SignalFlowBackground` import and render. |
| `src/app/router.tsx` | Home + `/work/:chapter` only. |
| `src/app/routes.ts` | Two entries. |
| `src/features/home/sections.ts` | `hero`, `work`. Two lines. |
| `src/features/home/hero/HeroSection.tsx` | Real copy. |
| `src/features/home/hero/hero.css` | **Re-measured cqi** (§5.2). |
| `src/features/home/work/*` | Real chapters. CSS grid areas re-keyed. |
| `src/content/site.ts` | Rainier's details. |
| `src/content/home.ts` | Hero + chapters only. |
| `src/content/work.ts` | 20 builds. |
| `package.json` | Drop deleted scripts, add `check:contrast`, `check:bento`. |

### 3.3 Deleted

```
src/components/background/       (signal-flow.ts, SignalFlowBackground.tsx, background.css)
src/components/search/
src/components/page/
src/features/home/manifesto/
src/features/home/automation/
src/features/home/services/
src/features/home/about/
src/features/showcase/
src/features/proof/
src/features/legal/
src/features/contact/
src/app/PageMeta.tsx
src/app/sitemap.ts
src/lib/seo.ts
src/lib/mail.ts
src/lib/storage.ts
src/lib/theme.ts
src/content/{about,automation,contact,faqs,legal,method,proof,services,showcase,tools}.ts
scripts/check-{background,sidebar,home,manifesto,automation,services,about,showcase,proof,contact}.mjs
scripts/make-placeholders.mjs + scripts/placeholders/
scripts/csp-hash.mjs + scripts/audit/
scripts/write-version.mjs
deploy/                           (nginx + CSP: no server, no form backend in pass 1)
public/demos/
```

Two files are **partially** deleted rather than removed:

- `src/content/schema.ts` — 193 lines down to ~40. Keeps `Image`, `LinkRef`, `SocialLink`, `WorkChapter`, `ChapterItem`; the rest goes with its consumers.
- `src/app/RouteStage.tsx` — kept, drives the route transition already wired in the shell.

**Expected end state: 20 source files, down from ~90.**

---

## 4. Palette

This is the deliberate departure. `#2D78C2` French blue is the single most generic thing about the template and the reason this site would read as "the template with Rainier's name on it". Every GHL and automation portfolio is blue. We go orange.

One accent. Exactly as the law requires. Everything else derives.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f7f5f2` warm paper | `#0b0d10` cool near-black |
| `--surface` | `#ffffff` | `#14181d` |
| `--surface-2` | `#efece7` | `#1d2229` |
| `--surface-3` | `#e4e0da` | `#272d36` |
| `--ink` | `#14181d` | `#e8eaed` |
| `--ink-2` | `#44505e` | `#a7afb9` |
| `--ink-3` | `#566170` | `#8b94a0` |
| `--accent` | `#b63d0b` | `#f97316` |
| `--on-accent` | `#ffffff` | `#1a0d05` |

**The asymmetry is intentional:** light is warm paper, dark is cool black. The theme toggle reads as a real switch, not an inversion.

`--ink-3` light is `#566170`, not the first candidate `#5a6675` — the latter scored **4.45:1** on `--surface-3`, failing AA by 0.05. `#566170` scores 4.78. This is why §6 requires an executable check.

### 4.1 Verified contrast

Every pair measured against WCAG 2.1 relative luminance. All pass.

| Pair | Light | Dark |
|---|---|---|
| `ink` / `bg` | 16.38 AAA | 16.14 AAA |
| `ink` / `surface` | 17.82 AAA | 14.79 AAA |
| `ink` / `surface-3` | 13.56 AAA | 11.50 AAA |
| `ink-2` / `bg` | 7.55 AAA | 8.78 AAA |
| `ink-2` / `surface-3` | 6.25 AA | — |
| `ink-3` / `bg` | 5.78 AA | 6.34 AA |
| `ink-3` / `surface-3` | **4.78** AA | 4.52 AA |
| `accent` / `bg` | 5.27 AA | 6.94 AA |
| `accent` / `surface` | 5.74 AA | 6.36 AA |
| `accent` / `--band` composite | **4.96** AA | 5.60 AA |
| `on-accent` / `accent` | 5.74 AA | 6.79 AA |

The tightest margins are `ink-3` on `surface-3` (4.78 light, 4.52 dark) and `accent` on the `--band` composite in light (4.96). The tightest pairs have under half a point of headroom, so any future surface change must re-run the check.

**Amended during implementation.** Light `--accent` was originally specified as `#c2410c`. That value scores **4.48:1** on the `--band` composite `#f9ece7` — the actual backdrop of `.sb-logo__accent`, the one place the accent renders as live text. It was darkened to **`#b63d0b`** (4.96:1). The band composite is an alpha blend (`--accent-soft` over `--surface`), so `check:contrast` composites it properly rather than dropping alpha; asserting `accent/bg` alone gives a false all-clear, which is exactly what the first run of the check reported.

### 4.2 Derived tokens

Shadows, `--line`, `--accent-soft`, `--band`, `--grid-line` are rewritten from the new inks — warm-shifted in light, cool-shifted in dark. `--radius-*`, `--sidebar-w`, `--rail-w`, `--content-max` and the whole motion block (lines 64-87 of the source) are **unchanged**.

---

## 5. Sections (pass 1)

### 5.1 Hero

Copy taken from the live site, verbatim:

- Line 1 (thin, weight 100): **Rainier**
- Line 2 (bold, weight 700): **Dimasacat Jr**
- Eyebrow: `GHL SPECIALIST / FUNNEL BUILDER`
- Lede: *"I build GoHighLevel systems that turn inquiries into booked conversations. Funnels, automations, routing, and follow-up for businesses that are tired of losing leads between 'contact us' and 'booked'."*
- CTAs: `Hire me →` and `View my work →`
- Contact strip: `techva.rain@gmail.com` · `0995 146 2765` · LinkedIn
- Location line: `Cavite, PH · replies within 24h`

The scroll exit (`hero-scene.ts`) is kept verbatim — foot leaves first, then the two lines part sideways.

### 5.2 The cqi re-measure — a named failure mode

`hero.css:29` sizes the headline in container units against a **measured** width:

```css
font-size: clamp(2.3rem, 13.05cqi, 10rem);
```

`13.05cqi` is derived from `"MAKE IT YOURS."` being **7.20em** wide in Geist 700 at `-0.05em`. Our headline is `Dimasacat Jr` — 12 characters against 14, and narrower glyphs.

**If this is not re-measured, the hero overflows its column at desktop widths and the `overflow-x: clip` at `hero.css:16` hides the break, producing a visibly clipped headline.**

Task: render `Dimasacat Jr` in Geist 700 at `-0.05em`, read its width in em (range width ÷ font-size), compute `94 ÷ that width`, and write both the number and the method into the comment block at `hero.css:24-28`.

### 5.3 Builds

20 chapters, drawn from the live site's real work:

| Group | Count | Examples |
|---|---|---|
| Automations | 12 | Legal nurture, FlowFix triage, TorqueWorks win-back, Haven AI booking, FitCoach Stripe→GHL |
| Funnels | 8 | Rubio roofing (featured), Legal 4-step intake |

Named builds to carry: **Rubio Roofing** (featured — hazard-stripe system, 20+ real builds, 5-tab gallery), FlowFix Plumbing, TorqueWorks Auto Care, Haven Animal Clinic, FitCoach, Legal Intake & Nurture.

Each chapter is a `WorkChapter` in `home.ts` and opens as a sheet at `/work/<slug>`. Adding one is a single array entry; the bento, the route and the sheet follow.

**Pass 1 ships 6 chapters, not 20.** The six named above, each with its real picture, real summary and real live link. The `WorkChapter[]` array is sized for 20 and the bento's `grid-template-areas` is keyed by id, so entries 7-20 are added as later passes land — no structural change, no rework. Six is the point at which the bento reads as a real portfolio rather than a demo; more is content work, not engineering, and it is deliberately not blocking the concept being proven.

`work.css` `grid-template-areas` is keyed by chapter id and must be re-keyed to the new set — this is a mechanical edit, but a missed key leaves a tile unplaced and invisible.

### 5.4 What fold into the shell

The live site's About material — software-development background, Stratpoint/OutSystems 2022-24, Fligno TypeScript/Next.js, Ling Ling React, PUP BS Computer Engineering 2022 — becomes **sidebar panel content**. It is credential context, not a scroll moment. It earns its place as a panel, not a section.

The sidebar keeps a live Cavite clock (`use-local-time.ts`).

---

## 6. Checks

Two executable checks are kept or added, plus one structural guard; all Playwright, all printing PASS/FAIL.

### `check:work-sheet` (kept from the template)
Asserts URL → sheet opens; drag-to-dismiss closes; scroll lock releases on close **and** on unmount while open; back button restores the closed state.

### `check:contrast` (new)
Parses `tokens.css`, resolves both themes, and asserts every ink/surface and accent/surface pair clears its threshold — 4.5:1 body, 3:1 for `--accent` at large sizes only. Fails the build on regression.

### `check:bento` (new)
Asserts every id in `workChapters[]` has a matching `grid-template-areas` key in `work.css`. Guards the §5.3 failure mode directly.

**These checks are the reason the palette work is safe.** A full surface rethink invalidates contrast assumptions written into comments across roughly ten CSS files. The checks make that assumption failure loud instead of visual.

### Also required
- `npm run build` — `tsc -b` clean.
- `npm run lint` — clean.

---

## 7. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Palette change silently breaks contrast assumed in ~10 CSS files' comments | **High** | `check:contrast` runs before any visual judgement. Comments in kept files re-audited during the pass. |
| Headline cqi not re-measured → clipped hero | Medium | Named explicitly in §5.2 with the measurement method and the 94-divisor. |
| `grid-template-areas` key mismatch → invisible tile | Medium | `check:bento` asserts every chapter id has an area. |
| Sheet momentum feels wrong with the new surfaces | Low | Physics untouched; only backdrop changed. |
| Motion law drifts during the palette edit | Low | `gsap.ts`, `smooth-scroll.ts`, `use-scroll-scene.ts` are verbatim. Review is a diff check. |

The motion law itself carries **no** risk. It is already solved and is not being touched.

---

## 8. Out of scope (pass 1)

Explicitly deferred, each additive under the existing law:

- **Services** — the live site's 5 (Routing, Funnels, AI & Prompts, API Integrations, No-Code). Pass 2.
- **Contact** — mailto hand-off. Pass 2.
- three.js background, search palette, showcase, proof, manifesto, automation diagram, legal pages.
- SEO, sitemap, `llms.txt`, JSON-LD (`lib/seo.ts` deleted).
- nginx deploy config and CSP.

---

## 9. Acceptance

Done when:

1. `npm run dev` renders Hero and Builds with Rainier's real content in both themes.
2. `check:work-sheet` passes.
3. `check:contrast` passes — all pairs per §4.1.
4. `check:bento` passes — every chapter id resolves to a grid area.
5. `npm run build` and `npm run lint` are clean.
6. Hero headline is uncropped at 1280, 1440 and 1920.
7. `git diff` on `src/lib/motion/` and `src/hooks/use-scroll-scene.ts` is **empty**.
8. Source file count is 20, from ~90.