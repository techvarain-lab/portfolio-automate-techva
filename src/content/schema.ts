/**
 * The content model. Every page renders from typed data in src/content/, so copy changes never
 * touch a component. Rule for all content: real facts only. Anything unconfirmed is left out,
 * never estimated.
 */
export type Image = {
  src: string
  alt: string
  width: number
  height: number
  /** Smaller copies for `srcset` (scripts/make-image-variants.py), where a picture shows small. */
  srcSet?: string
}

export type LinkRef = {
  label: string
  href: string
  /** Opens in a new tab and shows the external-link mark. */
  external?: boolean
}

/** A profile link shown as a logo button. `icon` picks the glyph in SocialIcon. */
export type SocialLink = LinkRef & {
  icon: 'facebook' | 'linkedin' | 'discord' | 'github' | 'x'
  /** Someone else's page (a partner, a community), not your own profile: kept out of the Person JSON-LD sameAs. */
  partner?: true
}

/** One chapter of the Home Work section: a group of builds with its covers. */
export type WorkChapter = {
  category?: 'automation' | 'funnel'
  concept?: boolean
  business?: string
  need?: string
  problem?: string
  solution?: string
  intendedOutcome?: string
  id: string
  title: string
  /** One quiet line under the title. */
  line: string
  /** Builds in the group. Derive it from the group's array, never type a number in. */
  count: number
  /** What the count counts, already matching it ("blueprint", "pages"). */
  unit: string
  /** One or two sentences: the chapter sheet's intro and its meta description (keep under ~160 chars). */
  description: string
  /** The picture its Home bento tile shows, when the default (the lead, else the first landscape
   *  build picture) is the wrong one. Crop it to the tile's shape. */
  tile?: Image
  /** The logo face a tile shows when the chapter has no landscape picture: these logos as embossed app
   *  icons on paper. 3 fan out (the middle one leads), 2 = a mark with a badge, 1 = one large mark. */
  marks?: Image[]
  /** The builds, shown as the sheet's showcase. Empty for a single-build chapter. */
  items: WorkItem[]
  /** Single-build chapters: a lead picture, a gallery and a live link instead of items. */
  lead?: Image
  gallery?: Image[]
  link?: LinkRef
}

/** One build inside a Work chapter. `href` opens it live in a new tab. */
export type WorkItem = {
  id: string
  name: string
  /** The small label above the name: funnel step, kind of app, or agent group. */
  kicker: string
  summary: string
  image?: Image
  href?: string
}
