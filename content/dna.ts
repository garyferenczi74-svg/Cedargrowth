// CannabisIQ, the DNA test page (CG Prompt 07 v1.1, expanded 2026-08-08).
//
// CLAIMS: nothing here describes a medical, diagnostic, or clinical test. No
// marker meaning, evidence tier, or citation is written here. Those cells are
// null and render as UNKNOWN / CITATION PENDING until the panel author supplies
// them. New-domain explanations are null too and render PENDING CLINICAL REVIEW:
// the build does not author health-adjacent domain copy.
//
// SCOPE (2026-08-08): Gary directed that CedarGrowth's genetic test is the full
// cannabis genetic panel (the "Cannabis Genetic Testing" report), and confirmed
// regulatory counsel cleared psychosis-risk and dependence testing. The panel
// below covers the report's wellness modules plus the kept Terpene Response
// domain. THC Psychosis Risk (Module 7) and Cannabis Dependence (Module 6) are
// STILL NOT rendered here: they report disease/condition risk, which directly
// contradicts Block 5's legal line "It does not report on disease risk" and the
// page's general-wellness (not medical) positioning. Rendering them requires
// counsel's REDRAFTED scope/disclaimer language, which is not authored here.
//
// FLIP POINTS: DOMAIN_COUNT / MARKER_COUNT derive from DOMAINS, so adding a
// domain updates the counts automatically. kitsShipping flips the closing block.
// Naming, laboratory name, and accreditation stay visible bracketed placeholders.

export const DNA_NAME = '[PENDING NAMING CONFIRMATION]';

// When kits ship, flip this to true and build the purchase branch in the page.
export const kitsShipping = false;

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
];
const word = (n: number) => NUMBER_WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type EvidenceTier = 'Established' | 'Supported' | 'Emerging';

export type Marker = {
  symbol: string;
  governs: string | null;
  informs: string | null;
  tier: EvidenceTier | null;
  citations: number[] | null;
};

export type Domain = {
  key: string;
  surface: 'parchment' | 'bone';
  title: string;
  // Null renders PENDING CLINICAL REVIEW; the build does not author domain copy.
  explanation: string | null;
  markers: Marker[];
};

// Every marker ships with its four data cells null. Symbols only, transcribed
// from the panel roster. Nothing clinical is authored by the build.
const marker = (symbol: string): Marker => ({
  symbol,
  governs: null,
  informs: null,
  tier: null,
  citations: null,
});

// The rendered panel. Order alternates parchment/bone. The three original
// domains keep their supplied explanations; the domains added from the report
// carry null explanations (PENDING CLINICAL REVIEW). Dependence and Psychosis
// Risk are intentionally absent (see SCOPE note above).
const DOMAINS: Domain[] = [
  {
    key: 'metabolism',
    surface: 'parchment',
    title: 'Cannabinoid Metabolism',
    explanation:
      'How quickly your body clears THC and CBD, and how cannabinoids ' +
      'interact with other things you take. Clearance rate is the single ' +
      'largest driver of why a dose that suits one person overwhelms another.',
    markers: [marker('CYP2C9'), marker('CYP2C19'), marker('CYP3A4'), marker('UGT1A9')],
  },
  {
    key: 'receptor',
    surface: 'bone',
    title: 'Receptor Sensitivity',
    explanation:
      'How responsive your cannabinoid receptors are, and how your body ' +
      'maintains its own endocannabinoid tone. This is the difference ' +
      'between a compound reaching you loudly and reaching you quietly.',
    markers: [marker('CNR1 (CB1)'), marker('CNR2 (CB2)'), marker('FAAH'), marker('MGLL')],
  },
  {
    key: 'endocannabinoid',
    surface: 'parchment',
    title: 'Endocannabinoid Tone',
    explanation: null,
    markers: [marker('FAAH'), marker('MGLL')],
  },
  {
    key: 'subjective',
    surface: 'bone',
    title: 'Subjective Response',
    explanation: null,
    markers: [marker('CNR1 (CB1)'), marker('FAAH'), marker('AKT1')],
  },
  {
    key: 'stress',
    surface: 'parchment',
    title: 'Stress Response',
    explanation: null,
    markers: [marker('COMT'), marker('CRHR1'), marker('CNR1 (CB1)'), marker('FAAH'), marker('MGLL')],
  },
  {
    key: 'cognitive',
    surface: 'bone',
    title: 'Cognitive Response',
    explanation: null,
    markers: [marker('COMT'), marker('AKT1'), marker('CNR1 (CB1)')],
  },
  {
    key: 'terpene',
    surface: 'parchment',
    title: 'Terpene Response',
    explanation:
      'Which aromatic compounds you are built to perceive strongly, which ' +
      'shapes which of our five lines will read as intended to you rather ' +
      'than as approximately right.',
    markers: [marker('OR GENE GROUP'), marker('TRPV1')],
  },
];

