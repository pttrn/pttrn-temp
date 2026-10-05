import { useMemo } from 'react';

export function useMountMemo<T>(factory: () => T) {
    return useMemo(factory, [factory]);
}
