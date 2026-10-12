import { readFileSync } from 'node:fs'

const home = readFileSync('src/content/home.ts', 'utf8')
const css = readFileSync('src/features/home/work/work.css', 'utf8')

let failures = 0
const check = (condition, message) => {
  const status = condition ? 'PASS' : 'FAIL'
  console.log(`${status}: ${message}`)
  if (!condition) failures += 1
}

const chaptersStart = home.indexOf('const chapters: WorkChapter[] = [')
const chaptersEnd = home.indexOf('export const workChapters', chaptersStart)
check(chaptersStart >= 0 && chaptersEnd > chaptersStart, 'chapter source is readable')

const chapterSource = home.slice(chaptersStart, chaptersEnd)
const ids = [...chapterSource.matchAll(/^ {4}id: '([^']+)',?$/gm)].map((match) => match[1])
const rules = [...css.matchAll(/\.wb__cell\[data-area='([^']+)'\]\s*\{\s*grid-area:\s*([^;]+);\s*\}/g)]
const keyedAreas = new Map(rules.map((match) => [match[1], match[2].trim()]))
const templates = [...css.matchAll(/grid-template-areas:\s*([\s\S]*?);/g)]
const templateAreas = new Set(
  templates.flatMap((match) =>
    [...match[1].matchAll(/'([^']+)'/g)].flatMap((row) => row[1].trim().split(/\s+/)),
  ),
)

check(ids.length === 6, `found six chapters (${ids.join(', ')})`)
check(templates.length === 2, 'desktop and compact bento templates are declared')

for (const id of ids) {
  check(keyedAreas.get(id) === id, `chapter '${id}' maps to its matching grid area`)
  check(templateAreas.has(id), `chapter '${id}' appears in a grid template`)
}

for (const area of templateAreas) {
  check(ids.includes(area), `grid area '${area}' belongs to a chapter`)
}

if (failures > 0) {
  console.error(`\n${failures} bento check${failures === 1 ? '' : 's'} failed.`)
  process.exit(1)
}

console.log('\nAll bento checks passed.')
