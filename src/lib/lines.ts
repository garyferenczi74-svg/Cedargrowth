// The five wellness lines. Pigment maps to the line color token (used only as a
// 3px marker rule or a tinted plate, never a full bleed or a button). Copy is
// from Section 6.1 Block 3 and the anchors from Section 4.1.

export type Line = {
  key: string;
  name: string;
  href: string;
  descriptor: string;
  pigment: 'rest' | 'relief' | 'focus' | 'calm' | 'restore';
  anchor: string;
  image?: string;
};

export const LINES: Line[] = [
  {
    key: 'rest',
    name: 'Rest',
    href: '/wellness/rest',
    descriptor: 'For the hours before sleep.',
    pigment: 'rest',
    anchor: 'Myrcene',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/Rest%20Asset.jpg',
  },
  {
    key: 'relief',
    name: 'Relief',
    href: '/wellness/relief',
    descriptor: 'For the body after effort.',
    pigment: 'relief',
    anchor: 'Beta caryophyllene, linalool',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/Relief%20Asset.jpg',
  },
  {
    key: 'focus',
    name: 'Focus',
    href: '/wellness/focus',
    descriptor: 'For the clear part of the day.',
    pigment: 'focus',
    anchor: 'Pinene, limonene',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/Focus%20Asset.jpg',
  },
  {
    key: 'calm',
    name: 'Calm',
    href: '/wellness/calm',
    descriptor: 'For the room full of people.',
    pigment: 'calm',
    anchor: 'Balanced profile',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/Calm%20Asset.jpg',
  },
  {
    key: 'restore',
    name: 'Restore',
    href: '/wellness/restore',
    descriptor: 'For the long return.',
    pigment: 'restore',
    anchor: 'Full spectrum',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/Restore%20asset.jpg',
  },
];

// Static class map so the pigment utilities survive JIT purge (dynamic
// bg-${pigment} strings would not be detected). 3px marker rule only.
export const PIGMENT_MARK: Record<Line['pigment'], string> = {
  rest: 'bg-rest',
  relief: 'bg-relief',
  focus: 'bg-focus',
  calm: 'bg-calm',
  restore: 'bg-restore',
};

// The five absences (Section 6.1 Block 4).
export const ABSENCES: { label: string; ceiling: number }[] = [
  { label: 'No solvents.', ceiling: 12 },
  { label: 'No distillate.', ceiling: 12 },
  { label: 'No additives.', ceiling: 12 },
  { label: 'No fillers.', ceiling: 12 },
  { label: 'No shortcuts.', ceiling: 12 },
];
