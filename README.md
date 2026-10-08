# VLD — Good data. Great things.

A Next.js App Router website for [VLD](https://github.com/ersinkoc/vld). Designed around a warm paper palette, orange wireframe validation core, forest-green playground, and a fully independent dark theme.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000.

```sh
npm run typecheck
npm run build
npm start
npm run versions:check
```

## Pages and interactions

- `/`: animated SVG core that validates a real sample, features, live playground, interactive benchmark chart, and installation commands.
- `/docs`: getting started, schema basics, inferred types, Zod migration, Mini API, and locales.
- `/playground`: three predefined schemas powered by the actual `@oxog/vld` package. Edit JSON and inspect real success/error results. Ctrl+Enter or Cmd+Enter runs validation.
- Light/dark theme respects the system preference, persists locally, and initializes before paint.
- npm/pnpm/bun/yarn command picker and working clipboard buttons.
- Responsive mobile menu, keyboard focus indicators, skip link, and reduced-motion support. Content remains visible with JavaScript disabled.

## Version policy

All selected direct dependencies are installed from npm's `latest` stable dist-tag and pinned to exact versions. `package-lock.json` records the complete resolved dependency tree. Fonts are served locally from Fontsource; no Google Fonts connection is required.

`npm run versions:check` queries npm again, compares every direct dependency, writes a timestamped `DEPENDENCY-VERSIONS.json`, and exits nonzero if a newer stable version exists. This guarantees a check at execution time, not that packages will stay newest forever. Framework-managed transitive dependencies remain at their compatible locked versions.

## Content provenance

Product capabilities and examples follow the VLD repository README and the existing [VLD website](https://vld.oxog.dev).

The headline 3.03× figure refers to the repository's published semantic-checked drop-in benchmark against Zod 4.6.4. The chart separately displays the README's V2 vs Zod 4.5 measurements for one million `safeParse` operations, and labels that version pair explicitly. They are published measurements, not measurements made by this website. Local playground timings include parsing and validation and are illustrative, not a benchmark.

This workspace contains the new website. It does not modify the upstream VLD repository or deploy over its current website.
