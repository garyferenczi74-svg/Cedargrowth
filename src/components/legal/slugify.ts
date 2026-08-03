// Turns a section/question heading into a stable anchor id. Used by
// LegalDocument (to set each section's id) and by the FAQ page's contents
// list (to build matching hrefs), so the two never drift apart.

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
