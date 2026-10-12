import { useState, type FormEvent } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import content from '@/content/portfolio-sections.json'
import { site, socials } from '@/content/site'
import './portfolio.css'

const linkedIn = socials.find(link => link.icon === 'linkedin')?.href

export function ServicesSection() {
  return <section id="services" className="portfolio-section" aria-labelledby="services-title">
    <header className="portfolio-heading"><h2 id="services-title">What I run reliably.</h2><p>From the first click to the follow-up, the pieces work together.</p></header>
    <div className="service-list">{content.services.map(service => <article key={service.title} className="service-row"><h3>{service.title}</h3><div><p>{service.description}</p><ul className="portfolio-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div></article>)}</div>
  </section>
}

export { GhlCapabilities as CapabilitiesSection, ProcessSection } from './GhlCapabilities'

const experience = [
  { date: '2022 — 2024', title: 'Software Developer (Low-Code)', company: 'Stratpoint', description: 'OutSystems for client delivery. Scaffolding as product.', stack: 'OutSystems · Agile' },
  { date: 'Apr — Aug 2022', title: 'Frontend Intern', company: 'Fligno Software PH', description: 'Crowdsourcing platform — TypeScript + Next.js.', stack: 'TypeScript · Next.js' },
  { date: '2021 — 2022', title: 'Web Dev Intern', company: 'Ling Ling Restaurants', description: 'Interbranch POS — React, real ops.', stack: 'React · JavaScript' },
]
export function AboutSection() {
  return <section id="about" className="portfolio-section" aria-labelledby="about-title">
    <header className="portfolio-heading"><h2 id="about-title">The person behind the systems.</h2><p>I have a software-development background, so I can go beyond the normal no-code implementation. That means custom code and integrations when a funnel needs them — not just the parts a no-code builder reaches.</p></header>
    <div className="about-layout"><img className="about-portrait" src={site.avatarSmall} alt="Illustrated portrait of Rainier Dimasacat Jr." width={400} height={400} loading="lazy" /><div><h3 className="experience-heading">Work experience</h3>{experience.map(job => <article className="experience-row" key={job.company}><time>{job.date}</time><div><h3>{job.title}</h3><span>{job.company}</span><p>{job.description}</p><small>{job.stack}</small></div></article>)}<h3 className="experience-heading">Education</h3><article className="experience-row"><time>2022</time><div><h3>BS Computer Engineering</h3><span>Polytechnic University of the Philippines</span><p>Manila · PH</p></div></article></div></div>
  </section>
}

export function ContactSection() {
  const [opened, setOpened] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Project inquiry: ${data.get('topic')}`)
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setOpened(true)
  }
  return <section id="contact" className="portfolio-section contact-section" aria-labelledby="contact-title"><div><h2 id="contact-title">Let’s make<br />ops lighter.</h2><p>Tell me the flow eating your week — I’ll map it and ship the first automation in days.</p><div className="portfolio-contact-links"><a href={`mailto:${site.email}`}>{site.email}</a><a href="tel:+639951462765">0995 146 2765</a><a href={linkedIn} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a></div><small>Cavite, PH · Replies in 24h</small></div><form onSubmit={submit} className="brief-form"><label htmlFor="brief-name">Name</label><input id="brief-name" name="name" autoComplete="name" required placeholder="Your name" /><label htmlFor="brief-email">Email</label><input id="brief-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" /><label htmlFor="brief-topic">What would you like to automate?</label><select id="brief-topic" name="topic">{['Lead routing & follow-up', 'Missed-call & review recovery', 'Booking & payment flow', 'Content / AI pipeline', 'Other'].map(topic => <option key={topic}>{topic}</option>)}</select><label htmlFor="brief-message">Message</label><textarea id="brief-message" name="message" rows={4} placeholder="The flow that hurts most…" required /><button className="hero__primary" type="submit">Create email brief <ArrowUpRight size={18} aria-hidden /></button><p className="form-note" role="status">{opened ? 'Your email app was requested. Review the draft and send it there. If it didn’t open, email me directly using the link.' : 'Opens a draft in your email app. Nothing is sent until you send it.'}</p></form></section>
}
