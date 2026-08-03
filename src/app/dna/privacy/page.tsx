import { holdPageMetadata } from '@/components/shell/HoldPage';
import { ReviewBanner } from '@/components/legal/ReviewBanner';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';

// Prompt 05 Task 2 follow-up: structured "draft pending" document, not a
// bare HoldPage. Privacy Section 6 ("6. Genetic information") points here
// for "the full account, including the laboratory and the specific
// markers." This page lays out that account's section scaffold with
// plainer-language headings mirroring Section 6.1-6.8 (content/legal/
// privacy.ts) plus a laboratory section (referenced by Section 6's intro
// and Section 9). Every section body renders the Unknown atom: no policy
// language is drafted here. Two items are surfaced as visible, unanswered
// placeholders rather than guessed: the sample-retention decision and the
// laboratory's identity. Stays noindex (holdPageMetadata) and out of
// sitemap.ts until it has real content.
export const metadata = holdPageMetadata('Genetic privacy');

export default function DnaPrivacyPage() {
  return (
    <>
      <ReviewBanner reviewPending={true} />

      {/* Intro */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Genetic privacy</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              How we handle your genetic data.
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              This page is the full genetic privacy account referenced by
              Section 6 of the privacy policy. It lays out the sections that
              account will contain. It is being prepared and has not been
              published yet. Two items it depends on are still open: the
              identity of the laboratory that performs the analysis, and
              the decision on how long a physical sample is kept. Both are
              factual questions that have not yet been settled, and both
              are shown below as pending rather than guessed.
            </p>
          </div>
        </div>
      </section>

      {/* Sections, structure only */}
      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex flex-col gap-10 md:gap-16">
            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                What we analyze
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                How consent works
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                What we never do
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                The saliva sample
              </h2>
              <div className="flex flex-col gap-3">
                <Unknown caption="PENDING COUNSEL REVIEW" />
                <p className="font-mono text-body-m-m md:text-body-m text-tertiary">
                  [DESTROYED AFTER ANALYSIS / RETAINED FOR PERIOD]
                </p>
              </div>
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                Your control over your data
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                Sharing with a practitioner
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                Genetic information about relatives
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                How your data is secured
              </h2>
              <Unknown caption="PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                The laboratory
              </h2>
              <Unknown caption="UNKNOWN, PENDING CONFIRMATION" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
