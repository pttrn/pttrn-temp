## Update Design Tokens and Build the Package

This document provides step-by-step instructions to regenerate the stylesheet and theme data from a design-token export.

### Ensure your local Figma has the Figma plugin installed.

From Figma select Plugins > Development > "Import Plugin from Manifest..." and select the `figma-plugin/manifest.json` file at the root of this monorepo.
<small>This installs the pttrn Export Tokens plugin to your local Figma environment.</small>

### Run the plugin

In Figma, from `Plugins > Development > pttrn Export Tokens`.
<small>This will generate a JSON output of design tokens in the plugin UI.</small>

Click the "Copy Export Data" button.
<small>This copies the JSON to your clipboard.</small>

Paste the copied JSON into `tokens-export.json` in this package and save it.
<small>This file is the source for generating the css and ts files.</small>

### Update the CSS and TS files

From the root of the monorepo run: `npm install && npm run build --workspace @ptrn/styles`
<small>This regenerates `nowhere.css` and `data/*.ts` from the latest design tokens.</small>
