import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs'
import ts from 'typescript'

const sourceRoot = new URL('../../variant-E/', new URL('../', import.meta.url))
const html = readFileSync(new URL('index.html', sourceRoot), 'utf8')
const start = html.indexOf('const glSkills=')
const end = html.indexOf('\nconst ghlTiles=', start)
const ast = ts.createSourceFile('skills.js', html.slice(start, end), ts.ScriptTarget.Latest, true)
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(p => [p.name.text, literal(p.initializer)]))
  throw new Error(`Unsupported data syntax: ${node.kind}`)
}
const skills = literal(ast.statements[0].declarationList.declarations[0].initializer)
const servicesHtml = html.slice(html.indexOf('<section class="panel panel-services"'), html.indexOf('<!-- GHL -->'))
const services = [...servicesHtml.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p><ul>(.*?)<\/ul>/gs)].map(m => ({title:m[1], description:m[2], tags:[...m[3].matchAll(/<li>(.*?)<\/li>/g)].map(t => t[1])}))
mkdirSync('src/content', { recursive: true })
writeFileSync('src/content/portfolio-sections.json', JSON.stringify({ services, skills }, null, 2) + '\n')
cpSync(new URL('assets/ghl/', sourceRoot), 'public/images/ghl', {recursive:true})
console.log(`Imported ${services.length} services and ${skills.length} capability groups with proof assets.`)
