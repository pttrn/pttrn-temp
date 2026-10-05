# pttrn

A monorepo for the Pattern Design System: React components, Web Components, icons, styles, and the docs site that documents them.

## Packages

| Path                                 | Package             | Description                                                                   |
| ------------------------------------ | ------------------- | ----------------------------------------------------------------------------- |
| [`packages/react`](packages/react)   | `@ptrn/react`       | The React component library.                                                  |
| [`packages/web`](packages/web)       | `@ptrn/web`         | The same components as framework-free Web Components (Lit). Accordion so far. |
| [`packages/icons`](packages/icons)   | `@ptrn/icons`       | The icon set (material and custom `nowhere` icons).                           |
| [`packages/styles`](packages/styles) | `@ptrn/styles`      | The `nowhere` stylesheet and theme data generated from tokens.                |
| [`docs`](docs)                       | `ptrn-docs`         | The documentation and demo site, built with the packages above.               |
| [`figma-plugin`](figma-plugin)       | `ptrn-figma-plugin` | Figma plugin that exports design tokens for `@ptrn/styles`.                   |

## Installing

```bash
npm install @ptrn/react   # React components
npm install @ptrn/web     # Web Components, no React needed
```

Both take their design tokens from a `@ptrn/styles` stylesheet on the page (see [Theme](#theme)). No `.npmrc` or token is needed.

## Getting started

```bash
npm install
```

This is an npm workspace, so `@ptrn/react`, `@ptrn/web`, `@ptrn/icons`, and `@ptrn/styles` are linked from `packages/` automatically — no `npm link` needed.

```bash
npm run build      # build styles, icons, react, then web
npm run dev        # run the docs site against the local packages
npm run lint       # lint every workspace that defines a lint script
npm run test       # test every workspace that defines a test script
```

## Theme

The design system ships a single theme, `nowhere`. Apply it by importing the stylesheet directly:

```css
@import '@ptrn/styles/nowhere.css';
```

…or, in React, by rendering the styles provider:

```tsx
import { StylesProviderNowhere } from '@ptrn/react/StylesProviderNowhere';
```

## Attribution

See [attribution.md](attribution.md) for where this code came from.
