// WCAG 2.1 contrast check for the palette in src/styles/tokens.css.
// Both themes are parsed out of the stylesheet and the pairs below are measured
// with the standard relative-luminance formula. The tightest pairs are
// ink-3/surface-3 (4.78 light, 4.52 dark) and accent on the band composite
// (4.96 light), so they carry almost no headroom over AA: any future surface or
// ink change must re-run this rather than re-eyeballing the comment in tokens.css.
//
// Translucent tokens are composited, never measured at full strength: --band is
// painted over --surface before it is used as a backdrop, because that is what
// the sidebar banner actually renders as.
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

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * The declarations inside the rule whose selector line matches `selector`.
 * The match is anchored to the start of a line: `:root {` also appears inside
 * `@media (prefers-contrast: more)`, and taking the first bare hit would
 * silently measure the high-contrast override if the blocks were reordered.
 */
const blockFor = (selector) => {
  const found = new RegExp(`^[ \\t]*${escapeRe(selector)}`, 'm').exec(css)
  if (!found) throw new Error(`no ${selector} block in tokens.css`)
  const open = css.indexOf('{', found.index)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error(`unbalanced braces after ${selector}`)
}

/** The raw declaration text of `--name` in `block`, following one level of var() indirection. */
const declaration = (block, name, depth = 0) => {
  const decl = new RegExp(`(?:^|[;{\\s])\\s*${escapeRe(name)}\\s*:\\s*([^;]+);`).exec(block)?.[1]?.trim()
  if (!decl) throw new Error(`${name} is not set in the block`)
  const ref = /^var\(\s*(--[\w-]+)\s*\)$/.exec(decl)
  if (ref) {
    if (depth > 4) throw new Error(`${name}: var() chain is too deep at ${decl}`)
    return declaration(block, ref[1], depth + 1)
  }
  return decl
}

/** A colour declaration -> [r, g, b, a], each channel 0-255 and alpha 0-1. */
const parse = (name, decl) => {
  const hex = /^#([0-9a-f]{6})$/i.exec(decl)
  if (hex) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16))
    return [r, g, b, 1]
  }
  const rgb = /^rgba?\(\s*([\d.]+)(?:\s*[,\s]\s*([\d.]+))?(?:\s*[,\s]\s*([\d.]+))?(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/i.exec(decl)
  if (rgb) {
    const [, r, g, b, a] = rgb
    if (r === undefined) throw new Error(`${name}: ${decl} has no channels`)
    return [Number(r), Number(g), Number(b), a === undefined ? 1 : a.endsWith('%') ? parseFloat(a) / 100 : Number(a)]
  }
  throw new Error(`${name}: ${decl} is neither #hex nor rgb()`)
}

/** Source-over compositing: `fg` (with alpha) laid over the opaque `bg`. */
const composite = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]))

const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const lum = (rgb) => 0.2126 * lin(rgb[0] / 255) + 0.7152 * lin(rgb[1] / 255) + 0.0722 * lin(rgb[2] / 255)
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
  ['accent', 'band'],
  ['accent-ink', 'bg'],
  ['accent-ink', 'surface'],
  ['accent-ink', 'surface-3'],
  ['accent-ink', 'band'],
  ['accent-deep', 'bg'],
  ['accent-deep', 'surface'],
  ['accent-deep', 'surface-3'],
  ['on-accent', 'accent'],
]

const themes = [
  ['light', blockFor(':root {')],
  ['dark', blockFor(":root[data-theme='dark'] {")],
]

console.log('Contrast, WCAG 2.1. Every pair needs 4.5:1.\n')
for (const [theme, block] of themes) {
  const colour = (name) => parse(`--${name}`, declaration(block, `--${name}`))
  const surface = colour('surface').slice(0, 3)
  // --band is translucent in both themes: composite it over --surface to get the
  // backdrop the sidebar banner actually paints behind the logo accent.
  const backdrop = (name) =>
    name === 'band' ? composite(colour('band'), surface) : colour(name).slice(0, 3)

  console.log(`${theme}:`)
  for (const [fg, bg] of PAIRS) {
    const r = ratio(colour(fg).slice(0, 3), backdrop(bg))
    const note = bg === 'band' ? ' (band composited over --surface)' : ''
    check(r >= 4.5, `${theme}  --${fg} on --${bg}${note}: ${r.toFixed(2)}:1 (min 4.5)`)
  }
  console.log('')
}

console.log(failures.length ? `${failures.length} FAILED` : 'ALL PASS')
process.exitCode = failures.length ? 1 : 0
