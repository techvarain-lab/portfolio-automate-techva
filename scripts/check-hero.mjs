// Hero-specific checks that the contrast suite cannot cover.
// Two failures in this section are silent by construction: the phone
// scroll-timeline block in hero.css is load-bearing (reduced-motion phones
// lose their hero exit if it is dropped in a re-skin), and the headline is
// sized from a measured `cqi` behind `overflow-x: clip`, which hides an
// overflow instead of showing it. Nothing raises an error for either, so
// both are asserted here at three widths.
//
// Usage: BASE=http://localhost:5190 CHROME_PATH=<chrome> node scripts/check-hero.mjs
// (exits non-zero on any failure)

import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:5190'
const WIDTHS = [1280, 1440, 1920]

const failures = []
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`)
  if (!ok) failures.push(message)
}

const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
const browser = await chromium.launch(launch)

try {
  for (const width of WIDTHS) {
    const page = await browser.newPage()
    await page.setViewportSize({ width, height: 900 })
    await page.goto(BASE, { waitUntil: 'networkidle' })

    // The @supports (animation-timeline: view()) block survives the re-skin.
    const hasTimeline = await page.evaluate(
      () =>
        CSS.supports('animation-timeline', 'view()') &&
        [...document.styleSheets].some((s) => {
          try {
            return [...s.cssRules].some((r) => r.cssText.includes('animation-timeline'))
          } catch {
            return false
          }
        }),
    )
    check(hasTimeline, `phone scroll-timeline fallback is present at ${width}`)

    // The measured cqi is right: the headline fits its column uncropped.
    const fit = await page.evaluate(() => {
      const title = document.querySelector('.hero__title')
      const hero = document.querySelector('.hero')
      if (!title || !hero) return { found: false }
      const t = title.getBoundingClientRect()
      const h = hero.getBoundingClientRect()
      return {
        found: true,
        text: title.textContent.trim().replace(/\s+/g, ' '),
        width: Math.round(t.width),
        right: Math.round(t.right),
        heroRight: Math.round(h.right),
      }
    })
    check(fit.found, `hero headline element is present at ${width}`)
    if (fit.found) {
      check(fit.right <= fit.heroRight + 1, `hero headline fits its column at ${width} (right ${fit.right} <= ${fit.heroRight})`)
      check(fit.width > 0, `hero headline has a measured width at ${width} (${fit.width}px)`)
    }

    await page.close()
  }
} finally {
  await browser.close()
}

console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL PASS')
process.exitCode = failures.length ? 1 : 0
