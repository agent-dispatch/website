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
- `src/styles.css` — responsive visual system, no external assets.
- `src/main.js` — progressive enhancements only.
- `scripts/validate.mjs` — static checks for local links, copy placeholders, and required sections.
- `scripts/build.mjs` — copies `src` into `dist` for GitHub Pages or any static host.

## Deploy

The included GitHub Pages workflow builds `dist` and publishes it as a static artifact. No framework runtime or server is required.

## Design constraints

- No checked-in brand asset folder.
- No generated images.
- No runtime dependencies.
- Fast, readable, and easy to fork into a richer docs site later.
