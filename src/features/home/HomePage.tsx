import { Navigate, useMatch } from 'react-router'
import type { PageRoute } from '@/app/routes'
import { findChapter } from '@/content/home'
import { WorkSheet } from './work/WorkSheet'
import { homeSectionList } from './sections'

/**
 * Home: a scrolling page built from the section list in sections.ts, top to bottom.
 * At /work/<chapter> it stays mounted and that chapter's sheet opens over it (the sheet then owns
 * the page title, description and canonical URL).
 */
export function HomePage({ page }: { page: PageRoute }) {
  const chapterId = useMatch('/work/:chapter')?.params.chapter
  const chapter = findChapter(chapterId) ?? null
  if (chapterId && !chapter) return <Navigate to="/" replace />

  return (
    <>
      {chapter ? null : (
        <>
          <title>{page.title}</title>
          <meta name="description" content={page.description} />
        </>
      )}
      {homeSectionList.map(({ id, Component }) => (
        <Component key={id} />
      ))}
      <WorkSheet chapter={chapter} />
    </>
  )
}
