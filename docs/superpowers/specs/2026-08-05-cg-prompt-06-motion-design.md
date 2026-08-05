# CG Prompt 06: Motion (The Instrument Settling) - Design Spec

Date: 2026-08-05
Repo: CedarGrowth (Next.js 14.2.35 App Router, React 18.3.1, `src/` dir, content at repo-root `content/`)
Follows: CG Prompt 05
Deploy: one complete pass, straight to `main` (auto-deploys to prod)

## 1. Goal

Add a single, coherent motion system to the CedarGrowth marketing site whose register is "an instrument settling into a reading." Values resolve, rules draw, counters come to rest. Nothing bounces, springs, floats, greets, or performs. Three standing defects are fixed first, because animating a wrong string only makes it arrive more elegantly.

## 2. Pre-work: three defect fixes (do before any motion)

**D1. Purity strip string.** `content/home.ts:56` currently reads `Ice water hash and rosin, pressed from premium cannabis.` This is a quality claim ("premium") that replaced a factual two-input statement and drops the two-input story. Replace with the exact string:

`Ice water hash and rosin, pressed from two inputs: dried and cured sugar trim, and fresh frozen whole plant.`

**D2. The five numerals stay `00`.** The repeated `00` is intentional and read as a measurement (zero solvents, distillate, additives, fillers, shortcuts), not an index. The prior instruction to use `01` through `05` is withdrawn. Today `00` is a hardcoded literal at `src/app/page.tsx:147`; make it data-driven so each cell carries its own countdown ceiling while the resting value stays `00`. Extend `ABSENCES` in `src/lib/lines.ts` from `string[]` to entries of `{ label, ceiling }`.

**D3. Vertical rhythm above the ink band.** There is roughly a full screen of dead space above the dark five-absences band. The likely cause is three stacked full-width sections each carrying `md:py-40`, with the Two Inputs band (`src/components/home/TwoInputsBand.tsx:15`, `md:py-40`) butting its 160px bottom padding against the ink band. The prompt is itself unsure of the cause, so the fix is diagnosed on the live deploy at 1440 first, then applied: normalize section vertical rhythm so adjacent full-width sections do not double their padding, and record the exact before/after values in the delivery report. No guessing in code before the visual diagnosis.

## 3. Governing idea and absolute prohibitions

Every animation expresses an instrument settling into a reading. If an animation would make a reader smile, it is wrong; if it makes the page feel like a precise object, it is right.

Prohibited: spring physics with visible overshoot, bounce, elastic easing, parallax beyond 40px, scroll-hijacking, scroll-driven horizontal movement, rotation, skew, 3D transforms, blur transitions, scale on text, staggered letter-by-letter fades, marquees, cursor followers, confetti, and reveal-on-scroll applied indiscriminately to every element.

## 4. Technical setup

**Package.** Add `framer-motion` (latest stable, compatible with React 18). Import from `framer-motion`.

**Client boundary.** `page.tsx`, `layout.tsx`, and every `content/*.ts` stay server components. Build small client motion primitives in `src/components/motion/` (each begins with `"use client"`). Wrap server-rendered section JSX as the `children` of these primitives; App Router passes server children through a client boundary untouched, so content and SEO stay server-rendered and only the thin motion wrapper is client. If a page file would need `"use client"`, restructure instead.

**Bundle discipline.** Mount `LazyMotion` with `domAnimation` once, via a small client `MotionProvider` component rendered inside the server `layout.tsx`. Use `m.` components throughout, never `motion.`. Report the bundle delta.

**Reduced motion.** Every primitive reads `useReducedMotion()`. When true: no transforms, no counting, no drawn rules, no character cycling. Opacity transitions at 120ms only, every value at its final state immediately. Verify by toggling the OS setting, not by reading the code.

**LCP.** The hero headline is the LCP element. It must not animate in from `opacity: 0`. It uses the mask reveal (Section 7.2) that paints text immediately inside a moving mask, or it does not animate. Measure LCP before and after and report both; budget is 2.0s on 4G.

