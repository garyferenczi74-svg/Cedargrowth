// Contractors, visitors, and agency workers (CG Prompt 09D Section 7), and the
// onboarding tiers (Section 12). These are PERSON records with an ENGAGEMENT
// rather than an employment. They are not employees with a flag, and they are not
// left out: a contractor commissioning a hundred-ton press does more consequential
// work than most employees will that week. Each engagement type carries a minimal
// required curriculum, configured as data. Pure types and logic.

export type EngagementKind = 'CONTRACTOR' | 'VISITOR' | 'AGENCY';

export type Engagement = {
  id: string;
  personId: string;
  kind: EngagementKind;
  company: string | null;
  purpose: string | null;
  start: string | null;
  end: string | null;
  sponsorPersonId: string | null; // the CedarGrowth employee responsible
};

// The minimal required curriculum per engagement type, configured as data. A
// visitor needs site induction only; a contractor commissioning equipment needs
// considerably more, added per purpose rather than fabricated here.
export const ENGAGEMENT_CURRICULUM: Record<EngagementKind, string[]> = {
  VISITOR: ['CGO-MOD-001'],
  AGENCY: ['CGO-MOD-001'],
  CONTRACTOR: ['CGO-MOD-001'],
};

// Onboarding tiers, each gating the next. A person at Tier 1 is cleared for
// nothing on the qualification board, which is correct and should be legible.
export type Tier = 'TIER_1_FACILITY_ACCESS' | 'TIER_2_PRODUCT_HANDLING' | 'TIER_3_EQUIPMENT_OPERATION';

export const TIER_ORDER: Tier[] = [
  'TIER_1_FACILITY_ACCESS',
  'TIER_2_PRODUCT_HANDLING',
  'TIER_3_EQUIPMENT_OPERATION',
];

export const TIER_LABEL: Record<Tier, string> = {
  TIER_1_FACILITY_ACCESS: 'Tier 1, facility access',
  TIER_2_PRODUCT_HANDLING: 'Tier 2, product handling',
  TIER_3_EQUIPMENT_OPERATION: 'Tier 3, equipment operation',
};

// A tier gate passes only when the person has reached the required tier in order.
export function tierGatePasses(current: Tier, required: Tier): boolean {
  return TIER_ORDER.indexOf(current) >= TIER_ORDER.indexOf(required);
}
