# Adding a Web Component

`@ptrn/web` is a parallel implementation of `@ptrn/react`: hand-written Lit elements with no React at runtime. The React component is the reference for behavior, accessibility and appearance. The two share no code, so parity is held by shared test cases and a side-by-side check in the docs.

## The rhythm

Copy this list into the pull request and check each box as it is verified.

1. **Map the API.** Write a table of React prop to attribute, slot or event (the Accordion table in `.plans/web-components.md` is the model). Get design and UX engineering to review it before writing the element.
2. **Scaffold.** `npm run newc -- <Name>` (the React component name, for example `TabGroup`).
3. **Build the element and its styles.** Copy the rules from the React SCSS. Start the stylesheet with `@use '../../styles/reset';`.
4. **Write the tests.** Mirror the cases in the React component's example file and `*.rtl.test.tsx`, plus behavior, keyboard, events and an axe run scoped to the element. `npm run build && npm test`.
5. **Register it in the docs.** Add `docs/src/wc/<name>.tsx` (usage HTML, the demo wrapper that turns the React demo state into the element, and the HTML generator) and one line in `docs/src/wc/index.ts`. The Web Component tab stays disabled until this exists.
6. **Look at it.** Build the docs and compare the React and Web Component tabs at the same preset: same width, same heights, same states.
7. **Ship it.** `npm run lint`, `npm run build` at the root, then update the component list in `README.md`.

## Conventions

- **Tag and class.** `ptrn-<kebab-name>`, class `Ptrn<Name>`, registered with `define()` so loading twice is safe.
- **Properties.** Declare them in `static properties` and initialize them in the constructor (no class fields: `useDefineForClassFields` is off so Lit's accessors are not shadowed). Reflect state that CSS or consumers select on (`open`, `disabled`).
- **Booleans.** An HTML boolean attribute is present or absent, so it cannot default to true. When the React prop defaults to true, name the Web Component attribute for the opposite (`singleOpen` is `multiple`).
- **Reserved names.** Do not reuse a global HTML attribute for a different meaning. `title` is the native tooltip, so the accordion uses `heading`. Check `hidden`, `label`, `type`, `role`, `slot` and `id` before naming one.
- **`ReactNode` props are slots.** `children` is the default slot, and `leading`, `trailing`, `icon` and similar are named slots. Track empty slots with `slotchange` when the wrapper should disappear.
- **Arrays of objects become child elements.** `items=[{...}]` becomes repeated `ptrn-<name>-item` children.
- **Events.** `emit(this, 'ptrn-<name>', detail)` from `src/utils/emit.ts` (bubbles and composed). Fire only for user-driven changes, not when a property is set from code.
- **Accessibility.** Keep the button and the panel it controls in the same shadow root, because `aria-controls` and `aria-labelledby` cannot cross a shadow boundary.
- **Icons.** Import the raw file from `@ptrn/icons` (`import arrow from '@ptrn/icons/KeyboardArrowDown.svg'`) and render it with `unsafeSVG`. The build inlines it.
- **Styles.** Tokens are CSS custom properties, so they inherit into the shadow root. Never hard-code a value the React SCSS reads from a token.
- **Form controls (later).** Use `ElementInternals` for form participation. Nothing in the base helpers should get in the way of `static formAssociated`.

## Known gaps

The full log, with the reasoning, is in `.plans/web-components.md`. The ones that will come up again: components whose demo presets contain other pttrn components (their generated HTML is React markup until those components exist here), and the docs data for each component being registered by hand.
