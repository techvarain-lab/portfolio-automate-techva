import { ArrowUpRight, ArrowRight, Funnel, GitBranch, CalendarCheck, Check } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { homeHero } from '@/content/home'
import { mailtoHref } from '@/content/site'
import './hero.css'

const stages = [
  { icon: Funnel, title: 'Capture', detail: 'Every inquiry, one place.' },
  { icon: GitBranch, title: 'Route & follow up', detail: 'The right next step, automatically.' },
  { icon: CalendarCheck, title: 'Book', detail: 'A conversation on the calendar.' },
]

export function HeroSection() {
  const systemRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = systemRef.current
    if (!element) return
    let visible = false
    const update = () => { element.dataset.running = String(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      update()
    }, { threshold: 0.35 })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__intro"><span>Rainier Dimasacat</span><span>GoHighLevel systems · Cavite, PH</span></div>
      <div className="hero__composition">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">Less chasing.<br />More <em>booking.</em></h1>
          <p className="hero__lede">{homeHero.lede}</p>
          <div className="hero__actions">
            <a href={mailtoHref()} className="hero__primary">Let’s build your system <ArrowUpRight size={19} aria-hidden /></a>
            <a href="#work" className="hero__secondary">Explore the work <ArrowRight size={18} aria-hidden /></a>
          </div>
          <p className="hero__note">Funnels. Automations. Fewer loose ends.</p>
        </div>
        <div ref={systemRef} className="system" data-running="false" aria-label="Illustrative lead journey: inquiry, capture, routing and follow-up, then a booked conversation">
          <div className="system__header"><span className="system__mark" aria-hidden>RD /</span><span>The work behind the workflow</span></div>
          <div className="system__entry"><span className="system__dot" />New inquiry<ArrowRight size={18} aria-hidden /></div>
          <ol className="system__stages">
            {stages.map(({ icon: Icon, title, detail }) => (
              <li key={title}><span className="system__housing"><Icon size={27} weight="light" aria-hidden /></span><div><strong>{title}</strong><span>{detail}</span></div></li>
            ))}
          </ol>
          <div className="system__output"><CalendarCheck size={18} aria-hidden /><span>Booked conversation</span><Check className="system__check" size={16} aria-hidden /></div>
          <div className="system__footer"><span>Designed around your business</span><ArrowUpRight size={13} aria-hidden /></div>
        </div>
      </div>
      <div className="hero__bottom"><span>Good systems do the heavy lifting.</span><a href="#work">Selected builds <span aria-hidden>↓</span></a></div>
    </section>
  )
}
