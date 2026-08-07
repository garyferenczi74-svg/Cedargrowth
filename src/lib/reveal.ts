'use client';
import { useEffect, useRef, useState } from 'react';

// Shared, reliable "reveal on view" trigger. It replaces framer-motion's
// whileInView, which was racy under LazyMotion: it intermittently failed to
// fire for elements already in view at first paint and for tall elements,
// stranding content hidden. The whole reveal system built on this is ADDITIVE:
// every consumer renders its final, visible state by default, so if this hook
// never fires, nothing is ever hidden. The reveal is a pure enhancement.

const AMOUNT = 0.15;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function ensureObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            observer!.unobserve(entry.target);
            callbacks.delete(entry.target);
            if (cb) cb();
          }
        }
      },
      { threshold: AMOUNT },
    );
  }
  return observer;
}

function alreadyInView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (r.height === 0 && r.width === 0) return false;
  return r.top < vh * (1 - AMOUNT) && r.bottom > vh * AMOUNT;
}

// Returns a ref and a boolean that flips true once, when the element is in view.
// It flips immediately on mount if the element is already in view (the case
// framer's observer raced on) and via a shared observer on scroll-in otherwise.
// Once true it never goes back to false (play once).
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    if (alreadyInView(el)) {
      setRevealed(true);
      return;
    }
    const obs = ensureObserver();
    if (!obs) {
      setRevealed(true);
      return;
    }
    const cb = () => setRevealed(true);
    callbacks.set(el, cb);
    obs.observe(el);
    return () => {
      obs.unobserve(el);
      callbacks.delete(el);
    };
  }, [revealed]);
  return { ref, revealed };
}
