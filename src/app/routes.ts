import type { Icon } from '@phosphor-icons/react'
import { Briefcase, House } from '@phosphor-icons/react'
import { workCount } from '@/content/work'
import { site } from '@/content/site'

/**
 * The route registry: the one list that drives the router and the sidebar.
 * Add a page = add one entry here.
 */

export type NavGroupId = 'menu' | 'general'

export const NAV_GROUPS: { id: NavGroupId; label: string }[] = [
  { id: 'menu', label: 'Menu' },
  { id: 'general', label: 'General' },
]

export type PageRoute = {
  kind: 'page'
  id: string
  path: string
  /** Short name for the sidebar and search. */
  label: string
  /** Unique document title. */
  title: string
  description: string
  icon: Icon
  /** Omit to keep the page out of the sidebar (legal pages). */
  group?: NavGroupId
  badge?: number
  /** A Home section id: the sidebar and search scroll Home to it instead of opening `path`. */
  section?: string
  /** Still the RouteStage placeholder: kept out of the sitemap (RouteStage also marks it noindex).
   *  Remove when the page is built and registered in router.tsx PAGE_COMPONENTS. */
  draft?: true
}

export type ExternalRoute = {
  kind: 'external'
  id: string
  href: string
  label: string
  description: string
  icon: Icon
  group: NavGroupId
}

export type NavEntry = PageRoute | ExternalRoute

/** Every page title ends with your name (content/site.ts). */
const SUFFIX = site.name

export const pages: PageRoute[] = [
  {
    kind: 'page',
    id: 'home',
    path: '/',
    label: 'Home',
    title: 'Rainier Dimasacat Jr. | Your Headline Here',
    description: 'PLACEHOLDER - tell me what to put here: the one-sentence search result description of you and what you do (under 160 characters).',
    icon: House,
    group: 'menu',
  },
  {
    kind: 'page',
    id: 'work',
    draft: true,
    path: '/work',
    label: 'Work',
    title: `Work | ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line on the kinds of work you show.',
    icon: Briefcase,
    group: 'menu',
    badge: workCount,
    section: 'work',
  },
]

/** Off-site links. Empty until a real destination replaces the `#` placeholders in content/site.ts:
 *  an entry pointing at `#` is a link that looks live and goes nowhere, so none ship. */
export const externals: ExternalRoute[] = []

/** Sidebar entries per group, in registry order (pages first, then external links). */
export function navEntries(group: NavGroupId): NavEntry[] {
  return [...pages.filter((p) => p.group === group), ...externals.filter((e) => e.group === group)]
}

/** Where a nav entry goes: its Home section when it has one, else its page. */
export function navTarget(page: PageRoute): string {
  return page.section ? `/#${page.section}` : page.path
}

export const notFoundTitle = `Page Not Found | ${SUFFIX}`
