import { Link } from 'react-router'
import { useState, useRef, type KeyboardEvent } from 'react'
import { chapterPath, workChapters, workSection } from '@/content/home'
import { chapterPicture } from './chapter-picture'
import { ChapterFace } from './ChapterFace'
import { AutomationCollection } from './AutomationCollection'
import './work.css'

/** Tiles are lazy, so Chrome reads their real width (`auto`); the fallback is the largest tile's share
 *  of the screen (measured: ~37vw from 1280 up, ~62vw at 1024, ~85vw on phones). */
const TILE_SIZES = 'auto, (min-width: 1280px) 38vw, (min-width: 1024px) 62vw, 88vw'

/**
 * Work: a bento of the six chapters. Every chapter on one screen as tiles of different sizes, the biggest
 * chapters largest (grid areas in work.css, keyed by chapter id); the tile is "A Clean frame". Nothing
 * holds: tiles rise in as they scroll into view. Every tile is a real link to /work/<chapter>, which opens that chapter's sheet over Home.
 */
export function WorkSection() {
  const [category, setCategory] = useState<'automation' | 'funnel'>('automation')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const categories = ['automation', 'funnel'] as const
  const visible = workChapters.filter(chapter => chapter.category === category)
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target: number
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') target = 1 - index
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = 1
    else return
    event.preventDefault()
    setCategory(categories[target]!)
    tabRefs.current[target]?.focus()
  }
  return (
    <section id="work" className="wk wb" aria-labelledby="work-title">
      <header className="wb__head">
        <h2 id="work-title" className="wk-title">
          <span className="wk-title__thin">{workSection.titleThin}</span> <span className="wk-title__bold">{workSection.titleBold}</span>
        </h2>
        <p className="wb__disclosure">These self-initiated projects use fictional businesses to demonstrate working funnels and automations.</p>
      </header>
      <div className="wb__tabs" role="tablist" aria-label="Build category">{categories.map((value, index) => <button key={value} ref={element => { tabRefs.current[index] = element }} type="button" role="tab" id={`work-tab-${value}`} aria-controls={`work-panel-${value}`} aria-selected={category === value} tabIndex={category === value ? 0 : -1} onKeyDown={event => onTabKey(event, index)} onClick={() => setCategory(value)}>{value === 'automation' ? 'Automations' : 'Funnels'}<span>{workChapters.filter(chapter => chapter.category === value).length}</span></button>)}</div>
      <div role="tabpanel" id={`work-panel-${category}`} aria-labelledby={`work-tab-${category}`} tabIndex={0}>
      {category === 'automation' ? <AutomationCollection /> : <>
      <ul className="wb__grid wb__grid--concepts">
        {visible.map((chapter) => {
          const pic = chapterPicture(chapter)
          return (
            <li key={chapter.id} className="wb__cell" data-area={chapter.id}>
              <Link to={chapterPath(chapter.id)} state={{ sheet: true }} preventScrollReset className="wb__tile" data-kind={pic ? 'pic' : 'marks'}>
                <span className="wb__concept-label">{chapter.need ? `${chapter.need} · ` : ''}Concept build</span>
                <span className="wb__media" aria-hidden>
                  {pic ? (
                    <img
                      src={pic.src}
                      srcSet={pic.srcSet}
                      sizes={pic.srcSet ? TILE_SIZES : undefined}
                      alt=""
                      width={pic.width}
                      height={pic.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : <ChapterFace chapter={chapter} foot={false} />}
                </span>
                <span className="wb__cap">
                  <b>{chapter.title}</b>
                  {category === 'funnel' && <span className="wk-count">
                    {chapter.count} {chapter.unit}
                  </span>}
                </span>
                <span className="wb__description">{chapter.line}</span>
                {chapter.business && <span className="wb__business">Example: {chapter.business}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
      </>}
      </div>
    </section>
  )
}
