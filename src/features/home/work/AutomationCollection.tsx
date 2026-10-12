import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, GitBranch, MagnifyingGlass, Play } from '@phosphor-icons/react'
import { chapterPath, featuredAutomations, workChapters } from '@/content/home'

const automations = workChapters.filter(build => build.category === 'automation')
const featuredCopy: Record<string, { title: string; description: string }> = {
  'automation-08-2': { title: 'Missed-call text-back', description: 'Respond automatically when your team misses a call.' },
  'automation-07-1': { title: 'Lead qualification & routing', description: 'Route buyer and seller inquiries into the right follow-up path.' },
  'automation-25-5': { title: 'Booking reminders', description: 'Remind leads about their upcoming consultation.' },
  'automation-05-1': { title: 'New-client onboarding', description: 'Update the CRM, client roster, and team when a payment comes in.' },
  'automation-05-3': { title: 'Failed-payment recovery', description: 'Follow up on declined payments and alert the team when needed.' },
  'automation-22-1': { title: 'Dormant-customer win-back', description: 'Re-engage inactive customers and stop follow-up when they return.' },
}

export function AutomationCollection() {
  const [query, setQuery] = useState('')
  const [playDemo, setPlayDemo] = useState(false)
  const term = query.trim().toLowerCase()
  const results = automations.filter(build => `${build.title} ${build.line} ${build.need} ${build.business}`.toLowerCase().includes(term))
  return <>
    <article className="automation-demo" aria-labelledby="cleaning-demo-title">
      <div className="automation-demo__player">{playDemo ? <iframe src="https://www.youtube-nocookie.com/embed/ZGSWorxyJKg?autoplay=1&rel=0" title="Cleaning business concept demo: from inquiry to booked job" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" ref={element => element?.focus()} /> : <button type="button" className="automation-demo__poster" onClick={() => setPlayDemo(true)} aria-label="Play cleaning business concept demo"><img src="https://i.ytimg.com/vi/ZGSWorxyJKg/hqdefault.jpg" alt="" loading="lazy" /><span className="automation-demo__play"><Play size={24} weight="fill" aria-hidden /></span><span className="automation-demo__watch">Watch the demo</span></button>}</div>
      <div className="automation-demo__copy"><span className="automation-demo__label">Concept demo · Cleaning business</span><h3 id="cleaning-demo-title">From cleaning inquiry<br />to booked job.</h3><p>A walkthrough of a concept system for a cleaning business, showing how inquiries can move toward booked jobs.</p><a href="https://www.youtube.com/watch?v=ZGSWorxyJKg" target="_blank" rel="noreferrer">Watch on YouTube <ArrowUpRight size={16} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a></div>
    </article>
    <div className="automation-heading"><h3>Six ways to lighten the workload.</h3><p>Selected automation concepts. Open one to see the workflow behind it.</p></div>
    <ul className="automation-featured">{featuredAutomations.map(build => {
      const copy = featuredCopy[build.id]!
      return <li key={build.id}><Link className="automation-entry" to={chapterPath(build.id)} state={{ sheet: true }} preventScrollReset>
        <span className="automation-entry__preview" aria-hidden>{build.tile ? <img src={build.tile.src} alt="" loading="lazy" /> : <GitBranch size={28} weight="light" />}</span>
        <span className="automation-entry__copy"><strong>{copy.title}</strong><span>{copy.description}</span><small>{build.business} · Concept build</small></span>
        <ArrowUpRight className="automation-entry__arrow" size={18} aria-hidden />
      </Link></li>
    })}</ul>
    <details className="automation-library"><summary>View all {automations.length} automations <span className="automation-library__toggle" aria-hidden>+</span></summary>
      <div className="automation-library__body">
        <label className="automation-search" htmlFor="automation-search"><MagnifyingGlass size={18} aria-hidden /><span className="sr-only">Search automations</span><input id="automation-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by task, workflow, or business…" /></label>
        <p className="automation-library__count" role="status">{results.length} automation{results.length === 1 ? '' : 's'}{term ? ' found' : ' in the collection'}</p>
        <ul className="automation-all">{results.map(build => <li key={build.id}><Link to={chapterPath(build.id)} state={{ sheet: true }} preventScrollReset><span><strong>{build.title}</strong><small>{build.business} · Concept build</small></span><span className="automation-all__need">{build.need}</span><ArrowUpRight size={16} aria-hidden /></Link></li>)}</ul>
        {!results.length && <p className="automation-empty">No matching automations. Try “payment”, “booking”, or “follow-up”. <button type="button" onClick={() => setQuery('')}>Clear search</button></p>}
      </div>
    </details>
  </>
}
