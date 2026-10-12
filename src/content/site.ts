import type { SocialLink } from './schema'

/**
 * Who the site is about. START HERE: every page, the sidebar, the SEO tags and the legal pages read
 * these values, so changing them here changes them everywhere.
 */
export const site = {
  name: 'Rainier Dimasacat',
  brand: 'Rainier D.',
  /** The brand name as the sidebar logo shows it: the second part takes the accent color. */
  brandParts: ['Rainier', 'D.'],
  /** Your logo mark, one file per theme (`light` = for light backgrounds). The 96px copies are the
   *  sidebar header (shown at 32-36px); the full ones are the Work logo faces. */
  logo: {
    light: '/images/brand/mark.webp',
    dark: '/images/brand/mark-light.webp',
    headerLight: '/images/brand/mark-96.webp',
    headerDark: '/images/brand/mark-light-96.webp',
  },
  role: 'GHL Specialist / Funnel Builder',
  email: 'techva.rain@gmail.com',
  emailSubject: 'Project inquiry',
  location: 'Cavite, PH',
  /** Two-letter country code (ISO 3166) for the Person JSON-LD address. */
  countryCode: 'PH',
  /** Your clock, shown live at the top of the sidebar. Any IANA zone, e.g. 'America/New_York'. */
  timeZone: 'Asia/Manila',
  timePlace: 'in Cavite',
  /** The sidebar picture (112px, 44px on the rail). */
  avatarSmall: '/images/profile/rainier-flat-cartoon.png',
} as const

/** Up to five fit the sidebar header. `icon` picks the glyph in components/brand/SocialIcon.tsx. */
export const socials: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rainier-dimasacat-a740a6176', external: true, icon: 'linkedin' },
]

export function mailtoHref(): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`
}
