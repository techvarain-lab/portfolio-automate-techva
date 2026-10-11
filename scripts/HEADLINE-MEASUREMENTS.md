# Measured headline metrics (Geist, uppercase, -0.05em, letter-spacing)

Produced by `node scripts/measure-headline.mjs`. Re-run it after editing any hero line.

| Line | Weight | Width (em) | `cqi` for a 94%-full column |
|---|---|---|---|
| `MAKE IT YOURS.` (template original) | 700 | 6.792 | 13.84 |
| `RAINIER` | 100 | 3.448 | 27.26 |
| `DIMASACAT JR` | 700 | 6.451 | **14.571** |

## What this means for `hero.css`

The template shipped `13.05cqi`, derived from a stated width of `7.20em`. **That stated width is
wrong — the real measured width is `6.792em`, which would give `13.84cqi`.** The shipped number is
*smaller* than either, so the original headline rendered slightly under-full. It did not overflow.

`DIMASACAT JR` measures `6.4511em`, narrower than the original, so the bold line fills the column at
a **larger** font size:

```css
.hero__title { font-size: clamp(2.3rem, 14.571cqi, 10rem); }
```

`RAINIER` is set at the same font size (it is a second line of the same block, not a separate scale),
so it naturally occupies roughly half the column width. No separate clamp is needed.

## Why the number must be re-measured, not copied

`13.05cqi` is calibrated to one specific string in one specific variable font. A different string at
the same `cqi` either under-fills the column or overflows it, and `.hero { overflow-x: clip }`
(`hero.css:16`) **hides an overflow rather than showing it** — the headline appears silently cropped
at some viewport widths with no visible error. There is no test failure. The only defence is
measuring.

To re-measure: run `node scripts/measure-headline.mjs`, read `widthEm`, and set
`cqi = 94 / widthEm`.