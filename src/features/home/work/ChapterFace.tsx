import type { WorkChapter } from '@/content/schema'

const LAYOUTS = ['solo', 'solo', 'badge'] as const
const NAMES_MAX = 110 // characters; a longer list shows the chapter line instead

/**
 * A chapter card: its marks as embossed app icons on paper, the build names under the title.
 * `foot={false}` keeps only the marks (when the title is set beside it).
 */
export function ChapterFace({ chapter, foot = true }: { chapter: WorkChapter; foot?: boolean }) {
  const marks = chapter.marks ?? []
  const names = chapter.items.map((item) => item.name).join(' · ')
  return (
    <span className="wa__face" data-layout={LAYOUTS[marks.length] ?? 'fan'}>
      <span className="wa__marks">
        {marks.map((mark) => (
          <span key={mark.src} className="wa__tile">
            <img src={mark.src} alt="" draggable={false} decoding="async" />
          </span>
        ))}
      </span>
      {foot ? (
        <span className="wa__face-foot">
          <b>{chapter.title}</b>
          <span>{names && names.length <= NAMES_MAX ? names : chapter.line}</span>
        </span>
      ) : null}
    </span>
  )
}
