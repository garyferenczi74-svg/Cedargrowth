import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

// Deterministic inline renderer for the legal/FAQ content modules
// (content/legal/{privacy,terms,faq}.ts). No markdown library: these
// strings only ever carry two inline markers, so a single left to right
// pass is enough.
//
// Assumptions, verified against every string in the three modules:
// 1. `**bold**` and `[PLACEHOLDER]` never nest and never overlap each
//    other (no `**[x]**` or `[**x**]` anywhere in the source).
// 2. A placeholder's contents never include a `]` character, so a
//    non-greedy match up to the first `]` is safe even though a
//    placeholder may itself contain `/` and spaces, e.g.
//    `[DESTROYED AFTER ANALYSIS / RETAINED FOR PERIOD]`.
// Given both, one alternation regex plus String.split is a complete,
// order-preserving parse; nothing recursive is required.
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\])/g;

// Optional literal-substring-to-link substitution. Used ONLY by the
// privacy page, to turn the backticked `` `/dna/privacy` `` reference in
// Section 6 into a real link (Prompt 05 Task 2 brief, Part D). This never
// touches the module text; it is a presentation-only replacement applied
// to plain-text segments after bold/placeholder parsing, so it cannot fire
// inside a bold span or a placeholder.
export type InlineLink = { marker: string; href: string };

function renderPlainText(text: string, links: InlineLink[], keyPrefix: string): ReactNode {
  if (links.length === 0) return text;
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    let bestIndex = -1;
    let bestLink: InlineLink | null = null;
    for (const link of links) {
      const i = remaining.indexOf(link.marker);
      if (i !== -1 && (bestIndex === -1 || i < bestIndex)) {
        bestIndex = i;
        bestLink = link;
      }
    }
    if (!bestLink || bestIndex === -1) {
      nodes.push(remaining);
      break;
    }
    if (bestIndex > 0) nodes.push(remaining.slice(0, bestIndex));
    nodes.push(
      <Link
        key={`${keyPrefix}-link-${key++}`}
        href={bestLink.href}
        className="text-cedar cedar-underline"
      >
        {bestLink.marker.replace(/`/g, '')}
      </Link>,
    );
    remaining = remaining.slice(bestIndex + bestLink.marker.length);
  }
  return <Fragment key={keyPrefix}>{nodes}</Fragment>;
}

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
    return renderPlainText(part, links, `t${index}`);
  });
}
