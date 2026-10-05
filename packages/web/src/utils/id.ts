let counter = 0;

/** A page-unique id for wiring aria relationships inside one shadow root. */
export function uniqueId(prefix: string) {
    counter += 1;
    return `${prefix}-${counter}`;
}
