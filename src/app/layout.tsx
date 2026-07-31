import type { Metadata } from 'next';
import { Newsreader, Inter_Tight, IBM_Plex_Mono } from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import { AgeGate } from '@/components/shell/AgeGate';
import { ReservationProvider } from '@/components/reserve/ReservationProvider';
import { isAgeGateEnabled } from '@/lib/flags';
import '../../tokens.css';
import './globals.css';

// Three faces, no more (Section 4.2). Each exposes a CSS variable that the
// Tailwind theme reads through font-display, font-sans, and font-mono.
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CedarGrowth Organics',
    template: '%s, CedarGrowth Organics',
  },
  description:
    'CedarGrowth produces solventless live rosin in Buffalo, New York, formulated for outcome rather than potency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${interTight.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-parchment text-primary font-sans">
        {/*
          Age gate (spec Section C item 6), guarded at this mount site rather
          than inside AgeGate itself: isAgeGateEnabled() defaults OFF, and
          when it is off this branch renders nothing at all, so the gate adds
          zero DOM and zero behavioral change. Do not flip
          NEXT_PUBLIC_AGE_GATE_ENABLED on without an explicit go-ahead.
        */}
        {isAgeGateEnabled() ? <AgeGate /> : null}
        <ReservationProvider>
          <Shell>{children}</Shell>
        </ReservationProvider>
      </body>
    </html>
  );
}
