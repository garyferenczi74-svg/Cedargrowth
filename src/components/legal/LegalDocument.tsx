import type { ReactNode } from 'react';
import type { LegalBlock, LegalDoc } from '@/content/legal/types';
import { renderInline, type InlineLink } from './renderInline';
import { slugifyHeading } from './slugify';

// House document treatment for the legal/FAQ content modules: a single
// bg-parchment surface (placeholder contrast fails on bone, so the body
// never alternates surfaces), a 720px editorial measure, left aligned, one
// h1, and Heading M section headers each with a hairline above. Renders
// LegalDoc as data; never edits a word of it.
//
// Does NOT render the review banner (the page composes ReviewBanner above
// this) and does NOT render the state-warning block: Footer.tsx already
// renders that exact Unknown (UNKNOWNS.stateWarnings) site-wide on every
// route, so repeating it here would duplicate it above the same footer.

function Block({
  block,
  links,
}: {
  block: LegalBlock;
  links?: InlineLink[];
}) {
  if (block.kind === 'list') {
    return (
      <ul className="flex flex-col gap-4">
        {block.items.map((item, index) => (
          <li
            key={index}
            className="font-sans text-body-l leading-[1.65] text-secondary"
          >
            {renderInline(item, links)}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="font-sans text-body-l leading-[1.65] text-secondary">
      {renderInline(block.text, links)}
    </p>
  );
}

export function LegalDocument({
  doc,
  afterTitle,
  sectionLinks,
}: {
  doc: LegalDoc;
  // Extra content rendered between the intro and the numbered/Q&A
  // sections, e.g. the FAQ contents list. Optional, unused by Terms/Privacy.
  afterTitle?: ReactNode;
  // Section-heading-scoped literal link substitutions, e.g. turning the
  // backticked `/dna/privacy` reference in privacy Section 6 into a real
  // link without touching the module text. Optional, unused by Terms/FAQ.
  sectionLinks?: Record<string, InlineLink[]>;
}) {
  return (
    <section className="bg-parchment py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-12">
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            {doc.title}
          </h1>

          {doc.intro ? (
            <div className="flex flex-col gap-4">
              {doc.intro.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </div>
          ) : null}

          {afterTitle}

          {doc.sections.map((section) => (
            <section
              key={section.heading}
              id={slugifyHeading(section.heading)}
              className="border-t border-hairline"
            >
              <h2 className="mb-6 font-display text-heading-m-m md:text-heading-m text-primary">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {section.blocks.map((block, index) => (
                  <Block
                    key={index}
                    block={block}
                    links={sectionLinks?.[section.heading]}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
