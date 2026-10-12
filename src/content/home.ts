import type { Image, WorkChapter } from './schema'
import conceptBuilds from './concept-builds.json'
import automationBuilds from './automation-builds.json'

/**
 * Home page copy. The hero pairs a thin line with a bold one. The bold line is sized in `cqi` in
 * features/home/hero/hero.css so it fills the column: re-measure it when you change the words
 * (see the comment on `.hero__title` there).
 */
export const homeHero = {
  headlineThin: 'Rainier',
  headlineBold: 'Dimasacat',
  subhead: 'GHL SPECIALIST / FUNNEL BUILDER',
  lede: 'I build funnels and automations that keep leads moving—from the first inquiry to the booked appointment.',
  cta: { label: 'Hire me', to: '/#contact' },
}

/* ---------- Work section ---------- */

/** The Work section header. */
export const workSection = {
  eyebrow: 'Selected work',
  titleThin: 'Concepts built',
  titleBold: 'to work.',
  all: { label: 'See all 6 builds', to: '/work' },
}

/** The URL of a chapter's showcase sheet. Real, shareable and in the sitemap. */
export const chapterPath = (id: string) => `/work/${id}`

/** Image helper: local typed image with src/alt/width/height. */
const img = (src: string, alt: string, width: number, height: number): Image => ({
  src,
  alt,
  width,
  height,
})

/**
 * The six Work chapters, in bento order. Each id is the URL slug and the bento grid key.
 * Counts are derived from items.length + (lead ? 1 : 0) — never typed.
 */
