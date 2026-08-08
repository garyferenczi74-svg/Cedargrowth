import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { PRODUCTS } from '@/lib/products';
import { LINES } from '@/lib/lines';

// Indexable routes only. Every remaining HoldPage route (holdPageMetadata /
// robots index:false: /dna/privacy, /research/practitioner, /find, /about,
// /account, /cart, /journal, /contact) and everything under /admin is
// deliberately excluded. /dna (CG Prompt 07) and the /research library
// (CG Prompt 08) are full pages and are indexed. The note articles that are
// still COPY PENDING shells are excluded until they carry real copy.
// No invented lastmod: a single stable date, not Date.now().

const LAST_MODIFIED = new Date('2026-08-01');

const STATIC_ROUTES = [
  '/',
  '/method',
  '/wellness',
  '/products',
  '/transparency',
  '/wholesale',
  '/faq',
  '/reserve',
  '/dna',
  '/research',
  '/research/terpenes',
  '/research/ecs',
  '/research/cannabinoids',
  '/research/notes',
  '/legal/privacy',
  '/legal/terms',
  '/legal/accessibility',
  '/legal/compliance',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...LINES.map((line) => line.href),
    ...PRODUCTS.map((product) => `/products/${product.slug}`),
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED,
  }));
}
