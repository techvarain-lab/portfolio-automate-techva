// WCAG 2.1 contrast check for the palette in src/styles/tokens.css.
// Both themes are parsed out of the stylesheet and the pairs below are measured
// with the standard relative-luminance formula. No pair has more than 0.5 of
// headroom over 4.5:1, so any future surface or ink change must re-run this.
//
// Usage: npm run check:contrast   (exits non-zero on any failure)

import { readFileSync } from 'node:fs'

const TOKENS = new URL('../src/styles/tokens.css', import.meta.url)

const failures = []
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`)
  if (!ok) failures.push(message)
}

const css = readFileSync(TOKENS, 'utf8')

/** The declarations inside the rule whose selector line matches `selector`. */
const blockFor = (selector) => {
  const at = css.indexOf(selector)
  if (at === -1) throw new Error(`no ${selector} block in tokens.css`)
  const open = css.indexOf('{', at)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error(`unbalanced braces after ${selector}`)
}

/** `--name: #rrggbb` or `--name: rgb(r g b / a)` -> "#rrggbb". Alpha is ignored. */
const resolve = (block, name) => {
  const decl = new RegExp(`${name}:\\s*([^;]+);`).exec(block)?.[1]?.trim()
  if (!decl) throw new Error(`--${name} is not set in the block`)
  const hex = /^#([0-9a-f]{6})$/i.exec(decl)
  if (hex) return decl.toLowerCase()
  const rgb = /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(decl)
  if (rgb) return `#${[rgb[1], rgb[2], rgb[3]].map((c) => Math.round(Number(c)).toString(16).padStart(2, '0')).join('')}`
  throw new Error(`--${name}: ${decl} is neither #hex nor rgb()`)
}

const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Every pair that has to clear 4.5:1, in both themes. */
const PAIRS = [
  ['ink', 'bg'],
  ['ink', 'surface'],
  ['ink', 'surface-2'],
  ['ink', 'surface-3'],
  ['ink-2', 'bg'],
  ['ink-2', 'surface-3'],
  ['ink-3', 'bg'],
  ['ink-3', 'surface-3'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['on-accent', 'accent'],
]

const themes = [
  ['light', blockFor(':root {')],
  ['dark', blockFor(":root[data-theme='dark'] {")],
]

console.log('Contrast, WCAG 2.1. Every pair needs 4.5:1.\n')
for (const [theme, block] of themes) {
  console.log(`${theme}:`)
  for (const [fg, bg] of PAIRS) {
    const r = ratio(resolve(block, `--${fg}`), resolve(block, `--${bg}`))
    check(r >= 4.5, `${theme}  --${fg} on --${bg}: ${r.toFixed(2)}:1 (min 4.5)`)
  }
  console.log('')
}

console.log(failures.length ? `${failures.length} FAILED` : 'ALL PASS')
process.exitCode = failures.length ? 1 : 0