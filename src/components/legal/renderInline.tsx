import type { ReactNode } from 'react';
import Link from 'next/link';

// Deterministic inline renderer for the legal/FAQ content modules
// (content/legal/{privacy,terms,faq}.ts). No markdown library: these
// strings only ever carry three inline markers, so a single left to right
// pass is enough.
//
// Assumptions, verified against every string in the three modules:
// 1. `**bold**`, `` `backtick` `` spans, and `[PLACEHOLDER]` never nest and
//    never overlap each other (no `` **`x`** ``, `` `**x**` ``, `` [`x`] ``,
//    or `` `[x]` `` anywhere in the source).
// 2. A placeholder's contents never include a `]` character, so a
//    non-greedy match up to the first `]` is safe even though a
//    placeholder may itself contain `/` and spaces, e.g.
//    `[DESTROYED AFTER ANALYSIS / RETAINED FOR PERIOD]`.
// 3. A backtick span's contents never include a backtick, so a
//    non-greedy match up to the first closing backtick is safe.
// Given all three, one alternation regex plus String.split is a complete,
// order-preserving parse; nothing recursive is required.
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]|`[^`]+`)/g;

// Optional exact-token substring-to-link substitution. Used ONLY by the
// privacy page, to turn the backticked `` `/dna/privacy` `` reference in
// Section 6 into a real link (Prompt 05 Task 2 brief, Part D). This never
// touches the module text; it is a presentation-only replacement applied
// to a backtick-span token after tokenizing, so it cannot fire inside a
// bold span or a placeholder. A backtick span with no matching link (e.g.
// the same reference in Section 9) still renders, as plain text with the
// backticks themselves removed: they are markdown formatting, not part of
// the legal wording, exactly like `**bold**` strips its asterisks.
export type InlineLink = { marker: string; href: string };

export function renderInline(text: string, links: InlineLink[] = []): ReactNode[] {
  const parts = text.split(INLINE_PATTERN).filter((part) => part !== '');
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={index} className="font-mono text-tertiary">
          {part}
        </span>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const inner = part.slice(1, -1);
      const matchingLink = links.find((link) => link.marker === part);
      if (matchingLink) {
        return (
          <Link key={index} href={matchingLink.href} className="text-cedar cedar-underline">
            {inner}
          </Link>
        );
      }
      return inner;
    }
    return part;
  });
}
