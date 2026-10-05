export type Prop = {
    name: string;
    required: boolean;
    description: string;
    /** Type as TypeScript source, for example `boolean` or `'small' | 'large'`. */
    type: string;
    /** Allowed values when the type is a union of literals. */
    options?: string[];
    default?: unknown;
};

export type Component = {
    name: string;
    slug: string;
    description: string;
    /** Import path, for example `@ptrn/react/Button`. */
    import: string;
    dependencies: string[];
    /** Example JSX from the docs, when the component has one. */
    usage?: string;
    props: Prop[];
};

export type Icon = {
    name: string;
    title: string;
    kind: string;
    /** Search synonyms. */
    alias: string;
    /** Import path, for example `@ptrn/icons/Person`. */
    import: string;
    /** Named export, for example `SvgPerson`. */
    export: string;
};

export type Token = {
    /** CSS custom property, including the leading dashes. */
    name: string;
    /** Group, the first word of the name (`colors`, `spacing`, `typography`). */
    kind: string;
    value: string;
    /** Value under `[data-theme='dark']`, when it differs. */
    dark?: string;
    description: string;
};

export type Meta = {
    /** `@ptrn/react` version the data was built from. */
    version: string;
    generated: string;
};

export type Catalog = {
    meta: Meta;
    components: Component[];
    icons: Icon[];
    tokens: Token[];
};
