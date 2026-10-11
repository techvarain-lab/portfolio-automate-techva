import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// Default to the repo root (the parent of scripts/), so the script runs with no arguments.
const root = process.argv[2] ?? path.resolve(import.meta.dirname, '..')
const font = readFileSync(path.join(root, 'public/fonts/geist-var.woff2'))

// Measures a hero headline in em so the `cqi` size in hero.css can be set from a real number.
// Usage: node scripts/measure-headline.mjs
// CHROME_PATH overrides the browser binary (set it if `npx playwright install` could not fetch).
const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
const browser = await chromium.launch(launch)
const page = await browser.newPage()
await page.setContent('<div id="t"></div>')
await page.evaluate(async (bytes) => {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'font/woff2' })
  // The weight RANGE is required. Without it the face registers as 400 only, so
  // `font-weight: 700` never resolves to the variable font's real 700 instance and
  // the browser substitutes the 400 instance (plus synthetic bold). That silently
  // mis-measures every bold line: `DIMASACAT JR` reads 6.4511em instead of the
  // 6.8245em the page actually renders, a 5.8% error that shrinks the headline.
  // Keep this in sync with the `font-weight: 100 900` in src/styles/index.css.
  const face = new FontFace('GeistMeasure', await blob.arrayBuffer(), { weight: '100 900' })
  await face.load()
  document.fonts.add(face)
}, [...font])

const measure = await page.evaluate(() => {
  const t = document.getElementById('t')
  t.style.fontFamily = 'GeistMeasure'
  t.style.letterSpacing = '-0.05em'
  t.style.textTransform = 'uppercase'
  t.style.whiteSpace = 'nowrap'
  t.style.position = 'absolute'
  t.style.fontSize = '100px'
  const out = []
  for (const [text, weight] of [
    ['MAKE IT YOURS.', 700],
    ['RAINIER', 100],
    ['DIMASACAT JR', 700],
    ['GHL SPECIALIST', 700],
  ]) {
    t.style.fontWeight = String(weight)
    t.textContent = text
    const r = t.getBoundingClientRect()
    out.push({
      text,
      weight,
      widthEm: +(r.width / 100).toFixed(4),
      cqiFor94: +(94 / (r.width / 100)).toFixed(3),
      at13_05cqiWidthPx: +((94 / 100) * (r.width / 100) * 1000).toFixed(1),
    })
  }
  return out
})

console.log(JSON.stringify(measure, null, 2))
await browser.close()