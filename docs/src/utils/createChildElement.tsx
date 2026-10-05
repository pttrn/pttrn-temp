import { SvgContentCopy } from '@ptrn/icons/ContentCopy';
import { SvgDiamond } from '@ptrn/icons/Diamond';
import { Avatar } from '@ptrn/react/Avatar';
import { Button } from '@ptrn/react/Button';
import { Checkbox } from '@ptrn/react/Checkbox';
import { Img } from '@ptrn/react/Img';
import { Radio } from '@ptrn/react/Radio';
import { Switch } from '@ptrn/react/Switch';
import { Tag } from '@ptrn/react/Tag';
import { Txt } from '@ptrn/react/Txt';
import { updateComponentContext } from 'src/components/ComponentProvider';
import { action } from 'src/utils/actions';

export const createChildrenElement = (state: Record<string, any>, name: string) => {
    const componentName = state[name];

    if (componentName === 'Checkbox' || componentName === 'Radio' || componentName === 'Switch') {
        let As: typeof Checkbox | typeof Radio | typeof Switch = Checkbox;
        if (componentName === 'Radio') As = Radio;
        else if (componentName === 'Switch') As = Switch;

        return (
            <As
                aria-label={`${componentName} demo`}
                checked={state[`${name}-toggle`]}
                name={`${name}-toggle`}
                onChange={(checked: boolean) => {
                    updateComponentContext({ [`${name}-toggle`]: checked });
                }}
                onClick={() => action(`${name} ${componentName} clicked`)}
                value={`${name}-${componentName}`}
            />
        );
    }

    if (componentName === 'Button')
        return <Button icon={<SvgContentCopy />} label="LI Button" onClick={() => action('ListItem button clicked')} />;

    if (componentName === 'Img') return <Img alt="placeholder" src="/placeholder.svg" />;

    if (componentName === 'Avatar') return <Avatar name="List Item" />;

    if (componentName === 'Tag') return <Tag label="Tag" />;

    if (componentName === 'Txt') return <Txt>Text</Txt>;

    if (componentName === 'Icon') return <SvgDiamond />;

    return null;
};
