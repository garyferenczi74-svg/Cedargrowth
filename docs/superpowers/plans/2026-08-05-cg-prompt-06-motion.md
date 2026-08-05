# CG Prompt 06 Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single play-once "instrument settling" motion system to the CedarGrowth marketing site using Framer Motion, after fixing three standing defects.

**Architecture:** Server components stay server (`page.tsx`, `layout.tsx`, `content/*`). Six thin client motion primitives in `src/components/motion/` wrap server-rendered JSX as `children`. `LazyMotion`+`domAnimation` is mounted once via a client `MotionProvider` inside the server layout; all motion uses `m.` components. The existing CSS scroll-timeline reveal is removed so there is one motion system that plays once.

**Tech Stack:** Next.js 14.2.35 App Router, React 18.3.1, TypeScript, Tailwind, Framer Motion (new), content modules at repo-root `content/` (alias `@/content/*`), motion/CSS tokens in `tokens.css`.

## Global Constraints

- Motion register is "an instrument settling into a reading." No spring overshoot, bounce, elastic, parallax beyond 40px, scroll-hijack, scroll-driven horizontal move, rotation, skew, 3D, blur transitions, scale on text, letter-by-letter fades, marquees, cursor followers, confetti, or indiscriminate reveal-on-scroll.
- Every animation plays once (`viewport: { once: true, amount: 0.15 }`). Nothing re-triggers on scroll back.
- Standing ease `[0.22, 1, 0.36, 1]`; durations `{ fast .24, base .48, slow .72, settle .9 }` seconds; stagger `.08`.
- No `page`, `layout`, or `content/*` file marked `"use client"`.
- `LazyMotion` with `domAnimation` and `m.` components throughout. Report bundle delta.
- Every primitive honors `useReducedMotion()`: no transforms, no counting, no character cycling; opacity only at 120ms; final state immediate.
- Hero headline is LCP; it must not animate from `opacity: 0`. No layout shift (CLS 0); counters use tabular numerals at final width.
- Zero em-dashes and zero en-dashes anywhere (copy, code, comments). Lint must pass.
- Never run `npm run build` in the working copy. Verify with `npm run lint` and `npm run typecheck`.
- Numerals in the five-absences band stay `00` (intentional measurement, not an index).
- Counter ceilings: uniform `12` for all five absences.

---

### Task 1: Defect D1 (purity string) and D2 data model

**Files:**
- Modify: `content/home.ts:54-57` (the `absences.trailing` string)
- Modify: `src/lib/lines.ts:67-74` (`ABSENCES` becomes structured)
- Modify: `src/app/page.tsx:139-158` (render `ceiling`, keep visible `00`)

**Interfaces:**
- Produces: `ABSENCES: { label: string; ceiling: number }[]` in `src/lib/lines.ts`, consumed by the five-absences section and later by Task 15.

- [ ] **Step 1: Fix the purity string.** In `content/home.ts`, replace the `absences.trailing` value with exactly:
  `Ice water hash and rosin, pressed from two inputs: dried and cured sugar trim, and fresh frozen whole plant.`
- [ ] **Step 2: Restructure ABSENCES.** In `src/lib/lines.ts` replace the `string[]` with:
```ts
export const ABSENCES: { label: string; ceiling: number }[] = [
  { label: 'No solvents.', ceiling: 12 },
  { label: 'No distillate.', ceiling: 12 },
  { label: 'No additives.', ceiling: 12 },
  { label: 'No fillers.', ceiling: 12 },
  { label: 'No shortcuts.', ceiling: 12 },
];
```
- [ ] **Step 3: Update the render.** In `src/app/page.tsx`, change the map so the numeral still renders `00` at rest but the data carries the ceiling for Task 15. For now render the static `00` and `{item.label}` from `ABSENCES.map((item) => ...)`. Keep the `font-mono text-data text-inverse/50` numeral and `text-body-l` label markup unchanged except the map variable.
- [ ] **Step 4: Verify.** Run `npm run lint && npm run typecheck`. Expected: pass (baseline has 2 known errors in `email.ts`/`supabase.ts` from missing local deps; no NEW errors). Grep the string is present: `grep -n "two inputs" content/home.ts`.
- [ ] **Step 5: Commit.** `git add content/home.ts src/lib/lines.ts src/app/page.tsx && git commit -m "Fix purity string and make absences numerals data-driven"`

