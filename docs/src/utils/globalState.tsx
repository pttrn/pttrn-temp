import { useUIContext } from '@ptrn/react/hooks/useUIContext';
import { Brand } from '@ptrn/react/types/common';
import { ColorTheme } from '@ptrn/react/utils/uiContext';
import { createContext, useContext } from 'react';

export const globalStateDefault: GlobalStateContext = {
    brand: 'nowhere',
    showTouchTarget: false,
    setBrand: () => {},
    setShowTouchTarget: () => {},
    resetGlobalState: () => {},
    theme: 'dark',
} as const;

export type GlobalState = {
    brand: Brand;
    showTouchTarget?: boolean;
    theme: ColorTheme;
};

export type GlobalStateContext = GlobalState & {
    setBrand: (brand: Brand) => void;
    setShowTouchTarget: (showTouchTarget: boolean) => void;
    resetGlobalState: () => void;
};

export const globalStateContext = createContext<GlobalStateContext | null>(null);

export function useGlobalState(): GlobalStateContext & { theme: ColorTheme; setTheme: (theme: ColorTheme) => void } {
    const globalState = useContext(globalStateContext);

    const { theme, setTheme } = useUIContext();

    return { ...(globalState || globalStateDefault), theme, setTheme };
}
