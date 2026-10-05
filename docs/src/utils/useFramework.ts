import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import store from 'store';

export type Framework = 'react' | 'web-component';

export const FRAMEWORKS: { value: Framework; label: string }[] = [
    { value: 'react', label: 'React' },
    { value: 'web-component', label: 'Web Component' },
];

const PARAM = 'framework';
const STORE_KEY = 'pttrn-framework';

function isFramework(value: unknown): value is Framework {
    return FRAMEWORKS.some((framework) => framework.value === value);
}

function readStored() {
    try {
        return store.get(STORE_KEY);
    } catch {
        return undefined;
    }
}

/**
 * The framework tab the visitor picked. The URL (`?framework=web-component`) wins so a link always shows what it was
 * shared with, then the last choice is remembered across pages, then React.
 */
export function useFramework(): [framework: Framework, setFramework: (next: Framework) => void] {
    const [params, setParams] = useSearchParams();

    const fromUrl = params.get(PARAM);
    const stored = readStored();
    const framework = isFramework(fromUrl) ? fromUrl : isFramework(stored) ? stored : 'react';

    const setFramework = useCallback(
        (next: Framework) => {
            try {
                store.set(STORE_KEY, next);
            } catch {
                // storage can be blocked; the URL still carries the choice
            }
            setParams(
                (previous) => {
                    const nextParams = new URLSearchParams(previous);
                    nextParams.set(PARAM, next);
                    return nextParams;
                },
                { replace: true },
            );
        },
        [setParams],
    );

    return [framework, setFramework];
}
