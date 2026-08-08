#!/usr/bin/env node
// Build-time doctrine guard for the research library (CG Prompt 08).
// MECHANISM, NOT INDICATION. Fails the build if any forbidden indication,
// dosing, interaction, or adverse-effect term appears in the research content.
// This library will be edited by several people over time; the line is enforced
// here rather than by memory. Runs as a prebuild step.
//
// Terms are the exact list from Prompt 08 plus the dosing/interaction/adverse
// clauses. Multi-word clinical phrases are used so neutral words like "clinical
// audience" or "medical practitioner" do not false-positive.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const TARGETS = [join(ROOT, 'content', 'research.ts'), join(ROOT, 'content', 'research')];

const FORBIDDEN = [
  'chronic pain', 'neuropathic pain', 'nausea', 'vomiting', 'chemotherapy',
  'appetite', 'wasting', 'cachexia', 'multiple sclerosis', 'spasticity',
  'insomnia', 'sleep disorder', 'ptsd', 'glaucoma', 'intraocular pressure',
  'epilepsy', 'seizure', 'dravet', 'lennox-gastaut', 'anxiety disorder',
  'depression', 'psychosis', 'schizophrenia', 'addiction',
  'substance use disorder', 'alzheimer', 'parkinson', 'dementia',
  'neuroprotection', 'neuroprotective', 'inflammatory bowel disease',
  'acne', 'psoriasis', 'eczema', 'therapeutic', 'treats', 'relieves',
  'medical benefit', 'clinical benefit', 'efficacy', 'contraindication',
  'dosing', 'adverse effect', 'drug interaction',
];

function collectFiles(path) {
  let out = [];
  let s;
  try {
    s = statSync(path);
  } catch {
    return out;
  }
  if (s.isDirectory()) {
    for (const name of readdirSync(path)) out = out.concat(collectFiles(join(path, name)));
  } else if (/\.(ts|tsx|json|md)$/.test(path)) {
    out.push(path);
  }
  return out;
}

const files = TARGETS.flatMap(collectFiles);
const hits = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    for (const term of FORBIDDEN) {
      let idx = lower.indexOf(term);
      while (idx !== -1) {
        hits.push({ file: file.replace(ROOT, '.'), line: i + 1, term, text: line.trim() });
        idx = lower.indexOf(term, idx + term.length);
      }
    }
  });
}

if (hits.length > 0) {
  console.error('\nResearch doctrine check FAILED. Forbidden terms found:\n');
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  [${h.term}]  ${h.text}`);
  }
  console.error(
    `\n${hits.length} forbidden term occurrence(s). The research library is mechanism, not indication.\n`,
  );
  process.exit(1);
}

console.log(`Research doctrine check passed (${files.length} file(s), 0 forbidden terms).`);
