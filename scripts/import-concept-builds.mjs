import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname } from 'node:path'
import ts from 'typescript'
const source = new URL('../../variant-E/', new URL('../', import.meta.url))
const html = readFileSync(new URL('index.html', source), 'utf8')
const start = html.indexOf('const projects=[')
const end = html.indexOf('\n];', start) + 3
const ast = ts.createSourceFile('data.js', html.slice(start, end), ts.ScriptTarget.Latest, true)
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(p => [p.name.text, literal(p.initializer)]))
  throw new Error(`Unsupported syntax ${node.kind}`)
}
const projects = literal(ast.statements[0].declarationList.declarations[0].initializer)
const copy = path => {
  if (!path?.startsWith('assets/')) return undefined
  const destination = `public/images/concepts/${path.slice(7)}`
  mkdirSync(dirname(destination), { recursive: true })
  copyFileSync(new URL(path, source), destination)
  return { src: `/${destination.slice(7)}`, alt: 'Concept build screenshot', width: 1600, height: 900 }
}
const chapters = projects.map(p => {
  const automation = p.cat === 'automation'
  const images = automation ? (p.automation?.length ? p.automation : p.flows?.flatMap(f => f.imgs ?? []) ?? []) : (p.sections?.length ? p.sections : [p.full || p.img])
  const gallery = [...new Set(images)].map(copy).filter(Boolean)
  const cover = automation ? gallery[0] : copy(p.img)
  return {id:`concept-${p.n}`, title:p.title, line:p.desc, description:p.desc, category:p.cat, concept:true, count:gallery.length, unit:automation ? 'workflow views' : 'page views', tile:cover, lead:cover, gallery, items:[], ...(p.liveUrl ? {link:{label:'Open concept demo',href:p.liveUrl,external:true}} : {})}
})
writeFileSync('src/content/concept-builds.json', JSON.stringify(chapters, null, 2) + '\n')
function needFor(name) {
  if (/payment|checkout|stripe|deposit/i.test(name)) return 'Payments'
  if (/review|reputation|referral/i.test(name)) return 'Reviews'
  if (/win.back|dormant|reactivat|re.engag|cold lead/i.test(name)) return 'Retention'
  if (/booking|appointment|reminder|consultation|cancellation|confirmation/i.test(name)) return 'Booking'
  if (/lead|intake|triage|missed.call|emergency|owner alert/i.test(name)) return 'Lead response'
  return 'Operations'
}
const automations = projects.filter(p => p.cat === 'automation').flatMap(p => (p.flows ?? []).map((flow, index) => {
  const gallery = [...new Set(flow.imgs ?? [])].map(copy).filter(Boolean)
  return {id:`automation-${p.n}-${index+1}`, title:flow.name.replace(/Missed-Call-Text-Back/i,'Missed-call text-back'), business:p.title.split(/ — | – /)[0], need:needFor(flow.name), category:'automation', concept:true, line:flow.short.split(/(?<=[.!?])\s/)[0], description:flow.short, problem:flow.problem, solution:flow.solution, intendedOutcome:flow.outcome, count:gallery.length, unit:'workflow views', tile:gallery[0], lead:gallery[0], gallery, items:[]}
}))
writeFileSync('src/content/automation-builds.json', JSON.stringify(automations, null, 2) + '\n')
console.log(`Imported ${automations.length} individual automation workflows.`)
console.log(`Imported ${chapters.filter(p=>p.category==='automation').length} automation concepts and ${chapters.filter(p=>p.category==='funnel').length} funnel concepts.`)
