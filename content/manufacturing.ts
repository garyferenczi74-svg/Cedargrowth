// Manufacturing page copy (CG Prompt 10). Contract manufacturing, white
// label, post-production, and bulk supply, on CedarGrowth's own New York
// licence. Copy lives here, following the same content-layer pattern as
// content/home.ts and content/ageGate.ts, so the compliance-critical wording
// is reviewable in one place.
//
// Standing rails held: zero em-dashes and zero en-dashes; no medical claims;
// no effect claims on behalf of a client brand; no client name, logo, or
// reference; no capacity, minimum, lead time, or price that was not supplied
// (those render UNKNOWN); nothing implying extraction capability, licence
// transfer, or interstate movement. British "licence" is preserved verbatim
// from the prompt.

export type ServiceSpec =
  | { label: string; value: string }
  | { label: string; unknownCaption: string };

export type ManufacturingService = {
  key: string;
  title: string;
  body: string;
  specs: ServiceSpec[];
};

export const manufacturing = {
  meta: {
    title: 'Manufacturing',
    description:
      'CedarGrowth manufactures cannabis products in Buffalo under its own New York licence, for brands that do not hold one. Contract manufacturing, white label, post-production, and bulk solventless supply.',
  },

  hero: {
    eyebrow: 'Manufacturing',
    headline: 'Your brand. Our licence, our floor, our standards.',
    body: 'CedarGrowth manufactures cannabis products in Buffalo under its own New York licence, for brands that do not hold one. You bring the formulation and the identity. We build it here, from New York material, for the New York market.',
    // The hero specimen line (CG Prompt 10A). Three facts, no qualifier, no
    // explanatory sentence. Read together they answer the home purity strip
    // without referencing it, so the contradiction never assembles in a shared
    // screenshot of the hero. Rendered uppercase. On one line the established
    // period convention separates them; at 390 they stack one per line.
    specimen: [
      'Solventless production',
      'Post-production on client-owned material',
      'No extraction',
    ],
    cta: 'Request a conversation',
    placeholderAlt:
      'Placeholder, process documentary of the CedarGrowth production floor',
  },

  interstate: {
    eyebrow: 'How this works',
    headline: 'Nothing crosses the state line.',
    body: 'Cannabis cannot move between states, and no licence can be transferred. What travels is your formulation, your specification, and your brand. Everything else happens here: New York material, our licensed facility, our staff, our certificates of analysis, and New York dispensaries.',
  },

  servicesEyebrow: 'What we make',
  services: [
    {
      key: 'bulk-rosin-supply',
      title: 'Bulk rosin supply',
      body: 'Solventless rosin by weight, to licensed New York processors and brands. Ice water hash and rosin from two input streams, with a published certificate on every batch.',
      specs: [
        { label: 'Formats', unknownCaption: 'Formats, pending confirmation.' },
        { label: 'Minimum', unknownCaption: 'Minimum, pending confirmation.' },
        { label: 'Lead time', unknownCaption: 'Lead time, pending confirmation.' },
      ],
    },
    {
      key: 'solventless-manufacturing',
      title: 'Solventless manufacturing',
      body: 'Rosin vapes, infused pre-rolls, and gummies, produced to your specification under your brand. The same process, the same equipment, and the same standards as everything we make for ourselves.',
      specs: [
        { label: 'Formats', value: 'Vapes . Infused pre-rolls . Gummies' },
        { label: 'Minimum', unknownCaption: 'Minimum, pending confirmation.' },
        { label: 'Lead time', unknownCaption: 'Lead time, pending confirmation.' },
      ],
    },
    {
      key: 'post-production',
      title: 'Post-production',
      body: 'Filling, infusion, and finishing of client-owned distillate. You own the material. We receive it under Metrc, formulate to your specification, fill, infuse, and package. Testing and distribution stay with you.',
      specs: [
        { label: 'Formats', value: 'Vapes . Infused pre-rolls . Gummies' },
        { label: 'Minimum', unknownCaption: 'Minimum, pending confirmation.' },
        { label: 'Lead time', unknownCaption: 'Lead time, pending confirmation.' },
      ],
    },
    {
      key: 'launch-support',
      title: 'Launch support',
      body: 'For brands entering New York for the first time: formulation development, packaging and labelling review against state requirements, Metrc onboarding, and introductions to licensed dispensaries.',
      specs: [],
    },
  ] as ManufacturingService[],

  boundary: {
    eyebrow: 'What we do not do',
    headline: 'We extract nothing we did not press.',
    body: 'CedarGrowth operates no solvent extraction of any kind. We do not distil, refine, or remediate. Everything we produce ourselves is separated with ice, water, and pressure. Where we work with distillate, it belongs to the brand that supplies it, and our part begins after extraction ends.',
  },

  capability: {
    eyebrow: 'Capability',
    headline: 'Documented equipment, one controlled process.',
    body: 'Every step runs under a controlled standard operating procedure. Throughput figures are published only where they are confirmed.',
    equipment: [
      { name: 'RollPros Blackbird', role: 'Pre-roll production' },
      { name: 'Access Rosin KWAD', role: 'Pressing' },
      { name: 'DDS CFM-1800', role: 'Cartridge filling and infusion' },
    ],
    throughputCaption: 'Throughput, pending confirmation.',
  },

  compliance: {
    eyebrow: 'Compliance',
    headline: 'We hold the licence. You keep the brand.',
    handlesHeading: 'What CedarGrowth handles as the licensed manufacturer',
    handles: [
      'Metrc reporting',
      'Packaging and labelling compliance',
      'Manifest and transfer documentation',
    ],
    retainsHeading: 'What the client retains',
    retains: [
      'Their brand',
      'Their formulation',
      'Their material',
      'Their third-party testing and distribution',
      'Their commercial relationships',
    ],
  },

  request: {
    eyebrow: 'Request',
    headline: 'Start a conversation.',
    body: 'CedarGrowth reviews manufacturing inquiries directly. A public inquiry email is being finalized and will be published here. When you write, include your company, your contact, your state of operation, the services you are interested in, the product formats, and an estimated volume.',
    emailCaption: 'Manufacturing inquiry email, pending publication.',
    onwardLabel: 'Contact',
    onwardHref: '/contact',
  },
} as const;

export type ManufacturingContent = typeof manufacturing;