// Counts derive from the panel so they can never drift and are never typed into
// prose. Adding a domain updates both automatically.
export const DOMAIN_COUNT = DOMAINS.length;
export const MARKER_COUNT = new Set(DOMAINS.flatMap((d) => d.markers.map((m) => m.symbol))).size;

export const dna = {
  hero: {
    eyebrow: DNA_NAME,
    headline: 'Your genetics already have an opinion.',
    body:
      'We read how your body processes cannabinoids, how your receptors respond, ' +
      'and which aromatic compounds you are built to notice. ' +
      `${cap(word(DOMAIN_COUNT))} domains, ${word(MARKER_COUNT)} markers, and a ` +
      'protocol that starts from evidence rather than from guessing.',
    panelLink: 'Read the panel',
    placeholder: {
      family: 'process documentary',
      caption: 'PROCESS DOCUMENTARY . SAMPLE KIT ON STAINLESS',
      alt: 'Placeholder, process documentary of a sample kit on stainless',
    },
  },

  problem: {
    eyebrow: 'THE PROBLEM',
    headline: 'Guesswork is not a wellness plan.',
    body:
      'Two people take the same product at the same dose and have entirely ' +
      'different afternoons. That difference is not mysterious. It is largely ' +
      'metabolic, partly receptor-level, and it is written in genes that can be ' +
      'read from saliva.',
  },

  process: {
    eyebrow: 'HOW IT WILL WORK',
    steps: [
      {
        n: '01',
        title: 'Collect at home.',
        body: 'A saliva sample, sealed and returned in the prepaid mailer. Ten minutes.',
      },
      {
        n: '02',
        title: 'Laboratory analysis.',
        body: 'Your sample is analyzed at [LABORATORY NAME], [ACCREDITATION STATUS].',
      },
      {
        n: '03',
        title: 'Your profile.',
        body: 'Your results arrive in your account, with the evidence behind every marker.',
      },
    ],
  },

  panel: {
    eyebrow: 'THE PANEL',
    domains: DOMAINS,
    closing:
      'Not every marker carries the same weight, and we say which is which ' +
      'rather than presenting them as equals. Established markers drive your ' +
      'protocol. Emerging markers inform it. Anything we cannot support, we do ' +
      'not include.',
  },

  // The page's primary legal protection. Never collapsed, never below the fold.
  // [COUNSEL: review alongside Terms Section 5. This block's "does not report on
  // disease risk" line is why Psychosis Risk and Dependence are not rendered; if
  // those launch, counsel must redraft this block first.]
  scope: {
    lead:
      'This is a wellness tool. It is not a medical device, a diagnostic test, ' +
      'or a clinical genetic test.',
    body:
      'It does not detect, diagnose, treat, cure, mitigate, or prevent any ' +
      'disease or condition. It does not report on disease risk, carrier ' +
      'status, or ancestry. It does not replace advice from a qualified ' +
      'healthcare professional, and it should not be used to make decisions ' +
      'about any medication without one.',
    tail:
      'Genotype describes tendencies, not outcomes. Two people with the same ' +
      'result can still respond differently.',
  },

  privacy: {
    eyebrow: 'YOUR DATA',
    headline: `We analyze ${word(MARKER_COUNT)} markers and nothing else.`,
    points: [
      'We analyze only the markers on this panel. We do not read the rest of ' +
        'your genome, and we do not report on disease risk, carrier status, or ancestry.',
      'Your genetic data is never sold, never shared for advertising, and never ' +
        'given to insurers or employers.',
      'Consent is separate for each purpose and can be revoked at any time.',
      'Export and deletion are self-serve. You do not have to ask.',
    ],
    link: { label: 'Read the genetic privacy notice', href: '/dna/privacy' },
  },

  closing: {
    eyebrow: 'AVAILABILITY',
    headline: 'Kits are not shipping yet.',
    body:
      'The test is still being finalized. We are closing out the lab ' +
      'partnership and the kit packaging before any order ships. This page will ' +
      'carry the details once a ship date is set.',
    capture: {
      intent: 'dna_kit' as const,
      submitLabel: 'Tell me when kits ship',
      consent:
        'CedarGrowth uses this email only to notify you when kits ship, and ' +
        'stores it until then or until you unsubscribe.',
    },
    ageLine: 'For adults 21 and over.',
    onward: [
      { label: 'Read the method', href: '/method' },
      { label: 'Read the research', href: '/research' },
    ],
  },

  references: [] as { n: number; text: string }[],

  meta: {
    title: 'The DNA test',
    description:
      'A genetic analysis that informs cannabis product selection. ' +
      `${cap(word(DOMAIN_COUNT))} domains, ${word(MARKER_COUNT)} markers, each ` +
      'shown with the evidence behind it.',
  },
};
