# Measured headline metrics (Geist, uppercase, -0.05em, letter-spacing)

Produced by `node scripts/measure-headline.mjs`. Re-run it after editing any hero line.

| Line | Weight | Width (em) | `cqi` for a 94%-full column |
|---|---|---|---|
| `MAKE IT YOURS.` (template original) | 700 | 7.2038 | 13.049 |
| `RAINIER` | 100 | 3.1941 | 29.430 |
| `DIMASACAT JR` | 700 | 6.8245 | **13.774** |
| `GHL SPECIALIST` | 700 | 7.3442 | 12.799 |

## What this means for `hero.css`

```css
.hero__title { font-size: clamp(1.9rem, 13.774cqi, 10rem); }
```

## Correction — the tool used to under-measure every bold line

An earlier version of this table recorded `DIMASACAT JR` at `6.4511em`, and concluded from a
`MAKE IT YOURS.` reading of `6.792em` that the template's own stated `7.20em` was wrong.

**Both numbers were artifacts of a bug in the measuring script, not facts about the font.** The
script created its `FontFace` without a weight range:

```js
new FontFace('GeistMeasure', buffer)                  // registers as weight 400 only
new FontFace('GeistMeasure', buffer, { weight: '100 900' })   // correct
```

With no range, `font-weight: 700` never resolves to the variable font's real 700 instance — the
browser substitutes the 400 instance plus synthetic bold. That mis-measures every bold line by
about 5.8% (narrow) and every thin line by about 8% (wide). The fix is the `weight` descriptor;
`scripts/measure-headline.mjs` carries a comment explaining why it must stay.

The corrected numbers, each confirmed against the real rendered page as well as the tool:

| Line | Buggy reading | True reading | Confirmed in the live DOM |
|---|---|---|---|
| `MAKE IT YOURS.` 700 | 6.792 | **7.2038** | — |
| `DIMASACAT JR` 700 | 6.4511 | **6.8245** | 682.4531px at a pinned 100px font-size = 6.8245em ✓ |
| `RAINIER` 100 | 3.4481 | **3.1941** | 319.4063px at 100px = 3.1941em ✓ |

**The template's `13.05cqi` was therefore correct all along.** `94 / 7.2038 = 13.049`, which is the
`13.05cqi` it shipped, calibrated to a correctly-stated `7.20em`. The claim that the template's
calibration was unreliable came from the bug, not from the template.

## The floor, and why it is 1.9rem rather than 2.3rem

The line is 6.8245em wide at every size, so at the chosen `cqi` it fills exactly 94% of the
container's content box at *any* width — the ratio is width-independent, and the line cannot
overflow while the `cqi` term is the operative one.

The floor breaks that. Below the width where `13.774cqi` falls under the floor, the font stops
shrinking while the container keeps shrinking, so the line starts to overflow — and
`.hero { overflow-x: clip }` hides it rather than showing it. Measured:

| Viewport | Content box | Font-size | Line width | Result |
|---|---|---|---|---|
| 320 | 257px | 35.4px | 242px | fits (94%) |
| 300 | 237px | floor | 251px | **overflows 14px — cropped** |
| 280 | 217px | floor | 251px | **overflows 34px — cropped both sides** |

At `2.3rem` the floor engages below a ~330px viewport and the line is 251px wide, so it is silently
cropped on any device narrower than about 314px — Galaxy Fold-class phones. At `1.9rem` the floor
engages below a ~270px viewport, where the line is 207px and still fits.

The floor's job is only to stop the line getting silly inside a pathological container, not to set
a readable minimum on phones — at 280px the unbounded `cqi` size is already ~30px.

## Why the number must be re-measured, not copied

`13.774cqi` is calibrated to one specific string in one specific variable font at one specific
weight. A different string at the same `cqi` either under-fills the column or overflows it, and
`.hero { overflow-x: clip }` (`hero.css:16`) **hides an overflow rather than showing it** — the
headline appears silently cropped at some viewport widths with no visible error. There is no test
failure unless one is written. `scripts/check-hero.mjs` is that test.

To re-measure: run `node scripts/measure-headline.mjs`, read `widthEm`, and set
`cqi = 94 / widthEm`.
