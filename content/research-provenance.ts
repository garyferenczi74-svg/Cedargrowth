// Machine-readable provenance for the cannabinoid index. This is the sidecar to
// the display prose in research.ts: the prose is what a reader sees, this is what
// a query answers. Every atomic data point carries the tier it stands on, so the
// question "which published values still need a primary citation" has a
// programmatic answer rather than a manual audit.
//
// The four tiers are from the compound entry copy specification:
//   verified  read off an NLM record or the primary paper itself
//   guide     supplied by the internal CedarGrowth Reference Guide, not peer
//             reviewed; needs a primary reference before publication
//   derived   calculated from a definitional relationship (decarboxylation, or
//             alkyl homology of 14.03 per CH2 unit); needs a primary reference
//   unknown   not supplied and not derivable; renders UNKNOWN
//
// A point carries a source only when a citable primary is in hand. Guide and
// derived points without a source are the ones awaiting a citation. Nothing here
// is invented: where a figure is not known, its value is null and its tier is
// unknown.

export type ProvenanceTier = 'verified' | 'guide' | 'derived' | 'unknown';

export type ProvenancePoint = {
  datum: string; // what the value is, e.g. 'Formula', 'Molecular weight', 'CB1 Ki'
  value: string | null; // the figure, or null when unknown
  tier: ProvenanceTier;
  source?: string; // citation identifier, present only when a primary is in hand
  derivation?: string; // the definitional relationship, for derived values
};

const p = (
  datum: string,
  value: string | null,
  tier: ProvenanceTier,
  source?: string,
  derivation?: string,
): ProvenancePoint => ({
  datum,
  value,
  tier,
  ...(source ? { source } : {}),
  ...(derivation ? { derivation } : {}),
});

const CITTI = 'Citti 2019';
// E1 is a real primary (CBDA decarboxylation kinetics) named in Batch 1, but its
// citation string is not yet transcribed. The value is verified; the string is
// pending, which is a different state from a guide value awaiting a citation.
const E1 = 'E1 (Batch 1, string pending)';