**CLS.** Every animated element reserves its final space at first paint. Counters render at final character width from the start using tabular numerals. Target zero CLS, measured.

## 5. Tokens

New `src/lib/motion.ts` mirrors the existing CSS tokens in `tokens.css` so JS and CSS stay in sync:

```
ease:     [0.22, 1, 0.36, 1]            // the standing curve, matches --ease-cedar
duration: { fast: 0.24, base: 0.48, slow: 0.72, settle: 0.9 }  // seconds
stagger:  0.08                          // 80ms between siblings
viewport: { once: true, amount: 0.15 }
```

Every animation plays once. Nothing re-triggers on scroll back up. Where `tokens.css --dur-reveal` reads 500ms, align the JS base to 480ms per spec; the small difference is cosmetic and the JS token governs Framer Motion.

## 6. Remove the existing CSS scroll-reveal system

The site currently animates via `.reveal` / `.settle` classes driven by `animation-timeline: view()` in `globals.css`, applied across nearly every block in `page.tsx`. This re-triggers on scroll and contradicts the play-once governing idea. Remove it:

- Delete the `@keyframes cg-reveal`, `@keyframes cg-settle`, and the `.reveal` / `.settle` scroll-timeline rules from `globals.css`.
- Remove the `reveal` / `settle` class usages from `page.tsx` and the three home components.
- Keep `.cedar-underline` (already the spec's hover/focus underline draw) and every `--ease-*` / `--dur-*` token and the reduced-motion safety net.

## 7. The six primitives (`src/components/motion/`)

Build once, use everywhere. No component animates ad hoc. Anything that cannot be built from these does not get built.

**7.1 Rise.** Default. Opacity 0 to 1 plus 16px translateY, base duration, standing ease, optional delay. Carries most body copy and most blocks.

**7.2 LineReveal.** Text split by rendered line, each line wrapped in an `overflow: hidden` container, each line translates from 100 percent of its own height to 0, lines stagger at 80ms. Split by rendered line (not word or character) and recompute on resize so the mask never cuts a rewrapped line. Keep continuous readable text in the DOM for screen readers and search; if the split fragments the accessible name, carry the full string as `aria-label` on the wrapper. Never animate letters individually. Used on all Newsreader headlines at Heading M and above.

**7.3 RuleDraw.** Hairlines draw: `scaleX` 0 to 1, `transform-origin: left`, slow duration. Vertical variant draws on `scaleY` from top. The signature move. Used on every section-header hairline, the rules between team entries, the two-inputs separators, the research-list dividers, and the five-absences verticals.

**7.4 Counter.** Animates a numeric value to target via `useMotionValue` and `animate`, rendered through `useTransform` with correct zero-padding, settle duration, standing ease, tabular numerals, fixed character width. Modes: `countDown` (from a stated ceiling to target; this is the five-absences mode, target `00`) and `countUp` (from zero, for real figures elsewhere). The last third is deliberately slower than linear so the value visibly comes to rest. Never animate a value the site does not know; `UNKNOWN` renders `UNKNOWN` and does not animate.

**7.5 Resolve.** Monospace specimen lines only. Characters resolve from a randomized set to their final value, left to right, over the fast duration, one pass, no loop. Only on `INPUT:` specimen lines, batch identifiers, and laboratory readouts. Never on prose, headlines, or navigation. If it appears more than twice on a screen it is decoration and must be cut. Reduced motion renders the final string immediately.

**7.6 FrameWipe.** Images and placeholder frames reveal under a mask traveling bottom to top, slow duration, no fade and no scale. The frame border draws with RuleDraw at the same time. No scale on images at all.

## 8. Section by section

- **Hero (page.tsx 47-82).** On load, not on scroll. Frame wipes in over 900ms; eyebrow rises at 200ms; headline runs LineReveal (three lines, 80ms apart) at 320ms with text painted immediately inside its mask (confirm LCP not deferred); subline rises at 640ms; button border draws and label rises at 800ms.
- **Statement band (85-99).** LineReveal on the headline, Rise on the body at 160ms. Nothing else.
- **The five lines (102-133).** Cards stagger 80ms left to right. Each: FrameWipe on the specimen plate, pigment marker rule draws at 240ms, name and descriptor rise together. On mobile horizontal scroll, animate per card on entry, not all at once.
- **Two inputs band (TwoInputsBand.tsx).** Header runs LineReveal and RuleDraw. Two entries reveal in sequence 160ms apart, each hairline drawing first and its specimen line running Resolve last. Reading order preserved: cured completes before fresh frozen begins.
- **The five absences (139-158), the centerpiece.** On entry, the four vertical hairlines draw simultaneously with RuleDraw vertical over 720ms. As they complete, the five counters begin, staggered 80ms, each counting down to `00` over the settle duration with the slowed final third. Labels rise beneath their counters 240ms after each counter starts, so the number is already falling when its meaning arrives. The line beneath rises last, 400ms after the final counter rests. Whole band about 2.2 seconds.
- **Transparency band / BatchTeaser.** The disabled batch field border draws; the caption rises. Nothing else.
- **Research teaser (200-217).** Rows stagger 80ms. Each: hairline draws, date runs Resolve (a legitimate readout), title and abstract rise together.
- **Team (TeamSection.tsx).** Wider restraint. Section header standard. Each entry: hairline draws, portrait frame wipes, name rises, role and bio rise together at 160ms. Never Resolve on a name or credential.
- **Locator and footer (220-237, Footer).** Locator: frame wipe plus standard rise on headline and button. Footer: no entry animation at all.
- **Announcement bar.** Static, always.

## 9. Interaction motion

- Links: underline draws left to right over 240ms on hover and focus. No color change, no lift. (Existing `.cedar-underline`.)
- Outline buttons: border darkens over 240ms; arrow translates 4px right. No scale.
- Solid buttons: background lightens one step over 240ms.
- Navigation: mega-panel fades over 240ms. On scroll past the header, the header bottom hairline draws in over 240ms; it does not slide, shrink, or change height; the wordmark never resizes.
- Focus rings: appear instantly, no transition.
- Page transitions: 240ms crossfade on the content column only; header and footer never move between routes.

## 10. What not to animate

The announcement bar, the footer, any `UNKNOWN` value, the disabled batch field contents, legal page bodies (render instantly and completely), any unverified figure, and the compliance warning block, ever.

## 11. Counter ceilings (decision)

Uniform ceiling `12` for all five absences, each counting `12 -> 00` over the 900ms settle with the slowed final third, staggered 80ms. Uniform reads as five identical instruments zeroing in cascade rather than five arbitrary numbers; `12` is small enough to read as a count, and two digits fill the `00` width so there is zero layout shift. Recorded here per the spec requirement to choose deliberately and report.

## 12. Acceptance criteria

- Purity strip string corrected; vertical rhythm fixed (values reported); numerals confirmed as `00`.
- All six primitives in `src/components/motion/`, tokens in `src/lib/motion.ts`.
- No page, layout, or content module marked `"use client"`.
- `LazyMotion` with `domAnimation`, `m.` components throughout; bundle delta reported.
- Reduced motion verified by OS toggle: no transforms, no counting, no character cycling, opacity only at 120ms.
- LCP measured before and after, both reported, no regression past 2.0s on 4G.
- CLS measured at zero.
- Every animation plays once, no re-trigger on scroll back.
- LineReveal output readable to a screen reader as continuous text, verified.
- Resolve at most twice per screen, never on a name, headline, or navigation.
- Five-absences band times at about 2.2 seconds and counts down to `00`.
- Counter ceilings chosen deliberately and reported (uniform `12`).
- Zero em-dashes and zero en-dashes, lint passing.
- Verified at 390 and 1440 and on a throttled connection; full-page scroll capture at 1440 attached to the report.

## 13. Build and deploy approach

One complete pass. Never run `npm run build` in the working copy (it poisons `.next`). Verify with `npm run lint` and `npm run typecheck`. Install `framer-motion` (approved by this prompt). Straight to `main` on completion, which auto-deploys to prod; verification (LCP, CLS, reduced motion, screen capture) runs against the resulting deploy, with revert on any regression.
