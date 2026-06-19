# Agent Notes

This repository is the new minimal personal website for Aryan Mehra. Future coding agents should read this file before making changes.

## Required Maintenance

Always keep this file up to date when changing the site structure, build commands, assets, styling conventions, or known open tasks. If a change would make any section below inaccurate, update this file in the same work session.

## Current Site

- The site is intentionally a single static page.
- Entry point: `index.html`.
- Stylesheet: `src/styles.css`.
- No framework or bundler is currently used.
- Local server command: `npm start` or `npm run serve`.
- The local server uses `python3 -m http.server 5174`.

## Design Direction

- Minimal, photo-led personal homepage.
- Full-screen background photo: `public/photography/4V7A3683.jpg`.
- Content should be centered, not left-aligned.
- The name `Aryan Mehra` should stay on one line.
- Typography uses Google Font `Saira Stencil One` with heavy sans-serif fallbacks.
- Keep the page restrained and avoid distracting motion or visual effects.
- Social links should be icon-only, borderless buttons.

## Social Links

Social links are shown in this exact order:

1. X: `https://x.com/aryansfv`
2. GitHub: `https://github.com/Jdka1`
3. LinkedIn: `https://www.linkedin.com/in/aryan-mehra/`
4. YouTube: `https://www.youtube.com/@arymehr`

Icons are local SVG assets in `public/icons/`.

## Assets

- Primary background image: `public/photography/4V7A3683.jpg`.
- Social icons:
  - `public/icons/x.svg`
  - `public/icons/github.svg`
  - `public/icons/linkedin.svg`
  - `public/icons/youtube.svg`
- Do not reintroduce the old multi-page photo gallery unless explicitly requested.

## Verification

When changing layout or typography, verify desktop and mobile renderings. The narrow mobile case matters because the title is intentionally kept on one line.

Useful checks:

```sh
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
