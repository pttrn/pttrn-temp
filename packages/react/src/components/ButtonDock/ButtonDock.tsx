import './button-dock.scss';
import { Button, ButtonProps } from '-/components/Button/Button';

export type ButtonDockProps = {
    /**
     * The primary button in the dock. If a secondary button is provided the primary will render on the right side.
     *
     * @required
     */
    primaryButton: ButtonProps;
    /**
     * Secondary button. If provided will render on the left side.
     *
     * @required
     */
    secondaryButton?: ButtonProps;
    /**
     * If more than one button is provided defines how the buttons should be arranged.
     *
     * @default fill
     */
    arrangement?: 'fill' | 'spread';
    /**
     * If the dock should render inline or fixed to the bottom of the viewport.
     *
     * @default inline
     */
    mode?: 'fixed' | 'inline';
};

/**
 * A sticky or fixed bar containing action buttons that are to remain on the screen while the page scrolls. Alternative
 * option to house the bar within the bottom of a page’s body content.
 *
 * @example
 *     import { ButtonDock } from '@ptrn/react/ButtonDock';
 *
 *     <ButtonDock
 *         primaryButton={{
 *             children: 'Send',
 *             label: 'send',
 *         }}
 *         secondaryButton={{
 *             children: 'Cancel',
 *             label: 'cancel',
 *         }}
 *     />;
 *
 * @name ButtonDock
 * @phase Dev
 */
export function ButtonDock({ primaryButton, secondaryButton, arrangement = 'fill', mode = 'inline' }: ButtonDockProps) {
    const finalArrangement = secondaryButton ? arrangement : 'fill';

    return (
        <div data-arrangement={finalArrangement} data-mode={mode} data-pttrn="button-dock">
            {secondaryButton && <Button {...{ size: 'medium', variant: 'secondary', ...secondaryButton }} />}

            <Button {...{ size: 'medium', variant: 'primary', ...primaryButton }} />
        </div>
    );
}
