# Hyperframes Composition Brief: Second Innings (Vertical / Portrait)

## Objective
Create a high-impact, vertical launch video (1080×1920) for Second Innings using Hyperframes.

## Output
- Composition directory: `brag-vertical/composition/`
- Rendered video: `brag-vertical/brag.mp4`
- Format: Portrait (1080×1920, 9:16 aspect ratio, 30fps)
- Duration: Exactly 20.0 seconds (600 frames)

## Source Material
- Product: Second Innings (Mentoring Young Minds)
- Founder: Deepak Sogani (35+ years corporate leadership, 5 years Head of Student Affairs at JKLU)
- Website: `second-innings.in`
- Core Philosophy: "Information is everywhere. Perspective is not."
- Methodology: 7-Step Mentoring (`LISTEN`, `UNDERSTAND`, `EXPLORE`, `PERSPECTIVE`, `CONNECT`, `ACT`, `REVIEW`)
- Outcome: 7-Day Next Step
- Offer: Complimentary first conversation (No pressure, no selling)

## Creative Direction
- Tone preset: `polished`
- Format: `portrait` (1080×1920)
- Palette:
  - Canvas: Deep luxury dark navy (`#11161F`) with radial warm amber aura (`rgba(224, 138, 46, 0.12)`)
  - Accent / Primary Gold: `#E08A2E` and `#F59E0B`
  - Text Primary: `#FAF7F0`
  - Text Secondary: `#94A3B8`
  - Light Card Canvas: `#FAF7F0` with text `#11161F`
  - Accent Green: `#10B981` (for complimentary session badge)
- Typography:
  - Display / Serif: `Playfair Display` or `Newsreader` (editorial, human, authoritative)
  - Sans: `Inter` (crisp, modern legibility)

## Audio Architecture
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` placed at `assets/music/bgm.mp3`
- Sound Effects:
  - `switch.ogg` on scene transitions / major card reveals
  - `click.ogg` on step cascade and badge locks
- Music treatment:
  - Starts with rhythmic acoustic feel
  - Volume balanced with smooth 1.5s fade-out at the end

## Hyperframes Requirements
- Single container canvas styled as `w-[1080px] h-[1920px] bg-[#11161F] text-[#FAF7F0] overflow-hidden relative font-sans`
- Valid clips with explicit `class="clip"` and `data-start`, `data-duration` attributes.
- Avoid animating `display`, `visibility`, or `autoAlpha` on `.clip` root elements.
- Maintain high contrast passing WCAG AA across all text layers.
- Check cleanly with `npx hyperframes check` (0 errors) prior to render.
