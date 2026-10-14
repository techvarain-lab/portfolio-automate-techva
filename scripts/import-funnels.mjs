import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspace = resolve(root, '../../..')
const funnels = [
  ['rubio', 'Rubio Roofing - Construction Inspired', 'funnelbuild-rubio_roofing', ['index.html', 'thank-you.html', 'assets']],
  ['mountain-hiking', 'Mountain Hiking', 'funnelbuild-mountainhiking', ['index.html', 'thank-you.html', 'assets']],
  ['clearview', 'Clearview Latest', 'funnelbuild-clearview', ['index.html', 'assets']],
  ['legal-intake', 'Legal Intake', 'funnelbuild-legal_intake', ['index.html']],
  ['fitcoach', 'Web Design Engineer', 'funnelbuild-fitcoach', ['index.html', 'coaching.html']],
  ['haven-animal', 'Haven Animal Clinic', 'funnelbuild-haven_animal_clinic', ['index.html']],
  ['bright-minds', 'Bright Minds', 'funnelbuild-brightminds', ['index.html', 'book.html', 'thank-you.html', 'styles.css', 'assets']],
  ['executive-coaching', 'Northstar Coaching/v5', 'funnelbuild-northstar-v2', ['index.html']],
]

function copy(source, target) {
  if (!existsSync(source)) throw new Error(`Missing funnel dependency: ${source}`)
  if (statSync(source).isDirectory()) {
    for (const entry of readdirSync(source)) {
      if (entry.startsWith('.')) continue
      copy(join(source, entry), join(target, entry))
    }
  } else {
    if (statSync(source).size > 95 * 1024 * 1024) throw new Error(`Asset too large for GitHub: ${source}`)
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(source, target)
  }
}

for (const [slug, folder, , entries] of funnels) {
  const source = join(workspace, folder)
  for (const entry of entries) copy(join(source, entry), join(root, 'public/funnels', slug, entry))
  console.log(`Imported /funnels/${slug}/`)
}

// Mechanical URL migration only; original source folders and their Git repos stay untouched.
const contentPath = join(root, 'src/content/concept-builds.json')
let content = readFileSync(contentPath, 'utf8')
for (const [slug, , repository] of funnels) {
  content = content.replaceAll(`https://techvarain-lab.github.io/${repository}/`, `/funnels/${slug}/index.html`)
  content = content.replaceAll(`"/funnels/${slug}/"`, `"/funnels/${slug}/index.html"`)
}
writeFileSync(contentPath, content)
