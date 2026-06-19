# Webcard V2 Handoff

This repo is a minimal static personal website for Aryan Mehra. It is intentionally plain HTML/CSS/JS with no build step.

## Local Workflow

- Start server: `npm start`
- Local URL: `http://localhost:5173`
- Script check: `node --check src/main.js`

`package.json` uses `python3 -m http.server 5173`, so all paths are static and rooted at `/`.

## Routes

- `/` - minimal web-card homepage with Matrix-style animated background.
- `/about/` - concise bio, experience, education, and selected notes.
- `/photography/` - standalone masonry photography gallery.

Only photography assets should live in `public/photography/`. Non-photography images were deliberately removed.

## Homepage UX

Initial state:
- Full-screen light theme.
- Matrix-style characters fall in the background, with a slow default scroll/parallax drift.
- Centered text shows:
  - `Aryan Mehra`
  - `FDAI @ Palantir · Stanford Computer Engineering`
- Links are hidden.

First click on the centered name/card:
- One-way interaction. There is no second-click reset.
- Links reveal immediately:
  - About
  - Photography
  - LinkedIn
  - GitHub
- The centered card subtly enlarges.
- Matrix animation keeps running; click does not freeze, reset, or resize the character field.

Wheel / trackpad:
- Scrolls through the Matrix glyph field with depth-based parallax.
- Adds to the default background drift rather than being the only source of movement.
- The canvas remains full-screen and glyphs wrap vertically, so there are no finite canvas edges.
- The foreground card does not zoom from wheel/trackpad input.

## Matrix Implementation

Main file: `src/main.js`

Core concepts:
- `canvas#matrix-canvas` is always fixed full-screen.
- `trails` are Matrix rain streaks, each assigned to a column.
- `universe` is a reusable glyph array that glitches over time.
- `drawTrail()` renders trail heads, bodies, and tails.
- The Matrix animation keeps moving after click; there is no freeze/explosion state.

Important constants in `src/main.js`:
- `baseFontHeight = 22` controls default Matrix glyph size.
- `moveScale = 0.0064` and `speedBase = 0.72` control fall speed.
- `autoScrollSpeed = 0.018` controls the default background scroll/parallax drift.
- `enteredZoom = 1.22` is the subtle click zoom.
- `matrixScroll` stores wheel-driven character-field scroll.

Rendering details:
- Font: `Syne Mono`.
- No flipped/180-degree glyphs.
- Glyphs have depth values for subtle parallax and shadow.
- Parallax strength is controlled in `parallaxPoint()`.
- Colors are light-theme Matrix green/black with low opacity.

## Styling

Main stylesheet: `src/styles.css`

Design direction:
- Minimal, light-only web business card.
- Font: Google Font `Syne Mono`.
- Background: warm off-white gradient.
- Centered name, one-line layout.
- Links are plain text, not bordered buttons.
- Link hover uses a very slight scale-up, not vertical lift.
- The main text uses a subtle shadow for depth.

Key state class:
- `body.is-entered` reveals links and hides the hint.

Zoom:
- CSS variable `--card-scale` is updated from JS.
- `.home-card` uses `transform: scale(var(--card-scale))`.
- Click updates `cardScale` only.
- Wheel/trackpad updates `matrixScroll` only.
- Canvas drawing is not DOM-scaled. Keep the canvas full-screen and wrap glyphs vertically.

## Content Notes

About page content is based on user-provided LinkedIn profile details:
- FDAI @ Palantir
- Stanford Computer Engineering
- Prior Sauron ML Engineering internship
- 8VC Engineering Fellow
- Meritocracy Fellowship references

Photography page uses existing files copied from the old repo:
- `public/photography/*.jpg`

## Things To Be Careful With

- Do not reintroduce non-photography images unless the user asks.
- Keep homepage email removed; current homepage links are About, Photography, LinkedIn, GitHub.
- Do not make the click interaction toggle back out; user requested one-way first-click behavior.
- Do not reintroduce the explosion/freeze effect for webcard v2 unless the user explicitly asks to restore it.
- Avoid scaling the canvas DOM element. For Matrix wheel interaction, adjust `matrixScroll` and keep glyph wrapping intact.
- If editing Matrix behavior, run `node --check src/main.js` afterward.
