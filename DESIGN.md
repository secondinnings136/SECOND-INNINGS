# Second Innings Design System: "Editorial Paper"

Synthesis of: redesign-existing-projects, minimalist-ui, high-end-visual-design,
industrial-brutalist-ui, gpt-taste, design-taste-frontend-v1.

## Design plan (gpt-taste pre-flight)

```
>>> rng = seed(len(prompt) % 7)      # = 3
>>> hero        = "Artistic Asymmetry" (left-weighted H1, inline portrait pill, offset meta column)
>>> components  = ["Inline Typography Image", "Masonry testimonial wall", "Sticky card stack"]
>>> motion      = ["Scrubbing text reveal", "Image scale on scroll"]
>>> type        = Instrument Serif (display) / Hanken Grotesk (UI) / JetBrains Mono (meta)
```

- **Vibe archetype (high-end):** Editorial Luxury. Warm paper, serif display, film grain.
- **Layout archetype (high-end):** Editorial Split + Swiss hairline grids.
- **Brutalist mode:** Swiss Industrial Print (light) ONLY. Never the CRT/terminal mode.
- **Dials (taste-v1):** DESIGN_VARIANCE 7, MOTION_INTENSITY 6, VISUAL_DENSITY 3.

## How conflicts between skills were resolved

| Conflict | Decision |
|---|---|
| Brutalist "0 radius" vs high-end "rounded-[2rem]" | **Two-material rule.** The *grid* is paper: square corners, 1px hairlines (`gap-px` technique). *Objects* placed on it (portrait, form, buttons, nav) are rounded. Never round a grid cell; never square an object. |
| gpt-taste "GSAP required" vs taste-v1 "default to Framer, never mix" | Framer Motion only (already installed). The gpt-taste paradigms are reproduced with `useScroll`/`useTransform` and CSS `position: sticky`. No GSAP. |
| Minimalist "4-6px buttons" vs high-end "pill + button-in-button" | High-end wins for CTAs: ink pill with nested circular arrow. |
| gpt-taste "ban meta labels" vs brutalist "ASCII framed labels" | Mono labels allowed only when they carry real information (location, sequence index, audience, read time). No decorative "SECTION 01". |
| Icons: Lucide banned everywhere | Public pages use **no icon library**. Typographic glyphs (→ ↗ + ×) and the inline SVG in `components/ui/Arrow.jsx`. Admin dashboard keeps Lucide (out of scope). |
| Dark hero sections (old site) | Banned. One substrate (paper) for the whole site. Depth via paper-2 bands, hairlines, grain, halftone. |

## Tokens

| Token | Value | Use |
|---|---|---|
| `paper` | `#F4F2EC` | Canvas |
| `paper-2` | `#EBE7DE` | Bands, footer, input fill |
| `paper-3` | `#E0DBCF` | Pressed / hover fills |
| `ink` | `#1C1B18` | Text, primary buttons (never #000) |
| `ink-2` | `#3B3934` | Secondary headings |
| `muted` | `#6F6B62` | Body secondary |
| `line` | `rgba(28,27,24,0.12)` | Hairlines |
| `signal` | `#B0442C` | The ONLY accent. Innings red. Saturation ~60%. |
| `signal-soft` | `#F1E1D9` | Accent wash |

Legacy names (`charcoal-blue`, `golden-pollen`, `tea-green`, `midnight-violet`, `primary`,
`secondary`, `accent`) are remapped onto this palette in `tailwind.config.js` so the
admin dashboard inherits the new look without edits.

## Type scale

- Display: `font-serif` Instrument Serif, `tracking-[-0.02em]`, `leading-[0.95]`.
  H1 `clamp(2.75rem,5.4vw,5.5rem)` inside `max-w-[78rem]` (2-3 lines max).
  H2 `clamp(2.25rem,4vw,3.75rem)`.
- UI/body: `font-sans` Hanken Grotesk, body `text-[1.0625rem] leading-[1.65] text-ink-2`, max `65ch`.
- Meta: `font-mono` JetBrains Mono, `text-[0.6875rem] uppercase tracking-[0.14em] text-muted`.
- Sentence case for headings. `text-wrap: balance` on headings.

## Spacing

- Sections: `py-28 md:py-40`. Container: `max-w-[84rem] mx-auto px-5 md:px-10`.
- Bottom padding optically larger than top where a section ends on text.

## Motion

- Easing: `cubic-bezier(0.32,0.72,0,1)` (const `EASE` in `components/ui/motion.js`).
- Entry: `y: 28, opacity: 0, filter: blur(8px)` → rest, 0.9s, `whileInView` once.
- Stagger children 0.08s.
- Only `transform`, `opacity`, `filter`. Blur only on entry, never on scrolling containers.
- `prefers-reduced-motion`: all entry motion disabled.

## Components (in `components/ui/`)

- `Reveal` / `RevealGroup` / `RevealItem`: scroll entry.
- `Button`: ink pill + nested arrow circle (`variant="primary"`), or text link (`variant="link"`).
- `Meta`: mono label.
- `ScrubText`: words scrub from 0.15 to 1 opacity with scroll.
- `HairlineGrid`: `grid gap-px bg-line border border-line` wrapper; children are `bg-paper`.
- `Halftone`: dot-matrix overlay for portraits (brutalist analog effect).
- `PageHero`: shared interior-page hero (meta row + H1 + lede + hairline).

## Bans (all skills combined)

Inter, Roboto, Lucide on public pages, emojis, pure black, gradients on sections, purple/blue,
`shadow-md/lg/xl`, three equal cards in a row, centered-everything heroes, `h-screen`,
pill "New" badges, exclamation marks in success copy, "Elevate/Seamless/Unleash".
