// The research library (CG Prompt 08 / 08A / 08B / 08C). Content module.
//
// DOCTRINE, enforced by scripts/check-research-terms.mjs at build time:
// MECHANISM, NOT INDICATION. Nothing here states, implies, or cites toward the
// claim that a compound is a remedy for a condition. Receptor pharmacology,
// chemistry, biosynthesis, and extraction physics only. No indication, no dose
// guidance, no interaction, no safety-warning content. Tiers and citations are
// supplied, never assigned or invented by the build. Where a value is not
// supplied it renders UNKNOWN or CITATION PENDING, never a guess.
//
// SOURCE: the Comprehensive Cannabinoid Reference Guide 2026, mechanism and
// chemistry sections only (Sections 1, 2, and the chemical/receptor/extraction
// portions of 3 to 6). Terpene public copy is 08A Layer 2, verbatim. Only three
// references in the guide are publishable (no indication in the title): Russo
// 2011 (entourage), Pacher 2006 (ECS), Citti 2019 (THCP discovery). Every other
// reference names an indication and is gated; those entries carry CITATION
// PENDING rather than an invented citation.

export type EvidenceTier = 'Established' | 'Supported' | 'Emerging';

export type EntryField = { label: string; value: string | null };

export type Compound = {
  key: string; // URL fragment, e.g. #thcp
  name: string;
  abbr?: string;
  summary: string; // collapsed one-liner, useful on its own
  tier: EvidenceTier | null; // null renders UNKNOWN
  fields: EntryField[]; // null values render UNKNOWN
  sources: string[] | null; // null renders CITATION PENDING
  clinical: { references: number; indications: number } | null; // counts only; null omits the line
  tags: string[]; // filter tags
};

// Publishable references (mechanism / chemistry / discovery). Full academic
// format. These are the only guide references without an indication in the
// title, so they are the only ones that may appear on the public site.
export const REFERENCES = {
  russo2011:
    'Russo EB. (2011). Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects. British Journal of Pharmacology, 163(7), 1344-1364.',
  pacher2006:
    'Pacher P, Batkai S, Kunos G. (2006). The endocannabinoid system as an emerging target of pharmacotherapy. Pharmacological Reviews, 58(3), 389-462.',
  citti2019:
    'Citti C, et al. (2019). A novel phytocannabinoid isolated from Cannabis sativa L. with an in vivo cannabimimetic activity higher than tetrahydrocannabinol: Tetrahydrocannabiphorol. Scientific Reports, 9, 20335.',
};

// Verified Batch 1 references (CG Prompt 11C), transcribed verbatim from the
// supplied primer. Each is a mechanism, pharmacology, or discovery title with
// no indication named, so each is publishable under the library doctrine. Keyed
// by the identifier the primer cites (F1 through F4) so pages reference them by
// identifier rather than duplicating the citation text.
export const BATCH1_REFERENCES: Record<string, string> = {
  F1: 'Hanuš LO, Meyer SM, Muñoz E, Taglialatela-Scafati O, Appendino G. (2016). Phytocannabinoids: a unified critical inventory. Natural Product Reports 33:1357-1392. PMID 27722705.',
  F2: 'Munro S, Thomas KL, Abu-Shaar M. (1993). Molecular characterization of a peripheral receptor for cannabinoids. Nature 365:61-65. PMID 7689702.',
  F3: 'Pertwee RG. (2008). The diverse CB1 and CB2 receptor pharmacology of three plant cannabinoids. British Journal of Pharmacology 153:199-215. PMID 17828291.',
  F4: 'Shao Z, et al. (2016). High-resolution crystal structure of the human CB1 cannabinoid receptor. Nature 540:602-606. PMID 27851727.',
};

// The ECS primer (CG Prompt 11C) is a full article, so its sections carry
// blocks rather than a single string: paragraphs (with an optional citation
// identifier that renders as a superscript link) and term lists.
export type EcsBlock =
  | { kind: 'p'; text: string; cite?: string }
  | { kind: 'terms'; items: { term: string; text: string }[] };

// ---------------------------------------------------------------------------
// THE ENDOCANNABINOID SYSTEM (pillar one). From guide Section 2, restricted to
// receptor location and molecular mechanism. Function is described at the
// cellular level, never as a benefit for a person or a condition.
// ---------------------------------------------------------------------------

