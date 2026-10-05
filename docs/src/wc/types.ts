import { ComponentType } from 'react';

/** How the docs show one component as a Web Component. */
export type WebComponentDemo = {
    /** The custom element tag, used to tell whether a component has a Web Component. */
    tag: string;
    /** The HTML in Basic usage, and the starting point of the editable playground. */
    usage: string;
    /** Markdown shown above the usage playground: how to load the elements. */
    usageDescription?: string;
    /** Renders the shared React demo state (the props table controls) as the custom element. Docs only, not shipped. */
    Wrapper: ComponentType<any>;
    /** The HTML a Web Component user writes for a given demo state. */
    toHtml: (propState: Record<string, unknown>) => string;
};
