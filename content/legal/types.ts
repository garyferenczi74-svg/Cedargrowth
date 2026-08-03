// Shared type for the legal/FAQ content modules (Prompt 05, Task 1). One
// shape for privacy.ts, terms.ts, and faq.ts so the render task can treat
// all three the same way. Terms and Privacy bodies are rendered VERBATIM
// from the source drafts; only the counsel/Gary notes and instruction
// brackets listed in the task brief were stripped. See content/legal/privacy.ts,
// content/legal/terms.ts, and content/legal/faq.ts for the extracted copy.

// One paragraph. text MAY contain inline **bold** markers and [PLACEHOLDER]
// markers, both left as literal substrings for the render task to interpret.
export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  // 'Privacy Policy' | 'Terms of Service' | on-page H1 text.
  title: string;
  // One sentence, site voice. Page metadata, not part of the legal body.
  metaDescription: string;
  // true for terms + privacy (review banner renders); false for faq.
  reviewPending: boolean;
  // Draft date, e.g. '2026-07-28'. Module metadata, not the on-page
  // "Effective date: [DATE]." line.
  lastUpdated: string;
  // Lead content before the numbered sections, e.g. the "Effective date:
  // [DATE]." line and (privacy only) its intro paragraph. Absent for FAQ.
  intro?: LegalBlock[];
  // Numbered sections (terms/privacy) or Q&A pairs (faq).
  sections: LegalSection[];
};