export const CANNABINOID_PROVENANCE: Record<string, ProvenancePoint[]> = {
  thc: [
    p('Formula', 'C21H30O2', 'guide'),
    p('Molecular weight', '314.46 g/mol', 'guide'),
    p('CAS', '1972-08-3', 'guide'),
    p('Boiling point', '157C at 0.02 mmHg', 'guide'),
    p('Plant content', '10 to 30 percent', 'guide'),
    p('CB1 Ki', '40 nM', 'verified', CITTI),
    p('CB1 Ki range', '10 to 40 nM', 'guide'),
  ],
  cbd: [
    p('Formula', 'C21H30O2', 'guide'),
    p('Molecular weight', '314.46 g/mol', 'guide'),
    p('CAS', '13956-29-1', 'guide'),
    p('Boiling point', '180C at 0.02 mmHg', 'guide'),
    p('Plant content', '0.5 to 20 percent', 'guide'),
    p('Receptor profile', 'CB1 NAM, 5-HT1A, TRPV1, GPR55, PPAR', 'guide'),
  ],
  cbg: [
    p('Formula', 'C21H32O2', 'guide'),
    p('Molecular weight', '316.48 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', '0.5 to 2 percent, up to 15 percent', 'guide'),
    p('Receptor profile', 'CB1, CB2, alpha-2, TRPV1, 5-HT1A', 'guide'),
  ],
  cbc: [
    p('Formula', 'C21H30O2', 'guide'),
    p('Molecular weight', '314.46 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', '0.1 to 1 percent', 'guide'),
    p('Receptor profile', 'CB1 weak, CB2, TRPV1, TRPA1', 'guide'),
  ],
  cbn: [
    p('Formula', 'C21H26O2', 'guide'),
    p('Molecular weight', '310.43 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', '0.1 to 2 percent', 'guide'),
    p('CB1 Ki', '211 nM', 'guide'),
    p('CB2 Ki', '96 nM', 'guide'),
  ],
  thcv: [
    p('Formula', 'C19H26O2', 'guide'),
    p('Molecular weight', '286.41 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', '0.1 to 2 percent, up to 8 to 15 percent', 'guide'),
    p('CB1 Ki', '75.4 nM', 'verified', CITTI),
  ],
  cbdv: [
    p('Formula', 'C19H26O2', 'guide'),
    p('Molecular weight', '286.41 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', '0.1 to 1 percent, up to 10 percent', 'guide'),
    p('Receptor profile', 'TRPV1, TRPV2, TRPM8', 'guide'),
    p('Cannabinoid receptor behavior', null, 'unknown'),
  ],
  cbcv: [
    p('Formula', 'C19H26O2', 'derived', undefined, 'homology from CBC'),
    p('Molecular weight', '286.41 g/mol', 'derived', undefined, 'homology from CBC'),
    p('CAS', null, 'unknown'),
    p('Receptor behavior', null, 'unknown'),
    p('Plant content', null, 'unknown'),
  ],
  cbgv: [
    p('Formula', 'C19H28O2', 'derived', undefined, 'homology from CBG'),
    p('Molecular weight', '288.43 g/mol', 'derived', undefined, 'homology from CBG'),
    p('CAS', null, 'unknown'),
    p('Receptor behavior', null, 'unknown'),
    p('Plant content', null, 'unknown'),
  ],
  cbga: [
    p('Formula', 'C22H32O4', 'derived', undefined, 'CBG plus CO2'),
    p('Molecular weight', '360.49 g/mol', 'derived', undefined, 'CBG plus CO2'),
    p('CAS', null, 'unknown'),
    p('Decarboxylation threshold', null, 'unknown'),
    p('Plant content', null, 'unknown'),
  ],
  thca: [
    p('Formula', 'C22H30O4', 'guide'),
    p('Molecular weight', '358.47 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Decarboxylation threshold', '104 to 110C', 'guide'),
    p('Plant content', '10 to 30 percent', 'guide'),
    p('Nuclear receptor', 'PPAR gamma agonist', 'guide'),
  ],
  cbda: [
    p('Formula', 'C22H30O4', 'guide'),
    p('Molecular weight', '358.47 g/mol', 'guide'),
    p('CAS', null, 'unknown'),
    p('Decarboxylation kinetics', 'above 120C, characterized', 'verified', E1),
    p('Plant content', '2 to 20 percent', 'guide'),
    p('Enzyme activity', 'COX-2 inhibitor, 5-HT1A agonist', 'guide'),
  ],
  cbca: [
    p('Formula', 'C22H30O4', 'derived', undefined, 'CBC plus CO2'),
    p('Molecular weight', '358.47 g/mol', 'derived', undefined, 'CBC plus CO2'),
    p('CAS', null, 'unknown'),
    p('Decarboxylation threshold', null, 'unknown'),
    p('Plant content', null, 'unknown'),
  ],
  cbdva: [
    p('Formula', 'C20H26O4', 'derived', undefined, 'CBDV plus CO2'),
    p('Molecular weight', '330.42 g/mol', 'derived', undefined, 'CBDV plus CO2'),
    p('CAS', null, 'unknown'),
    p('Decarboxylation threshold', null, 'unknown'),
    p('Plant content', null, 'unknown'),
  ],
  thcp: [
    p('Formula', 'C23H34O2', 'verified', CITTI),
    p('Molecular weight', '342.53 g/mol', 'derived', undefined, 'from the verified formula'),
    p('CAS', null, 'unknown'),
    p('Plant content', 'near 29 micrograms per gram in FM2', 'verified', CITTI),
    p('CB1 Ki', '1.2 nM', 'verified', CITTI),
    p('CB2 Ki', '6.2 nM', 'verified', CITTI),
  ],
  cbdp: [
    p('Formula', 'C23H34O2', 'verified', CITTI),
    p('Molecular weight', '342.53 g/mol', 'derived', undefined, 'from the verified formula'),
    p('CAS', null, 'unknown'),
    p('Plant content', 'near 243 micrograms per gram in FM2', 'verified', CITTI),
    p('Receptor behavior', null, 'unknown'),
  ],
  thcb: [
    p('Formula', 'C20H28O2', 'derived', undefined, 'homology from THC'),
    p('Molecular weight', '300.44 g/mol', 'derived', undefined, 'homology from THC'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', null, 'unknown'),
    p('CB1 Ki', '15 nM', 'verified', CITTI),
  ],
  cbdb: [
    p('Formula', 'C20H28O2', 'derived', undefined, 'homology from CBD'),
    p('Molecular weight', '300.44 g/mol', 'derived', undefined, 'homology from CBD'),
    p('CAS', null, 'unknown'),
    p('Boiling point', null, 'unknown'),
    p('Plant content', null, 'unknown'),
    p('Receptor behavior', null, 'unknown'),
  ],
  cbe: [
    p('Formula', null, 'unknown'),
    p('Molecular weight', null, 'unknown'),
    p('CAS', null, 'unknown'),
    p('Plant content', null, 'unknown'),
    p('Receptor', 'CB2 partial agonist', 'guide'),
  ],
  cbl: [
    p('Formula', null, 'unknown'),
    p('Molecular weight', null, 'unknown'),
    p('CAS', null, 'unknown'),
    p('Plant content', 'rare in fresh material', 'guide'),
    p('Receptor behavior', null, 'unknown'),
  ],
  cbt: [
    p('Formula', null, 'unknown'),
    p('Molecular weight', null, 'unknown'),
    p('CAS', null, 'unknown'),
    p('Plant content', 'more abundant in aged or UV-exposed samples', 'guide'),
    p('Receptor behavior', null, 'unknown'),
  ],
};

export type FlatPoint = { compound: string; point: ProvenancePoint };

export function provenanceForCompound(key: string): ProvenancePoint[] {
  return CANNABINOID_PROVENANCE[key] ?? [];
}

export function allProvenancePoints(): FlatPoint[] {
  return Object.entries(CANNABINOID_PROVENANCE).flatMap(([compound, points]) =>
    points.map((point) => ({ compound, point })),
  );
}

export function provenanceByTier(tier: ProvenanceTier): FlatPoint[] {
  return allProvenancePoints().filter((f) => f.point.tier === tier);
}

// Guide and derived values both need a primary reference before publication. A
// point is awaiting a citation when it is guide or derived and carries no source.
export function awaitingCitation(): FlatPoint[] {
  return allProvenancePoints().filter(
    (f) => (f.point.tier === 'guide' || f.point.tier === 'derived') && !f.point.source,
  );
}

export function provenanceSummary(): Record<ProvenanceTier, number> {
  const summary: Record<ProvenanceTier, number> = { verified: 0, guide: 0, derived: 0, unknown: 0 };
  for (const { point } of allProvenancePoints()) summary[point.tier] += 1;
  return summary;
}
