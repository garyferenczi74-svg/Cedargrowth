import { ANNOUNCEMENT } from '@/lib/site';

// One sentence, ink background (Section 5.2). Not dismissible, no color, no
// badge. text-inverse on ink is high contrast.

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-inverse">
      <p className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin py-2 text-center text-caption-m md:text-caption">
        {ANNOUNCEMENT}
      </p>
    </div>
  );
}
