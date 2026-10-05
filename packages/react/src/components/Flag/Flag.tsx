/* eslint-disable react/no-multi-comp */
import './flag.scss';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { CODES } from './codes';
import { ElementProps } from '-/types/common';
import { cssWithVars } from '-/utils/cwv';

export type FlagCode = (typeof CODES)[number];

export type FlagProps = {
    /** The flag to show, an ISO 3166-1 alpha-2 country code or one of the sprite's extra flags, like `_European_Union`. */
    code: FlagCode;
    /**
     * The width and height of the flag in pixels.
     *
     * @default 32
     */
    size?: number;
};

type FlagByCodeComponent = ForwardRefExoticComponent<
    ElementProps<Omit<FlagProps, 'code'>, 'span'> & RefAttributes<HTMLSpanElement>
>;

const flagsByCode = Object.fromEntries(
    CODES.map((code) => {
        const FlagByCode = forwardRef<HTMLSpanElement, ElementProps<Omit<FlagProps, 'code'>, 'span'>>(
            function FlagByCode(props, ref) {
                return <Flag {...props} code={code} ref={ref} />;
            },
        );

        FlagByCode.displayName = `Flag.${code}`;

        return [code, FlagByCode];
    }),
) as Record<FlagCode, FlagByCodeComponent>;

/**
 * Country flags by ISO 3166-1 alpha-2 code. A flag is a span that forwards its ref and accepts any span attribute.
 *
 * @example
 *     import { Flag } from '@ptrn/react/Flag';
 *     import { Flex } from '@ptrn/react/Flex';
 *
 *     <Flex align="center" gap="12">
 *         <Flag code="us" />
 *         <Flag code="gb" size={16} />
 *     </Flex>;
 *
 * @name Flag
 * @phase Backlog
 */
export const Flag = Object.assign(
    forwardRef<HTMLSpanElement, ElementProps<FlagProps, 'span'>>(function Flag({ code, size, style, ...props }, ref) {
        return (
            <span
                aria-label={code}
                role="img"
                {...props}
                data-flag={code}
                data-pttrn="flag"
                ref={ref}
                style={cssWithVars({ ...style, '--flag-size': size })}
            />
        );
    }),
    flagsByCode,
);
