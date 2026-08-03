// FAQ copy (Prompt 05, Task 1). Extracted from
// .superpowers/sdd/cg-prompt-05/source-faq.md, copy-edited for
// typographical errors ONLY (per the task brief). The only two changes
// made from the source are the removal of the two numbered footnote
// markers (they referenced the counsel-review footnotes stripped from the
// bottom of the draft and would otherwise dangle) from the DNA-test and
// practitioner answers. No other wording was changed; no typographical
// errors were found. The draft document's header block, the counsel
// footnotes and Gary-only notes at the bottom of the draft, and the
// placeholder line for the state warning chrome (the real chrome renders
// separately) were stripped per the brief. Every other bracketed
// placeholder (practitioner contact email, wholesale contact email, press
// contact email) is kept exactly as written; nothing is substituted or
// guessed.

import type { LegalDoc } from './types';

export const faq: LegalDoc = {
  title: 'Questions, answered plainly.',
  metaDescription:
    'Straight answers about CedarGrowth, the two-input method, the Cannabis DNA Test, and where to buy.',
  reviewPending: false,
  lastUpdated: '2026-07-28',
  sections: [
    {
      heading: 'What is CedarGrowth?',
      blocks: [
        {
          kind: 'p',
          text: 'A solventless cannabis processor licensed in New York State, operating from Buffalo. We separate resin with cold water, ice, and mechanical pressure, and we formulate it into five wellness lines organized by intended state rather than by strain name.',
        },
      ],
    },
    {
      heading: 'What does solventless mean?',
      blocks: [
        {
          kind: 'p',
          text: 'That no chemical solvent touches the material at any point. No hydrocarbons, no ethanol, no distillation. The resin is separated from the plant with ice and water, sieved through graduated screens, dried under vacuum, and pressed with heat and pressure alone. What remains is what the plant made.',
        },
      ],
    },
    {
      heading: 'Why two different inputs?',
      blocks: [
        {
          kind: 'p',
          text: 'Because they produce different resin and we would rather label the difference than blend it away.',
        },
        {
          kind: 'p',
          text: 'Dried and cured sugar trim has matured on the plant and through the cure. It reads deeper and more resinous, and it is the material behind most of what we make.',
        },
        {
          kind: 'p',
          text: 'Fresh frozen whole plant is taken to freezing within hours of harvest and never dried. The lightest aromatic compounds survive that process and would not survive a dry room, which is why it reads brighter and closer to the living plant. It costs more to produce and is available in a narrower window.',
        },
        {
          kind: 'p',
          text: 'Both are solventless. Both are full spectrum. Neither is the lesser one.',
        },
      ],
    },
    {
      heading: 'What do the five lines mean?',
      blocks: [
        {
          kind: 'p',
          text: 'Each line is formulated around an intended state rather than a promised outcome.',
        },
        {
          kind: 'p',
          text: 'REST, for the hours before sleep. RELIEF, for the body after effort. FOCUS, for the clear part of the day. CALM, for the room full of people. RESTORE, for the long return.',
        },
        {
          kind: 'p',
          text: 'Cannabis affects every person differently. The lines describe what each was formulated for, not what it will do to you. Start low.',
        },
      ],
    },
    {
      heading: 'What is the Cannabis DNA Test?',
      blocks: [
        {
          kind: 'p',
          text: 'A saliva test that reads thirteen traits related to how your body processes cannabinoids, and returns a profile that suggests a format, a ratio, and a starting protocol.',
        },
        {
          kind: 'p',
          text: 'It is a wellness tool. It is not a medical device, it is not a diagnostic, and it does not detect, diagnose, treat, or prevent any condition. It informs which of our products may suit you, and nothing more than that.',
        },
      ],
    },
    {
      heading: 'What happens to my genetic data?',
      blocks: [
        {
          kind: 'p',
          text: 'You decide, and you can change your mind.',
        },
        {
          kind: 'p',
          text: 'We sequence only the specific markers relevant to cannabinoid metabolism. We do not sell genetic data, we do not share it for advertising, and we do not share it with anyone without your separate and explicit consent. You can export it and you can delete it, yourself, at any time, without asking us.',
        },
        {
          kind: 'p',
          text: 'The full account is on the genetic privacy page, and it is worth reading before you order a kit rather than after.',
        },
      ],
    },
    {
      heading: 'Are your products tested?',
      blocks: [
        {
          kind: 'p',
          text: 'Every batch we release is tested by an independent laboratory licensed in New York, and the full certificate of analysis is published before the batch ships. Enter a batch number on the transparency page to read its complete profile: cannabinoids, terpenes, and every contaminant screen with its result.',
        },
        {
          kind: 'p',
          text: 'If a batch has no published certificate, it has not shipped.',
        },
      ],
    },
    {
      heading: 'Where can I buy CedarGrowth products?',
      blocks: [
        {
          kind: 'p',
          text: "At licensed New York dispensaries. We are a processor, not a retailer, so we do not sell cannabis products through this site and no one can lawfully ship them to you from a website. The Find page shows which dispensaries carry which of our formats, and you can confirm any shop's license through the OCM Dispensary Verification Tool.",
        },
        {
          kind: 'p',
          text: 'The DNA test kit is the one thing we do sell directly, because it is not a cannabis product.',
        },
      ],
    },
    {
      heading: 'Is cannabis risk-free?',
      blocks: [
        {
          kind: 'p',
          text: 'No, and we will not suggest otherwise. Cannabis may cause impairment and may be habit forming. It can impair concentration, coordination, and judgment. There may be health risks associated with consumption. It is not recommended for persons who are pregnant or nursing. Never drive or operate machinery under the influence.',
        },
        {
          kind: 'p',
          text: 'If someone ingests cannabis accidentally, contact the Poison Center at 1-800-222-1222 or call 9-1-1.',
        },
      ],
    },
    {
      heading: 'Do I need to be 21?',
      blocks: [
        {
          kind: 'p',
          text: 'Yes. This site and everything we make is for adults 21 and over. Keep every cannabis product out of reach of children and pets.',
        },
      ],
    },
    {
      heading: 'How should I store your products?',
      blocks: [
        {
          kind: 'p',
          text: 'In the original packaging, upright, cool, and dark, locked away from children and pets. Rosin is a living material and heat is what degrades it fastest.',
        },
      ],
    },
    {
      heading: 'I am a practitioner. How does the referral pathway work?',
      blocks: [
        {
          kind: 'p',
          text: 'Write to [PRACTITIONER EMAIL]. We will describe the programme, what a practitioner receives, and the consent model in full.',
        },
      ],
    },
    {
      heading: 'I run a dispensary. How do we carry your products?',
      blocks: [
        {
          kind: 'p',
          text: 'Write to [WHOLESALE EMAIL], or use the request form on the wholesale page. We will send the line sheet, case configurations, minimums, and lead times.',
        },
      ],
    },
    {
      heading: 'Press and partnerships?',
      blocks: [
        {
          kind: 'p',
          text: '[PRESS EMAIL].',
        },
      ],
    },
  ],
};
