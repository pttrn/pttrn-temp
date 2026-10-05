declare module '*.scss' {
    import type { CSSResult } from 'lit';
    const styles: CSSResult;
    export default styles;
}

declare module '*.svg' {
    const markup: string;
    export default markup;
}
