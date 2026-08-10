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

// ---------------------------------------------------------------------------
// THE ENDOCANNABINOID SYSTEM (pillar one). From guide Section 2, restricted to
// receptor location and molecular mechanism. Function is described at the
// cellular level, never as a benefit for a person or a condition.
// ---------------------------------------------------------------------------

export const ECS = {
  eyebrow: 'THE ENDOCANNABINOID SYSTEM',
  headline: 'One system, many settings.',
  intro:
    'The endocannabinoid system is a signalling network built from three parts: ' +
    'the receptors a cannabinoid binds, the molecules the body makes to bind them, ' +
    'and the enzymes that build and break those molecules down. It is a regulatory ' +
    'layer, tuning how other systems signal rather than driving them directly. What ' +
    'follows is what each part is and what it does at the level of the cell.',
  tier: 'Established' as EvidenceTier,
  sources: [REFERENCES.pacher2006],
  sections: [
    {
      key: 'cb1',
      heading: 'CB1',
      body:
        'CB1 is expressed predominantly in the central nervous system, in the brain ' +
        'and spinal cord, with a smaller presence in peripheral nerves. It sits on the ' +
        'sending side of a synapse. When activated it reduces the release of ' +
        'neurotransmitters, which is how a single receptor can turn the volume down ' +
        'across many different circuits. Its endogenous ligand is anandamide, and THC ' +
        'binds it as a partial agonist.',
    },
    {
      key: 'cb2',
      heading: 'CB2',
      body:
        'CB2 is expressed predominantly in immune tissue, in the spleen, tonsils, and ' +
        'thymus, and on the microglia of the central nervous system. Because it sits ' +
        'largely outside the brain, a compound selective for CB2 can act at the ' +
        'receptor without the central effects that follow CB1 activation. Its ' +
        'endogenous ligand is 2-AG.',
    },
    {
      key: 'other-targets',
      heading: 'The other targets',
      body:
        'Cannabinoids do not act at CB1 and CB2 alone. GPR55 is a related receptor ' +
        'studied in bone and signalling. TRPV1 is an ion channel that responds to ' +
        'several cannabinoids. 5-HT1A is a serotonin receptor at which CBD acts as an ' +
        'agonist. PPAR is a nuclear receptor, sitting inside the cell and acting on ' +
        'gene expression, engaged by several cannabinoids. The point is that a single ' +
        'molecule usually touches more than one target, which is why two compounds ' +
        'with similar names can behave differently.',
    },
    {
      key: 'ligands-enzymes',
      heading: 'Ligands and enzymes',
      body:
        'The body makes its own cannabinoids. Anandamide and 2-arachidonoylglycerol, ' +
        'called 2-AG, are the two best characterized. They are made on demand rather ' +
        'than stored, and they are cleared quickly by two enzymes: FAAH breaks down ' +
        'anandamide, and MGLL breaks down 2-AG. The tone of the whole system depends ' +
        'as much on how fast these enzymes clear its signals as on how much signal is ' +
        'made.',
    },
    {
      key: 'variation',
      heading: 'Why response varies',
      body:
        'The genes that build this system vary from person to person: the receptors, ' +
        'the enzymes, and the metabolic machinery that clears cannabinoids afterward. ' +
        'Two people can take the same compound at the same amount and reach it at ' +
        'different levels for different lengths of time. That variation is measurable, ' +
        'and reading it is what our CannabisIQ panel is for. It is also the reason ' +
        'this library states an evidence tier on every claim rather than one confident ' +
        'voice for all of them.',
    },
  ],
  // The endocannabinoids live here, not in the cannabinoid index, because the
  // body makes them rather than the plant. Sources CITATION PENDING pending
  // primary references. Noladin ether, virodhamine, and lysophosphatidylinositol
  // are held: their status is contested and each needs a primary reference
  // before it appears, or it is omitted rather than hedged.
  endocannabinoids: [
    { symbol: 'AEA', name: 'Anandamide', note: 'CB1 and CB2 ligand.' },
    { symbol: '2-AG', name: '2-arachidonoylglycerol', note: 'CB1 and CB2 ligand, the most abundant.' },
    { symbol: 'NADA', name: 'N-arachidonoyl dopamine', note: 'CB1 and TRPV1 ligand.' },
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
// sections only. Mechanism is receptor-level physiology, never an indication.
// Evidence tiers are unsupplied (null -> UNKNOWN) pending the science lead.
// IN OUR MATERIAL is unsupplied (null -> UNKNOWN) pending COA data. Only THCP
// carries a publishable citation (Citti 2019, discovery); the rest render
// CITATION PENDING. The CLINICAL counts line is unsupplied, so it is omitted.
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
    { label: 'In our material', value: null },
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
    'Molecular weight 314.46 g/mol. CAS 1972-08-3. Boiling point 157C at 0.02 mmHg. Typically 10 to 30 percent in high-THC cultivars.',
    'CB1 partial agonist, Ki 10 to 40 nM. CB2 weak agonist.',
    'At CB1 in the central nervous system it reduces release of neurotransmitters including GABA, glutamate, dopamine, and norepinephrine. It modulates adenylyl cyclase, lowering cyclic AMP, and acts on calcium and potassium channels to reduce neuronal excitability.',
    'Highly lipophilic; extracts efficiently in hydrocarbon, ethanol, and supercritical CO2. Decarboxylates from THCA beginning near 105C, optimal at 115 to 120C. Oxidizes to CBN under oxygen, light, and heat, so it is stored cool, dark, and oxygen-free. Crystallizes at room temperature with a melting point of 28 to 31C.',
    null,
    ['major', 'intoxicating'],
  ),
  cannabinoid(
    'cbd',
    'Cannabidiol',
    'CBD',
    'Non-intoxicating. CB1 negative allosteric modulator, 5-HT1A and TRPV1 agonist, GPR55 antagonist.',
    'Molecular weight 314.46 g/mol. CAS 13956-29-1. Boiling point 180C at 0.02 mmHg. Ranges widely from 0.5 to 20 percent by chemotype.',
    'CB1 negative allosteric modulator. CB2 weak partial agonist. 5-HT1A agonist. TRPV1 agonist. GPR55 antagonist.',
    'As a negative allosteric modulator at CB1 it changes how the receptor responds without activating it directly. It acts as an agonist at 5-HT1A and TRPV1, an antagonist at GPR55, and an activator of PPAR, and it inhibits adenosine reuptake.',
    'Crystallizes readily to an isolate above 99 percent purity. More stable than THC and less prone to oxidation. Decarboxylates from CBDA at 120 to 140C, slower than THCA. Poorly water soluble, so beverages require emulsification, liposomal encapsulation, or nano-emulsion.',
    null,
    ['major', 'non-intoxicating'],
  ),

  // Group B: minor phytocannabinoids (0.1 to 1 percent).
  cannabinoid(
    'cbg',
    'Cannabigerol',
    'CBG',
    'Non-intoxicating. Neutral form of the biosynthetic precursor CBGA.',
    'Molecular weight 316.48 g/mol. Typically 0.5 to 2 percent, up to 15 percent in CBG-dominant chemovars.',
    'CB1 weak partial agonist. CB2 moderate affinity. Alpha-2 adrenoceptor agonist. TRPV1 agonist. 5-HT1A antagonist.',
    'The neutral form of CBGA, the acid from which THCA, CBDA, and CBCA are synthesized in the plant by specific synthase enzymes. As a neutral cannabinoid it binds CB1 and CB2 and interacts with the alpha-2 adrenoceptor, TRPV1, and 5-HT1A.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbc',
    'Cannabichromene',
    'CBC',
    'Non-intoxicating. TRPV1 and TRPA1 agonist, weak at CB1.',
    'Molecular weight 314.46 g/mol. Typically 0.1 to 1 percent, higher in some landrace sativas.',
    'CB1 very weak. TRPV1 agonist. TRPA1 agonist.',
    'Interacts only weakly with CB1 and instead engages the transient receptor potential channels TRPV1 and TRPA1.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbn',
    'Cannabinol',
    'CBN',
    'Oxidation product of THC. Accumulates with age, light, and heat exposure.',
    'Molecular weight 310.43 g/mol. Typically 0.1 to 2 percent, rising with storage and oxidation.',
    'CB1 partial agonist, Ki 211 nM. CB2 partial agonist, Ki 96 nM.',
    'Forms as THC oxidizes under light, air, and heat rather than being synthesized directly by the plant. It is a partial agonist at both CB1 and CB2.',
    'Accumulates as a degradation product of THC under light, air, and heat, so its level rises with age and exposure. Its presence is a marker of oxidation in stored material.',
    null,
    ['minor', 'intoxicating'],
  ),
  cannabinoid(
    'thcv',
    'Tetrahydrocannabivarin',
    'THCV',
    'Propyl analog of THC, three-carbon side chain. Dose-dependent at CB1.',
    'Molecular weight 286.41 g/mol. A propyl analog with a three-carbon side chain against the five-carbon chain of THC. Typically 0.1 to 2 percent, up to 8 to 15 percent in some African sativa landraces.',
    'CB1 antagonist at low concentration and agonist at high concentration. CB2 partial agonist.',
    'Its behavior at CB1 is dose-dependent: at low concentration it opposes activation as an antagonist, and at higher concentration it acts as an agonist. It is a partial agonist at CB2.',
    null,
    null,
    ['minor', 'intoxicating'],
  ),
  cannabinoid(
    'cbdv',
    'Cannabidivarin',
    'CBDV',
    'Propyl analog of CBD.',
    'Molecular weight 286.41 g/mol. A propyl analog of CBD. Typically 0.1 to 1 percent, up to 10 percent in CBDV-dominant chemovars.',
    'TRPV1 and TRPV2 agonist. TRPM8 antagonist.',
    'Engages the transient receptor potential channels, acting as an agonist at TRPV1 and TRPV2 and an antagonist at TRPM8, and modulates gene expression.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbcv',
    'Cannabichromevarin',
    'CBCV',
    'Propyl analog of CBC.',
    null,
    null,
    'A propyl analog of CBC.',
    null,
    null,
    ['minor', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbgv',
    'Cannabigerovarin',
    'CBGV',
    'Propyl analog of CBG.',
    null,
    null,
    'A propyl analog of CBG.',
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
    null,
    null,
    'The parent acid of the plant. Specific synthase enzymes convert CBGA into THCA, CBDA, or CBCA, which then decarboxylate to THC, CBD, or CBC.',
    null,
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'thca',
    'Tetrahydrocannabinolic acid',
    'THCA',
    'Non-intoxicating. Decarboxylates to THC with heat.',
    'Molecular weight 358.47 g/mol. Typically 10 to 30 percent in high-THC raw material.',
    'PPAR activator in vitro. Non-intoxicating in its acid form.',
    'The acidic precursor of THC. In its acid form it does not activate CB1 and is non-intoxicating; heating converts it to THC.',
    'Converts to THC on heating, beginning around 104 to 110C, which is why smoking, vaping, and cooking make it psychoactive. Preserved by raw and low-temperature products.',
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbda',
    'Cannabidiolic acid',
    'CBDA',
    'Decarboxylates to CBD with heat, more slowly than THCA.',
    'Molecular weight 358.47 g/mol. Typically 2 to 20 percent in high-CBD raw material.',
    '5-HT1A agonist. Reported as a COX-2 interacting compound in vitro.',
    'The acidic precursor of CBD. It decarboxylates to CBD with heat above about 120C, more slowly than THCA, and over time with light exposure.',
    'Decarboxylates to CBD at 120C and above, and with time or light. Preserved by raw and cold-processed products; low temperature handling keeps the acid form intact.',
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbca',
    'Cannabichromenic acid',
    'CBCA',
    'Acid form of CBC.',
    null,
    null,
    'The acidic precursor of CBC, synthesized from CBGA. Decarboxylates to CBC with heat.',
    null,
    null,
    ['acid', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbdva',
    'Cannabidivarinic acid',
    'CBDVA',
    'Acid form of CBDV.',
    null,
    null,
    'The acidic precursor of CBDV. Decarboxylates to CBDV with heat.',
    null,
    null,
    ['acid', 'non-intoxicating'],
  ),

  // Group D: rare and emerging (less than 0.1 percent).
  cannabinoid(
    'thcp',
    'Tetrahydrocannabiphorol',
    'THCP',
    'Heptyl homologue of THC, seven carbons. CB1 Ki 1.2 nM.',
    'A seven-carbon alkyl side chain against the five-carbon chain of THC. Present at well under 0.1 percent.',
    'CB1 binding affinity reported around Ki 1.2 nM.',
    'Its seven-carbon side chain gives it a very high CB1 binding affinity, reported around Ki 1.2 nM. Binding affinity is how tightly a molecule attaches to a receptor; it is not the same as potency or effect, and the figure should not be read as either. Identified in 2019.',
    null,
    [REFERENCES.citti2019],
    ['rare', 'intoxicating'],
  ),
  cannabinoid(
    'cbdp',
    'Cannabidiphorol',
    'CBDP',
    'Heptyl homologue of CBD. Receptor behavior UNKNOWN.',
    'A seven-carbon alkyl side chain against the five-carbon chain of CBD. Present at well under 0.1 percent.',
    null,
    'The seven-carbon homologue of CBD, reported alongside THCP in 2019. Its receptor interactions are not yet characterized.',
    null,
    [REFERENCES.citti2019],
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'thcb',
    'Tetrahydrocannabutol',
    'THCB',
    'Butyl homologue, four carbons. CB1 Ki 15 nM.',
    'A four-carbon butyl side chain against the five-carbon chain of THC. Present at well under 0.1 percent.',
    'CB1 binding affinity reported around Ki 15 nM.',
    'A butyl homologue of THC. Its CB1 binding affinity is reported around Ki 15 nM. Binding affinity is not the same as potency or effect.',
    null,
    null,
    ['rare', 'intoxicating'],
  ),
  cannabinoid(
    'cbdb',
    'Cannabidibutol',
    'CBDB',
    'Butyl homologue of CBD.',
    'A four-carbon butyl side chain against the five-carbon chain of CBD. Present at well under 0.1 percent.',
    null,
    'A butyl homologue of CBD.',
    null,
    null,
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbe',
    'Cannabielsoin',
    'CBE',
    'CBD metabolite.',
    'Present at well under 0.1 percent; found in aged material.',
    'CB2 partial agonist.',
    'Forms as a metabolite of CBD. It is a partial agonist at CB2.',
    null,
    null,
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbl',
    'Cannabicyclol',
    'CBL',
    'CBC photodegradation product.',
    'Present at well under 0.1 percent; rare in fresh plant material.',
    null,
    'Forms from CBC under light exposure. Its receptor profile is not yet characterized.',
    'Rare in fresh material; forms from CBC on exposure to light over time.',
    null,
    ['rare', 'non-intoxicating'],
  ),
  cannabinoid(
    'cbt',
    'Cannabicitran',
    'CBT',
    'Cannabicitran. CBT also denotes cannabitriol in much of the literature; CBT-C disambiguates.',
    'Present at well under 0.1 percent; more abundant in aged or UV-exposed samples.',
    null,
    'Cannabicitran forms from CBC under heat and ultraviolet light. Note: the abbreviation CBT is also used in much of the literature for cannabitriol, a different molecule; cannabicitran is sometimes written CBT-C to disambiguate. Interactions at CB1 and CB2 are not yet clear.',
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
    { key: 'acid', label: 'ACIDIC PRECURSORS', band: 'Raw plant forms, before heat' },
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
