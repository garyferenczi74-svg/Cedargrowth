// The nine step protocol (Section 6.2). Copy is production intent in the house
// register, formulation and process only, no physiological claims. Step 06
// names a temperature and pressure window, but the figures are not confirmed
// here, so they render as UNKNOWN rather than an invented number.

export type MethodStep = {
  n: string;
  title: string;
  body: string;
  video?: { src: string; poster?: string };
  image?: string;
  unknownFigure?: { label: string; caption: string };
};

export const METHOD_STEPS: MethodStep[] = [
  {
    n: '01',
    title: 'Input selection',
    body: 'Only dried and cured sugar trim, 100 percent, selected by hand. Nothing grown for flower is diverted into the wash.',
  },
  {
    n: '02',
    title: 'Cold water agitation',
    body: 'The trim is agitated in ice water. Cold keeps the resin heads intact and brittle so they separate cleanly.',
    video: {
      src: 'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Videos/Cold%20water%20agitation.mp4',
      poster:
        'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Videos/bio-mass-1.jpg',
    },
  },
  {
    n: '03',
    title: 'Micron filtration',
    body: 'The slurry passes through a graded stack of micron screens, isolating the resin heads by size.',
  },
  {
    n: '04',
    title: 'Collection and sieving',
    body: 'Heads are collected, sieved, and graded. Only the full melt fractions carry through to pressing.',
    video: {
      src: 'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Videos/Collection%20and%20sieving.mp4',
    },
  },
  {
    n: '05',
    title: 'Freeze drying',
    body: 'The wet hash is freeze dried to pull water without heat, protecting the terpene profile before it is pressed.',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/dry-sift-1024x576.jpeg',
  },
  {
    n: '06',
    title: 'Rosin pressing',
    body: 'The dried hash is pressed between heated plates, held to a stated temperature and pressure window.',
    video: {
      src: 'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Videos/rosin%20press.mp4',
    },
    unknownFigure: {
      label: 'Press window',
      caption: 'Temperature and pressure specification, pending confirmation.',
    },
  },
  {
    n: '07',
    title: 'Cold cure',
    body: 'The fresh rosin is cold cured until it settles into a stable, homogenous consistency.',
    image:
      'https://gncuknpulgzqnpxtxtry.supabase.co/storage/v1/object/public/Hero%20Images/Cold%20Cure.jpg',
  },
  {
    n: '08',
    title: 'Formulation by line',
    body: 'Cured rosin is formulated into one of the five lines by terpene profile and ratio.',
  },
  {
    n: '09',
    title: 'Third-party verification',
    body: 'Every batch is sent to an independent laboratory. Nothing ships before its Certificate of Analysis is complete.',
  },
];

// Input economics for the data panel (Section 6.2). Real figures are not
// confirmed, so input material and yield stay UNKNOWN.
export const METHOD_ECONOMICS = {
  inputCaption: 'Input material per batch, pending confirmation.',
  yieldCaption: 'Yield per batch, pending confirmation.',
  note: 'Yield discipline is what funds the packaging, the testing, and the price.',
};

export const METHOD_ABSENCES = [
  'No hydrocarbons.',
  'No distillate.',
  'No cutting agents.',
  'No synthetic terpenes.',
];