---

### Task 2: Defect D3 (vertical rhythm above the ink band)

**Files:**
- Modify: `src/components/home/TwoInputsBand.tsx:15` and/or `src/app/page.tsx:102,139` (section vertical padding)

**Interfaces:** none produced.

- [ ] **Step 1: Diagnose live.** Load `https://cedargrowth.vercel.app` in the browser at 1440 width, scroll to the transition between the Two Inputs band (parchment) and the ink band (dark). Screenshot. Measure the empty gap (use the browser tool to read `getBoundingClientRect()` of the Two Inputs section bottom and the ink section top, and the computed `padding` on each).
- [ ] **Step 2: Decide the fix from evidence.** The stacked `md:py-40` (160px) on the five-lines section, the Two Inputs band, and their inner short columns are the suspected cause. The fix normalizes the rhythm: reduce the doubled padding where two full-width sections meet so the combined gap reads as one section boundary, not two. Candidate: drop the Two Inputs band bottom and the ink band top to a single consistent value (for example `md:py-24` on the seam), keeping the section internal rhythm intact. Do NOT change values blindly; base them on the measured gap.
- [ ] **Step 3: Apply and re-measure.** Apply the chosen padding change, reload, re-measure the gap. Record before/after pixel values for the delivery report.
- [ ] **Step 4: Verify.** `npm run lint && npm run typecheck` pass. Confirm no horizontal overflow and the seam reads correctly at 1440 and 390.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "Normalize vertical rhythm above the ink band"` (record before/after in the message body).

---

### Task 3: Framer Motion setup, tokens, and MotionProvider

**Files:**
- Modify: `package.json` (add `framer-motion`)
- Create: `src/lib/motion.ts`
- Create: `src/components/motion/MotionProvider.tsx`
- Modify: `src/app/layout.tsx` (wrap children in `MotionProvider`)

**Interfaces:**
- Produces: `MOTION` tokens object and `MotionProvider` client component consumed by every primitive.

- [ ] **Step 1: Install.** Run `npm install framer-motion` (latest stable). Commit the lockfile change with the code below.
- [ ] **Step 2: Tokens.** Create `src/lib/motion.ts`:
```ts
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: { fast: 0.24, base: 0.48, slow: 0.72, settle: 0.9 },
  stagger: 0.08,
  viewport: { once: true, amount: 0.15 },
  reducedMs: 0.12,
} as const;
```
- [ ] **Step 3: Provider.** Create `src/components/motion/MotionProvider.tsx`:
```tsx
'use client';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
```
- [ ] **Step 4: Mount.** In `src/app/layout.tsx`, import `MotionProvider` and wrap the existing children tree (inside `<body>`, around `ReservationProvider`/`Shell`) with `<MotionProvider>`. Do not add `"use client"` to the layout.
- [ ] **Step 5: Verify.** `npm run lint && npm run typecheck` pass. `grep -n "framer-motion" package.json` shows the dep.
- [ ] **Step 6: Commit.** `git add package.json package-lock.json src/lib/motion.ts src/components/motion/MotionProvider.tsx src/app/layout.tsx && git commit -m "Add framer-motion, motion tokens, and LazyMotion provider"`

---

### Task 4: Remove the existing CSS scroll-reveal system

**Files:**
- Modify: `src/app/globals.css` (delete `cg-reveal`, `cg-settle`, `.reveal`, `.settle` scroll-timeline blocks)
- Modify: `src/app/page.tsx`, `src/components/home/TwoInputsBand.tsx`, `src/components/home/TeamSection.tsx`, `src/components/home/BatchTeaser.tsx` (strip `reveal`/`settle` classes)

**Interfaces:** none produced. Keep `.cedar-underline` and all `--ease-*`/`--dur-*` tokens and the reduced-motion safety net.

- [ ] **Step 1: Inventory.** `grep -rn "reveal\|settle" src/app/page.tsx src/components/home` and `grep -n "cg-reveal\|cg-settle\|animation-timeline" src/app/globals.css`.
- [ ] **Step 2: Delete CSS.** Remove the `@keyframes cg-reveal`, `@keyframes cg-settle`, and the `.reveal`/`.settle` (scroll-timeline) rule blocks from `globals.css`. Leave `.cedar-underline` and the tokens untouched.
- [ ] **Step 3: Strip classes.** Remove `reveal` and `settle` class tokens from the four files. Do not remove any layout classes; only the two motion class names.
- [ ] **Step 4: Verify.** `grep -rn "\breveal\b\|\bsettle\b" src/app/page.tsx src/components/home src/app/globals.css` returns nothing. `npm run lint && npm run typecheck` pass. Load the page: content renders statically (no motion yet), no console errors.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "Remove CSS scroll-timeline reveal system in favor of Framer Motion"`

