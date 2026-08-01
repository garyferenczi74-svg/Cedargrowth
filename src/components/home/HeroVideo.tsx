'use client';

import { useEffect, useRef } from 'react';

type HeroVideoProps = {
  src: string;
  className?: string;
};

// Full bleed background video for the home hero. iOS Safari and some mobile
// browsers pause background video on their own (tab backgrounded, low power
// mode, returning from another app), so we hold a ref and re-issue play()
// whenever the element pauses or the page regains focus. Honors
// prefers-reduced-motion by leaving the first frame static. The video is
// decorative (aria-hidden); the hero headline and body carry the meaning.
export function HeroVideo({ src, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) {
      video.pause();
      return;
    }

    const tryPlay = () => {
      // Autoplay can be rejected until the user interacts; swallow the
      // rejection and let the next focus or visibility change retry.
      void video.play().catch(() => {});
    };

    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    video.addEventListener('pause', tryPlay);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', tryPlay);

    return () => {
      video.removeEventListener('pause', tryPlay);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', tryPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
