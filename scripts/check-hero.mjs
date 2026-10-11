// Hero-specific checks that the contrast suite cannot cover.
// Two failures in this section are silent by construction: the phone
// scroll-timeline block in hero.css is load-bearing (reduced-motion phones
// lose their hero exit if it is dropped in a re-skin), and the headline is
// sized from a measured `cqi` behind `overflow-x: clip`, which hides an
// overflow instead of showing it. Nothing raises an error for either, so both
// are asserted here.
//
// Two things this check has to get right to be worth anything:
//   - Measure the TEXT (a Range over the line), not the element's rect. The
//     title is a flex column, so its own rect can equal the container and would
//     hide a cropped line.
//   - Compare against the container's CONTENT box, not its padding box. `.hero`
//     carries 24px of horizontal padding, so a padding-box comparison silently
//     tolerates 24px of cropping per side.
// Narrow widths are included because that is where the `clamp` floor starts to
// crop: the line is a fixed 6.8245em wide, so any floor above 6.8245 x
// contentWidth overflows, and the clip hides it.
//
// Usage: BASE=http://localhost:5190 CHROME_PATH=<chrome> node scripts/check-hero.mjs
// (exits non-zero on any failure)

import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:5190'
// 280 is the narrowest realistic phone (Galaxy Fold outer). 1920 is past the 10rem cap.
const WIDTHS = [280, 300, 320, 375, 768, 1280, 1440, 1920]
const FLOOR_PX = 30.4 // 1.9rem, the clamp floor in hero.css
const CAP_PX = 160 // 10rem, the clamp cap in hero.css

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

    const fit = await page.evaluate(() => {
      const hero = document.querySelector('.hero')
      const title = document.querySelector('.hero__title')
      if (!hero || !title) return { found: false }
      const hs = getComputedStyle(hero)
      const hr = hero.getBoundingClientRect()
      const contentLeft = hr.left + parseFloat(hs.paddingLeft)
      const contentRight = hr.right - parseFloat(hs.paddingRight)
      // The real ink of every line, unioned.
      const nodes = title.querySelectorAll('span').length ? title.querySelectorAll('span') : [title]
      let left = Infinity
      let right = -Infinity
      for (const node of nodes) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const box = range.getBoundingClientRect()
        if (!box.width) continue
        left = Math.min(left, box.left)
        right = Math.max(right, box.right)
      }
      return {
        found: true,
        fontSize: parseFloat(getComputedStyle(title).fontSize),
        contentLeft: Math.round(contentLeft),
        contentRight: Math.round(contentRight),
        contentWidth: Math.round(contentRight - contentLeft),
        inkLeft: Math.round(left),
        inkRight: Math.round(right),
        inkWidth: Math.round(right - left),
      }
    })

    check(fit.found, `hero headline element is present at ${width}`)
    if (!fit.found) {
      await page.close()
      continue
    }

    // The line is uncropped: its ink sits inside the container's content box.
    check(
      fit.inkLeft >= fit.contentLeft - 1 && fit.inkRight <= fit.contentRight + 1,
      `headline ink inside the content box at ${width} (${fit.inkLeft}..${fit.inkRight} vs ${fit.contentLeft}..${fit.contentRight})`,
    )

    // Where neither clamp bound is operative the `cqi` alone governs, and the
    // line must fill the column at the calibrated ratio. This is the assertion
    // that catches a `cqi` drifting away from HEADLINE-MEASUREMENTS.md.
    if (fit.fontSize > FLOOR_PX + 0.1 && fit.fontSize < CAP_PX - 0.1) {
      const ratio = fit.inkWidth / fit.contentWidth
      check(
        ratio > 0.9 && ratio < 0.98,
        `headline fills ~94% of the column at ${width} (${(ratio * 100).toFixed(1)}%)`,
      )
    }

    await page.close()
  }
} finally {
  await browser.close()
}

console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL PASS')
process.exitCode = failures.length ? 1 : 0