---

### Task 5: Rise primitive

**Files:**
- Create: `src/components/motion/Rise.tsx`
- Test: `src/components/motion/__tests__/motion-primitives.md` (manual verification note; no unit runner in repo)

**Interfaces:**
- Produces: `<Rise delay?={number}>` client component. Consumed by most sections.

- [ ] **Step 1: Implement.** Create `src/components/motion/Rise.tsx`:
```tsx
'use client';
import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <m.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>
        {children}
      </m.div>
    );
  }
  return (
    <m.div className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay }}>
      {children}
    </m.div>
  );
}
```
- [ ] **Step 2: Verify.** `npm run lint && npm run typecheck` pass. Temporarily wrap one block in `page.tsx` with `<Rise>`, load, confirm it rises once and does not re-trigger on scroll back; revert the temporary wrap.
- [ ] **Step 3: Commit.** `git add src/components/motion/Rise.tsx && git commit -m "Add Rise motion primitive"`

---

### Task 6: RuleDraw primitive (horizontal and vertical)

**Files:**
- Create: `src/components/motion/RuleDraw.tsx`

**Interfaces:**
- Produces: `<RuleDraw axis?={'x'|'y'} delay?={number} duration?={number} className>` rendering an animated 1px rule. `className` supplies the border/background color (e.g. `bg-hairline` or `bg-hairline-inverse`) and the box dimensions.

- [ ] **Step 1: Implement.** Create `src/components/motion/RuleDraw.tsx`:
```tsx
'use client';
import { m, useReducedMotion } from 'framer-motion';
import { MOTION } from '@/lib/motion';

export function RuleDraw({ axis = 'x', delay = 0, duration = MOTION.duration.slow, className = '' }:
  { axis?: 'x' | 'y'; delay?: number; duration?: number; className?: string }) {
  const reduced = useReducedMotion();
  const origin = axis === 'x' ? 'left' : 'top';
  const scaleKey = axis === 'x' ? 'scaleX' : 'scaleY';
  if (reduced) {
    return <m.div className={className} style={{ transformOrigin: origin }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={MOTION.viewport}
      transition={{ duration: MOTION.reducedMs }} />;
  }
  return <m.div className={className} style={{ transformOrigin: origin }}
    initial={{ [scaleKey]: 0 }} whileInView={{ [scaleKey]: 1 }} viewport={MOTION.viewport}
    transition={{ duration, ease: MOTION.ease, delay }} />;
}
```
- [ ] **Step 2: Verify.** `npm run lint && npm run typecheck` pass. Render one instance replacing a static hairline, confirm it draws from the correct origin once.
- [ ] **Step 3: Commit.** `git add src/components/motion/RuleDraw.tsx && git commit -m "Add RuleDraw motion primitive"`

---

### Task 7: LineReveal primitive

**Files:**
- Create: `src/components/motion/LineReveal.tsx`

**Interfaces:**
- Produces: `<LineReveal text={string} delay?={number} className>` for Newsreader headlines at Heading M and above. Splits by rendered line, staggers 80ms, keeps `aria-label={text}` so the accessible name is the full continuous string.