const chapters: WorkChapter[] = [
  {
    id: 'rubio',
    title: 'Rubio Roofing and Trusses',
    line: 'A five-tab funnel for a roofing contractor.',
    count: 0, // derived below
    unit: 'build',
    description: 'A multi-tab funnel for a roofing and trusses contractor, with five sequential sections guiding visitors from overview to contact.',
    lead: img('/images/work/rubio-thumb.webp', 'Rubio Roofing funnel overview screen', 1920, 6143),
    gallery: [
      img('/images/work/rubio-sec01.webp', 'Rubio Roofing funnel — tab 1: Overview', 1440, 795),
      img('/images/work/rubio-sec02.webp', 'Rubio Roofing funnel — tab 2: Services', 1440, 841),
      img('/images/work/rubio-sec03.webp', 'Rubio Roofing funnel — tab 3: Gallery', 1440, 828),
      img('/images/work/rubio-sec04.webp', 'Rubio Roofing funnel — tab 4: Contact', 1440, 818),
      img('/images/work/rubio-sec05.webp', 'Rubio Roofing funnel — tab 5: Booking', 1440, 842),
    ],
    items: [],
  },
  {
    id: 'legal',
    title: 'Legal Intake & Nurture',
    line: 'Capture, booking, nurture, win-back, and cancel screens for a law firm.',
    count: 0, // derived below
    unit: 'screens',
    description: 'A GoHighLevel intake and nurture system for a legal practice, spanning capture, booking, nurture sequences, win-back, and cancellation flows.',
    items: [
      {
        id: 'legal-capture',
        name: 'Intake Capture',
        kicker: 'Capture',
        summary: 'A landing page that captures case details from prospective clients.',
        image: img('/images/work/legal-capture.webp', 'Legal intake capture form screen', 2210, 2686),
      },
      {
        id: 'legal-confirm',
        name: 'Booking Confirmation',
        kicker: 'Booking',
        summary: 'A scheduling screen that confirms the consultation and sets expectations.',
        image: img('/images/work/legal-confirm.webp', 'Legal booking confirmation screen', 1149, 2375),
      },
      {
        id: 'legal-nurture',
        name: 'Nurture Sequence',
        kicker: 'Nurture',
        summary: 'An automated email and SMS nurture track for leads who are not ready to book yet.',
        image: img('/images/work/legal-nurture.webp', 'Legal nurture sequence automation screen', 1668, 4863),
      },
      {
        id: 'legal-coldwinback',
        name: 'Win-Back',
        kicker: 'Win-back',
        summary: 'A re-engagement automation that brings cold leads back into the pipeline.',
        image: img('/images/work/legal-coldwinback.webp', 'Legal win-back re-engagement screen', 1162, 2375),
      },
      {
        id: 'legal-cancel',
        name: 'Cancellation',
        kicker: 'Cancel',
        summary: 'A cancellation flow that saves the appointment or moves it to a better time.',
        image: img('/images/work/legal-cancel.webp', 'Legal cancellation recovery screen', 1149, 2064),
      },
    ],
  },
  {
    id: 'flowfix',
    title: 'FlowFix Plumbing',
    line: 'Triage, missed-call, reactivation, and review for a plumbing business.',
    count: 0, // derived below
    unit: 'screens',
    description: 'A GoHighLevel system for a plumbing company: triage routing, missed-call text-back, customer reactivation, and review requests.',
    items: [
      {
        id: 'flowfix-triage',
        name: 'Triage Routing',
        kicker: 'Triage',
        summary: 'An intake form that routes emergency calls differently from general inquiries.',
        image: img('/images/work/flowfix-triage.webp', 'FlowFix Plumbing triage routing screen', 1600, 910),
      },
      {
        id: 'flowfix-missedcall',
        name: 'Missed-Call Text-Back',
        kicker: 'Missed call',
        summary: 'An automatic text response when a customer call is missed, keeping the lead warm.',
        image: img('/images/work/flowfix-missedcall.webp', 'FlowFix missed-call text-back automation screen', 1705, 4241),
      },
      {
        id: 'flowfix-reactivation',
        name: 'Reactivation',
        kicker: 'Reactivation',
        summary: 'A win-back campaign that brings past customers back for seasonal maintenance.',
        image: img('/images/work/flowfix-reactivation.webp', 'FlowFix customer reactivation campaign screen', 2173, 5174),
      },
      {
        id: 'flowfix-review',
        name: 'Review Request',
        kicker: 'Review',
        summary: 'An automated review request sent after a completed job.',
        image: img('/images/work/flowfix-review.webp', 'FlowFix review request automation screen', 2210, 5486),
      },
    ],
  },
  {
    id: 'torqueworks',
    title: 'TorqueWorks Auto Care',
    line: 'Dormant win-back screens for an auto repair shop.',
    count: 0, // derived below
    unit: 'screens',
    description: 'A win-back automation for an auto care shop, re-engaging customers who have not returned for service in a while.',
    items: [
      {
        id: 'torqueworks-1',
        name: 'Win-Back Email',
        kicker: 'Win-back',
        summary: 'The first email in the dormant-customer win-back sequence.',
        image: img('/images/work/torqueworks-1.webp', 'TorqueWorks win-back email screen', 2088, 4856),
      },
      {
        id: 'torqueworks-2',
        name: 'Win-Back Follow-Up',
        kicker: 'Win-back',
        summary: 'The follow-up email for customers who did not respond to the first message.',
        image: img('/images/work/torqueworks-2.webp', 'TorqueWorks win-back follow-up email screen', 2088, 5188),
      },
      {
        id: 'torqueworks-3',
        name: 'Win-Back Offer',
        kicker: 'Win-back',
        summary: 'The final offer screen that gives the customer a reason to book now.',
        image: img('/images/work/torqueworks-3.webp', 'TorqueWorks win-back offer screen', 1819, 4193),
      },
    ],
  },
  {
    id: 'haven',
    title: 'Haven Animal Clinic',
    line: 'Emergency detection and CAI configuration for a veterinary clinic.',
    count: 0, // derived below
    unit: 'screens',
    description: 'A GoHighLevel setup for an animal clinic: an emergency intake form and a CAI (Conversational AI) configuration screen.',
    items: [
      {
        id: 'haven-emergency',
        name: 'Emergency Detection',
        kicker: 'Emergency',
        summary: 'An intake form that detects emergency situations and routes them immediately.',
        image: img('/images/work/haven-emergency.webp', 'Haven Animal Clinic emergency detection screen', 1921, 3945),
      },
      {
        id: 'haven-cai-config',
        name: 'CAI Configuration',
        kicker: 'CAI',
        summary: 'The Conversational AI configuration screen for the clinic\'s chatbot.',
        image: img('/images/work/haven-cai-config.webp', 'Haven Animal Clinic CAI configuration screen', 1915, 902),
      },
    ],
  },
  {
    id: 'fitcoach',
    title: 'FitCoach',
    line: 'Onboarding, payment-failed, and abandoned-cart flows for a fitness coach.',
    count: 0, // derived below
    unit: 'screens',
    description: 'A GoHighLevel automation for a fitness coach: new-member onboarding, payment-failed recovery, and abandoned-cart follow-up.',
    items: [
      {
        id: 'fitcoach-onboarding',
        name: 'Onboarding',
        kicker: 'Onboarding',
        summary: 'An automated welcome and onboarding sequence for new coaching clients.',
        image: img('/images/work/fitcoach-make-onboarding.webp', 'FitCoach onboarding automation screen', 1920, 932),
      },
      {
        id: 'fitcoach-paymentfailed',
        name: 'Payment Failed',
        kicker: 'Payment',
        summary: 'A dunning automation that recovers failed payments without losing the client.',
        image: img('/images/work/fitcoach-make-paymentfailed.webp', 'FitCoach payment-failed recovery screen', 1437, 719),
      },
      {
        id: 'fitcoach-abandoned',
        name: 'Abandoned Cart',
        kicker: 'Cart',
        summary: 'An abandoned-cart email that brings the client back to complete checkout.',
        image: img('/images/work/fitcoach-make-abandoned.webp', 'FitCoach abandoned-cart recovery screen', 1431, 732),
      },
    ],
  },
]

/** Derive each chapter's count from its items and lead — never a typed literal. */
const selectedAutomationIds = ['automation-08-2', 'automation-07-1', 'automation-25-5', 'automation-05-1', 'automation-05-3', 'automation-22-1']
export const workChapters: WorkChapter[] = [...automationBuilds, ...conceptBuilds.filter(ch => ch.category === 'funnel')].map(ch => ({
  ...ch, category: ch.category as 'automation' | 'funnel', count: ch.gallery.length,
}))
export const featuredAutomations = selectedAutomationIds.flatMap(id => workChapters.filter(build => build.id === id))

/** Total builds across all chapters. Derived from items.length + gallery lengths. */
export const workCount = workChapters.length

export const findChapter = (id: string | undefined) => workChapters.find((chapter) => chapter.id === id) ?? (automationBuilds as WorkChapter[]).find(chapter => chapter.id === id) ?? (conceptBuilds as WorkChapter[]).find(chapter => chapter.id === id) ?? chapters.find(chapter => chapter.id === id)
