// Renders the exact draft-review notice above a legal document's H1.
// Controlled entirely by reviewPending: false renders nothing. Not an
// alert (no role="alert", no aria-live) because it is not a live status
// change, just a static notice; no icon, no color signal, no dismissal
// control, per the Prompt 05 Task 2 brief.

export function ReviewBanner({ reviewPending }: { reviewPending: boolean }) {
  if (!reviewPending) return null;

  return (
    <div className="w-full bg-ink py-3">
      <p className="text-center font-mono text-caption text-inverse">
        REVIEW BANNER, REMOVE BEFORE PUBLICATION: Draft pending attorney
        review.
      </p>
    </div>
  );
}
