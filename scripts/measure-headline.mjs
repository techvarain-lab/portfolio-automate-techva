import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.argv[2]
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
  const face = new FontFace('GeistMeasure', await blob.arrayBuffer())
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