export const ECS = {
  eyebrow: 'Pharmacology',
  headline: 'The endocannabinoid system, plainly.',
  tier: 'Established' as EvidenceTier,
  category: 'Pharmacology',
  // Reference identifiers into BATCH1_REFERENCES, in citation order. F1 is the
  // general inventory reference; F2 to F4 are cited inline in the sections. The
  // whole article (CG Prompt 11C primer) is transcribed verbatim.
  sources: ['F1', 'F2', 'F3', 'F4'],
  intro: [
    'Two people take the same product at the same dose and have entirely different afternoons. The reason is not mysterious and it is not a matter of tolerance alone. It is a receptor system that varies considerably from person to person, in how densely it is expressed, how quickly it clears what binds to it, and what else it responds to.',
    'This is an account of that system: what it is made of, where it sits, and why it behaves differently in different bodies. It describes mechanism. It does not describe outcomes, and nothing here should be read as advice.',
  ],
  sections: [
    {
      key: 'what-the-body-makes',
      heading: 'What the body already makes',
      blocks: [
        { kind: 'p' as const, text: 'The system is named for compounds the body produces itself. Two are well characterized: anandamide and 2-arachidonoylglycerol, usually shortened to 2-AG. Both are lipids, built from fatty acids in cell membranes, and both are unusual in how they are handled.' },
        { kind: 'p' as const, text: 'Most signalling molecules are manufactured in advance and held in vesicles until they are needed. Endocannabinoids are not. They are synthesized on demand, at the moment of the signal, from material already present in the membrane. They act, and then they are broken down quickly by dedicated enzymes.' },
        { kind: 'p' as const, text: 'That production-on-demand pattern is the first reason the system varies between people. There is no reservoir to measure. What matters is how readily a given body builds these compounds and how quickly it takes them apart, and both are under genetic and physiological influence.' },
      ],
    },
    {
      key: 'cb1',
      heading: 'CB1, and where it sits',
      blocks: [
        { kind: 'p' as const, text: 'The first cannabinoid receptor is among the most abundant receptors of its type in the mammalian brain.' },
        { kind: 'p' as const, text: 'CB1 is concentrated in the central nervous system: the cortex, the hippocampus, the basal ganglia, the cerebellum, and the hypothalamus. It also appears in the peripheral nervous system and in a range of other tissues at lower density. Its structure has been resolved at high resolution, which is how the shape of its binding pocket is known rather than inferred.', cite: 'F4' },
        { kind: 'p' as const, text: 'Its position in a circuit is what makes it distinctive. CB1 typically sits on the presynaptic terminal, the sending side of a junction between two neurons. Most signalling runs forward, from sending cell to receiving cell. Endocannabinoid signalling runs backward: the receiving cell produces the compound, it travels back across the gap, and it binds CB1 on the cell that just fired.' },
        { kind: 'p' as const, text: "The effect is to reduce that cell's subsequent release of whatever it was releasing, which may be an excitatory signal, an inhibitory one, or a modulatory one. CB1 is therefore not a switch with a single function. It is a volume control fitted to many different circuits, and what it does depends entirely on which circuit it is fitted to." },
        { kind: 'p' as const, text: "THC binds CB1 as a partial agonist, meaning it occupies the receptor and activates it, but less completely than the body's own compounds do at full effect.", cite: 'F3' },
      ],
    },
    {
      key: 'cb2',
      heading: 'CB2, and the rest of the body',
      blocks: [
        { kind: 'p' as const, text: 'The second receptor was identified three years after the first and it is distributed quite differently.', cite: 'F2' },
        { kind: 'p' as const, text: 'CB2 is expressed mainly outside the central nervous system, in immune tissue: the spleen, the tonsils, the thymus, and circulating immune cells. It also appears on microglia, the immune cells resident in the brain, which is why the boundary between the two receptors is less clean than a simple central-and-peripheral division suggests.' },
        { kind: 'p' as const, text: 'CB2 activation does not produce intoxication. Compounds that bind it selectively do not produce the effects associated with CB1, which is the pharmacological basis for the interest in cannabinoids that act at one receptor and not the other.' },
      ],
    },
    {
      key: 'other-targets',
      heading: 'The other targets',
      blocks: [
        { kind: 'p' as const, text: 'Describing this as a two-receptor system is a simplification that stopped being accurate some time ago. Several cannabinoids act at receptors outside the cannabinoid family entirely.', cite: 'F3' },
        {
          kind: 'terms' as const,
          items: [
            { term: 'TRPV1', text: 'is a vanilloid receptor, the same channel that responds to capsaicin and to heat. Several cannabinoids and several terpenes act here.' },
            { term: '5-HT1A', text: "is a serotonin receptor. CBD acts at it, which is part of why CBD's pharmacology looks so unlike THC's despite the two sharing a molecular formula." },
            { term: 'GPR55', text: 'is sometimes called an orphan receptor, because it was identified before its natural ligand was agreed. It responds to several cannabinoids, and CBD appears to block it.' },
            { term: 'PPAR gamma', text: 'is a nuclear receptor, which is a different class again: rather than sitting in the membrane and passing a signal inward, it acts on gene expression directly.' },
          ],
        },
        { kind: 'p' as const, text: "The practical consequence is that a compound's behaviour cannot be predicted from its cannabinoid receptor binding alone. CBD binds the cannabinoid receptors weakly and is pharmacologically active, because most of what it does happens elsewhere." },
      ],
    },
    {
      key: 'enzymes',
      heading: 'The enzymes, which are where the variation lives',
      blocks: [
        { kind: 'p' as const, text: 'Two enzymes do most of the disassembly. FAAH breaks down anandamide. MAGL breaks down 2-AG.' },
        { kind: 'p' as const, text: 'These are the least visible part of the system and arguably the most consequential. If synthesis is on demand and degradation is enzymatic, then the concentration of endocannabinoids present at any moment is set by the balance between the two. A body that degrades anandamide slowly maintains a higher baseline than one that degrades it quickly, with no difference in how much it produces.' },
        { kind: 'p' as const, text: 'That baseline has a name in the literature: endocannabinoid tone. It is not directly measurable in a clinical setting, and it is the most likely explanation for a substantial part of the variation between people.' },
      ],
    },
    {
      key: 'why-different',
      heading: 'So why do two people respond differently',
      blocks: [
        { kind: 'p' as const, text: 'Four sources of variation, none of which involve tolerance or expectation.' },
        {
          kind: 'terms' as const,
          items: [
            { term: 'Receptor density', text: 'How many CB1 and CB2 receptors are expressed, and where. This varies between individuals and is under genetic influence.' },
            { term: 'Receptor sensitivity', text: 'How readily a given receptor responds once occupied, which is a function of its structure and of variation in the gene encoding it.' },
            { term: 'Enzyme activity', text: 'How quickly FAAH and MAGL clear what is present, which sets baseline tone.' },
            { term: 'Metabolism', text: 'How quickly the liver processes what was consumed, which determines how much reaches the receptors and for how long. This is the work of enzymes in the cytochrome P450 family, and it varies widely between people.' },
          ],
        },
        { kind: 'p' as const, text: 'None of these are visible from the outside. Two people of similar size and similar experience can differ substantially on all four, which is why dose recommendations derived from population averages describe a middle that many individuals do not occupy.' },
      ],
    },
    {
      key: 'what-this-does-not-tell-you',
      heading: 'What this does not tell you',
      blocks: [
        { kind: 'p' as const, text: 'This is an account of a signalling system. It is not a guide to what any product will do, and it is not medical information.' },
        { kind: 'p' as const, text: 'The system described here participates in a great many physiological processes, and that breadth is often presented as evidence that acting on it produces broad benefit. It is not evidence of that. A system involved in many things is a system where intervention has many consequences, some of them unintended, and the honest position is that the mechanism is reasonably well characterized while the clinical picture in most areas is not.' },
        { kind: 'p' as const, text: 'Where we can measure something, we publish it. Where the evidence is thin, we say so.' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// THE TERPENE INDEX (pillar two). Public copy is 08A Layer 2, verbatim.
// Per-terpene citations carry CITATION PENDING: 08A flags each primary as
// needing verification before it is cited, so none are printed here.
// ---------------------------------------------------------------------------

const terpene = (
  key: string,
  name: string,
  summary: string,
  aroma: string,
  character: string,
  alsoIn: string,
  mechanism: string | null,
  line: string,
  tier: EvidenceTier | null,
  tags: string[],
): Compound => ({
  key,
  name,
  summary,
  tier,
  fields: [
    { label: 'Aroma', value: aroma },
    { label: 'Character', value: character },
    { label: 'Also found in', value: alsoIn },
    { label: 'Mechanism', value: mechanism },
    { label: 'Associated line', value: line },
  ],
  sources: null,
  clinical: null,
  tags,
});

export const TERPENES: Compound[] = [
  terpene(
    'myrcene',
    'Myrcene',
    'The most abundant terpene in modern cannabis, associated with heavier, slower profiles.',
    'Earthy, musky, clove.',
    'The most abundant terpene in modern cannabis, and the one most associated with heavier, slower profiles.',
    'Hops, lemongrass, thyme.',
    'Studied at alpha-2 adrenoceptors and, in one model, the serotonergic pathway; a reported TRPV1 interaction did not replicate in the human channel.',
    'REST',
    'Supported',
    ['monoterpene', 'rest'],
  ),
  terpene(
    'beta-caryophyllene',
    'Beta-caryophyllene',
    'A sesquiterpene, and the only cannabis terpene with a documented claim to direct cannabinoid receptor binding.',
    'Pepper, clove, warm wood.',
    'A sesquiterpene, heavier than the citrus and pine compounds, and the only cannabis terpene with a documented claim to direct cannabinoid receptor binding.',
    'Black pepper, clove, hops.',
    'Described as a selective CB2 receptor agonist, which is the receptor family expressed peripherally rather than in the brain; one 2019 study found no such activity, and the dispute is unresolved.',
    'RELIEF',
    'Supported',
    ['sesquiterpene', 'relief'],
  ),
  terpene(
    'linalool',
    'Linalool',
    'Light and floral, the compound most responsible for a profile reading as soft.',
    'Lavender, floral, faint citrus.',
    'Light, and the compound most responsible for a profile reading as soft.',
    'Lavender, coriander, birch.',
    'Studied at benzodiazepine-responsive GABA-A receptors. In mice the effect disappeared when the sense of smell was removed, which suggests the aroma itself is part of the route rather than a byproduct of it.',
    'RELIEF and CALM',
    'Supported',
    ['monoterpene', 'relief', 'calm'],
  ),
  terpene(
    'alpha-pinene',
    'Alpha-pinene',
    'Bright and volatile, among the first compounds lost when material is dried.',
    'Pine, rosemary, sharp resin.',
    'Bright and volatile, among the first compounds lost when material is dried.',
    'Pine, rosemary, basil.',
    'Binds as a partial modulator at the benzodiazepine site of the GABA-A receptor, shown by electrophysiology and molecular docking, and studied for its effect on non-REM sleep architecture.',
    'UNDER REVIEW',
    'Supported',
    ['monoterpene'],
  ),
  terpene(
    'limonene',
    'Limonene',
    'The compound that makes a profile read as lifted rather than heavy.',
    'Citrus peel, bright, sharp.',
    'The compound that makes a profile read as lifted rather than heavy.',
    'Citrus rind, juniper, peppermint.',
    'Studied at adenosine A2A receptors, with downstream effects on dopaminergic and GABAergic signalling in the striatum, a route distinct from the GABA-A compounds above.',
    'FOCUS',
    'Supported',
    ['monoterpene', 'focus'],
  ),
  terpene(
    'alpha-humulene',
    'Alpha-humulene',
    'Earthy and hoppy, the structural isomer of beta-caryophyllene.',
    'Earthy, hoppy, woody.',
    'A sesquiterpene that commonly co-occurs with beta-caryophyllene, its structural isomer.',
    'Hops, sage, ginseng.',
    'Reported activity is preclinical; a 2024 scoping review exists to consolidate its early evidence base.',
    'UNASSIGNED',
    'Emerging',
    ['sesquiterpene'],
  ),
  terpene(
    'nerolidol',
    'Nerolidol',
    'Floral and woody, and the one terpene to show weak TRPV1 activation in a recent screen.',
    'Floral, woody, bark, faint citrus.',
    'A sesquiterpene alcohol, and also described as a transdermal penetration enhancer, which is a formulation property.',
    'Jasmine, ginger, tea tree.',
    'The one exception in a TRPV1 screen where the other cannabis terpenes showed no effect: nerolidol induced weak TRPV1 activation.',
    'UNASSIGNED',
    'Emerging',
    ['sesquiterpene'],
  ),
  terpene(
    'terpinolene',
    'Terpinolene',
    'Fresh and piney, present across many chemovars.',
    'Fresh, piney, faintly floral.',
    'Present across chemovars; mechanistic data is sparse.',
    'Nutmeg, tea tree, apple.',
    null,
    'UNASSIGNED',
    'Emerging',
    ['monoterpene'],
  ),
  terpene(
    'ocimene',
    'Ocimene',
    'Sweet and herbaceous, consistent with a plant-defense role.',
    'Sweet, woody, herbaceous.',
    'Reported antimicrobial and antifungal activity, consistent with a plant defense role.',
    'Mint, parsley, basil.',
    'No effect on the TRPV1 channel in the screen that tested it.',
    'UNASSIGNED',
    'Emerging',
    ['monoterpene'],
  ),
  terpene(
    'alpha-bisabolol',
    'Alpha-bisabolol',
    'Floral and sweet, characteristic of fiber-type cannabis.',
    'Floral, sweet, chamomile.',
    'Characteristic of fiber-type cannabis alongside beta-eudesmol, guaiol, and eucalyptol.',
    'Chamomile, candeia tree.',
    null,
    'UNASSIGNED',
    'Emerging',
    ['sesquiterpene'],
  ),
  terpene(
    'eucalyptol',
    'Eucalyptol',
    'Minty and cooling, also known as 1,8-cineole.',
    'Minty, cooling, camphoraceous.',
    'Also known as 1,8-cineole; reported activity is preclinical.',
    'Eucalyptus, rosemary, sage.',
    null,
    'UNASSIGNED',
    'Emerging',
    ['monoterpene'],
  ),
  terpene(
    'geraniol',
    'Geraniol',
    'Rose-sweet, an antioxidant terpene found across many plants.',
    'Rose, sweet.',
    'Reported antioxidant activity is preclinical.',
    'Geranium, rose oil, lemons.',
    null,
    'UNASSIGNED',
    'Emerging',
    ['monoterpene'],
  ),
  terpene(
    'borneol',
    'Borneol',
    'Camphor and cool, in the same mechanistic family as pinene and linalool.',
    'Camphor, cool, herbal.',
    'A bicyclic monoterpene documented as a positive modulator of GABA-A action at recombinant human receptors.',
    'Camphor, rosemary, mint.',
    'Documented as a positive modulator of GABA-A action at recombinant human GABA-A receptors, the same mechanistic family as pinene and linalool.',
    'UNASSIGNED',
    'Emerging',
    ['monoterpene'],
  ),
  terpene(
    'delta-3-carene',
    'Delta-3-carene',
    'Sweet and piney, sharing alpha-pinene’s GABA-A mechanism.',
    'Sweet, piney, cypress.',
    'Shares alpha-pinene’s mechanism.',
    'Pine, cedar, rosemary.',
    'Prolonged the decay time constant of GABA-A receptors, fully blocked by flumazenil, with docking at the benzodiazepine binding site.',
    'UNASSIGNED',
    'Emerging',
    ['monoterpene'],
  ),
];

// ---------------------------------------------------------------------------
// THE CANNABINOID INDEX (pillar three). From guide chemistry and receptor
// sections plus the verified Batch 1 references. Mechanism is receptor-level
// physiology, never an indication. Provenance is tiered: verified and guide
// values render plain, derived values carry an inline derivation note (from
// decarboxylation, acid plus CO2, or alkyl homology of 14.03 per CH2 unit), and
// unsupplied values render UNKNOWN. Evidence tiers are unsupplied (null ->
// UNKNOWN) pending the science lead. The closing note per entry carries the
// process paragraph or the honesty caveat. Only the compounds covered by Citti
// 2019 (THC, THCV, THCB, THCP, CBDP) carry a publishable citation; the rest
// render CITATION PENDING pending the remaining Batch 1 reference strings. The
// CLINICAL counts line is unsupplied, so it is omitted.
// ---------------------------------------------------------------------------

const cannabinoid = (
  key: string,
  name: string,
  abbr: string,
  summary: string,
  chemistry: string | null,
  receptor: string | null,
  mechanism: string | null,
  extraction: string | null,
  sources: string[] | null,
  tags: string[],
  note?: string | null,
  noteLabel?: string,
): Compound => ({
  key,
  name,
  abbr,
  summary,
  tier: null,
  fields: [
    { label: 'Chemistry', value: chemistry },
    { label: 'Receptor behavior', value: receptor },
    { label: 'Mechanism', value: mechanism },
    { label: 'In extraction', value: extraction },
    // Provenance tiers ([verified], [guide], [derived]) render as plain values;
    // derived values carry an inline derivation note; [unknown] renders UNKNOWN
    // through a null value. The closing note carries the process paragraph or the
    // honesty caveat, and is omitted when null.
    ...((note ? [{ label: noteLabel ?? 'In our process', value: note }] : []) as EntryField[]),
  ],
  sources,
  clinical: null,
  tags,
});

export const CANNABINOIDS: Compound[] = [
  // Group A: major phytocannabinoids (greater than 1 percent).
  cannabinoid(
    'thc',
    'Tetrahydrocannabinol',
    'THC',
    'Primary intoxicating compound. CB1 partial agonist.',
    'Formula C21H30O2. Molecular weight 314.46 g/mol. CAS 1972-08-3. Boiling point 157C at 0.02 mmHg, a vacuum distillation figure that does not describe behavior at atmospheric pressure. Typically 10 to 30 percent in high-THC cultivars.',
    'CB1 partial agonist, Ki 10 to 40 nM. CB2 weak agonist. The CB1 figure is corroborated at 40 nM in an independent binding assay.',
    'At CB1 in the central nervous system it reduces release of neurotransmitters including GABA, glutamate, dopamine, and norepinephrine. It modulates adenylyl cyclase, lowering cyclic AMP, and acts on calcium and potassium channels to reduce neuronal excitability. Its behavior is partial rather than full agonism: it occupies the receptor without producing the maximal response a full agonist would.',
    'Highly lipophilic; extracts efficiently in hydrocarbon, ethanol, and supercritical CO2. Decarboxylates from THCA beginning near 105C, optimal at 115 to 120C. Oxidizes to CBN under oxygen, light, and heat, so cold and dark storage is a preservation requirement rather than a preference. Crystallizes at room temperature with a melting point of 28 to 31C.',
    [REFERENCES.citti2019],
    ['major', 'intoxicating'],
    'Ice water separation never approaches the decarboxylation threshold, so the material entering the press is predominantly THCA. Conversion happens under the platens, which is why press temperature is the single variable that sets the neutral cannabinoid content of a finished rosin.',
    'In our process',
  ),
  cannabinoid(
    'cbd',
    'Cannabidiol',
    'CBD',
    'Non-intoxicating. CB1 negative allosteric modulator, 5-HT1A and TRPV1 agonist, GPR55 antagonist.',
    'Formula C21H30O2. Molecular weight 314.46 g/mol. CAS 13956-29-1. Boiling point 180C at 0.02 mmHg, a vacuum distillation figure. Ranges widely from 0.5 to 20 percent by chemotype.',
    'CB1 negative allosteric modulator. CB2 weak partial agonist. 5-HT1A agonist. TRPV1 agonist. GPR55 antagonist.',
    'CBD shares a molecular formula with THC and almost none of its receptor behavior. Rather than activating CB1 it binds a separate site and lowers the receptor responsiveness to compounds that do, which is why it attenuates the activity of THC. Its other activity happens largely outside the cannabinoid receptors, at 5-HT1A, TRPV1, GPR55, and PPAR, which is why its pharmacology is described as promiscuous rather than targeted.',
    'Crystallizes readily to an isolate above 99 percent purity. More stable than THC and less prone to oxidation. Decarboxylates from CBDA at 120 to 140C, more slowly than THCA. Poorly water soluble, so beverages and emulsions require additional processing.',
    null,
    ['major', 'non-intoxicating'],
    'THCA and CBDA do not decarboxylate at the same rate. A press schedule tuned for one is not tuned for the other, and material carrying both will convert unevenly under a single temperature hold.',
    'In our process',
  ),

  // Group B: minor phytocannabinoids (0.1 to 1 percent).
  cannabinoid(
    'cbg',
    'Cannabigerol',
    'CBG',
    'Non-intoxicating. Neutral form of the biosynthetic precursor CBGA.',
    'Formula C21H32O2. Molecular weight 316.48 g/mol. CAS UNKNOWN. Boiling point UNKNOWN. Typically 0.5 to 2 percent in most cultivars, up to 15 percent in CBG-dominant selections.',
    'CB1 weak partial agonist. CB2 moderate affinity. Alpha-2 adrenoceptor agonist. TRPV1 agonist. 5-HT1A antagonist.',
    'CBG occupies an unusual position: its acidic form is the substrate that plant enzymes convert into the acidic precursors of THC, CBD, and CBC. What remains as CBG in a finished plant is largely what was not converted. Its receptor activity is spread across cannabinoid and non-cannabinoid targets, with notably more adrenergic involvement than the other major compounds.',
    null,
    null,
    ['minor', 'non-intoxicating'],
    'Because CBGA is consumed during biosynthesis, a high-CBG cultivar is one selected to arrest that conversion rather than one that produces more of it.',
    'Worth noting',
  ),
  cannabinoid(
    'cbc',
    'Cannabichromene',
    'CBC',
    'Non-intoxicating. TRPV1 and TRPA1 agonist, weak at CB1.',
    'Formula C21H30O2. Molecular weight 314.46 g/mol. CAS UNKNOWN. Boiling point UNKNOWN. Typically 0.1 to 1 percent, higher in some landrace populations.',
    'CB1 very weak. CB2 moderate agonist. TRPV1 agonist. TRPA1 agonist.',
    'CBC is the third product of the CBGA branch point, formed by its own synthase enzyme alongside those producing THCA and CBDA. Its activity sits largely outside the cannabinoid receptors, at the transient receptor potential channels TRPV1 and TRPA1 that also respond to capsaicin and to mustard oil compounds.',
    'Degrades to CBL under acidic conditions. Converts to CBT with heat and ultraviolet exposure. Decarboxylation behavior of CBCA UNKNOWN.',
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbn',
    'Cannabinol',
    'CBN',
    'Oxidation product of THC. Accumulates with age, light, and heat exposure.',
    'Formula C21H26O2. Molecular weight 310.43 g/mol. CAS UNKNOWN. Boiling point UNKNOWN. Typically 0.1 to 2 percent, rising with storage time.',
    'CB1 partial agonist, Ki 211 nM. CB2 partial agonist, Ki 96 nM. Roughly one tenth the potency of THC.',
    'CBN is not primarily a biosynthetic product. It forms when THC oxidizes, so its concentration in a sample is largely a record of that sample history rather than of its genetics. It binds both cannabinoid receptors with lower affinity than THC and, unusually among the cannabinoids, binds CB2 more readily than CB1.',
    'CBN content is a storage artifact. Rising CBN in a stored product indicates oxidative degradation of THC and is a stability indicator rather than a feature.',
    null,
    ['minor', 'intoxicating'],
    'CBN is widely marketed as a sleep compound. The evidence for that activity is limited, and the study most often cited for it came from a commercial laboratory and was not peer reviewed. CedarGrowth does not make that claim.',
    'On the evidence',
  ),
  cannabinoid(
    'thcv',
    'Tetrahydrocannabivarin',
    'THCV',
    'Propyl analog of THC, three-carbon side chain. Dose-dependent at CB1.',
    'Formula C19H26O2. Molecular weight 286.41 g/mol. CAS UNKNOWN. Boiling point UNKNOWN. A propyl analog with a three-carbon side chain against the five-carbon chain of THC. Typically 0.1 to 2 percent, up to 8 to 15 percent in certain African landrace populations.',
    'CB1 antagonist at low concentration, agonist at high. CB2 partial agonist. CB1 Ki 75.4 nM in a comparative binding assay.',
    'THCV differs from THC by two carbons on the side chain, and that difference reverses its behavior at CB1 across a concentration range: at low levels it blocks the receptor, at higher levels it activates it. It is the clearest illustration in the plant of why side chain length is treated as the pharmacophore in this compound class.',
    null,
    [REFERENCES.citti2019],
    ['minor', 'intoxicating'],
  ),
  cannabinoid(
    'cbdv',
    'Cannabidivarin',
    'CBDV',
    'Propyl analog of CBD.',
    'Formula C19H26O2. Molecular weight 286.41 g/mol. CAS UNKNOWN. Boiling point UNKNOWN. A propyl analog of CBD. Typically 0.1 to 1 percent, up to 10 percent in selected cultivars.',
    'TRPV1 agonist. TRPV2 agonist. TRPM8 antagonist. Cannabinoid receptor behavior UNKNOWN.',
    'CBDV stands in the same relationship to CBD that THCV stands to THC: two fewer carbons on the side chain. Its documented activity is at the transient receptor potential channels rather than at the cannabinoid receptors, consistent with the weak cannabinoid receptor binding of CBD itself.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbcv',
    'Cannabichromevarin',
    'CBCV',
    'Propyl analog of CBC.',
    'Formula C19H26O2, derived by homology from CBC. Molecular weight 286.41 g/mol, derived. CAS UNKNOWN. Boiling point UNKNOWN. Typical plant content UNKNOWN.',
    null,
    'CBCV is the three-carbon side chain form of CBC, produced by the same synthase acting on the propyl precursor rather than the pentyl one. Its receptor behavior has not been characterized in material available here.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbgv',
    'Cannabigerovarin',
    'CBGV',
    'Propyl analog of CBG.',
    'Formula C19H28O2, derived by homology from CBG. Molecular weight 288.43 g/mol, derived. CAS UNKNOWN. Boiling point UNKNOWN. Typical plant content UNKNOWN.',
    null,
    'CBGV is the propyl form of the precursor compound. Where CBGA feeds the pentyl series, its varin counterpart feeds the propyl one, which is why cultivars rich in THCV and CBDV are also where CBGV appears.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),

  // Group C: acidic precursors (raw plant forms).
  cannabinoid(
    'cbga',
    'Cannabigerolic acid',
    'CBGA',
    'The precursor. Converted by synthase enzymes to THCA, CBDA, or CBCA.',
    'Formula C22H32O4, derived as CBG plus CO2. Molecular weight 360.49 g/mol, derived. CAS UNKNOWN. Decarboxylation threshold UNKNOWN. Typical plant content UNKNOWN.',
    null,
    'CBGA is formed from a terpene precursor and a phenolic acid, then acted on by one of three synthase enzymes to produce THCA, CBDA, or CBCA. Which enzyme a plant expresses is what determines its chemotype. CBGA remaining in finished material is the portion never converted.',
    'Decarboxylates to CBG with heat, threshold UNKNOWN.',
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'thca',
    'Tetrahydrocannabinolic acid',
    'THCA',
    'Non-intoxicating. Decarboxylates to THC with heat.',
    'Formula C22H30O4. Molecular weight 358.47 g/mol. CAS UNKNOWN. Decarboxylation 104 to 110C. Typically 10 to 30 percent in high-THC raw material.',
    'PPAR gamma agonist. Cannabinoid receptor binding UNKNOWN, and it does not produce intoxication, which distinguishes it sharply from its neutral form.',
    'THCA carries a carboxyl group that THC does not, and that single structural difference is why raw cannabis is not intoxicating. The group is lost as carbon dioxide under heat. Its own documented activity is at the nuclear receptor PPAR gamma rather than at CB1.',
    'This is the compound that actually enters the press. Conversion begins at 104 to 110C, so every press schedule is implicitly a decarboxylation schedule, whether or not it is designed as one.',
    null,
    ['acid', 'non-intoxicating'],
    'A cold press retains more THCA; a hot press converts more of it. Both are legitimate products and they are not the same product.',
    'In our process',
  ),
  cannabinoid(
    'cbda',
    'Cannabidiolic acid',
    'CBDA',
    'Decarboxylates to CBD with heat, more slowly than THCA.',
    'Formula C22H30O4. Molecular weight 358.47 g/mol. CAS UNKNOWN. Decarboxylation above 120C, kinetics characterized. Typically 2 to 20 percent in high-CBD raw material.',
    'COX-2 inhibitor. 5-HT1A agonist.',
    'CBDA is CBD carrying a carboxyl group. Unlike the neutral form, its documented activity includes direct enzyme inhibition rather than receptor binding alone.',
    'Decarboxylates more slowly than THCA and at a higher threshold, 120 to 140C against 104 to 110C. Its kinetics have been measured directly, which makes this the one decarboxylation figure on the page citable to a primary source rather than asserted. Poor bioavailability in its own right.',
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbca',
    'Cannabichromenic acid',
    'CBCA',
    'Acid form of CBC.',
    'Formula C22H30O4, derived as CBC plus CO2. Molecular weight 358.47 g/mol, derived. CAS UNKNOWN. Decarboxylation threshold UNKNOWN. Typical plant content UNKNOWN.',
    null,
    'CBCA is the third product of the CBGA branch point, formed by CBCA synthase. It decarboxylates to CBC.',
    null,
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbdva',
    'Cannabidivarinic acid',
    'CBDVA',
    'Acid form of CBDV.',
    'Formula C20H26O4, derived as CBDV plus CO2. Molecular weight 330.42 g/mol, derived. CAS UNKNOWN. Decarboxylation threshold UNKNOWN. Typical plant content UNKNOWN.',
    null,
    'The acid form of the propyl CBD analog, produced in cultivars expressing the propyl biosynthetic route.',
    null,
    null,
    ['acid', 'non-intoxicating'],
  ),

  // Group D: rare and emerging (less than 0.1 percent).
  cannabinoid(
    'thcp',
    'Tetrahydrocannabiphorol',
    'THCP',
    'Heptyl homologue of THC, seven carbons. Binds CB1 with markedly higher affinity than THC.',
    'Formula C23H34O2, verified. Molecular weight 342.53 g/mol, derived from the verified formula. CAS UNKNOWN. Measured near 29 micrograms per gram in the Italian FM2 medicinal variety, against 39 milligrams per gram of THC in the same material.',
    'CB1 Ki 1.2 nM. CB2 Ki 6.2 nM. Comparators from the same assay: THC 40 nM, THCB 15 nM, THCV 75.4 nM at CB1.',
    'THCP differs from THC by two carbons on the alkyl side chain. Structural work indicates the longer chain reaches further into a hydrophobic channel in the CB1 binding pocket, occupying it along its full length where the shorter chain of THC reaches only part way. That fuller occupancy accounts for the affinity difference.',
    'Present at microgram-per-gram levels, below the reporting threshold of most standard cannabinoid panels, so it will not appear on a routine certificate of analysis.',
    [REFERENCES.citti2019],
    ['rare', 'intoxicating'],
    'Binding affinity is not potency and it is not effect. The figure describes how readily the molecule occupies the receptor in one assay. In the animal work from the same study THCP was active at 5 mg per kilogram against a 10 mg per kilogram minimum for THC, a more modest ratio and the more honest comparison. There is no human data. The evidence base is one in vitro binding assay and one mouse study with five animals per dose group.',
    'On the evidence',
  ),
  cannabinoid(
    'cbdp',
    'Cannabidiphorol',
    'CBDP',
    'Heptyl homologue of CBD. Isolated and characterized; receptor behavior not determined.',
    'Formula C23H34O2, verified. Molecular weight 342.53 g/mol, derived from the verified formula. CAS UNKNOWN. Measured near 243 micrograms per gram in the FM2 variety.',
    null,
    'CBDP was isolated alongside THCP in the same work, structurally characterized, and confirmed against a stereoselective synthesis. Its receptor interactions were not determined.',
    null,
    [REFERENCES.citti2019],
    ['rare', 'non-intoxicating'],
    'A compound whose pharmacology has not been characterized is a compound whose pharmacology has not been characterized. The authors state that they did not treat evaluating its cannabimimetic activity as a priority, given how weakly CBD itself binds the cannabinoid receptors.',
    'On the evidence',
  ),
  cannabinoid(
    'thcb',
    'Tetrahydrocannabutol',
    'THCB',
    'Butyl homologue of THC, four carbons. CB1 Ki 15 nM.',
    'Formula C20H28O2, derived by homology from THC. Molecular weight 300.44 g/mol, derived. CAS UNKNOWN. Boiling point UNKNOWN. Typical plant content UNKNOWN.',
    'CB1 Ki 15 nM.',
    'THCB sits between THCV and THC in the homologous series, one carbon shorter than THC. Its binding affinity falls between them accordingly, the pattern the side chain structure-activity work predicts.',
    null,
    [REFERENCES.citti2019],
    ['rare', 'intoxicating'],
  ),
  cannabinoid(
    'cbdb',
    'Cannabidibutol',
    'CBDB',
    'Butyl homologue of CBD.',
    'Formula C20H28O2, derived by homology from CBD. Molecular weight 300.44 g/mol, derived. CAS UNKNOWN. Boiling point UNKNOWN. Typical plant content UNKNOWN.',
    null,
    'CBDB was identified in hemp-derived CBD material and characterized alongside its THC counterpart. The origin of the butyl series is not fully settled; one proposal is microbial modification of the corresponding pentyl compounds rather than direct biosynthesis.',
    null,
    null,
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbe',
    'Cannabielsoin',
    'CBE',
    'A CBD metabolite. Found in aged material.',
    'Formula UNKNOWN. Molecular weight UNKNOWN. CAS UNKNOWN. Typical plant content UNKNOWN.',
    'CB2 partial agonist.',
    'CBE is a metabolite of CBD rather than a primary plant product. Its presence in a sample points to metabolic or degradative history.',
    'Appears in aged material.',
    null,
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbl',
    'Cannabicyclol',
    'CBL',
    'A photodegradation product of CBC. Rare in fresh material.',
    'Formula UNKNOWN. Molecular weight UNKNOWN. CAS UNKNOWN. Rare in fresh plant material.',
    null,
    'CBL forms from CBC under acidic conditions. Like CBN, it is a compound whose presence records what has happened to a sample rather than what the plant produced.',
    'Formation is a degradation pathway, so rising CBL indicates the material has aged or been exposed.',
    null,
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbt',
    'Cannabicitran',
    'CBT',
    'Cannabicitran. CBT also denotes cannabitriol in much of the literature; CBT-C disambiguates.',
    'Formula UNKNOWN. Molecular weight UNKNOWN. CAS UNKNOWN. Present at well under 0.1 percent, more abundant in some aged or UV-exposed samples.',
    null,
    'Cannabicitran forms from CBC under heat and ultraviolet light. The abbreviation CBT is also used in much of the literature for cannabitriol, a different molecule; cannabicitran is sometimes written CBT-C to disambiguate. Interactions at CB1 and CB2 are not yet clear.',
    'Accumulates in aged or UV-exposed samples.',
    null,
    ['rare', 'non-intoxicating'],
  ),
];

// ---------------------------------------------------------------------------
// NOTES. Shells only; bodies are COPY PENDING. Categories are the fixed set.
// ---------------------------------------------------------------------------

export type NoteCategory = 'METHOD' | 'PHARMACOLOGY' | 'TERPENES' | 'TESTING' | 'MATERIALS';

export type Note = {
  slug: string;
  date: string; // ISO
  category: NoteCategory;
  title: string;
  abstract: string;
  tier: EvidenceTier | null;
  body: string | null; // null renders COPY PENDING
  sources: string[] | null;
  redirectTo?: string; // the ECS note points at the pillar
};

export const NOTES: Note[] = [
  {
    slug: 'why-we-press-from-trim',
    date: '2026-08-01',
    category: 'METHOD',
    title: 'Why we press from trim, and not from flower',
    abstract: 'Why our inputs are dried and cured sugar trim, and what that choice is for.',
    tier: null,
    body: null,
    sources: null,
  },
  {
    slug: 'cold-cure-and-what-it-preserves',
    date: '2026-08-01',
    category: 'METHOD',
    title: 'Cold cure, and what it preserves',
    abstract: 'What happens to rosin during a cold cure, and what the process is meant to protect.',
    tier: null,
    body: null,
    sources: null,
  },
  {
    slug: 'what-a-certificate-of-analysis-actually-says',
    date: '2026-08-01',
    category: 'TESTING',
    title: 'What a Certificate of Analysis actually says',
    abstract: 'How to read a COA, what each panel measures, and what a pass means.',
    tier: null,
    body: null,
    sources: null,
  },
  {
    slug: 'the-endocannabinoid-system-plainly',
    date: '2026-08-01',
    category: 'PHARMACOLOGY',
    title: 'The endocannabinoid system, plainly',
    abstract: 'Receptors, ligands, and why two people respond differently to the same amount.',
    tier: 'Established',
    body: null,
    sources: null,
    redirectTo: '/research/ecs',
  },
];

export const NOTE_CATEGORIES: NoteCategory[] = [
  'METHOD',
  'PHARMACOLOGY',
  'TERPENES',
  'TESTING',
  'MATERIALS',
];

// ---------------------------------------------------------------------------
// THE INDEX. Header plus three pillars. Counts derive from the data.
// ---------------------------------------------------------------------------

export const research = {
  eyebrow: 'RESEARCH',
  headline: 'What we know, and how well we know it.',
  body:
    'Everything here carries its sources. Where the evidence is strong we say ' +
    'so, and where it is thin we say so as well. A library that publishes only ' +
    'its confident findings is a marketing department.',
  pillars: [
    {
      key: 'terpenes',
      title: 'The terpene index',
      href: '/research/terpenes',
      count: TERPENES.length,
      description: 'aromatic compounds, their chemistry, and what the evidence actually supports.',
    },
    {
      key: 'ecs',
      title: 'The endocannabinoid system',
      href: '/research/ecs',
      count: null, // a pillar, not a counted index
      description: 'Receptors, ligands, and why two people respond differently to the same dose.',
    },
    {
      key: 'cannabinoids',
      title: 'The cannabinoid index',
      href: '/research/cannabinoids',
      count: CANNABINOIDS.length,
      description:
        'compounds, their chemistry, their receptor behavior, and how each survives extraction.',
    },
  ],
  facilityCaption: 'FACILITY . 998 BROADWAY',
};

export const terpeneIndex = {
  eyebrow: 'TERPENE INDEX',
  headline: 'What the plant makes, and what is actually known about it.',
  body: [
    'Terpenes are the aromatic compounds a cannabis plant produces alongside its cannabinoids. They are why one cultivar smells of pine and another of citrus, and they are the basis on which we assign material to our five lines.',
    'How much they change the experience is an open question, and we would rather say so than pretend otherwise. In 2019 a research group tested the six most common cannabis terpenes and found none of them altered cannabinoid receptor signalling; the paper is titled "Absence of Entourage". A 2025 group testing sixteen terpenes reported the opposite. A 2025 review of the whole field concluded the synergy remains unproven and that clinical trials are needed.',
    'We formulate on terpene composition because composition is measurable and it is published on every batch. We do not claim a mechanism the literature has not settled.',
    'Every entry below carries an evidence tier and its sources.',
  ],
  closing:
    'Nearly all of the work above is preclinical. Human trials of isolated ' +
    'terpenes at the concentrations found in cannabis are close to nonexistent, ' +
    'and we would rather you knew that from us.',
  filters: [
    { key: 'monoterpene', label: 'MONOTERPENE' },
    { key: 'sesquiterpene', label: 'SESQUITERPENE' },
    { key: 'rest', label: 'REST' },
    { key: 'relief', label: 'RELIEF' },
    { key: 'focus', label: 'FOCUS' },
    { key: 'calm', label: 'CALM' },
  ],
};

export const cannabinoidIndex = {
  eyebrow: 'THE CANNABINOID INDEX',
  headline: 'Every compound, and what each one actually is.',
  body:
    'Cannabis produces many cannabinoids beyond the handful that appear in ' +
    'meaningful quantity, and reviews do not agree on the exact number, so we ' +
    'hold a figure until it can be cited. What follows is grouped by where each ' +
    'compound sits in the plant, from the major cannabinoids through the acidic ' +
    'precursors to the rare homologues. Each entry is chemistry and mechanism, ' +
    'with sources. Clinical evidence is held for registered practitioners, where ' +
    'it belongs.',
  groups: [
    { key: 'major', label: 'MAJOR', band: 'Greater than one percent of plant composition' },
    { key: 'minor', label: 'MINOR', band: 'One tenth to one percent of plant composition' },
    {
      key: 'acid',
      label: 'ACIDIC PRECURSORS',
      band: 'Raw plant forms, before heat',
      note:
        'These are the forms the plant actually makes. Every neutral cannabinoid ' +
        'on this page exists in living material as its acid, carrying an additional ' +
        'carboxyl group, and becomes neutral only when heat drives that group off as ' +
        'carbon dioxide. Nothing pressed cold is fully decarboxylated, and nothing ' +
        'decarboxylated is unchanged.',
    },
    {
      key: 'rare',
      label: 'RARE AND EMERGING',
      band: 'Less than one tenth of one percent of plant composition',
    },
  ],
  filters: [
    { key: 'major', label: 'MAJOR' },
    { key: 'minor', label: 'MINOR' },
    { key: 'acid', label: 'ACID' },
    { key: 'rare', label: 'RARE' },
    { key: 'intoxicating', label: 'INTOXICATING' },
    { key: 'non-intoxicating', label: 'NON-INTOXICATING' },
  ],
};
