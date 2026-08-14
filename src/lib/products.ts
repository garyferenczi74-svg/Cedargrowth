// The eight products (Section 5.1 and 6.4). Known specification comes from the
// SKU itself: format, net weight, count, and the labeled milligram total for
// gummies. Everything batch specific (cannabinoid profile, dominant terpenes,
// batch, harvest, lab, test date) is not confirmed here and renders UNKNOWN.
//
// Copy follows the marketing restrictions (Section 9.3): no candy language for
// the gummy line, described as count and milligrams, and no effect claims.

export type Format = 'vape' | 'preroll' | 'gummy';

export type Product = {
  slug: string;
  name: string;
  format: Format;
  formatLabel: string;
  descriptor: string;
  spec: string; // mono specification for the index card
  netWeight: string; // known from the SKU
  potency?: string; // labeled milligram total, gummies only
  // Supplied later (CG Prompt 11 "what I need" 2). Until a value is given each
  // renders UNKNOWN on the index and the product is excluded from filtered
  // views rather than guessed into a line or input it does not carry.
  line?: string; // wellness line name, e.g. 'Rest'
  input?: string; // input stream: 'Cured trim' or 'Fresh frozen'
  terpenes?: string; // dominant terpenes
};

export const FORMAT_GROUPS: { format: Format; label: string }[] = [
  { format: 'vape', label: 'Vape' },
  { format: 'preroll', label: 'Infused pre-roll' },
  { format: 'gummy', label: 'Gummy' },
];

export const PRODUCTS: Product[] = [
  {
    slug: 'vape-05g',
    name: '0.5g Vape',
    format: 'vape',
    formatLabel: 'Vape',
    descriptor: 'A half gram of live rosin, in a discreet format.',
    spec: '0.5g',
    netWeight: '0.5g',
  },
  {
    slug: 'vape-1g',
    name: '1g Vape',
    format: 'vape',
    formatLabel: 'Vape',
    descriptor: 'A full gram of live rosin, for the format you already keep.',
    spec: '1g',
    netWeight: '1g',
  },
  {
    slug: 'preroll-1g',
    name: '1g Infused Pre-roll',
    format: 'preroll',
    formatLabel: 'Infused pre-roll',
    descriptor: 'A single gram, infused with solventless rosin.',
    spec: '1g',
    netWeight: '1g',
  },
  {
    slug: 'preroll-5pk',
    name: 'Pre-roll, 5 count',
    format: 'preroll',
    formatLabel: 'Infused pre-roll',
    descriptor: 'Five to keep, each infused with rosin.',
    spec: '5 count',
    netWeight: '5 count',
  },
  {
    slug: 'dog-walker-5pk',
    name: 'Dog Walker, 5 count',
    format: 'preroll',
    formatLabel: 'Infused pre-roll',
    descriptor: 'Five slim pre-rolls, for the shorter walk.',
    spec: '5 count',
    netWeight: '5 count',
  },
  {
    slug: 'gummies-10ct-100',
    name: 'Gummies, 10 count, 100mg',
    format: 'gummy',
    formatLabel: 'Gummy',
    descriptor: 'Ten count, one hundred milligrams total.',
    spec: '10 count, 100mg',
    netWeight: '10 count',
    potency: '100mg',
  },
  {
    slug: 'gummies-10ct-200',
    name: 'Gummies, 10 count, 200mg',
    format: 'gummy',
    formatLabel: 'Gummy',
    descriptor: 'Ten count, two hundred milligrams total.',
    spec: '10 count, 200mg',
    netWeight: '10 count',
    potency: '200mg',
  },
  {
    slug: 'gummies-20ct-200',
    name: 'Gummies, 20 count, 200mg',
    format: 'gummy',
    formatLabel: 'Gummy',
    descriptor: 'Twenty count, two hundred milligrams total.',
    spec: '20 count, 200mg',
    netWeight: '20 count',
    potency: '200mg',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
