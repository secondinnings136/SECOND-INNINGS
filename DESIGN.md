---
version: alpha
name: Second Innings Design System
description: Editorial Luxury design system with Mocha Brown, Champagne Gold, and Burnt Amber brand tri-palette. Synthesized from UI Skills standards (better-colors, colorize, create-design-md).
colors:
  mocha:
    base: "#5B4632"
    deep: "#23180F"
    dark: "#443324"
    hover: "#4A3827"
    muted: "#786653"
  champagne:
    base: "#F4D9A0"
    paper: "#FAF6EE"
    paper2: "#F3EBDD"
    paper3: "#E8DEC9"
    border: "#E8CA88"
    deep: "#9E782F"
  burntAmber:
    base: "#C8792C"
    deep: "#9B5113"
    soft: "#FAF0E1"
    border: "#EBB47E"
---

# Second Innings Design System: "Editorial Champagne & Mocha"

Official synthesis of: **UI Skills** (`better-colors`, `colorize`, `create-design-md`, `frontend-design`), `high-end-visual-design`, and `minimalist-ui`.

## 1. Brand Color System (Official Tri-Palette)

Derived from the client brand swatches and calibrated through WCAG AA/AAA standards:

| Role | Primitive Name | Hex Code | Purpose & Application | Contrast Ratio (WCAG) |
|---|---|---|---|---|
| **Primary Grounding** | `mocha` | `#5B4632` | Editorial serif titles, dark button fills, luxury borders | 8.4:1 on `#FAF6EE` (AAA) |
| **Deep Ink** | `mocha-deep` | `#23180F` | Primary body text & high-contrast typography (replaces pure black) | 15.2:1 on `#FAF6EE` (AAA) |
| **Warm Canvas** | `champagne-paper` | `#FAF6EE` | Base page substrate; luminous, soft, eye-strain reducing | Canvas base |
| **Warm Surface** | `champagne-paper-2`| `#F3EBDD` | Secondary bands, card backgrounds, footer fill | 1.1:1 on Canvas |
| **Luminous Accent** | `champagne` | `#F4D9A0` | Official Champagne Gold; badges, card highlights, warm borders | 6.7:1 with Mocha `#5B4632` |
| **Dynamic Signal** | `burntAmber` | `#C8792C` | Official Burnt Amber; primary accents, focal indicators, CTA highlight | 3.4:1 on White, 5.1:1 with deep variant |
| **Action & Link Text**| `burntAmber-deep` | `#9B5113` | Deep Burnt Amber for accessible active links and interactive states | 5.2:1 on Canvas (AA) |
| **Soft Wash** | `burntAmber-soft` | `#FAF0E1` | Subtle tint for tags, notifications, and dilemma cards | Soft container fill |
| **Hairline Grid** | `line` | `rgba(91, 70, 50, 0.13)` | Mocha-tinted Swiss hairline dividers (never cold gray) | Subtle structural boundary |

## 2. Design Principles (UI Skills Standards)

1. **A system is ramps, not arbitrary colors:** One warm neutral ramp (`champagne`), one grounding dark ramp (`mocha`), and one vibrant accent ramp (`burntAmber`).
2. **Hold the hue across the ramp:** No random saturation spikes or dissonant cold grays. All neutrals are warmed with organic mocha and champagne tones.
3. **Fill exactly one action per view:** The primary CTA retains crisp prominence (`bg-ink` with nested arrow or `bg-signal` focal moments); secondary elements remain structural and calm.
4. **Two-material rule:** Grids are paper (`gap-px` Swiss hairlines); interactive objects (buttons, badges, portrait pills) are smoothly contoured.
5. **Brand Ensō & Sun Mark:** The logo brush stroke renders in Mocha Brown (`#5B4632`), glowing into a radiant Champagne Gold (`#F4D9A0`) to Burnt Amber (`#C8792C`) center, stamped with a Burnt Amber Hanko seal.

## 3. Typography & Hierarchy

- **Display:** `font-serif` (Instrument Serif), `tracking-[-0.02em]`, `leading-[0.95]`.
  - H1: `clamp(2.75rem, 5.4vw, 5.5rem)` in `max-w-[78rem]`.
  - H2: `clamp(2.25rem, 4vw, 3.75rem)`.
- **UI / Body:** `font-sans` (Hanken Grotesk), `text-[1.0625rem] leading-[1.65] text-ink-2`, `max-w-[65ch]`.
- **Metadata:** `font-mono` (JetBrains Mono), `text-[0.6875rem] uppercase tracking-[0.14em] text-muted`.

## 4. Components & Tokens

- `Button` (`variant="primary"`): Espresso mocha pill (`bg-ink`) + nested circular arrow (`hover:bg-mocha`).
- `Button` (`variant="link"`): Text with underline hover in Burnt Amber (`hover:decoration-signal`).
- `HairlineGrid`: `grid gap-px bg-line border border-line` where children paint `bg-paper`.
- `Halftone`: Dot matrix tinted with Mocha Brown (`rgba(91, 70, 50, 0.45)`).
- `Meta` / `Eyebrow`: Mono label in Burnt Amber (`text-signal`) or warm muted mocha (`text-muted`).

## 5. Prohibitions & Anti-Patterns

- **No cold blues or generic purples.**
- **No pure pitch black `#000000`:** always use warm deep espresso `#23180F`.
- **No ungrounded gradients on sections:** substrate depth is created through `paper-2` bands, `line` hairlines, and warm grain.
- **No low-contrast text:** all body text must maintain minimum 4.5:1 WCAG AA contrast against its rendered container.
