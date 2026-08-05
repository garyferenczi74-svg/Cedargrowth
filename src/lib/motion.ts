export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: { fast: 0.24, base: 0.48, slow: 0.72, settle: 0.9 },
  stagger: 0.08,
  viewport: { once: true, amount: 0.15 },
  reducedMs: 0.12,
} as const;
