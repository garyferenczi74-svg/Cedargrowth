// Per line editorial content for the wellness template (Section 6.3). The
// intent paragraphs describe the intended state and the formulation only, never
// a physiological outcome. Terpene names and anchors are from Section 4.1, the
// character notes are aroma descriptors, not effects.
//
// What is deliberately not asserted here, because it is not confirmed data:
//   which product formats belong to each line, and which DNA traits select into
//   it. Those render as pending states on the page, linking out rather than
//   inventing an assignment.

export type Terpene = { name: string; note: string };

export type WellnessContent = {
  intent: string[];
  terpenes: Terpene[];
  botanicalAlt: string;
};

export const WELLNESS_CONTENT: Record<string, WellnessContent> = {
  rest: {
    botanicalAlt:
      'Placeholder, raw material macro of the botanical terpene source for Rest',
    intent: [
      'Rest is the line we formulate for the end of the day, when the aim is to slow down rather than take something on.',
      'It is myrcene forward, pressed at the lower end of our temperature window so the heavier, earthier terpenes stay intact.',
      'Keep it for the last hour before bed, as part of a wind down you already practice.',
    ],
    terpenes: [
      { name: 'Myrcene', note: 'Earthy, clove, and damp forest floor.' },
    ],
  },
  relief: {
    botanicalAlt:
      'Placeholder, raw material macro of the botanical terpene source for Relief',
    intent: [
      'Relief is formulated for the body after effort, the hours after training, work, or a long day on your feet.',
      'It leans on beta caryophyllene and linalool, a peppery and floral pair, pressed to preserve them.',
      'It is a companion to the recovery you already keep, not a replacement for it.',
    ],
    terpenes: [
      { name: 'Beta caryophyllene', note: 'Warm and peppery, the note in black pepper.' },
      { name: 'Linalool', note: 'Soft and floral, the note in lavender.' },
    ],
  },
  focus: {
    botanicalAlt:
      'Placeholder, raw material macro of the botanical terpene source for Focus',
    intent: [
      'Focus is the daytime line, formulated for the clear part of the day when you want to stay present with your work.',
      'It is pinene and limonene forward, bright and citrus edged, at a ratio tuned to stay light.',
      'Keep it for the part of the day that asks for attention.',
    ],
    terpenes: [
      { name: 'Pinene', note: 'Fresh pine and rosemary.' },
      { name: 'Limonene', note: 'Bright citrus peel.' },
    ],
  },
  calm: {
    botanicalAlt:
      'Placeholder, raw material macro of the botanical terpene source for Calm',
    intent: [
      'Calm is formulated for the room full of people, the dinner, the gathering, the long conversation.',
      'It is a balanced profile, nothing dominant, pressed to sit evenly rather than pull in one direction.',
      'It is made to be sociable, an even keel for time spent with others.',
    ],
    terpenes: [
      { name: 'Balanced profile', note: 'An even blend, nothing dominant.' },
    ],
  },
  restore: {
    botanicalAlt:
      'Placeholder, raw material macro of the botanical terpene source for Restore',
    intent: [
      'Restore is the full spectrum line, formulated for the long return, the slow repair after a demanding stretch.',
      'It keeps the widest terpene profile we press, nothing narrowed, nothing stripped.',
      'It is for the days that ask for patience.',
    ],
    terpenes: [
      { name: 'Full spectrum', note: 'The complete terpene set, unnarrowed.' },
    ],
  },
};
