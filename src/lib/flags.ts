// Typed feature-flag helpers. Mirrors the env pattern in src/lib/supabase.ts:
// read a NEXT_PUBLIC_ prefixed var directly, default to the safe state when
// it is unset. Each flag defaults OFF, and only an exact 'true' or '1' turns
// it on, so a blank, misspelled, or otherwise malformed value never
// accidentally enables behavior.

function readBooleanFlag(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

// Age gate (spec Section C item 6). Defaults OFF. Do not set
// NEXT_PUBLIC_AGE_GATE_ENABLED in any environment until the gate is
// reviewed and explicitly signed off for launch. Gate consumers should
// branch on this at the mount site (do not render the gate component and
// have it return null) so a flag-off site has zero added DOM.
export function isAgeGateEnabled(): boolean {
  return readBooleanFlag(process.env.NEXT_PUBLIC_AGE_GATE_ENABLED);
}
