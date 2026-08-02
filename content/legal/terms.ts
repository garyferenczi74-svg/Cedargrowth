// Terms of Service copy (Prompt 05, Task 1). Extracted VERBATIM from
// .superpowers/sdd/cg-prompt-05/source-terms.md. Zero words written,
// edited, rephrased, condensed, expanded, or reordered. The ONLY changes
// from the source are the strips the task brief requires: the draft
// document's header block, the changelog section comparing this draft to
// the prior Bond-derived terms, the placeholder line for the state
// warning chrome (the real chrome renders separately), and every inline
// reviewer instruction bracket addressed to counsel or to counsel and
// Gary together (removed cleanly with its leading space so sentences end
// at their own period). Every other bracketed placeholder (effective
// date, OCM license number, legal contact email, return period) is kept
// exactly as written; nothing is substituted or guessed. Do not edit this
// file without an explicit content-review pass against the source draft.

import type { LegalDoc } from './types';

export const terms: LegalDoc = {
  title: 'Terms of Service',
  metaDescription:
    'The terms governing use of this site, the Cannabis DNA Test, and the CedarGrowth wellness lines.',
  reviewPending: true,
  lastUpdated: '2026-07-28',
  intro: [{ kind: 'p', text: 'Effective date: [DATE].' }],
  sections: [
    {
      heading: '1. Acceptance',
      blocks: [
        {
          kind: 'p',
          text: 'By using this site you agree to these terms. If you do not agree, do not use the site.',
        },
      ],
    },
    {
      heading: '2. Eligibility',
      blocks: [
        {
          kind: 'p',
          text: 'This site is intended for adults 21 years of age or older. By entering, you confirm you are 21 or older and consent to view cannabis-related material, as New York law requires.',
        },
      ],
    },
    {
      heading: '3. Who operates this site',
      blocks: [
        {
          kind: 'p',
          text: 'CedarGrowth Organics Solutions LLC, a New York State licensed cannabis processor, license [OCM LICENSE NUMBER], at 998 Broadway, Buffalo, New York 14212. Contact: [LEGAL EMAIL].',
        },
      ],
    },
    {
      heading: '4. What this site is, and what it is not',
      blocks: [
        {
          kind: 'p',
          text: "CedarGrowth is a licensed processor. We manufacture cannabis products and supply them to licensed New York dispensaries. **We do not sell cannabis products through this site**, cannabis products cannot be shipped to you from it, and no page here constitutes an offer to sell cannabis to a consumer. Verify any dispensary's license through the OCM Dispensary Verification Tool before purchasing.",
        },
      ],
    },
    {
      heading: '5. The Cannabis DNA Test, which is the one thing we do sell',
      blocks: [
        {
          kind: 'p',
          text: 'The DNA test kit is a consumer product, not a cannabis product, and it is sold directly through this site under this Section 5.',
        },
        {
          kind: 'list',
          items: [
            '**What it is.** A saliva collection kit and a laboratory analysis returning a profile of thirteen traits related to cannabinoid metabolism, with suggested product formats and starting protocols.',
            '**What it is not.** Not a medical device. Not a diagnostic test. Not a clinical genetic test. It does not detect, diagnose, treat, cure, mitigate, or prevent any disease or condition, it does not report on disease risk, carrier status, ancestry, or any trait outside the stated panel, and it is not a substitute for advice from a qualified healthcare professional.',
            '**Eligibility.** Purchasers must be 21 or older. Kits are not sold for use by any other person, and you may not submit a sample that is not your own.',
            '**Consent.** Analysis begins only after you register the kit and give separate, specific consent for each stated purpose. Consent may be withdrawn.',
            '**Payment, shipping, and delivery.**',
            '**Returns and cancellation.** An unregistered kit may be returned within [PERIOD] for a refund. **Once a sample has been submitted to the laboratory, the analysis cannot be cancelled or refunded**, because the analysis is the product and it has been performed.',
            '**Results.** Delivered through your account. Turnaround estimates are estimates. A sample that fails quality control is replaced at no cost, once.',
            '**No guarantee of outcome.** The profile suggests products. It does not promise that any product will suit you or produce any particular experience.',
          ],
        },
      ],
    },
    {
      heading: '6. Required health and safety information',
      blocks: [
        {
          kind: 'p',
          text: 'New York requires, and CedarGrowth stands behind, the following:',
        },
        {
          kind: 'list',
          items: [
            'For use only by adults 21 years of age and older. Keep out of reach of children and pets. In case of accidental ingestion or overconsumption, contact the Poison Center at 1-800-222-1222 or call 9-1-1. Please consume responsibly.',
            'Cannabis may cause impairment and may be habit forming.',
            'Cannabis can impair concentration, coordination, and judgment. Do not operate a vehicle or machinery under the influence of cannabis.',
            'There may be health risks associated with consumption of this product.',
            'Cannabis is not recommended for use by persons who are pregnant or nursing.',
          ],
        },
      ],
    },
    {
      heading: '7. No medical claims',
      blocks: [
        {
          kind: 'p',
          text: 'CedarGrowth products are adult-use cannabis products, not medical products. Nothing on this site is medical advice. Nothing here claims that any product diagnoses, treats, cures, mitigates, or prevents any disease or condition.',
        },
        {
          kind: 'p',
          text: 'Our wellness lines are named for the states they were formulated around, not for outcomes they produce. Descriptions of terpene composition, formulation intent, and published laboratory results are statements about the product. They are not statements about what will happen to you. Cannabis affects individuals differently. Start low, go slow.',
        },
      ],
    },
    {
      heading: '8. The practitioner channel',
      blocks: [
        {
          kind: 'p',
          text: "Where CedarGrowth engages with licensed practitioners, the practitioner exercises their own independent professional judgment. CedarGrowth does not practice medicine, does not provide clinical recommendations, and does not direct any practitioner's advice to any patient. Participation by a practitioner is not an endorsement of any CedarGrowth product by that practitioner or by their professional body.",
        },
      ],
    },
    {
      heading: '9. Published laboratory results',
      blocks: [
        {
          kind: 'p',
          text: "We publish a certificate of analysis for every batch we release. Certificates reflect the sample tested by the named laboratory on the stated date, and they are published as received. We do not alter them. Laboratory results describe the tested sample and are not a warranty of any individual unit's performance or effect.",
        },
      ],
    },
    {
      heading: '10. Intellectual property',
      blocks: [
        {
          kind: 'p',
          text: 'CedarGrowth, the CedarGrowth wordmark, the wellness line names, and all site content, design, photography, and copy belong to CedarGrowth Organics Solutions LLC or its licensors. No reproduction, scraping, or commercial use without written permission.',
        },
      ],
    },
    {
      heading: '11. Acceptable use',
      blocks: [
        {
          kind: 'p',
          text: 'No attempts to breach security, no automated scraping, no interference with other visitors, no use of the site to violate any law, and no use of any content here to market cannabis to anyone under 21.',
        },
      ],
    },
    {
      heading: '12. Third parties',
      blocks: [
        {
          kind: 'p',
          text: 'The dispensary locator links to independent licensed businesses we do not control. Their inventory, pricing, service, and websites are their own. Laboratories and other service providers named on this site are independent parties.',
        },
      ],
    },
    {
      heading: '13. Accounts',
      blocks: [
        {
          kind: 'p',
          text: 'Where the site offers an account, you are responsible for the confidentiality of your credentials and for activity under your account. We may suspend an account for breach of these terms. You may close your account and delete your data at any time.',
        },
      ],
    },
    {
      heading: '14. Disclaimers and limitation of liability',
      blocks: [
        {
          kind: 'p',
          text: 'The site is provided as is and as available. To the fullest extent the law allows, we disclaim warranties of every kind and are not liable for indirect, incidental, or consequential damages arising from use of the site. Where liability cannot be excluded, it is limited to the maximum extent the law permits.',
        },
      ],
    },
    {
      heading: '15. Indemnity',
      blocks: [
        {
          kind: 'p',
          text: 'You agree to indemnify CedarGrowth Organics Solutions LLC against claims arising from your breach of these terms or misuse of the site.',
        },
      ],
    },
    {
      heading: '16. Governing law and disputes',
      blocks: [
        {
          kind: 'p',
          text: 'New York law governs, without regard to conflict of law rules. Disputes belong to the state or federal courts located in New York.',
        },
      ],
    },
    {
      heading: '17. Changes and contact',
      blocks: [
        {
          kind: 'p',
          text: 'We may update these terms, and the effective date changes with them. Material changes will be noted plainly on this page. [LEGAL EMAIL], 998 Broadway, Buffalo, New York 14212.',
        },
      ],
    },
  ],
};
