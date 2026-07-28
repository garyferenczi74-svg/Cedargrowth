# CedarGrowth

Next.js App Router site for "CedarGrowth Organics". Live: cedargrowth-dxxt.vercel.app (Vercel team `via-connect`).

## Design system / Figma

See **[FIGMA-DESIGN-RULES.md](./FIGMA-DESIGN-RULES.md)** for the full design-system + Figma-MCP integration rules (tokens, components, assets, non-negotiable rails). Read it before any UI work or `get_design_context` / `use_figma` call.

Quick rails: Tailwind v3 (tokens in `tokens.css`, mirrored in `tailwind.config.js`) · plain function components, no shadcn/cva/clsx · radius 0 (2px chips only) · no shadows/gradients · Lucide icons only, `strokeWidth 1.5` · light mode only · no em/en-dashes · images are `<Placeholder>`, no `public/` folder yet.
