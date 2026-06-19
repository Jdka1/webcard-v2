# Aryan Mehra Personal Website

Minimal static homepage generated from editable content files.

## Edit Content

- Bio/name copy: `content/bio.md`
- Page title, meta description, font, and hero image: `content/site.json`
- Social links and ordering: `content/social-links.json`
- HTML shell: `templates/index.html`
- Styling: `src/styles.css`
- Glass-card interaction: `src/glass.js`
- Background photo rotation: `src/photo-rotator.js`

After editing content or templates, rebuild the generated page:

```sh
npm run build
```

To build and serve locally:

```sh
npm start
```

Then open `http://localhost:5174/`.
