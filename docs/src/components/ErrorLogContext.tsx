import { errorContext } from '@ptrn/react/utils/errors';

export function ErrorLogContext({ children, id }: { children: React.ReactNode; id: string }) {
    return <errorContext.Provider value={id}>{children}</errorContext.Provider>;
}
