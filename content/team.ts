// Team roster (spec Section B). Nulls are explicit: they mean pending or
// absent, never a placeholder value. Role and bio are PENDING for both
// entries and render through the Unknown atom. Credential is ABSENT for
// both, which the Team Section omits entirely rather than rendering as
// unknown. NO bio text lives here or anywhere until it is supplied and
// reviewed. /about will reuse this array once it exists.

export type TeamMember = {
  name: string;
  role: string | null;
  credential: string | null;
  bio: string | null;
  portrait: string | null;
};

export const team: readonly TeamMember[] = [
  { name: 'Dr. Fadi Dagher', role: null, credential: null, bio: null, portrait: null },
  { name: 'Thomas Rosengren', role: null, credential: null, bio: null, portrait: null },
] as const;
