import './top-navigation.scss';

export type TopNavigationProps = {
    /** The content of the top navigation. */
    children: string;
};

/**
 * Component description coming soon.
 *
 * @name TopNavigation
 * @phase Backlog
 */
export function TopNavigation({ children }: TopNavigationProps) {
    return <div data-pttrn="top-navigation">{children}</div>;
}
