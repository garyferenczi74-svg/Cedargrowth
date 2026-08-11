#!/usr/bin/env node
// Provenance report for the cannabinoid index. Reads the machine-readable tier
// metadata in content/research-provenance.ts and prints a summary plus the list
// of guide and derived values still awaiting a primary citation. Also guards
// coverage: every compound in the index must carry a provenance record.
//
// Run: node scripts/research-provenance.mjs   (Node 24 strips the TypeScript
// types on import). Exits non-zero on a coverage gap so it can gate a build if
// wired as a prebuild step later.

import {
  CANNABINOID_PROVENANCE,
  provenanceSummary,
  awaitingCitation,
} from '../content/research-provenance.ts';
import { CANNABINOIDS } from '../content/research.ts';

const summary = provenanceSummary();
const total = Object.values(summary).reduce((a, b) => a + b, 0);

console.log('Cannabinoid provenance summary');
console.log(`  verified ${summary.verified}`);
console.log(`  guide    ${summary.guide}`);
console.log(`  derived  ${summary.derived}`);
console.log(`  unknown  ${summary.unknown}`);
console.log(`  total    ${total} data points across ${Object.keys(CANNABINOID_PROVENANCE).length} compounds`);

const awaiting = awaitingCitation();
console.log(`\n${awaiting.length} guide/derived values awaiting a primary citation:`);
for (const { compound, point } of awaiting) {
  const deriv = point.derivation ? ` (${point.derivation})` : '';
  console.log(`  ${compound.toUpperCase().padEnd(6)} ${point.datum}: ${point.value ?? 'UNKNOWN'} [${point.tier}]${deriv}`);
}

const covered = new Set(Object.keys(CANNABINOID_PROVENANCE));
const missing = CANNABINOIDS.filter((c) => !covered.has(c.key)).map((c) => c.key);
if (missing.length > 0) {
  console.error(`\nCoverage gap: no provenance record for ${missing.join(', ')}.`);
  process.exit(1);
}
console.log(`\nCoverage: all ${covered.size} compounds carry a provenance record.`);