- [ ] **Step 1: Implement.** Create `src/components/motion/LineReveal.tsx`. Measure rendered line breaks by rendering the text invisibly, reading client-rect line tops via a `Range` per word, grouping words into lines, then rendering each line in an `overflow-hidden` wrapper with a `m.span` translating from `100%` to `0`. Recompute on `ResizeObserver`. Under reduced motion render the plain text at 120ms opacity. The wrapper carries `aria-label={text}`; the split spans are `aria-hidden`.
```tsx
'use client';
import { m, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MOTION } from '@/lib/motion';

function splitIntoLines(el: HTMLElement, text: string): string[] {
  const words = text.split(' ');
  el.textContent = '';
  const spans = words.map((w, i) => {
    const s = document.createElement('span');
    s.textContent = i < words.length - 1 ? w + ' ' : w;
    el.appendChild(s);
    return s;
  });
  const lines: string[] = [];
  let top: number | null = null;
  let current = '';
  spans.forEach((s, i) => {
    const t = s.offsetTop;
    if (top === null) top = t;
    if (t !== top) { lines.push(current.trim()); current = ''; top = t; }
    current += words[i] + ' ';
  });
  if (current.trim()) lines.push(current.trim());
  return lines;
}

export function LineReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[]>([text]);
  useEffect(() => {
    if (reduced || !measureRef.current) return;
    const el = measureRef.current;
    const recompute = () => setLines(splitIntoLines(el, text));
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, reduced]);
  if (reduced) {
    return <m.span className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>{text}</m.span>;
  }
  return (
    <span className={className} aria-label={text}>
      <span ref={measureRef} aria-hidden style={{ position: 'absolute', visibility: 'hidden', width: '100%' }} />
      {lines.map((line, i) => (
        <span key={i} aria-hidden style={{ display: 'block', overflow: 'hidden' }}>
          <m.span style={{ display: 'block' }} initial={{ y: '100%' }} whileInView={{ y: '0%' }}
            viewport={MOTION.viewport}
            transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay: delay + i * MOTION.stagger }}>
            {line}
          </m.span>
        </span>
      ))}
    </span>
  );
}
```
- [ ] **Step 2: Verify.** `npm run lint && npm run typecheck` pass. Render on a headline, confirm lines roll up from a mask, resize the window and confirm the mask never cuts a rewrapped line. In the browser accessibility tree, confirm the accessible name is the full continuous string.
- [ ] **Step 3: Commit.** `git add src/components/motion/LineReveal.tsx && git commit -m "Add LineReveal motion primitive"`

---

### Task 8: Counter primitive

**Files:**
- Create: `src/components/motion/Counter.tsx`

**Interfaces:**
- Produces: `<Counter to={number} from?={number} mode={'countUp'|'countDown'} pad?={number} delay?={number} className>`. For the five absences: `mode="countDown" from={12} to={0} pad={2}` renders and rests at `00`. Tabular numerals, fixed width, slowed final third.

- [ ] **Step 1: Implement.** Create `src/components/motion/Counter.tsx` using `useMotionValue` + `animate` + `useTransform`, `font-variant-numeric: tabular-nums`, a two-segment ease so the final third settles slower. Reserve final character width from first paint (render the padded target immediately, then start the value at the ceiling).
```tsx
'use client';
import { m, useReducedMotion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { MOTION } from '@/lib/motion';

export function Counter({ to, from, mode, pad = 2, delay = 0, className }:
  { to: number; from?: number; mode: 'countUp' | 'countDown'; pad?: number; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const start = from ?? (mode === 'countDown' ? Math.max(to, 12) : 0);
  const mv = useMotionValue(start);
  const text = useTransform(mv, (v) => String(Math.round(v)).padStart(pad, '0'));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: MOTION.viewport.amount });
  useEffect(() => {
    if (reduced) { mv.set(to); return; }
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: MOTION.duration.settle,
      delay,
      ease: [0.16, 0.84, 0.24, 1], // slower final third, no overshoot
    });
    return controls.stop;
  }, [inView, reduced, to, delay, mv]);
  return <m.span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>{reduced ? String(to).padStart(pad, '0') : text}</m.span>;
}
```
- [ ] **Step 2: Verify.** `npm run lint && npm run typecheck` pass. Render `from=12 to=0 mode=countDown pad=2`; confirm it starts at `12`, falls to `00`, visibly settles, digits do not reflow (tabular). Under OS reduced motion it shows `00` with no counting.
- [ ] **Step 3: Commit.** `git add src/components/motion/Counter.tsx && git commit -m "Add Counter motion primitive"`

