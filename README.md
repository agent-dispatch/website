# AgentDispatch Website

Static website package for AgentDispatch.

AgentDispatch lets local lead agents spawn cloud subagents through a provider-neutral MCP control plane. This package contains the public landing page that explains the product, architecture, packages, and first AWS AgentCore runtime path.

## Commands

```bash
npm run dev
npm test
npm run build
```

## Structure

- `src/index.html` — single-page marketing site.
- `src/styles.css` — responsive visual system.
- `src/assets/repo-social-preview.png` — Open Graph and Twitter preview image.
- `src/assets/org-logo.svg` — brand mark used in the page header and hero.
- `scripts/validate.mjs` — static checks for local links, copy placeholders, and required sections.
- `scripts/build.mjs` — copies `src` into `dist` for GitHub Pages or any static host.

## Deploy

The included GitHub Pages workflow builds `dist` and publishes it as a static artifact. No framework runtime or server is required.

## Design constraints

- Checked-in brand images shared with the GitHub organization profile assets.
- No runtime dependencies.
- Fast, readable, and easy to fork into a richer docs site later.
