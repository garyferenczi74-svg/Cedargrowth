# CedarGrowth Organics

Corporate website and companion app. Source of truth for this repository is the CedarGrowth Master Plan and the build prompt in `docs/`.

Build the digital home of a solventless cannabis wellness manufacturer that behaves like a research institute and looks like an apothecary.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| A | Foundations: palette, type scale, spacing ramp, motion, atoms, molecules | Delivered |
| B | Home and Method, 1440 and 390 | Delivered |
| C | Wellness, Products, Transparency | Delivered |
| D | DNA, Research, Find | Delivered |
| E | Framer build | Not started |
| F | Companion app | Not started |
| G | Hardening | Not started |

## Files

```
CedarGrowth Foundations.dc.html   Phase A foundations sheet
CedarGrowth Home.dc.html          All eight public routes, both breakpoints
tokens.css                        Semantic CSS custom properties
tailwind.config.js                Theme extension, identical token names
assets/                           Logo
docs/                             Build prompt
```

Both HTML files open directly in a browser. The route bar at the top switches page and breakpoint.

## Non-negotiable rails

These apply to every file, every artboard, and every line of copy.

- No em-dashes and no en-dashes anywhere, including comments, CMS entries, alt text, and metadata.
- Lucide icons only, strokeWidth 1.5, no fills, roughly 20 glyphs across the whole product.
- Border radius 0. A 2px radius is permitted only on status chips in the data layer.
- No shadows, gradients, blur, glassmorphism, or neon. Depth comes from hairlines, tone, and space.
- Desktop and mobile in the same pass, 1440 and 390, never retrofitted.
- WCAG 2.2 AA is a gate, not a polish step.
- Never present unverified values as data. Absent figures render as UNKNOWN with an explanation. Never a placeholder number, never a zero, never an invented citation.
- One accent. If Cedar appears more than four times on a screen it is decoration and must be removed.
- No claim that promises a physiological outcome. Describe formulation and intent.

## Known gaps

- Thirteen DNA traits: T-01 to T-03 carry placeholder copy for layout review. T-04 to T-13 render as UNKNOWN pending the master plan entries.
- Laboratory name, accreditation, license identifier, and kit price all render as UNKNOWN pending confirmation.
- All photography is marked placeholder. Four families are permitted: raw material macro, specimen plate, process documentary, facility.
- Required state warnings are pending counsel review.

## Acceptance gate

Every phase closes against the checklist in Section 13 of the build prompt.
