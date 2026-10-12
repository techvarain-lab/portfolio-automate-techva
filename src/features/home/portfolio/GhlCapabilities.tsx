import { useState } from 'react'
import { ArrowUpRight, ArrowRight } from '@phosphor-icons/react'
import content from '@/content/portfolio-sections.json'
import './portfolio.css'

const groups = [
  { title: 'Manage leads', ids: ['01', '02'] },
  { title: 'Capture & book', ids: ['03', '05'] },
  { title: 'Run & scale', ids: ['04', '06', '07', '08'] },
]
const platformSkills = content.skills.filter(skill => skill.n !== '09')
const proofPath = (path: string) => path.replace('assets/ghl/', '/images/ghl/')

export function GhlCapabilities() {
  const [selected, setSelected] = useState('01')
  const [shotIndex, setShotIndex] = useState(0)
  const skill = platformSkills.find(item => item.n === selected)!
  const proof = [...skill.proof.map(path => ({path, label:skill.title})), ...skill.subs.flatMap(sub => sub.proof.map(path => ({path, label:sub.title})))]
  const shot = proof[shotIndex] ?? proof[0]
  return <section id="ghl" className="portfolio-section" aria-labelledby="ghl-title">
    <header className="portfolio-heading"><h2 id="ghl-title">Built inside GoHighLevel.</h2><p>A closer look at the platform skills behind my builds. Select a capability to explore the setup and supporting screenshots.</p></header>
    <div className="ghl-explorer">
      <nav className="ghl-skills" aria-label="GoHighLevel capabilities">{groups.map(group => <div className="ghl-skill-group" key={group.title}><h3>{group.title}</h3>{group.ids.map(id => {
        const item = platformSkills.find(s => s.n === id)!
        return <button type="button" key={id} aria-pressed={selected === id} aria-controls="ghl-proof-viewer" onClick={() => { setSelected(id); setShotIndex(0) }}><span>{item.title}</span><ArrowRight size={15} aria-hidden /></button>
      })}</div>)}</nav>
      <div id="ghl-proof-viewer" className="ghl-viewer">
        <div className="ghl-viewer__heading"><h3>{skill.title}</h3><p>{skill.desc}</p></div>
        {shot ? <><figure className="ghl-viewer__figure"><a href={proofPath(shot.path)} target="_blank" rel="noreferrer"><img src={proofPath(shot.path)} alt={`${shot.label} — GoHighLevel configuration screenshot`} loading="lazy" /><span className="sr-only">Open full screenshot in a new tab</span></a><figcaption><span>{shot.label}</span><a href={proofPath(shot.path)} target="_blank" rel="noreferrer">Open full size <ArrowUpRight size={14} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a></figcaption></figure><div className="ghl-thumbnails" role="group" aria-label="Select proof screenshot">{proof.map((item, index) => <button key={`${item.path}-${index}`} type="button" aria-label={`${item.label}, screenshot ${index+1}`} aria-pressed={index === shotIndex} onClick={() => setShotIndex(index)}><img src={proofPath(item.path)} alt="" loading="lazy" /></button>)}</div></> : <div className="ghl-viewer__no-proof"><p>Explore this capability through my concept builds.</p><a href="#work">View the workflows and funnels <ArrowUpRight size={15} aria-hidden /></a></div>}
        {skill.subs.length > 0 && <div className="ghl-skill-notes">{skill.subs.map(sub => <details key={sub.title}><summary>{sub.title}</summary><p>{sub.desc}</p></details>)}</div>}
      </div>
    </div>
  </section>
}

export function ProcessSection() {
  const process = content.skills.find(skill => skill.n === '09')!
  return <section id="process" className="portfolio-section" aria-labelledby="process-title"><header className="portfolio-heading"><h2 id="process-title">How I work.</h2><p>{process.desc}</p></header><ol className="process-steps">{process.subs.map(step => <li key={step.title}><details><summary>{step.title}</summary><p>{step.desc}</p></details></li>)}</ol></section>
}