---

### Task 9: Resolve primitive

**Files:**
- Create: `src/components/motion/Resolve.tsx`

**Interfaces:**
- Produces: `<Resolve text={string} delay?={number} className>` for monospace specimen lines only. Left-to-right character resolve, one pass, fast duration. Reduced motion renders final string immediately.

- [ ] **Step 1: Implement.** Create `src/components/motion/Resolve.tsx`. On in-view, run a single `requestAnimationFrame` loop over `MOTION.duration.fast` that locks characters left to right; unlocked characters show a random glyph from a fixed set; spaces and already-final chars never cycle.
```tsx
'use client';
import { useReducedMotion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MOTION } from '@/lib/motion';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

export function Resolve({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: MOTION.viewport.amount });
  const [display, setDisplay] = useState(reduced ? text : text.replace(/[^ ]/g, ' '));
  useEffect(() => {
    if (reduced || !inView) { if (reduced) setDisplay(text); return; }
    let raf = 0; const durMs = MOTION.duration.fast * 1000; let startT = 0;
    const step = (t: number) => {
      if (!startT) startT = t + delay * 1000;
      const p = Math.min(Math.max((t - startT) / durMs, 0), 1);
      const locked = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') out += ' ';
        else if (i < locked) out += text[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(step); else setDisplay(text);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text, delay]);
  return <span ref={ref} className={className} aria-label={text}>{display}</span>;
}
```
- [ ] **Step 2: Verify.** `npm run lint && npm run typecheck` pass. Render on a specimen line, confirm one left-to-right pass, no loop; accessible name is the final string; reduced motion shows the final string with no cycling.
- [ ] **Step 3: Commit.** `git add src/components/motion/Resolve.tsx && git commit -m "Add Resolve motion primitive"`

---

### Task 10: FrameWipe primitive

**Files:**
- Create: `src/components/motion/FrameWipe.tsx`

**Interfaces:**
- Produces: `<FrameWipe className>{child}</FrameWipe>`. Reveals the child under a mask traveling bottom to top over the slow duration, border draws simultaneously, no image scale, no fade.

- [ ] **Step 1: Implement.** Create `src/components/motion/FrameWipe.tsx`. Use a `clip-path` inset animating from full-bottom-inset to zero, plus a bordering `RuleDraw`-style frame. No `scale`.
```tsx
'use client';
import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

export function FrameWipe({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <m.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>{children}</m.div>;
  }
  return (
    <m.div className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)' }} whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay }}>
      {children}
    </m.div>
  );
}
```
- [ ] **Step 2: Verify.** `npm run lint && npm run typecheck` pass. Confirm the reveal travels bottom to top, no scale/softening on the image.
- [ ] **Step 3: Commit.** `git add src/components/motion/FrameWipe.tsx && git commit -m "Add FrameWipe motion primitive"`

---

### Task 11: Hero sequence (on load)

**Files:**
- Modify: `src/app/page.tsx:47-82`, `src/components/home/HeroVideo.tsx`

**Interfaces:** Consumes Rise, LineReveal, RuleDraw, FrameWipe.

- [ ] **Step 1: Wire the load sequence.** Frame wipes in 900ms; eyebrow `Rise` delay .2; headline `LineReveal` (3 lines, 80ms apart) delay .32 with text painted immediately inside its mask (no `opacity:0` on the headline container); subline `Rise` delay .64; button border `RuleDraw` + label `Rise` delay .8. Because this is on load, use `initial`/`animate` (not `whileInView`) for the hero only.
- [ ] **Step 2: Verify LCP not deferred.** Load with the browser, capture LCP via `PerformanceObserver` for `largest-contentful-paint`; the headline text node must be the LCP and must paint at first frame (mask moves over painted text). Record the value.
- [ ] **Step 3: Verify.** `npm run lint && npm run typecheck` pass. Reduced motion shows the hero fully at once.
- [ ] **Step 4: Commit.** `git add -A && git commit -m "Animate hero on load with mask reveal, LCP preserved"`

