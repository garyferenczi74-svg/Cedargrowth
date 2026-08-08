import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { CaptureForm } from '@/components/shell/CaptureForm';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { FrameWipe } from '@/components/motion/FrameWipe';
import { MarkerTable } from '@/components/dna/MarkerTable';
import { dna, kitsShipping } from '@/content/dna';

// CannabisIQ, the DNA test page (CG Prompt 07 v1.1). Built onto the former
// /dna hold page: its headline, body, capture form, consent line, and onward
// links are preserved and reused in the closing block. The page teaches the
// panel and captures intent; it cannot sell (kits are not shipping). It flips
// to commerce by setting content/dna.ts#kitsShipping to true and building the
// purchase branch marked below. Indexed, in the sitemap, age gate applies via
// the layout. All unsupplied values render visibly as UNKNOWN, CITATION
// PENDING, or a bracketed placeholder. Adverse Reaction Risk is not built.

export const metadata: Metadata = {
  title: dna.meta.title,
  description: dna.meta.description,
};

const surfaceClass = (surface: 'parchment' | 'bone') =>
  surface === 'bone' ? 'bg-bone' : 'bg-parchment';

export default function DnaPage() {
  return (
    <>
      {/* Block 1, hero. Split layout. The form is deliberately not here. */}
      <section className="bg-bone py-16 md:py-40">
        <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile md:grid-cols-2 md:gap-16 md:px-page-margin">
          <FrameWipe className="relative aspect-[4/5] overflow-hidden border border-hairline bg-parchment">
            <div
              role="img"
              aria-label={dna.hero.placeholder.alt}
              className="flex h-full w-full items-end p-3"
            >
              <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                {dna.hero.placeholder.caption}
              </span>
            </div>
          </FrameWipe>
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{dna.hero.eyebrow}</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              <LineReveal text={dna.hero.headline} />
            </h1>
            <Rise delay={0.16} className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
              {dna.hero.body}
            </Rise>
            <ButtonLink href="#panel" variant="ghost">
              {dna.hero.panelLink}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 2, the problem. Statement band, centered, 720px measure. */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center">
            <Eyebrow>{dna.problem.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              <LineReveal text={dna.problem.headline} />
            </h2>
            <Rise delay={0.12} className="text-body-m-m md:text-body-l text-secondary">
              {dna.problem.body}
            </Rise>
          </div>
        </div>
      </section>

      {/* Block 3, how it will work. Future tense. Both bracketed values render
          literally. */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="mb-10">{dna.process.eyebrow}</Eyebrow>
          <ol>
            {dna.process.steps.map((step, i) => (
              <li key={step.n}>
                <RuleDraw
                  delay={i * 0.08}
                  className="h-px w-full bg-hairline"
                />
                <div className="grid grid-cols-1 gap-2 py-8 md:grid-cols-12 md:gap-8">
                  <span className="font-mono text-data text-tertiary md:col-span-2">
                    {step.n}
                  </span>
                  <p className="font-display text-heading-s-m md:text-heading-s text-primary md:col-span-4">
                    {step.title}
                  </p>
                  <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary md:col-span-6">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Block 4, the panel. Three domain bands on alternating surfaces. */}
      {dna.panel.domains.map((domain, i) => (
        <section
          key={domain.key}
          id={i === 0 ? 'panel' : undefined}
          className={`${surfaceClass(domain.surface)} py-16 md:py-24`}
          aria-labelledby={`domain-${domain.key}`}
        >
          <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
            {i === 0 ? <Eyebrow className="mb-10">{dna.panel.eyebrow}</Eyebrow> : null}
            <h2
              id={`domain-${domain.key}`}
              className="font-display text-heading-m-m md:text-heading-m text-primary"
            >
              <LineReveal text={domain.title} />
            </h2>
            <Rise delay={0.12} className="mt-4 max-w-editorial text-body-m-m md:text-body-l text-secondary">
              {domain.explanation}
            </Rise>
            <div className="mt-10">
              <RuleDraw className="mb-0 h-px w-full bg-hairline" />
              <MarkerTable domain={domain} />
            </div>
          </div>
        </section>
      ))}

      {/* Block 4 closing paragraph, beneath the three domains. */}
      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Rise className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
            {dna.panel.closing}
          </Rise>
        </div>
      </section>

      {/* Block 5, what this is and what it is not. The page's primary legal
          protection. Never collapsed, never below the fold on mobile.
          [COUNSEL: review alongside Terms Section 5.] */}
      <section className="bg-clinical py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="mb-6">What this is, and what it is not</Eyebrow>
          <div className="flex max-w-editorial flex-col gap-5 border border-hairline p-6 md:p-8">
            <p className="font-display text-heading-s-m md:text-heading-s text-primary">
              {dna.scope.lead}
            </p>
            <p className="text-body-m-m md:text-body-l text-secondary">{dna.scope.body}</p>
            <p className="text-body-m-m md:text-body-l text-secondary">{dna.scope.tail}</p>
          </div>
        </div>
      </section>

      {/* Block 6, privacy, placed before the ask. */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow>{dna.privacy.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-heading-m-m md:text-heading-m text-primary">
            <LineReveal text={dna.privacy.headline} />
          </h2>
          <ul className="mt-10 max-w-editorial border-t border-hairline">
            {dna.privacy.points.map((point) => (
              <li
                key={point}
                className="border-b border-hairline py-6 text-body-m-m md:text-body-l text-secondary"
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={dna.privacy.link.href} variant="ghost">
              {dna.privacy.link.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 7, the closing block, built from the existing hold page. The
          headline, body, form, consent line, button, and onward links are
          preserved. kitsShipping flips this between waitlist and purchase. */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex max-w-editorial flex-col gap-6">
            <Eyebrow>{dna.closing.eyebrow}</Eyebrow>
            <h2 className="font-display text-display-l-m md:text-display-xl text-primary">
              <LineReveal text={dna.closing.headline} />
            </h2>
            <Rise className="text-body-m-m md:text-body-l text-secondary">
              {dna.closing.body}
            </Rise>

            {kitsShipping ? (
              // PURCHASE MODE. Not built now, by design (no ship date). When kits
              // ship, build the purchase block here: price, quantity, add to
              // cart or checkout. The waitlist branch below is then removed.
              // Nothing renders in purchase mode until that block exists.
              null
            ) : (
              // WAITLIST MODE. The form is preserved exactly from the hold page:
              // optional name, required email, verbatim consent line, and the
              // "Tell me when kits ship" button. It does not animate on entry.
              <div className="flex flex-col gap-6">
                <CaptureForm
                  intent={dna.closing.capture.intent}
                  fields={{ name: true }}
                  submitLabel={dna.closing.capture.submitLabel}
                  consent={dna.closing.capture.consent}
                />
                <p className="text-caption-m md:text-caption text-tertiary">
                  {dna.closing.ageLine}
                </p>
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-8">
              {dna.closing.onward.map((link) => (
                <ButtonLink key={link.href} href={link.href} variant="ghost">
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Block 8, references. No citations supplied, so the whole block renders
          CITATIONS PENDING with no fabricated structure. */}
      <section id="references" className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="mb-6">References</Eyebrow>
          {dna.references.length === 0 ? (
            <p className="font-mono text-data uppercase tracking-specimen text-tertiary">
              CITATIONS PENDING
            </p>
          ) : (
            <ol className="max-w-editorial border-t border-hairline">
              {dna.references.map((ref) => (
                <li
                  key={ref.n}
                  id={`ref-${ref.n}`}
                  className="flex gap-4 border-b border-hairline py-4 text-body-m-m md:text-body-m text-secondary"
                >
                  <span className="font-mono text-specimen text-tertiary">{ref.n}</span>
                  <span>{ref.text}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
