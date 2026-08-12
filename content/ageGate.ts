// Age gate copy (spec Section C item 6). Dedicated content file, following
// the same pattern as content/team.ts, so the 21 plus verification screen
// has no hardcoded marketing copy inside the component. The gate itself is
// shipped behind a feature flag that defaults OFF (see src/lib/flags.ts)
// and is not enabled anywhere; this content exists and is reviewable
// independent of that flag.

export const ageGate = {
  eyebrow: 'Age verification',
  headline: 'Confirm you are 21 or older.',
  body: 'CedarGrowth formulates cannabis products for adults 21 and over. Enter your month and year of birth to continue.',
  monthLabel: 'Month of birth',
  yearLabel: 'Year of birth',
  submitCta: 'Enter the site',
  errorInvalid: 'Enter a valid month and year of birth.',
  errorUnderage: 'You must be 21 or older to enter this site.',
  // States the retention in the UI copy, matching the code comment in
  // AgeGate.tsx: the confirmation lives in per-tab sessionStorage, so it is
  // cleared as soon as the tab or browser is closed and a return visit
  // re-prompts.
  retentionNote:
    'Your confirmation is remembered only for this visit and is cleared when you close this tab or your browser.',
  legalCta: 'Legal',
  accessibilityCta: 'Accessibility',
  exitNote: 'If you are not 21 or older, please leave this site.',
} as const;

export type AgeGateContent = typeof ageGate;