---

### Task 12: Statement band

**Files:** Modify `src/app/page.tsx:85-99`.

- [ ] **Step 1:** Headline `LineReveal`; body `Rise` delay .16. Nothing else.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass; visual check once, no re-trigger.
- [ ] **Step 3:** `git add -A && git commit -m "Animate statement band"`

---

### Task 13: The five lines

**Files:** Modify `src/app/page.tsx:102-133`.

- [ ] **Step 1:** Cards stagger 80ms left to right. Each card: `FrameWipe` on the specimen plate, pigment marker `RuleDraw` delay .24, name+descriptor `Rise` together. On mobile horizontal scroll, each card animates on its own entry (per-card `whileInView`), not all at once.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass; check at 1440 and 390.
- [ ] **Step 3:** `git add -A && git commit -m "Animate the five lines cards"`

---

### Task 14: Two inputs band

**Files:** Modify `src/components/home/TwoInputsBand.tsx` (add `"use client"` wrappers via primitives; the band data stays in place).

- [ ] **Step 1:** Header `LineReveal` + `RuleDraw`. Two entries reveal in sequence 160ms apart, each entry hairline `RuleDraw` first, specimen line `Resolve` last. Reading order preserved: cured entry completes before fresh frozen begins (chain via delays).
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass; confirm `Resolve` appears at most twice on this screen.
- [ ] **Step 3:** `git add -A && git commit -m "Animate two inputs band"`

---

### Task 15: The five absences centerpiece

**Files:** Modify `src/app/page.tsx:139-158`.

**Interfaces:** Consumes `ABSENCES` (Task 1), Counter, RuleDraw, Rise.

- [ ] **Step 1: Restructure the band for motion.** Extract the band into a small client wrapper (or wrap in primitives). The four interior vertical hairlines draw simultaneously with `RuleDraw axis="y"` over 720ms (720ms = `MOTION.duration.slow`). As they complete (delay .72), each of the five `Counter mode="countDown" from={item.ceiling} to={0} pad={2}` starts, staggered 80ms. Each label `Rise` starts 240ms after its counter (delay .72 + i*.08 + .24). The trailing line `Rise` starts 400ms after the last counter rests (delay .72 + 4*.08 + .9 + .4).
- [ ] **Step 2: Verify timing.** Total band time about 2.2s. Confirm counters start at `12`, fall to `00`, settle. Confirm zero CLS on the numerals (tabular, fixed width). Confirm plays once.
- [ ] **Step 3: Verify reduced motion.** OS toggle: numerals show `00` immediately, hairlines and labels present, no counting.
- [ ] **Step 4:** `npm run lint && npm run typecheck` pass.
- [ ] **Step 5:** `git add -A && git commit -m "Animate the five absences centerpiece with counting-down counters"`

---

### Task 16: Transparency band (BatchTeaser)

**Files:** Modify `src/components/home/BatchTeaser.tsx`.

- [ ] **Step 1:** Disabled batch field border `RuleDraw`; caption `Rise`. Nothing else (a disabled control stays quiet). Do not animate the field contents.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass.
- [ ] **Step 3:** `git add -A && git commit -m "Animate transparency band"`

---

### Task 17: Research teaser

**Files:** Modify `src/app/page.tsx:200-217`.

- [ ] **Step 1:** Rows stagger 80ms. Each row: hairline `RuleDraw`, date `Resolve` (legitimate readout), title+abstract `Rise` together. Confirm `Resolve` count on the screen stays within two.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass.
- [ ] **Step 3:** `git add -A && git commit -m "Animate research teaser rows"`

---

### Task 18: Team section

**Files:** Modify `src/components/home/TeamSection.tsx`.

- [ ] **Step 1:** Section header standard. Each entry: hairline `RuleDraw`, portrait `FrameWipe`, name `Rise`, role+bio `Rise` together at 160ms. Never `Resolve` on a name or credential.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass; confirm no `Resolve` anywhere in this component.
- [ ] **Step 3:** `git add -A && git commit -m "Animate team section"`

