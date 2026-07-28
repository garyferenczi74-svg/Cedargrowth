import type { ReactNode } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';

// The reusable shell every route inherits: skip link, announcement bar, header
// with the mega panel, the page main, and the footer.

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:bg-ink focus-visible:px-4 focus-visible:py-2 focus-visible:text-inverse focus-visible:text-caption"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="content" className="min-h-[50vh]">
        {children}
      </main>
      <Footer />
    </>
  );
}
