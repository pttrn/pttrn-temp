import { TabGroup } from '@ptrn/react/TabGroup';
import { Framework, FRAMEWORKS } from 'src/utils/useFramework';

/** The React / Web Component switch at the top of a component page. */
export function FrameworkTabs({
    framework,
    hasWebComponent,
    onChange,
}: {
    framework: Framework;
    hasWebComponent: boolean;
    onChange: (framework: Framework) => void;
}) {
    return (
        <div data-framework-tabs>
            <TabGroup
                label="Framework"
                onChange={(next) => onChange(next as Framework)}
                options={FRAMEWORKS.map(({ value, label }) => ({
                    value,
                    label,
                    disabled: value === 'web-component' && !hasWebComponent,
                }))}
                showTrail
                value={framework}
            />
            {!hasWebComponent && <small data-muted>Web Component version not available yet</small>}
        </div>
    );
}
