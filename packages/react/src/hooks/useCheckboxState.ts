import { useState } from 'react';

import { CheckboxProps } from '-/components/Checkbox';

/**
 * A hook to manage the state of a single checkbox. Used alongside the Checkbox component.
 *
 * @example
 *     import { Checkbox } from '@ptrn/react/Checkbox';
 *     import { useCheckboxState } from '@ptrn/react/hooks/useCheckboxState';
 *
 *     function Example() {
 *     const { checkboxProps } = useCheckboxState('fruits');
 *     return <Checkbox aria-label="cherry" {...checkboxProps('cherry')} />;
 *     }
 *
 * @param name - The name of the checkbox.
 * @param externalState - The externally managed state of the checkbox.
 * @returns Properties to pass to the checkbox and the state of the checkbox.
 */
export function useCheckboxState(
    name: string,
    externalState?: [value: string[] | undefined, onChange: (next: string[]) => void],
): {
    checkboxProps: (value: string) => Pick<CheckboxProps, 'checked' | 'name' | 'onChange' | 'value'>;
    value: string[] | undefined;
    setValue: (next: string[]) => void;
} {
    const localState = useState<string[]>();
    const [value, setValue] = externalState || localState;

    const checkboxProps = (checkboxValue: string): Pick<CheckboxProps, 'checked' | 'name' | 'onChange' | 'value'> => {
        return {
            name,
            checked: value?.includes(checkboxValue),
            value: checkboxValue,
            onChange: (checked) => {
                const next = (value || []).filter((v) => v !== checkboxValue);
                if (checked) next.push(checkboxValue);
                setValue(next);
            },
        };
    };

    return { checkboxProps, value, setValue };
}
