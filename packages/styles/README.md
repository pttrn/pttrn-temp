# Pattern Styles

`@ptrn/styles` contains the stylesheet and theme data for the Pattern Design System.

## Installation

```bash
npm install @ptrn/styles
```

This package contains the `nowhere` stylesheet and theme data generated from the design tokens, plus the Node scripts that convert the raw tokens/variables into stylesheets. The Figma plugin used to export those tokens lives at the root of the monorepo in [`figma-plugin/`](../../figma-plugin).

## Using the stylesheet

The stylesheet consists of a set of CSS variables. Some color variables exist in both a light (default) and dark theme. The variables and classes mirror the tokens from Figma — you can search the stylesheet for the exact token name as it is included as a comment.

```css
@import '@ptrn/styles/nowhere.css';
```

To enable the dark theme add the `data-theme="dark"` attribute to your html or body tag.

### Tools

While building `@ptrn/react` we use the <a href="https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables">CSS Variable Autocomplete</a> Visual Studio Code extension. Once you add the CSS file to your project this plugin makes it a breeze to work with the variables.
