# Agent Notes

This repository is the new minimal personal website for Aryan Mehra. Future coding agents should read this file before making changes.

## Required Maintenance

Always keep this file up to date when changing the site structure, build commands, assets, styling conventions, or known open tasks. If a change would make any section below inaccurate, update this file in the same work session.

## Current Site

- The site is intentionally a single static page, generated from small content/template files.
- Generated entry point: `index.html`.
- Do not hand-edit `index.html` unless the user explicitly asks. Edit source files, then run `npm run build`.
- Editable bio/name copy: `content/bio.md`.
- Page metadata, font, and hero image: `content/site.json`.
- Social links and ordering: `content/social-links.json`.
- HTML shell/template: `templates/index.html`.
- Build script: `scripts/build.js`.
- Stylesheet: `src/styles.css`.
- Glass-card pointer interaction: `src/glass.js`.
- Background photo rotation: `src/photo-rotator.js`.
- No framework or bundler is currently used. The build is a dependency-free Node script.
- Build command: `npm run build`.
- Local server command: `npm start` or `npm run serve`; both build first.
- The local server uses `python3 -m http.server 5174`.

## Design Direction

- Minimal, photo-led personal homepage.
- Full-screen background photo: `public/photography/4V7A3683.jpg`.
- Content card should remain centered in the viewport.
- Current card text is left-aligned.
- Typography uses Google Font `STIX Two Text` with Georgia/serif fallbacks.
- Keep the page restrained and avoid distracting motion or visual effects.
- Social links are currently text links with subtle underlines.
- The glass-card effect uses CSS custom properties that are updated by `src/glass.js`.
- The glass effect intentionally combines real `backdrop-filter` with a duplicated fixed background layer inside the card to fake refraction; keep it subtle enough that the bio remains readable.

## Social Links

Social links are maintained in `content/social-links.json` and shown in this exact order:

1. X: `https://x.com/aryansfv`
2. GitHub: `https://github.com/Jdka1`
3. LinkedIn: `https://www.linkedin.com/in/aryan-mehra/`
4. YouTube: `https://www.youtube.com/@arymehr`

Local SVG icon assets still exist in `public/icons/`, but the current template does not render them.

## Assets

- Primary background image: `public/photography/4V7A3683.jpg`.
- Available social icons:
  - `public/icons/x.svg`
  - `public/icons/github.svg`
  - `public/icons/linkedin.svg`
  - `public/icons/youtube.svg`
- Do not reintroduce the old multi-page photo gallery unless explicitly requested.

## Verification

When changing layout or typography, verify desktop and mobile renderings. The narrow mobile case matters because the glass card should stay readable and comfortably framed.

Useful checks:

```sh
npm run build
npm start
```

Then inspect:

- `http://localhost:5174/`
- A desktop viewport around `1440x1000`.
- A mobile viewport around `390x844`.
- A narrow mobile viewport around `320x700`.

## Known Context

- This repo is replacing the older site in `../web-card`.
- The old site had separate `/about/` and `/photography/` pages, matrix/click effects, audio, and more photos. The new direction is much simpler.
- There may be tracked deletions from removing the old multi-page version. Do not restore those unless the user asks.
- `.DS_Store` and temporary screenshot folders are not meaningful site files.

## Open Ideas

- The user is considering a minimal load animation. Good candidates:
  - subtle background photo fade/focus on load;
  - small staggered fade-in for name, bio, and icons;
  - very gentle background scale from `1.02` to `1`.
- Keep animation subtle and respect `prefers-reduced-motion`.
