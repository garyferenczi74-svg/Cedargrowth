// Site map from Section 5.1, typed for the shell. Every href here is a real
// route in the public map. Items with columns open the mega panel, items
// without are direct links.

export type NavLink = { label: string; href: string };

export type NavColumn = { heading: string; links: NavLink[] };

export type ImageFamily =
  | 'raw material macro'
  | 'specimen plate'
  | 'process documentary'
  | 'facility';

export type NavItem = {
  label: string;
  href: string;
  columns?: NavColumn[];
  specimen?: { family: ImageFamily; alt: string };
};

// Primary row order per Section 5.2.
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Method', href: '/method' },
  {
    label: 'Wellness',
    href: '/wellness',
    columns: [
      {
        heading: 'The five lines',
        links: [
          { label: 'Rest', href: '/wellness/rest' },
          { label: 'Relief', href: '/wellness/relief' },
          { label: 'Focus', href: '/wellness/focus' },
          { label: 'Calm', href: '/wellness/calm' },
          { label: 'Restore', href: '/wellness/restore' },
        ],
      },
      {
        heading: 'Understand',
        links: [
          { label: 'Terpene index', href: '/research' },
          { label: 'The endocannabinoid system', href: '/research' },
          { label: 'FAQ', href: '/faq' },
        ],
      },
      {
        heading: 'Overview',
        links: [{ label: 'All five lines', href: '/wellness' }],
      },
    ],
    specimen: {
      family: 'raw material macro',
      alt: 'Placeholder, raw material macro of a botanical terpene source',
    },
  },
  {
    label: 'Products',
    href: '/products',
    columns: [
      {
        heading: 'Vapes',
        links: [
          { label: '0.5g Vape', href: '/products/vape-05g' },
          { label: '1g Vape', href: '/products/vape-1g' },
        ],
      },
      {
        heading: 'Infused pre-rolls',
        links: [
          { label: '1g Pre-roll', href: '/products/preroll-1g' },
          { label: 'Pre-roll, 5 count', href: '/products/preroll-5pk' },
          { label: 'Dog Walker, 5 count', href: '/products/dog-walker-5pk' },
        ],
      },
      {
        heading: 'Gummies',
        links: [
          { label: '10 count, 100mg', href: '/products/gummies-10ct-100' },
          { label: '10 count, 200mg', href: '/products/gummies-10ct-200' },
          { label: '20 count, 200mg', href: '/products/gummies-20ct-200' },
        ],
      },
    ],
    specimen: {
      family: 'specimen plate',
      alt: 'Placeholder, specimen plate of a rosin pressing on bone',
    },
  },
  // Direct link to the full DNA page, no mega panel (the page carries its own
  // sections, so a dropdown of anchors is redundant).
  { label: 'DNA Test', href: '/dna' },
  {
    label: 'Research',
    href: '/research',
    columns: [
      {
        heading: 'Pillars',
        links: [
          { label: 'Terpene index', href: '/research' },
          { label: 'The endocannabinoid system', href: '/research' },
        ],
      },
      {
        heading: 'Notes',
        links: [{ label: 'All research notes', href: '/research' }],
      },
    ],
    specimen: {
      family: 'facility',
      alt: 'Placeholder, facility interior in winter light',
    },
  },
  { label: 'Transparency', href: '/transparency' },
  { label: 'Find', href: '/find' },
];

// Utility, left and right edges (Section 5.2).
export const UTILITY_LEFT: NavLink[] = [
  { label: 'Wholesale', href: '/wholesale' },
];

// Footer, four columns (Block 9).
export const FOOTER_COLUMNS: NavColumn[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'Wellness', href: '/wellness' },
      { label: 'Products', href: '/products' },
      { label: 'Find a dispensary', href: '/find' },
    ],
  },
  {
    heading: 'The company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Method', href: '/method' },
      { label: 'Wholesale', href: '/wholesale' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'The DNA Test', href: '/dna' },
      { label: 'Research', href: '/research' },
      { label: 'Transparency', href: '/transparency' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Accessibility', href: '/legal/accessibility' },
      { label: 'Compliance', href: '/legal/compliance' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
