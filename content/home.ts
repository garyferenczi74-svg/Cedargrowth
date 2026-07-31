// Home page copy (Section 6.1). Extracted verbatim from src/app/page.tsx so
// the strings live in one typed, readonly place. NO copy changes here, ever,
// without an explicit content-review pass. The hero body sentence is pinned
// by ruling D-LIVEROSIN: it must keep the words "live rosin" exactly.

// Reused verbatim for the page metadata description (D-LIVEROSIN) so the
// meta description and the on-page hero copy never drift apart.
const heroBody =
  'CedarGrowth produces solventless live rosin in Buffalo, New York, formulated for outcome rather than potency.';

export const home = {
  hero: {
    eyebrow: 'A study in subtraction',
    headlineLines: [
      'Premium Cannabis.',
      'Ice. Pressure.',
      'Nothing else.',
    ],
    body: heroBody,
    cta: 'Read the method',
  },
  position: {
    headline: 'We are a wellness company that produces solventless premium cannabis extracts',
    sub: 'Every formulation begins with an intended state, not a strain name. Five lines, eight products, one extraction standard.',
  },
  fiveLines: {
    eyebrow: 'The five lines',
  },
  twoInputs: {
    eyebrow: 'Two inputs',
    headline: 'One method. Two materials.',
    body: 'Dried and cured trim gives depth. Fresh frozen keeps the aromatics that drying takes away. We do not blend the distinction away, and we do not price it as though it does not exist.',
    cta: 'Read the method',
    entries: [
      {
        heading: 'Dried. Cured. Then washed.',
        body: 'Resin matured on the plant and in the cure, washed cold and pressed.',
        specimen: 'Input: dried and cured sugar trim',
      },
      {
        heading: 'Frozen at harvest. Never dried.',
        body: 'Whole plant taken to freezing within hours, washed cold, pressed.',
        specimen: 'Input: fresh frozen whole plant',
      },
    ],
  },
  absences: {
    trailing:
      'Ice water hash and rosin, pressed from premium cannabis.',
  },
  dna: {
    eyebrow: 'Precision',
    headline: 'Thirteen traits. One protocol.',
    body: 'Our Cannabis DNA Test reads how your body metabolizes cannabinoids, then matches you to a format, a ratio, and a starting protocol. Guesswork is not a wellness plan.',
    cta: 'See the thirteen traits',
  },
  transparency: {
    eyebrow: 'Transparency',
    body: 'Every batch we release is tested by a third-party laboratory. Enter a batch number to read its full profile.',
  },
  team: {
    eyebrow: 'People',
    headline: 'The work has names on it.',
    cta: 'The full team',
  },
  research: {
    eyebrow: 'Research',
    headline: 'Written like a laboratory, read like a library.',
    emptyNote:
      'No research notes are published yet. The index opens with the terpene and endocannabinoid pillars.',
    cta: 'Read the research',
  },
  find: {
    eyebrow: 'Availability',
    headline: 'Available across New York State.',
    cta: 'Find a dispensary',
  },
  meta: {
    // Home page metadata (spec Section C item 2). Title is absolute, not run
    // through the layout's "%s, CedarGrowth Organics" template, since Home is
    // the brand default already. Description reuses heroBody verbatim.
    title: 'CedarGrowth Organics',
    description: heroBody,
    ogImagePath: '/og/home.png',
    ogImageAlt:
      'Placeholder, specimen plate composition for CedarGrowth Organics',
  },
  placeholders: {
    hero: {
      family: 'raw material macro',
      alt: 'Placeholder, raw material macro of cured trim under raking light',
    },
    fiveLines: {
      family: 'specimen plate',
      altFor: (lineName: string) =>
        `Placeholder, specimen plate for the ${lineName} line`,
    },
    dna: {
      family: 'process documentary',
      alt: 'Placeholder, process documentary of a sample kit on stainless',
    },
    find: {
      family: 'map still',
      alt: 'Placeholder, map still of New York State with dispensary pins',
    },
  },
} as const;

export type HomeContent = typeof home;
