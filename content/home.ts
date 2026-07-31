// Home page copy (Section 6.1). Extracted verbatim from src/app/page.tsx so
// the strings live in one typed, readonly place. NO copy changes here, ever,
// without an explicit content-review pass. The hero body sentence is pinned
// by ruling D-LIVEROSIN: it must keep the words "live rosin" exactly.

export const home = {
  hero: {
    eyebrow: 'A study in subtraction',
    headlineLines: [
      'Premium Fresh Frozen.',
      'Ice. Pressure.',
      'Nothing else.',
    ],
    body: 'CedarGrowth produces solventless live rosin in Buffalo, New York, formulated for outcome rather than potency.',
    cta: 'Read the method',
  },
  position: {
    eyebrow: 'Position',
    headline: 'A wellness company that produces cannabis.',
    sub: 'Every formulation begins with an intended state, not a strain name. Five lines, eight products, one extraction standard.',
  },
  fiveLines: {
    eyebrow: 'The five lines',
  },
  absences: {
    trailing:
      'Ice water hash and rosin, pressed from 100 percent dried sugar trim.',
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
