import { useRef } from 'react';

export function useCallbackRef<T>(value: T) {
    const ref = useRef(value);
    return [ref.current, (nextValue: T) => (ref.current = nextValue)] as const;
}