---

### Task 19: Locator and footer

**Files:** Modify `src/app/page.tsx:220-237`, confirm `src/components/shell/Footer.tsx` unchanged.

- [ ] **Step 1:** Locator: `FrameWipe` plus `Rise` on headline and button. Footer: no entry animation at all (leave static). Announcement bar stays static.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass; confirm the footer and announcement bar carry no motion.
- [ ] **Step 3:** `git add -A && git commit -m "Animate locator, leave footer static"`

---

### Task 20: Interaction motion

**Files:** Modify `src/components/**` for links/buttons/nav/focus/page transitions. Reuse `.cedar-underline`, `--dur-hover`, `--ease-cedar`.

- [ ] **Step 1:** Links: underline draws over 240ms on hover and focus (existing `.cedar-underline`), no color change, no lift. Outline buttons: border darkens 240ms, arrow translates 4px right, no scale. Solid buttons: background lightens one step 240ms. Nav: mega-panel fades 240ms; on scroll past header, the header bottom hairline draws in 240ms and nothing slides/shrinks; wordmark never resizes. Focus rings: instant, no transition. Page transitions: 240ms crossfade on the content column only; header/footer never move.
- [ ] **Step 2:** `npm run lint && npm run typecheck` pass. Verify each interaction in the browser; verify focus ring is instant (no fade).
- [ ] **Step 3:** `git add -A && git commit -m "Add interaction motion for links, buttons, nav, and page transitions"`

---

### Task 21: Verification and deploy

**Files:** none (measurement + deploy).

- [ ] **Step 1: Bundle delta.** Compare bundle before/after framer-motion (from an earlier deploy's build output or `next build` analysis surrogate; do not run `npm run build` in the working copy, use the Vercel build logs after deploy). Report the delta.
- [ ] **Step 2: Reduced motion.** Toggle the OS reduced-motion setting; reload; confirm no transforms, no counting, no character cycling, opacity only at 120ms across the whole page.
- [ ] **Step 3: LCP + CLS.** In the browser with 4G throttling, record LCP (must be under 2.0s and not regressed vs a pre-motion capture) and CLS (must be 0). Report both numbers before and after.
- [ ] **Step 4: Play-once + Resolve cap.** Scroll the full page down and back up; confirm nothing re-animates. Confirm `Resolve` appears at most twice on any screen and never on a name, headline, or navigation.
- [ ] **Step 5: Captures.** Record a full-page scroll screen capture at 1440 and a pass at 390 on a throttled connection. Attach the 1440 capture to the delivery report.
- [ ] **Step 6: Lint gate.** `npm run lint` passes; confirm zero em-dashes and zero en-dashes: `grep -rnP "\x{2014}|\x{2013}" src content` returns nothing (or the ripgrep equivalent).
- [ ] **Step 7: Deploy.** Push `main` (auto-deploys to prod). Verify the deploy renders, run Steps 2 to 5 against the live deploy, and revert on any regression.

---

## Self-Review

**Spec coverage:** D1/D2/D3 (Tasks 1-2); setup + LazyMotion + tokens (Task 3); CSS removal (Task 4); six primitives (Tasks 5-10); all ten sections + announcement/footer static (Tasks 11-19); interaction motion (Task 20); reduced motion, LCP, CLS, bundle delta, play-once, Resolve cap, captures, dash lint, deploy (Task 21). Counter ceiling recorded (uniform 12, Task 1/15). No spec section is unmapped.

**Placeholder scan:** primitive code is complete; section tasks reference exact primitives, delays, and file:line ranges from the spec rather than vague instructions. D3 is a diagnose-then-apply task with a measurement gate, not a blind placeholder.

**Type consistency:** `ABSENCES: { label, ceiling }[]` defined in Task 1, consumed in Task 15. `MOTION` tokens defined in Task 3, consumed by all primitives. Primitive prop names (`Rise` delay, `RuleDraw` axis/delay/duration/className, `LineReveal` text/delay, `Counter` to/from/mode/pad/delay, `Resolve` text/delay, `FrameWipe` delay) are used consistently in the section tasks.
